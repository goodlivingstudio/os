// Gallery Curation API — three-action image curation
//
// approve:      Thumbs up — protect from auto-archiving, positive taste signal
// reject:       X — wrong content. Remove + blocklist + teach taste to avoid this subject
// low-quality:  Low fidelity — right subject, bad execution. Remove + blocklist the URL
//               but DON'T penalize the subject matter (watermarks, blurry, bad crop)
//
// POST /api/gallery/curate
// Body: { action: "approve" | "reject" | "low-quality", imageUrl: string, arenaBlockId?: string, source?: string }

import { kv } from "@vercel/kv"
import { kvKey } from "@/lib/config"

const KV_AVAILABLE = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const ARENA_API = "https://api.are.na/v2"

// KV keys for curation data
const BLOCKLIST_KEY = kvKey("gallery:blocklist")           // Set of rejected image URLs (both reject + low-quality)
const APPROVED_KEY = kvKey("gallery:approved")              // Set of approved image URLs
const CONTENT_REJECT_KEY = kvKey("gallery:content-rejects") // URLs rejected for CONTENT (teaches taste to avoid subject)
const QUALITY_REJECT_KEY = kvKey("gallery:quality-rejects") // URLs rejected for QUALITY (subject is fine, find better version)
const CURATION_LOG_KEY = kvKey("gallery:curation-log")      // Recent curation actions for taste learning

interface CurationAction {
  action: "approve" | "reject" | "low-quality"
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

    if (!["approve", "reject", "low-quality"].includes(action)) {
      return Response.json({ error: "action must be 'approve', 'reject', or 'low-quality'" }, { status: 400 })
    }

    const results: string[] = []

    // ── Remove from Are.na (both reject and low-quality remove the image) ──
    if ((action === "reject" || action === "low-quality") && arenaBlockId && process.env.ARENA_ACCESS_TOKEN) {
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

    if (KV_AVAILABLE) {
      // ── Reject (content): blocklist + record as content rejection ──
      if (action === "reject") {
        await kv.sadd(BLOCKLIST_KEY, imageUrl)
        await kv.sadd(CONTENT_REJECT_KEY, imageUrl)
        await kv.srem(APPROVED_KEY, imageUrl)
        results.push("Blocklisted (content)")
      }

      // ── Low quality: blocklist the URL but record as quality rejection ──
      // The scraper won't re-add this exact image, but won't avoid the subject matter
      if (action === "low-quality") {
        await kv.sadd(BLOCKLIST_KEY, imageUrl)
        await kv.sadd(QUALITY_REJECT_KEY, imageUrl)
        await kv.srem(APPROVED_KEY, imageUrl)
        results.push("Blocklisted (quality)")
      }

      // ── Approve: mark as protected ──
      if (action === "approve") {
        await kv.sadd(APPROVED_KEY, imageUrl)
        await kv.srem(BLOCKLIST_KEY, imageUrl)
        await kv.srem(CONTENT_REJECT_KEY, imageUrl)
        await kv.srem(QUALITY_REJECT_KEY, imageUrl)
        results.push("Approved")
      }

      // ── Log the action ──
      const logEntry: CurationAction = {
        action,
        imageUrl,
        source,
        timestamp: new Date().toISOString(),
      }
      await kv.lpush(CURATION_LOG_KEY, JSON.stringify(logEntry))
      await kv.ltrim(CURATION_LOG_KEY, 0, 499)
    }

    return Response.json({ success: true, action, results })
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
