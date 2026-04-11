import Anthropic from "@anthropic-ai/sdk"
import { INSTANCE_PREAMBLE } from "@/lib/prompts"
import { trackUsage } from "@/lib/usage-tracker"
import { layerLabelsSlash, kvKey } from "@/lib/config"
import { kv } from "@vercel/kv"

const KV_AVAILABLE = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const BRIEF_CACHE_TTL = 4 * 60 * 60 // 4 hours

function getClient() {
  const key = (process.env.DISPATCH_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY)
  if (!key) throw new Error("ANTHROPIC_API_KEY not configured")
  return new Anthropic({ apiKey: key })
}

const BRIEF_SYSTEM = `${INSTANCE_PREAMBLE}

Your task: generate exactly 3 signal cards from today's annotated feed. These are not headlines. They are deliberation triggers — each one surfaces a signal that specifically matters to this operator and frames why it demands attention.

SELECTION CRITERIA:
Sort the feed by urgency score first. From the highest-urgency signals, select 3 that:
- Are directly relevant to the operator's immediate context and active intelligence priorities
- Represent distinct territory — do not pick three signals from the same layer
- Prefer multi-layer signals (scoring high on 2+ layers simultaneously)
- Have a clear "so what" for this operator specifically — not just interesting in the abstract

CARD FORMAT:
Each card must contain:
- headline: A sharp declarative statement of the signal (not a news headline — a synthesis statement). Max 12 words.
- body: 2–3 sentences. What the signal is. Why it matters to this operator specifically. What it might demand of him.
- source: Article title and source name
- citation: [1], [2], [3] inline references in the body text, where numbers refer to the article indices in the feed
- layer: Primary intelligence layer (${layerLabelsSlash()})
- urgency: The urgency score (0–10)

TONE: The first signal is special — its headline will appear as a "Today's Lens" ambient one-liner in the left rail. Write the first headline as a grounded, clear observation — measured and reflective, like a principle emerging from the noise. The body of the first signal should still be substantive and specific.

The second and third signals can be more direct and tactical — lead with the implication, not the event. These should feel like something a trusted senior advisor flagged specifically for you.

Return as a JSON array with exactly 3 items. No preamble. No sign-off. Valid JSON only.`

interface ArticleInput {
  title: string
  source: string
  category: string
  summary?: string
  url?: string
}

export async function POST(req: Request) {
  try {
    const { articles }: { articles: ArticleInput[] } = await req.json()

    // KV cache — prevents redundant Haiku calls across browsers/tabs
    const cacheKey = kvKey(`brief:${new Date().toISOString().slice(0, 10)}`)
    if (KV_AVAILABLE) {
      try {
        const cached = await kv.get<{ signals: unknown[] }>(cacheKey)
        if (cached?.signals?.length) return Response.json(cached)
      } catch (e) { console.error("brief KV cache read failed:", e) }
    }

    if (!articles?.length) {
      return Response.json({
        signals: [
          { headline: "FEED UNAVAILABLE", label: "FEED UNAVAILABLE", body: "No articles to analyze.", layer: "", urgency: 0, sources: [] },
          { headline: "—", label: "—", body: "", layer: "", urgency: 0, sources: [] },
          { headline: "—", label: "—", body: "", layer: "", urgency: 0, sources: [] },
        ],
      })
    }

    const inputArticles = articles.slice(0, 25)

    const context = inputArticles
      .map((a, i) => `${i + 1}. [${a.category}] ${a.source}: ${a.title}${a.summary ? ` — ${a.summary.slice(0, 120)}` : ""}`)
      .join("\n")

    const response = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 900,
      system: BRIEF_SYSTEM,
      messages: [
        {
          role: "user",
          content: `Feed (${articles.length} articles):\n\n${context}\n\nGenerate the brief.`,
        },
      ],
    })
    trackUsage({ endpoint: "brief", provider: "anthropic", model: "claude-haiku-4-5-20251001", inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens }).catch(() => {})

    const text = response.content[0]?.type === "text" ? response.content[0].text.trim() : ""

    // Parse JSON array from model response
    let parsed: Array<{ headline?: string; body?: string; source?: string; citation?: string; layer?: string; urgency?: number }> = []
    try {
      // Strip markdown code fences if present
      const jsonText = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "")
      parsed = JSON.parse(jsonText)
    } catch {
      // Fallback: try to extract JSON array from response
      const match = text.match(/\[[\s\S]*\]/)
      if (match) {
        try { parsed = JSON.parse(match[0]) } catch (e) { console.error("brief JSON fallback parse failed:", e) }
      }
    }

    const signals = parsed.slice(0, 3).map(card => {
      const headline = card.headline || "SIGNAL"
      const rawBody = card.body || ""
      const layer = card.layer || "Landscape"
      const urgency = typeof card.urgency === "number" ? card.urgency : 5

      // Extract citation indices [1], [3], [15] from body text
      const citationMatches = rawBody.match(/\[(\d+)\]/g) || []
      const citedIndices = [...new Set(citationMatches.map(m => parseInt(m.replace(/[\[\]]/g, ""), 10) - 1))]

      // Map cited indices to actual articles
      let sources = citedIndices
        .filter(idx => idx >= 0 && idx < inputArticles.length)
        .map(idx => {
          const a = inputArticles[idx]
          return { title: a.title, url: a.url || "#", source: a.source }
        })

      // Fallback: if model didn't cite, match by keyword overlap
      if (sources.length === 0 && rawBody.length > 0) {
        const bodyLower = rawBody.toLowerCase()
        const matched = inputArticles
          .filter(a => {
            const words = a.title.toLowerCase().split(/\s+/).filter(w => w.length > 4)
            return words.some(w => bodyLower.includes(w))
          })
          .slice(0, 3)
          .map(a => ({ title: a.title, url: a.url || "#", source: a.source }))
        const seen = new Set<string>()
        sources = matched.filter(s => { if (seen.has(s.source)) return false; seen.add(s.source); return true })
      }

      // Renumber citations so [N] matches sources array index (1-based)
      let body = rawBody
      const renumberMap = new Map<number, number>()
      citedIndices.forEach((origIdx, i) => renumberMap.set(origIdx + 1, i + 1))
      body = body.replace(/\[(\d+)\]/g, (match, num) => {
        const newNum = renumberMap.get(parseInt(num, 10))
        return newNum ? `[${newNum}]` : match
      })

      return { headline, label: headline, body, layer, urgency, sources }
    })

    // Pad to exactly 3
    while (signals.length < 3) {
      signals.push({ headline: "—", label: "—", body: "", layer: "", urgency: 0, sources: [] })
    }

    const result = { signals }

    // Cache to KV for cross-browser consistency
    if (KV_AVAILABLE && signals.some(s => s.body)) {
      kv.set(cacheKey, result, { ex: BRIEF_CACHE_TTL }).catch(() => {})
    }

    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("Brief error:", message)
    return Response.json({
      signals: [
        { headline: "BRIEF ERROR", label: "BRIEF ERROR", body: message, layer: "", urgency: 0, sources: [] },
        { headline: "—", label: "—", body: "", layer: "", urgency: 0, sources: [] },
        { headline: "—", label: "—", body: "", layer: "", urgency: 0, sources: [] },
      ],
    })
  }
}
