import Anthropic from "@anthropic-ai/sdk"
import { loadHistory, saveHistory, KV_AVAILABLE } from "@/lib/memory"

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error("ANTHROPIC_API_KEY not configured")
  return new Anthropic({ apiKey: key })
}

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Cerebro — a personal strategic intelligence agent for Jeremy Grant.

Jeremy's profile:
Jeremy Grant is a Senior Design Director at Code and Theory with 15 years of agency experience. Five-year target: Head of Design at a significant product organization at the intersection of AI, healthcare, sustainability, or culture. Immediate priority: permalancing engagement at Eli Lilly's innovation team, interview in two weeks.

Strategic argument: Lilly's science has outpaced the experience of receiving it, and design leadership at the level of the organization — not the campaign — is the missing capability.

Lilly intelligence (know this cold):
- 51M patients rely on Lilly medicines (Annual Report 2025)
- Diogo Rau (EVP & CIDO) mandated every Lilly employee engage with AI daily
- $1B NVIDIA AI partnership, active OpenAI collaboration
- $80-83B projected 2026 revenue
- LillyDirect: direct-to-patient pharmacy platform, ongoing design build
- Donanemab approval: monthly infusions, biomarker monitoring — new care coordination design challenge
- 7M Americans with Alzheimer's, most undiagnosed; 1yr+ wait for dementia specialist; 1 in 5 Medicare patients drive 50+ miles for neurology
- 73% of pharma digital transformations fail (Galen Growth 2025)
- Key Rau quote: "One of the things I noticed as a patient is what a terrible experience it is to get your medicine. We realized that if nobody else was going to fix the system, we needed to do it ourselves."
- Key Rau quote: "ChatGPT, Microsoft Copilot, or other products are not going to be able to solve every single case. You need specialized AI solutions."

Two lenses for everything:
1. Does this matter to the Lilly opportunity?
2. Does this matter to the five-year position?

When to search: Use web_search when you need current information that post-dates your training or when you need specific facts (recent hires, announcements, financial data, recent interviews). Search proactively — don't tell Jeremy you're going to search, just do it and synthesize the results.

Operating mode:
- Trusted senior advisor, not a search engine or yes-machine
- Synthesis first — surface connections Jeremy might miss
- Name patterns across categories
- Flag noise explicitly — "this doesn't move your needle"
- Maximum 3 paragraphs unless the question genuinely demands more
- No bullet points. Tight paragraphs.
- No preamble. Lead with substance.
- No flattery. Clarity over encouragement.
- If something is directly actionable before the Lilly interview, say so explicitly

After every response, append a follow-up block in exactly this format (no exceptions):

