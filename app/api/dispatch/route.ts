// Dispatch endpoint — weekly intelligence brief → content pitch pipeline
// Analyzes 7 days of article history and generates publishable content briefs
import Anthropic from "@anthropic-ai/sdk"
import { generateCardImages } from "@/lib/image-gen"
import { loadArticleHistory, ARTICLE_STORE_AVAILABLE } from "@/lib/article-store"
import { trackUsage } from "@/lib/usage-tracker"
import { INSTANCE_PREAMBLE } from "@/lib/prompts"
import { kv } from "@vercel/kv"
import { kvKey, layerIdsPipe } from "@/lib/config"
import instanceConfig from "@/lib/config"

const KV_AVAILABLE = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)

function getISOWeek(d: Date): { year: number; week: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { year: date.getUTCFullYear(), week }
}

function getWeekKey(): string {
  const { year, week } = getISOWeek(new Date())
  return kvKey(`weekly:${year}-w${week}`)
}

const WEEK_TTL = 49 * 24 * 60 * 60 // 7 weeks — one set per week, 7 weeks lookback

// ─── Citation resolution ────────────────────────────────────────────────────

interface ContextArticle {
  title: string
  url: string
  source: string
}

function resolveCitations(body: string, contextArticles: ContextArticle[]): { body: string; sources: { title: string; url: string; source: string }[] } {
  const citationMatches = body.match(/\[(\d+)\]/g) || []
  const citedIndices = [...new Set(citationMatches.map(m => parseInt(m.replace(/[\[\]]/g, ""), 10) - 1))]

  const sources = citedIndices
    .filter(idx => idx >= 0 && idx < contextArticles.length)
    .map(idx => ({
      title: contextArticles[idx].title,
      url: contextArticles[idx].url || "#",
      source: contextArticles[idx].source,
    }))

  // Renumber citations sequentially so [N] matches sources array index (1-based)
  let resolved = body
  const renumberMap = new Map<number, number>()
  citedIndices
    .filter(idx => idx >= 0 && idx < contextArticles.length)
    .forEach((origIdx, i) => renumberMap.set(origIdx + 1, i + 1))
  resolved = resolved.replace(/\[(\d+)\]/g, (match, num) => {
    const newNum = renumberMap.get(parseInt(num, 10))
    return newNum ? `[${newNum}]` : match
  })

  return { body: resolved, sources }
}

// ─── System prompt — assembled from instance config ─────────────────────────

function buildDispatchPrompt(): string {
  const dir = instanceConfig.dispatchDirective

  // Instance-specific directive (preferred)
  if (dir) {
    const modesBlock = dir.modes
      .map((m, i) => `${m.name}:\n${m.description}`)
      .join("\n\n")

    return `${INSTANCE_PREAMBLE}

${dir.role}

PRODUCE:
1. A one-line editorial headline for the week (weekSummary)
2. 3-4 perspectives — each analyzing the week through a different intelligence layer lens, with [N] source citations
3. 5 pitches with evidence citations

${dir.modes.length} MODES for pitches — distribute across them:

${modesBlock}

Return a JSON object:
{
  "weekSummary": "One-line editorial headline capturing the week's dominant narrative.",
  "perspectives": [
    {
      "title": "Perspective title — a sharp framing of the week through this lens",
      "body": "2-3 sentences analyzing the week through this intelligence layer, with source citations [1][2]. Lead with the implication, not the event.",
      "layer": "${layerIdsPipe()}"
    }
  ],
  "pitches": [${dir.pitchSchema}]
}

PERSPECTIVES: Generate 3-4 perspectives. Each must analyze the week through a DIFFERENT intelligence layer. Cover at least the first two layers (${instanceConfig.layers.slice(0, 2).map(l => l.id).join(", ")}) and one of the remaining (${instanceConfig.layers.slice(2).map(l => l.id).join("/")}). Use [N] citations referencing the numbered articles.

${dir.rules}

Return only valid JSON. No prose outside the JSON.`
  }

  // Fallback for instances without a dispatchDirective (should not happen in practice)
  return `${INSTANCE_PREAMBLE}

You are the action intelligence layer. Translate the week's signal into 5 actionable pitches with a weekSummary headline and 3-4 perspectives. Return only valid JSON.`
}

const SYSTEM_PROMPT = buildDispatchPrompt()

