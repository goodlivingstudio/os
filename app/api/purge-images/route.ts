// Purge generated images from KV — clears synthesis and dispatch caches
// Use when exploring new art direction or cleaning up stale images
import { kv } from "@vercel/kv"

export async function POST(req: Request) {
  if (!process.env.KV_REST_API_URL) {
    return Response.json({ error: "KV not available" }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const target = searchParams.get("target") || "all" // "synthesis" | "dispatch" | "all"

  const deleted: string[] = []

  try {
    // Synthesis cache (includes embedded images)
    if (target === "synthesis" || target === "all") {
      const result = await kv.del("synthesis:weekly")
      if (result > 0) deleted.push("synthesis:weekly")
    }

    // Dispatch cache (includes embedded images)
    if (target === "dispatch" || target === "all") {
      // Find the current week key
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 1)
      const diff = now.getTime() - start.getTime()
      const weekNum = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
      const weekKey = `dispatch:weekly:${now.getFullYear()}-w${weekNum}`
      const result = await kv.del(weekKey)
      if (result > 0) deleted.push(weekKey)
    }

    // Clear localStorage caches on next load (client-side)
    // This is handled by the UI — we just clear KV here

    return Response.json({
      deleted: deleted.length,
      keys: deleted,
      target,
      message: `Cleared ${deleted.length} image cache${deleted.length !== 1 ? "s" : ""}. Fresh images will generate on next visit.`,
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
