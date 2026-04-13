// Synthesis endpoint — generates narrative intelligence briefing from today's feed + 7-day history
import Anthropic from "@anthropic-ai/sdk"
import { INSTANCE_PREAMBLE } from "@/lib/prompts"
import { loadArticleHistory } from "@/lib/article-store"
import { generateAllSkinImages } from "@/lib/image-gen"
import { trackUsage } from "@/lib/usage-tracker"
import { kv } from "@vercel/kv"
import { kvKey } from "@/lib/config"

const KV_KEY = kvKey("synthesis:weekly")
const CACHE_TTL = 60 * 60 * 24 // 24 hours — matches client-side SYNTHESIS_TTL

import instanceConfig from "@/lib/config"

const LAYER_NAMES: Record<string, string> = Object.fromEntries(
  instanceConfig.layers.map(l => [l.id, l.label])
)
const LAYER_COLORS: Record<string, string> = {
  ...Object.fromEntries(instanceConfig.layers.map((l, i) => [l.id, ["#D4A05A", "#5A9EB0", "#7BAF6A", "#9A85B8", "#C87A6A"][i] || "#888"]))
}
const ALL_LAYERS = instanceConfig.layers.map(l => l.id)

const SYSTEM_PROMPT = `${INSTANCE_PREAMBLE}

You are the trend intelligence layer of Dispatch. You are categorically different from the daily brief (DCOS). DCOS answers "what's urgent today." You answer "what's changing this week that wasn't true last week."

Your job is WEEK-OVER-WEEK TREND DETECTION. You receive today's annotated articles AND the prior 6 days of signal history. Compare them. What topics are intensifying? What appeared for the first time this week? What was present last week but has gone quiet? What thread connects signals across multiple days that wouldn't be visible looking at any single day?

Do NOT summarize today's articles. DCOS already did that. Instead, tell the story of the week — what moved, what shifted, what's building momentum.

PRODUCE:

1. HEADLINE: One declarative sentence (max 15 words) naming the single biggest shift this week. Not a topic — a change. "X is moving toward Y" or "The conversation around X shifted from A to B."

2. BRIEFING: 2-3 sentences expanding on the headline. What specific signals across which days demonstrate this shift? Name sources and dates when possible. This should feel like week-in-review intelligence, not a daily summary.

3. CONVERGENCES (exactly 4): Patterns where multiple intelligence layers are intersecting in new ways THIS WEEK. Always return exactly 4 patterns. Each must reference specific signals from different days to demonstrate the trend.
   - title: Declarative pattern name (5-8 words)
   - description: 2-3 sentences. What's converging and why it matters.
   - layers: Which 2-3 layers intersect
   - signalCount: How many signals support this

4. BLIND SPOTS (exactly 3): Three specific intelligence gaps. These are NOT contrarian takes — they are genuine absences in the signal that a rigorous analyst would flag. For each, explain WHY the absence matters:
   a) DROPPED SIGNAL: A topic that was generating signal last week but went quiet this week. Name it specifically — what were the articles, and why did they stop?
   b) MISSING SIGNAL: A major development in the mandate's primary domains that SHOULD be generating articles in the feed but isn't. What's happening in the world that your sources aren't covering?
   c) ASSUMPTION CHECK: One belief the operator is likely holding based on this week's signals that may not be as solid as it appears. What's the strongest evidence against the prevailing narrative? Not devil's advocacy — genuine analytical rigor.

5. CEREBRO TOPICS (exactly 4): Four distinct conversation starters for the Cerebro intelligence panel — questions or provocations that would produce genuinely different strategic conversations. Each should be grounded in this week's data. One should be a wildcard: unexpected, cross-domain, the kind of question that connects signals most analysts would keep separate.
   - title: Short label (3-6 words) for the card
   - body: 1-2 sentences explaining why this topic matters right now — what makes it worth exploring this week specifically
   - prompt: The full question or provocation to send to Cerebro

CRITICAL RULES:
- If no prior history is available, say so honestly. Don't fabricate trends from a single day.
- Name specific articles, sources, and dates. Vague pattern descriptions are worthless.
- Every claim must be grounded in the data you received. No speculation without labeling it.

Return JSON:
{
  "headline": "The week's biggest shift in one sentence.",
  "briefing": "2-3 sentences expanding on the headline with evidence.",
  "patterns": [
    {
      "title": "Pattern name",
      "description": "What's converging, with specific signal references.",
      "layers": ["opportunity", "discipline"],
      "signalCount": 4,
      "sources": ["STAT News: Article title", "The Verge: Article title"]
    }
  ],
  "blindSpots": [
    { "type": "dropped", "title": "Short label", "body": "What dropped and why it matters." },
    { "type": "missing", "title": "Short label", "body": "What should be here but isn't." },
    { "type": "assumption", "title": "Short label", "body": "What belief might be weaker than it appears." }
  ],
  "cerebroTopics": [
    { "title": "Short card label", "body": "Why this matters this week.", "prompt": "Full question for Cerebro." },
    { "title": "Short card label", "body": "Why this matters this week.", "prompt": "Full question for Cerebro." },
    { "title": "Short card label", "body": "Why this matters this week.", "prompt": "Full question for Cerebro." },
    { "title": "Wildcard label", "body": "Why this unexpected connection matters.", "prompt": "Cross-domain wildcard question." }
  ]
}

Return only valid JSON.`

