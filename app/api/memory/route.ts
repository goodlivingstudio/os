// Cerebro memory management — load, export, and clear conversation history
import { loadHistory, clearHistory, KV_AVAILABLE } from "@/lib/memory"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")

  if (!KV_AVAILABLE) {
    return Response.json({ available: false, messages: [] })
  }

  if (!sessionId) {
    return Response.json({ error: "sessionId required" }, { status: 400 })
  }

  const messages = await loadHistory(sessionId)
  return Response.json({ available: true, messages })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")

  if (!KV_AVAILABLE) {
    return Response.json({ available: false })
  }

  if (!sessionId) {
    return Response.json({ error: "sessionId required" }, { status: 400 })
  }

  await clearHistory(sessionId)
  return Response.json({ cleared: true })
}
