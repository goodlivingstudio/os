// Purge the synthesis cache — forces regeneration on next visit
// Clears all skin variants (each biome gets its own cached image set)
import { kv } from "@vercel/kv"
import { kvKey } from "@/lib/config"
import instanceConfig from "@/lib/config"

const KV_KEY = kvKey("synthesis:weekly")

export async function POST() {
  if (!process.env.KV_REST_API_URL) {
    return Response.json({ error: "KV not available" }, { status: 500 })
  }

  try {
    // Delete all skin variants + the base key
    const skinIds = instanceConfig.themes.map(t => t.id)
    const keys = [KV_KEY, ...skinIds.map(s => `${KV_KEY}:${s}`)]
    const results = await Promise.all(keys.map(k => kv.del(k)))
    const deleted = results.reduce((a, b) => a + b, 0)
    return Response.json({ success: true, deleted, message: "Synthesis cache cleared. Next visit will regenerate." })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
