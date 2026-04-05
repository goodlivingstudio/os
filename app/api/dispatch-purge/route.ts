// Purge the dispatch weekly cache — forces regeneration on next visit
import { kv } from "@vercel/kv"

const KV_AVAILABLE = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)

function getWeekKey(): string {
  const now = new Date()
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `dispatch:weekly:${date.getUTCFullYear()}-w${week}`
}

export async function POST() {
  if (!KV_AVAILABLE) {
    return Response.json({ error: "KV not available" }, { status: 500 })
  }

  try {
    const key = getWeekKey()
    await kv.del(key)
    return Response.json({ success: true, key, message: "Cache cleared. Next visit will regenerate." })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
