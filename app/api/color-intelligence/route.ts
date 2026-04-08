// Color Intelligence endpoint — synthesizes color/visual culture trends from the feed
// Now includes curated image galleries matched to each color direction.
import Anthropic from "@anthropic-ai/sdk"
import { DISPATCH_PREAMBLE } from "@/lib/prompts"
import { loadArticleHistory } from "@/lib/article-store"
import { generateCardImages } from "@/lib/image-gen"
import { trackUsage } from "@/lib/usage-tracker"
import { kv } from "@vercel/kv"
import { fetchAndClassifyGalleryImages } from "@/lib/gallery-fetch"
import { matchImagesToDirection, fetchMetMuseumImages } from "@/lib/color-utils"
import { kvKey } from "@/lib/config"

const KV_KEY = kvKey("color-intelligence:weekly")
const CACHE_TTL = 60 * 60 * 12 // 12 hours

// Sources and keywords that signal color/visual culture relevance
const COLOR_SOURCES = new Set([
  // Design publications
  "Heuritech", "It's Nice That", "Creative Boom", "Canva Newsroom",
  "Dezeen", "Wallpaper*", "Designboom", "IGNANT", "Colossal",
  "Booooooom", "Yellowtrace", "Awwwards", "Eye on Design",
  // Added: interiors
  "Architectural Digest", "AD Pro",
  // Added: fashion color signal
  "Vogue Runway", "Business of Fashion",
])
const COLOR_KEYWORDS = /\b(color|colour|palette|hue|pantone|wgsn|coloro|chromatic|pigment|tint|shade|tone|gradient|visual\s+trend|design\s+trend|aesthetic|material|texture|pattern|mood|fashion\s+week|forecast|season|farrow|dulux|benjamin\s+moore|sherwin|colormix|munsell|ncs|edelkoort|colour\s+hive|color\s+of\s+the\s+year)/i