export async function GET(request: Request) {
  const apiKey = (process.env.DISPATCH_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY)
  if (!apiKey) return Response.json({ error: "No API key" }, { status: 500 })

  // Support week navigation: ?week=2026-w14 and skin-specific images: ?skin=mesa
  const { searchParams } = new URL(request.url)
  const weekParam = searchParams.get("week")
  const skinParam = searchParams.get("skin") || instanceConfig.defaultTheme
  const currentWeekKey = getWeekKey()
  const currentWeekId = currentWeekKey.split(":").pop() || ""
  // Cache key includes skin — each biome gets its own image set
  const baseCacheKey = weekParam ? kvKey(`weekly:${weekParam}`) : currentWeekKey
  const cacheKey = `${baseCacheKey}:${skinParam}`
  const isArchive = weekParam && weekParam !== currentWeekId

  if (!ARTICLE_STORE_AVAILABLE) {
    return Response.json({
      available: false,
      weekSummary: null,
      pitches: [],
      message: "Article history not available — KV storage required for weekly analysis.",
    })
  }

  try {
    // Check KV cache first — avoid 10-20s Sonnet call on repeat visits
    if (KV_AVAILABLE) {
      try {
        const cached = await kv.get<Record<string, unknown>>(cacheKey)
        if (cached && (cached.pitches as unknown[])?.length > 0) {
          // Re-attach images from content-addressable cache (instant hits)
          if (process.env.REPLICATE_API_TOKEN) {
            try {
              const cachedPitches = cached.pitches as { title: string; layers?: string[] }[]
              const heroTitle = ((cached.weekSummary as string) || "").split(/[.!?]/)[0] || "Weekly dispatch"
              const [heroUrls, pitchUrls] = await Promise.all([
                generateCardImages([{ title: heroTitle, layers: ["landscape"] }], "dispatch", "21:9", skinParam),
                generateCardImages(cachedPitches.map(p => ({ title: p.title, layers: p.layers })), "dispatch", "3:2", skinParam),
              ])
              cached.headerImageUrl = heroUrls[0] || undefined
              cached.pitches = cachedPitches.map((p, i) => ({ ...p, imageUrl: pitchUrls[i] || undefined }))
            } catch { /* images optional */ }
          }
          return Response.json({
            available: true,
            ...cached,
            cached: true,
          })
        }
      } catch {
        // KV read failed — fall through to generation
      }
    }

    // Don't regenerate for past weeks — only serve from cache
    if (isArchive) {
      return Response.json({
        available: true,
        weekSummary: null,
        pitches: [],
        message: "No archived data for this week.",
      })
    }

    const articles = await loadArticleHistory(14)

    if (articles.length === 0) {
      return Response.json({
        available: true,
        weekSummary: null,
        pitches: [],
        message: "No article history yet. Check back after a day of feed ingestion.",
      })
    }

    // Build context from the week's articles, prioritizing annotated ones
    const annotated = articles.filter(a => a.synopsis || a.relevance)
    const contextArticles = (annotated.length > 10 ? annotated : articles).slice(0, 40)
    const context = contextArticles.map((a, i) => {
      const scores = a.signalScores ? Object.entries(a.signalScores).filter(([, v]) => v >= 4).map(([k, v]) => `${k}:${v}`).join(", ") : ""
      return `${i + 1}. [${a.tag}] ${a.source}: ${a.title}${a.synopsis ? ` — ${a.synopsis}` : ""}${a.relevance ? ` | Why: ${a.relevance}` : ""}${scores ? ` (${scores})` : ""}`
    }).join("\n")

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 5000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `This week's intelligence (${articles.length} articles across 7 days):\n\n${context}\n\nGenerate the weekly dispatch.`,
      }],
    })
    trackUsage({ endpoint: "dispatch", provider: "anthropic", model: "claude-sonnet-4-20250514", inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens }).catch(() => {})

    const text = response.content[0]?.type === "text" ? response.content[0].text : ""
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      return Response.json({ available: true, weekSummary: null, pitches: [], message: "Synthesis failed to parse." })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any
    try {
      result = JSON.parse(match[0])
    } catch {
      console.error("[dispatch] Failed to parse Claude response as JSON")
      return Response.json({ available: true, weekSummary: null, pitches: [], message: "Parse failed." })
    }

    // Generate images: header + each pitch
    // Use client-specified skin for biome-specific imagery
    const skinId = skinParam
    let pitches = result.pitches || []
    let headerImageUrl: string | undefined
    if (process.env.REPLICATE_API_TOKEN) {
      try {
        // Hero image at 21:9 cinematic ratio — anthemic, biome sets the scene
        const heroCard = [{ title: result.weekSummary?.split(/[.!?]/)[0] || "Weekly dispatch", layers: ["landscape"] }]
        const heroUrls = await generateCardImages(heroCard, "dispatch", "21:9", skinId)
        headerImageUrl = heroUrls[0] || undefined

        // Pitch thumbnails at 3:2 — scene extrapolation makes them editorial
        const pitchCards = pitches.map((p: { title: string; layers?: string[] }) => ({
          title: p.title,
          layers: p.layers,
        }))
        const pitchImageUrls = pitchCards.length > 0 ? await generateCardImages(pitchCards, "dispatch", "3:2", skinId) : []
        pitches = pitches.map((p: Record<string, unknown>, i: number) => ({
          ...p,
          imageUrl: pitchImageUrls[i] || undefined,
        }))
      } catch (err) {
        // Image generation failure shouldn't break dispatch — log and continue
        console.error("[dispatch] Image generation failed:", err instanceof Error ? err.message : err)
      }
    }

    // Resolve citations in perspectives
    const ctxForCitations: ContextArticle[] = contextArticles.map(a => ({ title: a.title, url: a.url, source: a.source }))
    const perspectives = (result.perspectives || []).map((p: { title: string; body: string; layer: string }) => {
      const { body, sources } = resolveCitations(p.body, ctxForCitations)
      return { title: p.title, body, layer: p.layer, sources }
    })

    // Resolve citations in pitch evidence
    pitches = pitches.map((p: Record<string, unknown>) => {
      const evidence = (p.evidence as string[]) || []
      const resolvedEvidence = evidence.map(e => resolveCitations(e, ctxForCitations))
      return {
        ...p,
        evidence: resolvedEvidence.map(r => r.body),
        evidenceSources: resolvedEvidence.map(r => r.sources),
      }
    })

    // Resolve citations in weekSummary
    const { body: resolvedSummary, sources: weekSummarySources } = resolveCitations(
      result.weekSummary || "", ctxForCitations
    )

    // Compute sparkline data — average layer scores per day, this week + last week
    const layerIds = instanceConfig.layers.map(l => l.id)
    const sparklines: Record<string, { thisWeek: number[]; lastWeek: number[] }> = {}
    for (const lid of layerIds) sparklines[lid] = { thisWeek: [], lastWeek: [] }

    // Group articles by day, compute average score per layer
    const dayBuckets: Record<string, typeof articles> = {}
    for (const a of articles) {
      const day = a.publishedAt?.slice(0, 10) || "unknown"
      if (!dayBuckets[day]) dayBuckets[day] = []
      dayBuckets[day].push(a)
    }
    const sortedDays = Object.keys(dayBuckets).sort()

    // This week = last 7 days
    for (const day of sortedDays.slice(-7)) {
      const dayArticles = dayBuckets[day]
      for (const lid of layerIds) {
        const scores = dayArticles
          .map(a => a.signalScores?.[lid])
          .filter((s): s is number => typeof s === "number" && s > 0)
        sparklines[lid].thisWeek.push(scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0)
      }
    }

    // Last week = days 8-14 (if available)
    const lastWeekDays = sortedDays.slice(-14, -7)
    if (lastWeekDays.length > 0) {
      for (const day of lastWeekDays) {
        const dayArticles = dayBuckets[day]
        for (const lid of layerIds) {
          const scores = dayArticles
            .map(a => a.signalScores?.[lid])
            .filter((s): s is number => typeof s === "number" && s > 0)
          sparklines[lid].lastWeek.push(scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0)
        }
      }
    }
    // Pad lastWeek to 7 if shorter
    for (const lid of layerIds) {
      while (sparklines[lid].lastWeek.length < 7) sparklines[lid].lastWeek.unshift(0)
    }

    const responseData = {
      weekSummary: resolvedSummary || null,
      weekSummarySources: weekSummarySources.length > 0 ? weekSummarySources : undefined,
      perspectives: perspectives.length > 0 ? perspectives : undefined,
      pitches,
      headerImageUrl,
      sparklines,
      articleCount: articles.length,
      generatedAt: new Date().toISOString(),
    }

    // Cache the analysis text WITHOUT images — images use content-addressable cache separately
    // Strip imageUrl from pitches before caching to keep value under KV size limits
    const cacheData = {
      ...responseData,
      pitches: pitches.map((p: Record<string, unknown>) => {
        const { imageUrl, ...rest } = p
        return rest
      }),
      headerImageUrl: undefined,
    }
    if (KV_AVAILABLE && pitches.length > 0) {
      kv.set(cacheKey, cacheData, { ex: WEEK_TTL }).catch(err => {
        console.error("[dispatch] KV cache write failed:", err instanceof Error ? err.message : err)
      })
    }

    return Response.json({
      available: true,
      ...responseData,
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