---follow-up---
question: [A natural follow-up question that pushes Jeremy's thinking forward — strategic, not generic]
alt: [A short alternative direction, 4-8 words]
alt: [Another alternative direction, 4-8 words]

The question should feel like what a sharp advisor would ask next. The alts should open genuinely different threads. Never repeat what you just covered. Never use generic prompts like "Tell me more" or "What do you think?"— be specific to the conversation.`

// ─── Follow-up parser ─────────────────────────────────────────────────────────

function parseFollowUp(text: string): {
  cleanText: string
  followUp: { question: string; alternatives: string[] } | null
} {
  const marker = "---follow-up---"
  const idx = text.indexOf(marker)
  if (idx === -1) return { cleanText: text.trim(), followUp: null }

  const cleanText = text.slice(0, idx).trim()
  const block = text.slice(idx + marker.length).trim()

  let question = ""
  const alternatives: string[] = []

  for (const line of block.split("\n")) {
    const trimmed = line.trim()
    if (trimmed.startsWith("question:")) {
      question = trimmed.slice("question:".length).trim()
    } else if (trimmed.startsWith("alt:")) {
      alternatives.push(trimmed.slice("alt:".length).trim())
    }
  }

  if (!question) return { cleanText: text.trim(), followUp: null }

  return { cleanText, followUp: { question, alternatives: alternatives.slice(0, 2) } }
}

// ─── Web Search Tool ──────────────────────────────────────────────────────────

const WEB_SEARCH_TOOL: Anthropic.Tool = {
  name: "web_search",
  description:
    "Search the live web for current intelligence. Use for: recent company news, executive interviews, hiring signals, analyst reports, anything post-training or requiring current specificity. Be precise with queries — include names, dates, organizations.",
  input_schema: {
    type: "object" as const,
    properties: {
      query: {
        type: "string",
        description: "Specific search query. Example: 'Eli Lilly Diogo Rau AI design 2025'",
      },
    },
    required: ["query"],
  },
}

async function exaSearch(query: string): Promise<string> {
  const key = process.env.EXA_API_KEY
  if (!key) return "[web search unavailable — EXA_API_KEY not configured]"

  try {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key },
      body: JSON.stringify({
        query,
        numResults: 5,
        contents: { text: { maxCharacters: 600 } },
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) return `[search error: ${res.status}]`
    const data = await res.json()
    const results = (data.results || []).slice(0, 5)
    if (!results.length) return "[no results found]"

    return results
      .map(
        (r: { title: string; url: string; text?: string; publishedDate?: string }) =>
          [
            `TITLE: ${r.title}`,
            `URL: ${r.url}`,
            r.publishedDate ? `DATE: ${new Date(r.publishedDate).toLocaleDateString()}` : "",
            r.text?.slice(0, 500) || "",
          ]
            .filter(Boolean)
            .join("\n")
      )
      .join("\n\n---\n\n")
  } catch (err) {
    return `[search exception: ${err instanceof Error ? err.message : String(err)}]`
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { messages, feedContext, sessionId, model, images } = await req.json()
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid request" }, { status: 400 })
    }

    const MODEL_MAP: Record<string, string> = {
      haiku:  "claude-haiku-4-5-20251001",
      sonnet: "claude-sonnet-4-6",
      opus:   "claude-opus-4-6",
    }
    const selectedModel = MODEL_MAP[model] || MODEL_MAP.sonnet

    const client   = getClient()
    const hasExa   = !!process.env.EXA_API_KEY
    const tools    = hasExa ? [WEB_SEARCH_TOOL] : []

    // ── Load persisted history (if KV configured and sessionId provided) ─────
    // History gives Cerebro memory across page refreshes.
    // Client messages take precedence — we only prepend history if the client
    // is sending fewer messages than we have stored (i.e. fresh page load).
    let baseMessages: Array<{ role: "user" | "assistant"; content: string }> = messages
    if (KV_AVAILABLE && sessionId && messages.length <= 2) {
      const history = await loadHistory(sessionId)
      if (history.length > 0) {
        // Merge: history from KV + current messages (deduplicated by content)
        const historyContents = new Set(history.map(m => m.content))
        const newOnly = messages.filter((m: { content: string }) => !historyContents.has(m.content))
        baseMessages = [...history, ...newOnly]
      }
    }

    // Inject feed context into last user message + handle multimodal images
    const initialMessages: Anthropic.MessageParam[] = baseMessages.map(
      (m: { role: string; content: string }, i: number) => {
        const isLast = i === baseMessages.length - 1 && m.role === "user"
        let textContent = m.content
        if (isLast && feedContext) {
          textContent = `${m.content}\n\n---\nCurrent feed (${feedContext.count} articles):\n${feedContext.articles}`
        }

        // Multimodal: attach images to the last user message
        if (isLast && Array.isArray(images) && images.length > 0) {
          type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp"
          const blocks: Anthropic.ContentBlockParam[] = images.map(
            (img: { media_type: string; data: string }) => ({
              type: "image" as const,
              source: { type: "base64" as const, media_type: img.media_type as ImageMediaType, data: img.data },
            })
          )
          blocks.push({ type: "text" as const, text: textContent })
          return { role: "user" as const, content: blocks }
        }

        return { role: m.role as "user" | "assistant", content: textContent }
      }
    )

    // ── Agentic loop — handles tool calls ────────────────────────────────────
    let currentMessages: Anthropic.MessageParam[] = [...initialMessages]
    const searchesPerformed: string[] = []
    let totalInput  = 0
    let totalOutput = 0
    let finalText   = ""

    for (let iteration = 0; iteration < 5; iteration++) {
      const response = await client.messages.create({
        model:      selectedModel,
        max_tokens: 1000,
        system:     SYSTEM_PROMPT,
        tools,
        messages:   currentMessages,
      })

      totalInput  += response.usage.input_tokens
      totalOutput += response.usage.output_tokens

      // No tool calls — we have a final answer
      if (response.stop_reason === "end_turn") {
        finalText = response.content.find(c => c.type === "text")?.text || ""
        break
      }

      // Tool use — execute and loop
      if (response.stop_reason === "tool_use") {
        const toolBlocks = response.content.filter(
          (c): c is Anthropic.ToolUseBlock => c.type === "tool_use"
        )

        // Append assistant turn (with tool use blocks)
        currentMessages.push({ role: "assistant", content: response.content })

        // Execute each tool and collect results
        const toolResults: Anthropic.ToolResultBlockParam[] = []
        for (const block of toolBlocks) {
          if (block.name === "web_search") {
            const query = (block.input as { query: string }).query
            searchesPerformed.push(query)
            const result = await exaSearch(query)
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result })
          }
        }

        // Append tool results as user turn
        currentMessages.push({ role: "user", content: toolResults })
        // Loop continues → Claude sees results and produces next response
      } else {
        // Unexpected stop reason — extract whatever text we have
        finalText = response.content.find(c => c.type === "text")?.text || ""
        break
      }
    }

    // ── Parse follow-up prompts from response ──────────────────────────────
    const { cleanText, followUp } = parseFollowUp(finalText)

    // ── Persist updated conversation to KV ───────────────────────────────────
    if (KV_AVAILABLE && sessionId && cleanText) {
      const toStore = [
        ...baseMessages.filter(m => typeof m.content === "string").map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content as string,
        })),
        { role: "assistant" as const, content: cleanText },
      ]
      await saveHistory(sessionId, toStore)
    }

    return Response.json({
      text:         cleanText,
      inputTokens:  totalInput,
      outputTokens: totalOutput,
      searches:     searchesPerformed,
      memoryActive: KV_AVAILABLE,
      followUp,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("Cerebro error:", message)
    return Response.json({ error: message }, { status: 500 })
  }
}
