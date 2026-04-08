// Gallery API — aggregates images from Are.na and RSS feeds
// Core fetch + classify logic lives in lib/gallery-fetch.ts (shared with color-intelligence)
import { GALLERY_SOURCES } from "@/lib/gallery"
import { fetchAndClassifyGalleryImages } from "@/lib/gallery-fetch"
import { kv } from "@vercel/kv"
import { kvKey } from "@/lib/config"

export const revalidate = 1800 // 30 min cache

const KV_AVAILABLE = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
const BLOCKLIST_KEY = kvKey("gallery:blocklist")

export async function GET() {
  const classified = await fetchAndClassifyGalleryImages()

  // Filter out blocklisted images (thumbs-downed by user)
  let filtered = classified
  if (KV_AVAILABLE) {
    try {
      const blockedUrls = await kv.smembers(BLOCKLIST_KEY) as string[]
      if (blockedUrls.length > 0) {
        const blocked = new Set(blockedUrls)
        filtered = classified.filter(img => !blocked.has(img.url))
      }
    } catch { /* KV unavailable — serve unfiltered */ }
  }

  // Shuffle for variety
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[filtered[i], filtered[j]] = [filtered[j], filtered[i]]
  }

  return Response.json({
    images: filtered,
    count: filtered.length,
    sources: GALLERY_SOURCES.length,
  })
}
