import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are Cerebro — a personal field intelligence agent for Jeremy Grant, a Senior Design Director actively positioning for Head of Design roles at significant product organizations within five years. Active immediate priority: permalancing opportunity at Eli Lilly's innovation team, interview in two weeks.

Your mandate: Jeremy is building a creative practice around the future of design judgment in an AI-accelerated world. He has 15 years of agency experience across editorial systems, brand identity, and digital product. He is building external signal and in-house credibility simultaneously.

Your job is synthesis, context, and intent. Read the current feed context provided with each query. Know what matters to him and why. Answer with the directness of a trusted senior advisor — not a search engine, not a yes-machine.

Surface connections across categories he might miss. Flag anything directly relevant to the Lilly positioning or the five-year trajectory. When you see a pattern across multiple articles, name it. When something is noise, say so.

Operating principles:
- No bullet points. Write in tight paragraphs.
- No preamble. Lead with the substance.
- No flattery. He doesn't need encouragement, he needs clarity.
- When you don't know, say so. When something is outside the feed context, say so.
- Maximum 3 paragraphs unless the question genuinely demands more.
- You have memory of this conversation thread. Build on previous exchanges.

If no feed context is provided or articles are sparse, work from your knowledge of the design and technology landscape — but be transparent about the source of your response.`

export async function POST(req: Request) {
  try {
    const { messages, feedContext } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid request" }, { status: 400 })
    }

    // Inject feed context into the last user message if available
    const messagesWithContext = messages.map((m: { role: string; content: string }, i: number) => {
      if (i === messages.length - 1 && m.role === "user" && feedContext) {
        return {
          role: m.role,
          content: `${m.content}\n\n---\nCurrent feed context (${feedContext.count} articles):\n${feedContext.articles}`,
        }
      }
      return m
    })

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: messagesWithContext.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const inputTokens = response.usage.input_tokens
    const outputTokens = response.usage.output_tokens

    return Response.json({ text, inputTokens, outputTokens })
  } catch (err) {
    console.error("Cerebro error:", err)
    return Response.json({ error: "Failed to reach Cerebro" }, { status: 500 })
  }
}
