// Gallery Metabolism — Automated Daily Cycling
// Runs on Vercel Cron: ages out unengaged images, preserves approved ones.
//
// Schedule: daily at 5am ET (before the team's day starts)
// Vercel cron config in vercel.json
//
// The cycle:
// 1. Load all Are.na channel blocks with timestamps
// 2. Load approved set from KV (thumbs-up images — protected)
// 3. Archive blocks older than DECAY_DAYS that haven't been approved
// 4. Log stats for monitoring

import { kv } from "@vercel/kv"
import { kvKey } from "@/lib/config"
import instanceConfig from "@/lib/config"

const KV_AVAILABLE = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const ARENA_API = "https://api.are.na/v2"
const DECAY_DAYS = 30  // images older than this without approval get archived
const STATS_KEY = kvKey("gallery:cycle-stats")
const APPROVED_KEY = kvKey("gallery:approved")

interface ArenaBlock {
  id: number
  title?: string
  created_at: string
  image?: {
    display?: { url?: string }
    original?: { url?: string }
  }
}

// Vercel Cron handler
export async function GET(req: Request) {
  // Verify cron secret — mandatory in production
  const authHeader = req.headers.get("authorization")
  if (process.env.VERCEL && !process.env.CRON_SECRET) {
    return Response.json({ error: "CRON_SECRET must be configured in production" }, { status: 500 })
  }
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const token = process.env.ARENA_ACCESS_TOKEN
  if (!token) {
    return Response.json({ error: "ARENA_ACCESS_TOKEN not configured" }, { status: 500 })
  }

  const channels: string[] = []
  if (instanceConfig.galleryScraper?.arenaChannelSlug) channels.push(instanceConfig.galleryScraper.arenaChannelSlug)
  if (instanceConfig.ugcScraper?.arenaChannelSlug) channels.push(instanceConfig.ugcScraper.arenaChannelSlug)

  if (channels.length === 0) {
    return Response.json({ error: "No gallery channels configured" }, { status: 500 })
  }

  // Load approved URLs from KV
  let approvedUrls = new Set<string>()
  if (KV_AVAILABLE) {
    try {
      const urls = await kv.smembers(APPROVED_KEY) as string[]
      approvedUrls = new Set(urls)
    } catch { /* */ }
  }

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - DECAY_DAYS)

  const results: Record<string, { total: number; archived: number; protected: number; kept: number }> = {}

  for (const slug of channels) {
    let total = 0
    let archived = 0
    let protectedCount = 0

    // Load all blocks
    let page = 1
    const blocks: ArenaBlock[] = []
    while (true) {
      try {
        const res = await fetch(`${ARENA_API}/channels/${slug}/contents?per=100&page=${page}`, {
          headers: { "Authorization": `Bearer ${token}` },
          signal: AbortSignal.timeout(15000),
        })
        if (!res.ok) break
        const data = await res.json()
        const contents = data.contents || []
        if (contents.length === 0) break
        blocks.push(...contents)
        if (contents.length < 100) break
        page++
      } catch { break }
    }

    total = blocks.length

    // Evaluate each block
    for (const block of blocks) {
      const imageUrl = block.image?.display?.url || block.image?.original?.url
      const createdAt = new Date(block.created_at)
      const isOld = createdAt < cutoff
      const isApproved = imageUrl ? approvedUrls.has(imageUrl) : false

      if (isApproved) {
        protectedCount++
        continue
      }

      if (isOld) {
        // Archive: remove from Are.na
        try {
          const res = await fetch(`${ARENA_API}/channels/${slug}/blocks/${block.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` },
          })
          if (res.ok) archived++
        } catch { /* */ }
        // Rate limit
        await new Promise(r => setTimeout(r, 200))
      }
    }

    results[slug] = {
      total,
      archived,
      protected: protectedCount,
      kept: total - archived,
    }
  }

  // Log stats
  if (KV_AVAILABLE) {
    try {
      const stats = {
        timestamp: new Date().toISOString(),
        instance: instanceConfig.id,
        channels: results,
        decayDays: DECAY_DAYS,
      }
      await kv.set(STATS_KEY, stats)
    } catch { /* */ }
  }

  return Response.json({
    success: true,
    instance: instanceConfig.id,
    decayDays: DECAY_DAYS,
    approvedCount: approvedUrls.size,
    channels: results,
  })
}
