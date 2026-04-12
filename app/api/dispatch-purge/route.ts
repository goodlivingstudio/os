// Purge the dispatch weekly cache — forces regeneration on next visit
// Clears all skin variants (each biome gets its own cached image set)
import { kv } from "@vercel/kv"
import { kvKey } from "@/lib/config"
import instanceConfig from "@/lib/config"

const KV_AVAILABLE = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)

function getWeekKey(): string {
  const now = new Date()
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return kvKey(`weekly:${date.getUTCFullYear()}-w${week}`)
}

export async function POST() {
  if (!KV_AVAILABLE) {
    return Response.json({ error: "KV not available" }, { status: 500 })
  }

  try {
    const baseKey = getWeekKey()
    // Delete all skin variants + the base key
    const skinIds = instanceConfig.themes.map(t => t.id)
    const keys = [baseKey, ...skinIds.map(s => `${baseKey}:${s}`)]
    const results = await Promise.all(keys.map(k => kv.del(k)))
    const deleted = results.reduce((a, b) => a + b, 0)
    return Response.json({ success: true, deleted, message: "Cache cleared. Next visit will regenerate." })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
