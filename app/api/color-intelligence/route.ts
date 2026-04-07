// Color Intelligence endpoint — synthesizes color/visual culture trends from the feed
import Anthropic from "@anthropic-ai/sdk"
import { DISPATCH_PREAMBLE } from "@/lib/prompts"
import { loadArticleHistory } from "@/lib/article-store"
import { generateCardImages } from "@/lib/image-gen"
import { trackUsage } from "@/lib/usage-tracker"
import { kv } from "@vercel/kv"

const KV_KEY = "color-intelligence:weekly"
const CACHE_TTL = 60 * 60 * 12 // 12 hours

// Sources and keywords that signal color/visual culture relevance
const COLOR_SOURCES = new Set([
  "Heuritech", "It's Nice That", "Creative Boom", "Canva Newsroom",
  "Dezeen", "Wallpaper*", "Designboom", "IGNANT", "Colossal",
  "Booooooom", "Yellowtrace", "Awwwards", "Eye on Design",
])
const COLOR_KEYWORDS = /\b(color|colour|palette|hue|pantone|wgsn|coloro|chromatic|pigment|tint|shade|tone|gradient|visual\s+trend|design\s+trend|aesthetic|material|texture|pattern|mood|fashion\s+week|forecast|season)/i

const SYSTEM_PROMPT = `${DISPATCH_PREAMBLE}

You are the color intelligence layer of Dispatch. You track what's moving in visual culture — not the colors themselves, but what color shifts MEAN.

Your job is NOT to act as a color picker or palette generator. Your job is to synthesize what authoritative sources (WGSN, Pantone, Heuritech, design publications, fashion forecasters) are saying about color, and interpret what those shifts signal about culture, consumer psychology, and the design landscape.

You receive articles from the operator's feed that touch on color, visual culture, design trends, and aesthetic direction. Some will reference forecaster predictions directly. Others will demonstrate color shifts through the work they cover. Read both.

PRODUCE:

1. HEADLINE: One declarative sentence (max 15 words) naming the most important shift in color culture this week. Not a color name — a cultural observation. "Institutional warmth is replacing clinical neutrality" not "Teal is trending."

2. BRIEFING: 2-3 sentences. What's moving in color culture and why it matters for a design leader. Connect color shifts to broader cultural forces — consumer psychology, industry direction, material culture. Reference specific articles and sources.

3. COLOR DIRECTIONS (exactly 4): Named trends emerging from the feed. Each is a cultural direction expressed through color, not just a color name. Example: "Pharmaceutical Warmth" — the shift from clinical white to amber in healthcare branding signals a pivot from authority to approachability.
   - title: A named direction (3-6 words, evocative not technical)
   - description: 2-3 sentences. What this direction means culturally and what's driving it. Reference specific articles.
   - palette: 2-3 hex colors that represent this direction (your best interpretation)

4. FORECAST HIGHLIGHTS (exactly 3): What the major color forecasters are saying, synthesized from the articles. If the articles reference WGSN, Pantone, Heuritech, Coloro, or similar authorities, distill their positions. If no forecaster content is available, note honestly what's missing.
   - authority: The forecaster or source name
   - insight: Their position, synthesized in 1-2 sentences
   - timeframe: What season or year they're forecasting for (if available)

5. CEREBRO TOPICS (exactly 3): Color-specific questions for the Cerebro intelligence panel. Each should connect color/visual culture to the operator's broader mandate — design leadership, healthcare, strategic positioning.
   - title: Short label (3-6 words)
   - body: 1-2 sentences on why this matters now
   - prompt: Full question for Cerebro

CRITICAL RULES:
- If color-specific signal is thin this week, say so honestly. Don't fabricate trends.
- Name specific articles and sources. Vague observations are worthless.
- Connect color to culture. "Teal is up" is data. "Teal signals institutional transformation" is intelligence.
- The operator is a design director. Write at that level.

Return JSON:
{
  "headline": "...",
  "briefing": "...",
  "colorDirections": [
    { "title": "Direction name", "description": "Cultural meaning.", "palette": ["#hex1", "#hex2"] }
  ],
  "forecastHighlights": [
    { "authority": "WGSN", "insight": "Their position.", "timeframe": "SS26" }
  ],
  "cerebroTopics": [
    { "title": "Label", "body": "Why now.", "prompt": "Full question." }
  ]
}

Return only valid JSON.`

export const maxDuration = 60

