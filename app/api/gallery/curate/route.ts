// Gallery Curation API — thumbs up/down on gallery images
// Approve: protects image from auto-archiving, logs positive signal
// Reject: removes from Are.na + adds to blocklist so scrapers skip it
//
// POST /api/gallery/curate
// Body: { action: "approve" | "reject", imageUrl: string, arenaBlockId?: string, source?: string }

import { kv } from "@vercel/kv"
import { kvKey } from "@/lib/config"

const KV_AVAILABLE = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const ARENA_API = "https://api.are.na/v2"

// KV keys for curation data
const BLOCKLIST_KEY = kvKey("gallery:blocklist")       // Set of rejected image URLs
const APPROVED_KEY = kvKey("gallery:approved")          // Set of approved image URLs
const CURATION_LOG_KEY = kvKey("gallery:curation-log")  // Recent curation actions for taste learning

interface CurationAction {
  action: "approve" | "reject"
  imageUrl: string
  source?: string
  timestamp: string
}

export async function POST(req: Request) {
  try {
    const { action, imageUrl, arenaBlockId, source } = await req.json()

    if (!action || !imageUrl) {
      return Response.json({ error: "action and imageUrl required" }, { status: 400 })
    }

    if (action !== "approve" && action !== "reject") {
      return Response.json({ error: "action must be 'approve' or 'reject'" }, { status: 400 })
    }

    const results: string[] = []

    // ── Reject: remove from Are.na + add to blocklist ──
    if (action === "reject") {
      // Delete from Are.na if we have a block ID and token
      if (arenaBlockId && process.env.ARENA_ACCESS_TOKEN) {
        // Try both channels (curated and UGC) — the block could be in either
        const channels = await getChannelSlugs()
        for (const slug of channels) {
          try {
            const res = await fetch(`${ARENA_API}/channels/${slug}/blocks/${arenaBlockId}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${process.env.ARENA_ACCESS_TOKEN}` },
            })
            if (res.ok) results.push(`Removed from Are.na (${slug})`)
          } catch { /* channel might not contain this block */ }
        }
      }

      // Add to KV blocklist
      if (KV_AVAILABLE) {
        await kv.sadd(BLOCKLIST_KEY, imageUrl)
        // Also remove from approved set if it was there
        await kv.srem(APPROVED_KEY, imageUrl)
        results.push("Added to blocklist")
      }
    }

    // ── Approve: mark as protected ──
    if (action === "approve") {
      if (KV_AVAILABLE) {
        await kv.sadd(APPROVED_KEY, imageUrl)
        // Remove from blocklist if it was there (undo previous reject)
        await kv.srem(BLOCKLIST_KEY, imageUrl)
        results.push("Marked as approved")
      }
    }

    // ── Log the action for taste learning ──
    if (KV_AVAILABLE) {
      const logEntry: CurationAction = {
        action,
        imageUrl,
        source,
        timestamp: new Date().toISOString(),
      }
      // Keep a rolling log of last 500 actions
      await kv.lpush(CURATION_LOG_KEY, JSON.stringify(logEntry))
      await kv.ltrim(CURATION_LOG_KEY, 0, 499)
    }

    return Response.json({
      success: true,
      action,
      results,
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// ── Read endpoints for scrapers ──

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type") // "blocklist" | "approved" | "stats"

  if (!KV_AVAILABLE) {
    return Response.json({ error: "KV not available" }, { status: 500 })
  }

  if (type === "blocklist") {
    const urls = await kv.smembers(BLOCKLIST_KEY)
    return Response.json({ count: urls.length, urls })
  }

  if (type === "approved") {
    const urls = await kv.smembers(APPROVED_KEY)
    return Response.json({ count: urls.length, urls })
  }

  // Default: stats
  const [blockedCount, approvedCount, logLength] = await Promise.all([
    kv.scard(BLOCKLIST_KEY),
    kv.scard(APPROVED_KEY),
    kv.llen(CURATION_LOG_KEY),
  ])

  return Response.json({
    blocked: blockedCount,
    approved: approvedCount,
    totalActions: logLength,
  })
}

// Helper: get channel slugs from config
async function getChannelSlugs(): Promise<string[]> {
  // Dynamic import to avoid circular dependency at module level
  const { default: config } = await import("@/lib/config")
  const slugs: string[] = []
  if (config.galleryScraper?.arenaChannelSlug) slugs.push(config.galleryScraper.arenaChannelSlug)
  if (config.ugcScraper?.arenaChannelSlug) slugs.push(config.ugcScraper.arenaChannelSlug)
  return slugs
}