// ─── Signal Velocity + Heatmap (computed from article history, no AI cost) ──

interface VelocityItem {
  topic: string
  delta: string
  prev: number
  curr: number
}

interface HeatmapLayer {
  name: string
  color: string
  data: number[]
}

function computeVelocityAndHeatmap(
  history: { publishedAt: string; tag: string; signalScores?: Record<string, number> }[],
  todayArticles: { tag: string; signalScores?: Record<string, number> }[],
) {
  // Split history into this-week (last 3 days + today) and last-week (4-7 days ago)
  const now = new Date()
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }

  // ── Velocity: compare tag counts this-half vs last-half of the week ──
  const thisHalf = dates.slice(4) // last 3 days
  const lastHalf = dates.slice(0, 4) // first 4 days

  const tagCountThis: Record<string, number> = {}
  const tagCountLast: Record<string, number> = {}

  for (const a of history) {
    const d = a.publishedAt.slice(0, 10)
    if (thisHalf.includes(d)) tagCountThis[a.tag] = (tagCountThis[a.tag] || 0) + 1
    else if (lastHalf.includes(d)) tagCountLast[a.tag] = (tagCountLast[a.tag] || 0) + 1
  }
  // Add today's articles to thisHalf
  for (const a of todayArticles) {
    tagCountThis[a.tag] = (tagCountThis[a.tag] || 0) + 1
  }

  const accelerating: VelocityItem[] = []
  const decelerating: VelocityItem[] = []
  const allTags = new Set([...Object.keys(tagCountThis), ...Object.keys(tagCountLast)])

  for (const tag of allTags) {
    const curr = tagCountThis[tag] || 0
    const prev = tagCountLast[tag] || 0
    if (prev === 0 && curr === 0) continue
    const pct = prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100)
    if (pct === 0) continue
    const name = LAYER_NAMES[tag] || tag
    const item = { topic: name, delta: `${pct > 0 ? "+" : ""}${pct}%`, prev, curr }
    if (pct > 0) accelerating.push(item)
    else decelerating.push(item)
  }

  accelerating.sort((a, b) => (b.curr - b.prev) - (a.curr - a.prev))
  decelerating.sort((a, b) => (a.curr - a.prev) - (b.curr - b.prev))

  // ── Heatmap: per-day × per-layer average urgency ──
  const dayLabels = dates.map(d => {
    const dt = new Date(d + "T12:00:00")
    return dt.toLocaleDateString("en-US", { weekday: "short" })
  })

  const layers: HeatmapLayer[] = ALL_LAYERS.map(layer => {
    const data = dates.map(date => {
      const dayArticles = history.filter(a =>
        a.publishedAt.slice(0, 10) === date && a.tag === layer && a.signalScores
      )
      // Also include today's articles for the last date
      if (date === dates[dates.length - 1]) {
        const todayOfLayer = todayArticles.filter(a => a.tag === layer && a.signalScores)
        dayArticles.push(...todayOfLayer as typeof dayArticles)
      }
      if (dayArticles.length === 0) return 0
      const avg = dayArticles.reduce((sum, a) => sum + (a.signalScores?.urgency ?? 0), 0) / dayArticles.length
      return Math.round(avg * 10) / 10
    })
    return { name: LAYER_NAMES[layer], color: LAYER_COLORS[layer], data }
  })

  return {
    velocity: { accelerating: accelerating.slice(0, 5), decelerating: decelerating.slice(0, 5) },
    heatmap: { days: dayLabels, layers },
  }
}

