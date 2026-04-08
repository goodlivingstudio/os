// Annotation endpoint — runs Claude Haiku on article titles, returns relevance hooks
// Called client-side after articles load; results cached in localStorage (2hr)
// Decoupled from /api/news to avoid Vercel function timeout during ISR

import Anthropic from "@anthropic-ai/sdk"
import { trackUsage } from "@/lib/usage-tracker"
import { OPERATOR, FIVE_LAYERS } from "@/lib/prompts"
import { layerLabelsSlash, scoreJsonExample, scoreJsonRange, layerIdsPipe } from "@/lib/config"

interface ArticleInput {
  id: string
  title: string
  category: string
}

interface Annotation {
  id: string
  synopsis: string
  relevance: string
  signalType: string
  signalLens: string
  signalScores?: Record<string, number>
}

const SYSTEM_PROMPT = `${OPERATOR}

${FIVE_LAYERS}

Your task: annotate the following article for the Dispatch intelligence system.

Produce a structured annotation with:

SYNOPSIS: 1–2 sentences. What this article is about, stated plainly.

RELEVANCE_HOOK: 1 sentence. Why this specific article is relevant to the mandate. Be precise — name the specific connection (the active engagement, strategic positioning, current design challenges, etc.). If it is not relevant, say so.

SIGNAL_TYPE: One of: DATA / CASE / OPINION / TREND / RESEARCH / NEWS / CULTURAL

PRIMARY_LAYER: The single most relevant intelligence layer: ${layerLabelsSlash()}

SCORES: JSON object with integer scores 0–10 for each layer:
${scoreJsonExample()}

SCORING GUIDANCE:
- Score generously for genuine relevance; score 0–2 for layers where relevance is a stretch
- Urgency reflects time-sensitivity: today's breaking news scores higher than evergreen analysis
- Multi-layer signals (2+ layers above 6) are the most valuable — flag these in the relevance hook

For each numbered headline, return a JSON array. One object per article, same order:
{
  "synopsis": "1-2 sentence synopsis",
  "hook": "1 sentence relevance hook",
  "type": "DATA | CASE | OPINION | TREND | RESEARCH | NEWS | CULTURAL",
  "lens": "${layerLabelsSlash().toUpperCase()}",
  "scores": ${scoreJsonRange()}
}

Return only valid JSON array. No prose.`

export async function POST(req: Request) {
  const apiKey = (process.env.DISPATCH_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY)
  if (!apiKey) return Response.json({ error: "No API key" }, { status: 500 })

  let articles: ArticleInput[] = []
  try {
    const body = await req.json()
    articles = body.articles || []
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (articles.length === 0) {
    return Response.json({ annotations: [] })
  }

  const items = articles
    .map((a, i) => `${i + 1}. [${a.category}] ${a.title}`)
    .join("\n")

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 6000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: items + "\n\nReturn JSON array." },
      ],
    })
    trackUsage({ endpoint: "annotate", provider: "anthropic", model: "claude-haiku-4-5-20251001", inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens }).catch(() => {})

    const text = response.content[0]?.type === "text" ? response.content[0].text : ""
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return Response.json({ annotations: [] })

    let raw: { synopsis?: string; hook?: string; type?: string; lens?: string; scores?: Record<string, number> }[]
    try {
      raw = JSON.parse(match[0])
    } catch {
      return Response.json({ annotations: [] })
    }

    const annotations: Annotation[] = articles.map((a, i) => ({
      id:           a.id,
      synopsis:     raw[i]?.synopsis  || "",
      relevance:    raw[i]?.hook      || "",
      signalType:   raw[i]?.type      || "",
      signalLens:   raw[i]?.lens      || "",
      signalScores: raw[i]?.scores,
    }))

    return Response.json({ annotations })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
