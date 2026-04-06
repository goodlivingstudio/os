export const revalidate = 1800 // 30 min cache

import { PODCAST_FEEDS, type PodcastFeed } from "@/lib/podcasts"
import { kv } from "@vercel/kv"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Episode {
  id: string
  title: string
  showName: string
  url: string
  hasEpisodePage?: boolean
  publishedAt: string
  summary: string
  duration: string
  artworkUrl: string
  category: string
  tag: string
  layer: string
  urgency?: number
  signalScores?: { opportunity: number; position: number; discipline: number; landscape: number; culture: number; urgency: number }
}

// ─── RSS Parser ──────────────────────────────────────────────────────────────

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}

function extractCDATA(raw: string): string {
  const m = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return m ? m[1] : raw
}

function stripHTML(str: string): string {
  return str.replace(/<[^>]+>/g, "").trim()
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return m ? decodeEntities(extractCDATA(m[1]).trim()) : ""
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i"))
  return m ? m[1] : ""
}

function formatDuration(raw: string): string {
  if (!raw) return ""
  // Could be seconds (e.g., "2580") or HH:MM:SS
  if (raw.includes(":")) return raw
  const totalSec = parseInt(raw, 10)
  if (isNaN(totalSec)) return raw
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

async function fetchPodcastFeed(feed: PodcastFeed): Promise<Episode[]> {
  try {
    const res = await fetch(feed.url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Dispatch/1.0 (+https://dispatch.goodliving.studio)" },
    })
    if (!res.ok) return []
    const xml = await res.text()

    // Extract show-level artwork + link
    const showArtwork = extractAttr(xml, "itunes:image", "href")
      || extractAttr(xml, "image", "href")
      || ""

    // Parse items
    const items = xml.match(/<item[\s\S]*?<\/item>/gi) || []
    return items.slice(0, 5).map((item) => {
      const title = stripHTML(extractTag(item, "title"))
      const guid = extractTag(item, "guid")
      const pubDate = extractTag(item, "pubDate")

      // URL priority: episode page link > guid (if URL-shaped) > enclosure (audio file)
      const link = extractTag(item, "link")
      const enclosureUrl = extractAttr(item, "enclosure", "url")
      const guidUrl = guid && guid.startsWith("http") ? guid : ""
      const episodeUrl = link || guidUrl || ""
      const audioUrl = enclosureUrl || ""

      // Skip episodes that only have audio file URLs and no episode page
      // These are likely aggregator feeds or low-quality sources
      const url = episodeUrl || audioUrl

      const desc = stripHTML(extractTag(item, "description") || extractTag(item, "itunes:summary") || "")
      const duration = formatDuration(extractTag(item, "itunes:duration"))
      const episodeArt = extractAttr(item, "itunes:image", "href")

      // Generate stable ID from title + show (not index position)
      const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60)
      const showSlug = feed.show.toLowerCase().replace(/[^a-z0-9]+/g, "-")

      return {
        id: `${showSlug}-${titleSlug}`,
        title: title || "Untitled Episode",
        showName: feed.show,
        url,
        hasEpisodePage: !!episodeUrl,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        summary: desc.slice(0, 200),
        duration,
        artworkUrl: episodeArt || showArtwork,
        category: feed.category,
        tag: feed.tag,
        layer: feed.layer,
      }
    })
  } catch {
    return []
  }
}

// ─── GET Handler ─────────────────────────────────────────────────────────────

export async function GET() {
  const results = await Promise.allSettled(
    PODCAST_FEEDS.map(feed => fetchPodcastFeed(feed))
  )

  const allEpisodes: Episode[] = []
  let liveSources = 0

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.length > 0) {
      allEpisodes.push(...result.value)
      liveSources++
    }
  }

  // Deduplicate by normalized title — if two shows cover the same topic
  // with near-identical titles, keep the one from the more credible source
  // (the one with an episode page URL, or the first one encountered)
  const seen = new Map<string, Episode>()
  for (const ep of allEpisodes) {
    // Normalize: lowercase, strip punctuation, collapse whitespace
    const norm = ep.title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim()
    const existing = seen.get(norm)
    if (!existing) {
      seen.set(norm, ep)
    } else {
      // Keep the one with an episode page, or the first
      if (!existing.hasEpisodePage && (ep as Episode & { hasEpisodePage?: boolean }).hasEpisodePage) {
        seen.set(norm, ep)
      }
    }
  }
  const episodes = [...seen.values()]

  // Sort by most recent
  episodes.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  // Podcast annotation is lazy — runs client-side when Audio tab is visited
  // Removed from ISR to avoid competing with news annotation on page load

  // Check which shows have generated artwork in KV, serve via /api/audio-image endpoint
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const uniqueShows = [...new Set(episodes.map(e => e.showName))]
      const keys = uniqueShows.map(s => `audio-image:${s.replace(/[^a-zA-Z0-9]/g, "_")}`)
      // Just check existence via TTL (cheap — no data transfer)
      const ttls = await Promise.all(keys.map(k => kv.ttl(k).catch(() => -2)))
      const showsWithArt = new Set<string>()
      uniqueShows.forEach((show, i) => { if (ttls[i] > 0 || ttls[i] === -1) showsWithArt.add(show) })

      for (const ep of episodes) {
        if (showsWithArt.has(ep.showName)) {
          const slug = ep.showName.replace(/[^a-zA-Z0-9]/g, "_")
          ;(ep as Episode & { originalArtworkUrl?: string }).originalArtworkUrl = ep.artworkUrl
          ep.artworkUrl = `/api/audio-image?show=${encodeURIComponent(slug)}`
        }
      }
    } catch { /* KV read failure — keep original artwork */ }
  }

  return Response.json({
    episodes,
    isLive: liveSources > 0,
    showCount: liveSources,
    totalShows: PODCAST_FEEDS.length,
  })
}