export async function POST(req: Request) {
  const apiKey = (process.env.DISPATCH_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY)
  if (!apiKey) return Response.json({ error: "No API key" }, { status: 500 })

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: { articles?: any[]; skin?: string }
    try {
      body = await req.json()
    } catch {
      return Response.json({ briefing: null, patterns: [], blindSpotNote: null, message: "Request body required" })
    }
    const { articles } = body
    const skinId = body.skin || instanceConfig.defaultTheme
    if (!articles?.length) {
      return Response.json({ briefing: null, patterns: [], blindSpotNote: null })
    }

    // Check KV cache first — skin-aware so each biome gets its own image set
    const synthCacheKey = `${KV_KEY}:${skinId}`
    if (process.env.KV_REST_API_URL) {
      try {
        const cached = await kv.get<Record<string, unknown>>(synthCacheKey)
        if (cached && cached.briefing) return Response.json(cached)
      } catch { /* KV unavailable — proceed with fresh generation */ }
    }

    // Build context from today's annotated articles
    const context = articles.slice(0, 25).map((a: { title: string; source: string; category: string; tag: string; synopsis?: string; relevance?: string; signalScores?: Record<string, number> }, i: number) => {
      const scores = a.signalScores ? Object.entries(a.signalScores).filter(([, v]) => v >= 5).map(([k, v]) => `${k}:${v}`).join(", ") : ""
      return `${i + 1}. [${a.tag}] ${a.source}: ${a.title}${a.synopsis ? ` — ${a.synopsis}` : ""}${scores ? ` (scores: ${scores})` : ""}`
    }).join("\n")

    // Load 7-day history for trend detection + dataviz
    let historyContext = ""
    let historyArticles: { publishedAt: string; tag: string; title: string; signalScores?: Record<string, number> }[] = []
    try {
      const history = await loadArticleHistory(7)
      historyArticles = history
      // Exclude today's articles (already in context above) — group by date
      const todayStr = new Date().toISOString().slice(0, 10)
      const priorArticles = history.filter(a => !a.publishedAt.startsWith(todayStr))
      if (priorArticles.length > 0) {
        const byDate: Record<string, typeof priorArticles> = {}
        for (const a of priorArticles) {
          const date = a.publishedAt.slice(0, 10)
          if (!byDate[date]) byDate[date] = []
          byDate[date].push(a)
        }
        const lines = Object.entries(byDate)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, arts]) => {
            const entries = arts.slice(0, 10).map(a => {
              const urgency = a.signalScores?.urgency ?? 0
              return `  - [${a.tag}] ${a.title} (urgency: ${urgency})`
            }).join("\n")
            return `${date}:\n${entries}`
          }).join("\n\n")
        historyContext = `\n\nPrior 6 days (for trend detection):\n${lines}`
      }
    } catch {
      // KV unavailable — proceed without history
    }

    // Frame history as the primary input, today as the latest data point
    const hasHistory = historyContext.length > 0
    const userMessage = hasHistory
      ? `WEEK HISTORY (primary — compare across days):\n${historyContext}\n\nTODAY'S LATEST (${articles.length} articles — the newest data point):\n\n${context}\n\nAnalyze the week-over-week trends. What changed?`
      : `TODAY'S FEED ONLY (${articles.length} articles — no prior history available yet):\n\n${context}\n\nNo week history is available. Note this honestly. Identify patterns within today's signal but do not fabricate trends.`

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    })
    trackUsage({ endpoint: "synthesis", provider: "anthropic", model: "claude-haiku-4-5-20251001", inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens }).catch(() => {})

    const text = response.content[0]?.type === "text" ? response.content[0].text : ""
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      console.error("[synthesis] No JSON block found in Claude response")
      return Response.json({ briefing: null, patterns: [], blindSpotNote: null })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any
    try {
      result = JSON.parse(match[0])
    } catch (parseErr) {
      console.error("[synthesis] JSON parse failed:", parseErr instanceof Error ? parseErr.message : parseErr)
      return Response.json({ briefing: null, patterns: [], blindSpotNote: null })
    }

    // Normalize blindSpots — support both new array format and old string format
    if (result.blindSpots && Array.isArray(result.blindSpots)) {
      result.blindSpotNote = result.blindSpots.map((b: { title: string; body: string }) => `${b.title}: ${b.body}`).join(" ")
    } else if (result.blindSpotNote && !result.blindSpots) {
      result.blindSpots = [{ type: "general", title: "Blind Spot", body: result.blindSpotNote }]
    }

    // Backward compat: convert old cerebroProvocation to cerebroTopics
    if (result.cerebroProvocation && !result.cerebroTopics) {
      result.cerebroTopics = [{ title: "Strategic question", prompt: result.cerebroProvocation }]
    }

    // Compute Signal Velocity + Urgency Heatmap from article history (no AI cost)
    const { velocity, heatmap } = computeVelocityAndHeatmap(historyArticles, articles)
    result.velocity = velocity
    result.heatmap = heatmap

    // Generate images for ALL skins — each biome gets its own imagery
    // ~10 min generation, cached for 24h in localStorage
    if (process.env.REPLICATE_API_TOKEN) {
      try {
        // Hero images at 21:9 — one per skin
        const heroTitle = result.headline || result.briefing?.split(/[.!?]/)[0] || "Weekly synthesis"
        const heroAllSkins = await generateAllSkinImages([{ title: heroTitle, layers: ["landscape"] }], "synthesis", "21:9")
        result.headerImages = heroAllSkins[0] || {}

        // Convergence thumbnails at 3:2 — scene extrapolation + all skins
        const patternCards = (result.patterns || []).map((p: { title: string; layers?: string[] }) => ({
          title: p.title, layers: p.layers,
        }))
        if (patternCards.length > 0) {
          const allSkinImages = await generateAllSkinImages(patternCards, "synthesis", "3:2")
          result.patterns = result.patterns.map((p: Record<string, unknown>, i: number) => ({
            ...p,
            images: allSkinImages[i] || {},
          }))
        }
      } catch (err) {
        console.error("[synthesis] Image generation failed:", err instanceof Error ? err.message : err)
      }
    }

    // Cache to KV — avoid re-generating on every visit
    if (process.env.KV_REST_API_URL) {
      try { await kv.set(synthCacheKey, result, { ex: CACHE_TTL }) } catch { /* KV write failure */ }
    }

    return Response.json(result)
  } catch (err) {
    console.error("[synthesis] API error:", err instanceof Error ? err.message : err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
