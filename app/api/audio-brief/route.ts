// Audio Brief — generates 3 signal cards from podcast episodes
// Same pattern as /api/brief but specific to audio content
import Anthropic from "@anthropic-ai/sdk"
import { INSTANCE_PREAMBLE } from "@/lib/prompts"
import { trackUsage } from "@/lib/usage-tracker"
import { layerLabelsSlash } from "@/lib/config"

function getClient() {
  const key = (process.env.DISPATCH_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY)
  if (!key) throw new Error("ANTHROPIC_API_KEY not configured")
  return new Anthropic({ apiKey: key })
}

const BRIEF_SYSTEM = `${INSTANCE_PREAMBLE}

Your task: generate exactly 3 signal cards from the podcast episodes below. These are audio intelligence — conversations, interviews, and analysis that carry different weight than written news.

SELECTION CRITERIA:
- Select the 3 episodes most relevant to the mandate right now
- Prefer episodes that surface insights not available in the news feed (interviews, practitioner perspective, long-form analysis)
- Each card should represent distinct territory — do not pick three signals from the same layer

CARD FORMAT:
Each card must contain:
- layer: Primary intelligence layer (${layerLabelsSlash()}) — uppercase
- headline: A sharp declarative statement of the signal (not a news headline — a synthesis statement). Max 12 words.
- body: 2-3 sentences. What this episode reveals. Why it matters to this operator specifically. What it might demand.

TONE: Direct. The card should make someone want to listen immediately.

Return as a JSON array with exactly 3 items. No preamble. No sign-off. Valid JSON only.`

interface EpisodeInput {
  title: string
  showName: string
  category: string
  summary?: string
}

export async function POST(req: Request) {
  try {
    const { episodes }: { episodes: EpisodeInput[] } = await req.json()

    if (!episodes?.length) {
      return Response.json({
        signals: [
          { headline: "FEED UNAVAILABLE", body: "No episodes to analyze.", layer: "", sources: [] },
          { headline: "—", body: "", layer: "", sources: [] },
          { headline: "—", body: "", layer: "", sources: [] },
        ],
      })
    }

    const inputEpisodes = episodes.slice(0, 20)
    const context = inputEpisodes
      .map((e, i) => `${i + 1}. [${e.category}] ${e.showName}: ${e.title}${e.summary ? ` — ${e.summary.slice(0, 100)}` : ""}`)
      .join("\n")

    const response = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: BRIEF_SYSTEM,
      messages: [{ role: "user", content: `Podcast episodes (${episodes.length}):\n\n${context}\n\nGenerate the audio brief.` }],
    })
    trackUsage({ endpoint: "audio-brief", provider: "anthropic", model: "claude-haiku-4-5-20251001", inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens }).catch(() => {})

    const text = response.content[0]?.type === "text" ? response.content[0].text.trim() : ""

    let parsed: { headline?: string; body?: string; layer?: string; label?: string }[] = []
    try {
      const jsonText = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "")
      parsed = JSON.parse(jsonText)
    } catch {
      const match = text.match(/\[[\s\S]*\]/)
      if (match) {
        try { parsed = JSON.parse(match[0]) } catch { /* */ }
      }
    }

    const signals = parsed.slice(0, 3).map(item => ({
      headline: item.headline || item.label || "SIGNAL",
      body: item.body || "",
      layer: item.layer || "",
      sources: [],
    }))

    while (signals.length < 3) {
      signals.push({ headline: "—", body: "", layer: "", sources: [] })
    }

    return Response.json({ signals })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return Response.json({
      signals: [
        { headline: "BRIEF ERROR", body: message, layer: "", sources: [] },
        { headline: "—", body: "", layer: "", sources: [] },
        { headline: "—", body: "", layer: "", sources: [] },
      ],
    })
  }
}