const SYSTEM_PROMPT = `${DISPATCH_PREAMBLE}

You are the color intelligence layer of Dispatch. You track what's moving in visual culture — not the colors themselves, but what color shifts MEAN.

Your job is NOT to act as a color picker or palette generator. Your job is to synthesize what authoritative sources are saying about color, and interpret what those shifts signal about culture, consumer psychology, and the design landscape.

AUTHORITATIVE SOURCES TO REFERENCE (by tier):

Tier 1 — Forecasting authorities:
- WGSN: The dominant fashion/consumer trend forecaster. Color forecasting ~2 years ahead.
- Pantone Color Institute: Industry standard. Color of the Year, seasonal palettes.
- Coloro: Digital-physical color accuracy system, often paired with WGSN. Strong on sustainability palettes.
- Heuritech: AI-powered fashion trend detection from social media with color signal layer.
- Trend Union / Li Edelkoort: Legendary forecaster. Editorial and cultural, not data-driven.
- Colour Hive: Accessible trend forecasting with color-forward editorial.
- Fashion Snoops / Stylesight: Competitive with WGSN; strong seasonal color callouts.
- EDITED: Retail analytics — what's actually selling vs. what's forecast.

Tier 2 — Paint & material authorities:
- Dulux, Benjamin Moore, Farrow & Ball, Sherwin-Williams: Annual Color of the Year with supporting palettes. Farrow & Ball carries serious curatorial weight. Sherwin-Williams Colormix is underrated.
- Material ConneXion: Materials library with color/texture overlap for product/industrial design.

Tier 3 — Color science & classification:
- NCS (Natural Color System): Perceptual color model from Sweden, used in architecture/product.
- Munsell Color System: Scientific notation used in soil science, dentistry, archaeology, forensics.
- Werner's Nomenclature of Colours (1814): The original natural color classification. Still referenced.

Tier 4 — Cultural & art historical:
- The Metropolitan Museum of Art, Rijksmuseum, Cooper Hewitt: Open-access collections for historical palette research.
- Google Arts & Culture: Color search tool for browsing artwork by dominant hue.
- Smithsonian Color in Nature project: Pigmentation across the natural world.
- NASA Earth Observatory / OceanColor: Satellite imagery as earthtone and atmospheric palette source.

Tier 5 — Digital community signals:
- Coolors.co, Adobe Color, ColorHunt: Trending palettes crowd-sourced from millions.
- Pinterest: Visual trend signal via dominant palette clustering.

When synthesizing, cite the most relevant authorities. Reference historical precedent when it strengthens the argument (e.g., "This echoes the muted terracottas in Dutch Golden Age interiors" or "The NCS system would classify this shift as...").

You receive articles from the operator's feed that touch on color, visual culture, design trends, and aesthetic direction. Some will reference forecaster predictions directly. Others will demonstrate color shifts through the work they cover. Read both.

PRODUCE:

1. HEADLINE: One declarative sentence (max 15 words) naming the most important shift in color culture this week. Not a color name — a cultural observation. "Institutional warmth is replacing clinical neutrality" not "Teal is trending."

2. BRIEFING: 2-3 sentences. What's moving in color culture and why it matters for a design leader. Connect color shifts to broader cultural forces — consumer psychology, industry direction, material culture. Reference specific articles and sources.

3. COLOR DIRECTIONS (exactly 4): Named trends emerging from the feed. Each is a cultural direction expressed through color, not just a color name. Example: "Institutional Warmth" — the shift from clinical white to amber in corporate branding signals a pivot from authority to approachability.
   - title: A named direction (3-6 words, evocative not technical)
   - description: 2-3 sentences. What this direction means culturally and what's driving it. Reference specific articles.
   - palette: exactly 5 hex colors that represent this direction, ordered from warmest/darkest to lightest/coolest. Include a range: a deep anchor, two mid-tones, a light tint, and an accent or complement.

4. FORECAST HIGHLIGHTS (exactly 3): What the major color forecasters are saying, synthesized from the articles. If the articles reference WGSN, Pantone, Heuritech, Coloro, or similar authorities, distill their positions. If no forecaster content is available, note honestly what's missing.
   - authority: The forecaster or source name
   - insight: Their position, synthesized in 1-2 sentences
   - timeframe: What season or year they're forecasting for (if available)

5. CEREBRO TOPICS (exactly 3): Color-specific questions for the Cerebro intelligence panel. Each should connect color/visual culture to the operator's broader mandate — design leadership, strategic positioning, and the mandate's primary domains.
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
  // Color intelligence is Dispatch-only — skip for other instances
  const instance = process.env.NEXT_PUBLIC_INSTANCE || "dispatch"
  if (instance !== "dispatch") {
    return Response.json({ briefing: null, colorDirections: [], forecastHighlights: [] })
  }

  const apiKey = (process.env.DISPATCH_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY)
  if (!apiKey) return Response.json({ error: "No API key" }, { status: 500 })

  try {
    const { articles } = await req.json()
    if (!articles?.length) {
      return Response.json({ briefing: null, colorDirections: [], forecastHighlights: [] })
    }

    // Check KV cache first — but reject stale entries missing curatedImages
    if (process.env.KV_REST_API_URL) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cached = await kv.get<any>(KV_KEY)
        if (cached && cached.briefing) {
          // Validate cache has the new fields (curatedImages, 5-color palettes)
          const hasImages = cached.colorDirections?.some((d: { curatedImages?: unknown[] }) => (d.curatedImages?.length ?? 0) > 0)
          const has5Colors = cached.colorDirections?.some((d: { palette?: string[] }) => (d.palette?.length || 0) >= 5)
          if (hasImages && has5Colors) {
            return Response.json(cached)
          }
          // Stale cache — missing new fields, delete and regenerate
          await kv.del(KV_KEY)
        }
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

    // ─── Parallel: Claude synthesis + gallery image fetch ───────────────
    const client = new Anthropic({ apiKey })
    const [claudeResponse, galleryImages] = await Promise.all([
      client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 3000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
      fetchAndClassifyGalleryImages().catch(() => []),
    ])

    trackUsage({ endpoint: "color-intelligence", provider: "anthropic", model: "claude-haiku-4-5-20251001", inputTokens: claudeResponse.usage?.input_tokens, outputTokens: claudeResponse.usage?.output_tokens }).catch(() => {})

    const text = claudeResponse.content[0]?.type === "text" ? claudeResponse.content[0].text : ""
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

    // ─── Match gallery images + Met Museum art to each color direction ──
    if (result.colorDirections?.length) {
      // Track used image IDs across directions to avoid duplicates
      const usedIds = new Set<string>()

      // Fetch Met Museum images for all directions in parallel
      const metImagePromises = result.colorDirections.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (dir: any) => dir.palette?.length
          ? fetchMetMuseumImages(dir.palette, 2).catch(() => [])
          : Promise.resolve([])
      )
      const metImageResults = await Promise.all(metImagePromises)

      for (let i = 0; i < result.colorDirections.length; i++) {
        const direction = result.colorDirections[i]
        if (!direction.palette?.length) continue

        // Gallery feed images (4 slots)
        const available = galleryImages.filter(img => !usedIds.has(img.id))
        const galleryMatched = matchImagesToDirection(available, direction.palette, 4)
        for (const img of galleryMatched) usedIds.add(img.id)

        // Met Museum images (up to 2 slots)
        const metImages = metImageResults[i] || []

        // Interleave: gallery images first, then museum at positions 2 and 4
        const combined = [...galleryMatched]
        if (metImages[0]) combined.splice(Math.min(2, combined.length), 0, metImages[0])
        if (metImages[1]) combined.splice(Math.min(4, combined.length), 0, metImages[1])

        direction.curatedImages = combined.slice(0, 6)
      }
    }

    // Generate hero image (3:2 — fits the narrow left column of the B2 broadsheet)
    if (process.env.REPLICATE_API_TOKEN) {
      try {
        const heroTitle = result.headline || result.briefing?.split(/[.!?]/)[0] || "Color intelligence"
        const heroUrls = await generateCardImages([{ title: heroTitle, layers: ["culture"] }], "color-intelligence", "3:2")
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