export async function POST(req: Request) {
  const apiKey = (process.env.DISPATCH_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY)
  if (!apiKey) return Response.json({ error: "No API key" }, { status: 500 })

  try {
    const { articles } = await req.json()
    if (!articles?.length) {
      return Response.json({ briefing: null, colorDirections: [], forecastHighlights: [] })
    }

    // Check KV cache first
    if (process.env.KV_REST_API_URL) {
      try {
        const cached = await kv.get<Record<string, unknown>>(KV_KEY)
        if (cached && cached.briefing) return Response.json(cached)
      } catch { /* KV unavailable */ }
    }

    // Filter articles for color/visual culture relevance
    const colorArticles = articles.filter((a: { source?: string; title?: string; synopsis?: string; tag?: string }) => {
      if (a.tag === "culture") return true
      if (a.source && COLOR_SOURCES.has(a.source)) return true
      if (a.title && COLOR_KEYWORDS.test(a.title)) return true
      if (a.synopsis && COLOR_KEYWORDS.test(a.synopsis)) return true
      return false
    })

    // Fall back to all culture articles if color-specific filter is too narrow
    const contextArticles = colorArticles.length >= 5
      ? colorArticles.slice(0, 25)
      : articles.filter((a: { tag?: string }) => a.tag === "culture").slice(0, 25)

    const context = contextArticles.map((a: { title: string; source: string; tag: string; synopsis?: string }, i: number) =>
      `${i + 1}. [${a.tag}] ${a.source}: ${a.title}${a.synopsis ? ` — ${a.synopsis}` : ""}`
    ).join("\n")

    // Load 7-day history for trend detection
    let historyContext = ""
    try {
      const history = await loadArticleHistory(7)
      const todayStr = new Date().toISOString().slice(0, 10)
      const priorCulture = history.filter(a =>
        !a.publishedAt.startsWith(todayStr) &&
        (a.tag === "culture" || COLOR_KEYWORDS.test(a.title))
      )
      if (priorCulture.length > 0) {
        const byDate: Record<string, typeof priorCulture> = {}
        for (const a of priorCulture) {
          const date = a.publishedAt.slice(0, 10)
          if (!byDate[date]) byDate[date] = []
          byDate[date].push(a)
        }
        const lines = Object.entries(byDate)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, arts]) => {
            const entries = arts.slice(0, 8).map(a => `  - ${a.source}: ${a.title}`).join("\n")
            return `${date}:\n${entries}`
          }).join("\n\n")
        historyContext = `\n\nPrior color/culture signal (6 days):\n${lines}`
      }
    } catch { /* proceed without history */ }

    const hasHistory = historyContext.length > 0
    const userMessage = hasHistory
      ? `COLOR & VISUAL CULTURE FEED (${contextArticles.length} articles):${historyContext}\n\nTODAY'S LATEST:\n\n${context}\n\nSynthesize the color intelligence. What's moving and what does it mean?`
      : `COLOR & VISUAL CULTURE FEED (${contextArticles.length} articles — no prior history yet):\n\n${context}\n\nNo history available. Note this honestly. Identify color/visual directions from today's signal.`

    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    })
    trackUsage({ endpoint: "color-intelligence", provider: "anthropic", model: "claude-haiku-4-5-20251001", inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens }).catch(() => {})

    const text = response.content[0]?.type === "text" ? response.content[0].text : ""
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) {
      console.error("[color-intelligence] No JSON block found in Claude response")
      return Response.json({ briefing: null, colorDirections: [], forecastHighlights: [] })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any
    try {
      result = JSON.parse(match[0])
    } catch (parseErr) {
      console.error("[color-intelligence] JSON parse failed:", parseErr instanceof Error ? parseErr.message : parseErr)
      return Response.json({ briefing: null, colorDirections: [], forecastHighlights: [] })
    }

    // Generate hero image (21:9) via Replicate
    if (process.env.REPLICATE_API_TOKEN) {
      try {
        const heroTitle = result.headline || result.briefing?.split(/[.!?]/)[0] || "Color intelligence"
        const heroUrls = await generateCardImages([{ title: heroTitle, layers: ["culture"] }], "color-intelligence", "21:9")
        result.headerImageUrl = heroUrls[0] || undefined
      } catch (err) {
        console.error("[color-intelligence] Image generation failed:", err instanceof Error ? err.message : err)
      }
    }

    // Cache to KV
    if (process.env.KV_REST_API_URL) {
      try { await kv.set(KV_KEY, result, { ex: CACHE_TTL }) } catch { /* */ }
    }

    return Response.json(result)
  } catch (err) {
    console.error("[color-intelligence] API error:", err instanceof Error ? err.message : err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
