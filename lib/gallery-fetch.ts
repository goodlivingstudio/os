// ─── Gallery Fetch & Classify ───────────────────────────────────────────────
// Extracted from app/api/gallery/route.ts for shared use by both the gallery
// API and the color intelligence API. Fetches images from all gallery sources,
// classifies each by color mood/hue/saturation/lightness.

import { GALLERY_SOURCES, type GalleryImage, type ColorMood } from "@/lib/gallery"
import sharp from "sharp"

// ─── In-memory cache (30 min) ───────────────────────────────────────────────
let cachedImages: GalleryImage[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// ─── Are.na fetch ───────────────────────────────────────────────────────────

export async function fetchArena(url: string, sourceName: string): Promise<GalleryImage[]> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const data = await res.json()
    const contents = data.contents || []
    return contents
      .filter((c: { class?: string; image?: { display?: { url?: string }; original?: { url?: string } } }) => {
        if (c.image?.display?.url) return true
        if (c.image?.original?.url) return true
        return false
      })
      .map((c: { id: number; title?: string; class?: string; image?: { display?: { url?: string }; original?: { url?: string } }; source?: { url?: string } }) => ({
        id: `arena-${c.id}`,
        url: c.image?.display?.url || c.image?.original?.url || "",
        title: c.title || undefined,
        source: sourceName,
        linkUrl: c.source?.url || undefined,
        arenaBlockId: String(c.id),
      }))
      .filter((img: GalleryImage) => img.url.length > 0)
  } catch {
    return []
  }
}

// ─── RSS image extraction ───────────────────────────────────────────────────

function extractImageFromRSS(item: string): string | null {
  const decoded = item.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")

  function upgradeDezeenUrl(url: string): string {
    if (url.includes("dezeen.com")) {
      url = url.replace(/_sq_(\d+)\./, "_col_$1.")
      url = url.replace(/_sq(\d+)\./, "_col_$1.")
      url = url.replace(/_sq-\d+\./, "_col_0.")
      url = url.replace(/_sq\./, "_col_0.")
    }
    return url.replace(/-\d+x\d+\./, ".")
  }

  const imgMatches = decoded.matchAll(/<img[^>]+src=["']([^"']{20,})["']/gi)
  for (const m of imgMatches) {
    if (m[1]?.startsWith("http")) return upgradeDezeenUrl(m[1])
  }

  const mc = item.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*/i)
  if (mc?.[1]) return upgradeDezeenUrl(mc[1])

  const enc = item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image[^"']*["']/i)
    || item.match(/<enclosure[^>]+type=["']image[^"']*["'][^>]+url=["']([^"']+)["']/i)
  if (enc?.[1]) return upgradeDezeenUrl(enc[1])

  const mt = item.match(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*/i)
  if (mt?.[1]) return upgradeDezeenUrl(mt[1])

  const og = decoded.match(/(?:og:image|twitter:image)[^>]*content=["']([^"']+)["']/i)
  if (og?.[1]?.startsWith("http")) return og[1]

  return null
}

// ─── RSS fetch ──────────────────────────────────────────────────────────────

export async function fetchRSS(url: string, sourceName: string): Promise<GalleryImage[]> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Dispatch/1.0 (personal gallery)" },
    })
    if (!res.ok) return []
    const xml = await res.text()

    const items = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || []
    const images: GalleryImage[] = []

    for (let i = 0; i < Math.min(items.length, 30); i++) {
      const item = items[i]

      const titleMatch = item.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)
      const title = titleMatch?.[1]?.trim().replace(/<[^>]+>/g, "") || undefined

      const linkMatch = item.match(/<link[^>]+href=["']([^"']+)["']/i) || item.match(/<link[^>]*>([^<]+)<\/link>/i)
      const linkUrl = linkMatch?.[1]?.trim() || undefined

      const videoEnc = item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']video[^"']*["']/i)
        || item.match(/<enclosure[^>]+type=["']video[^"']*["'][^>]+url=["']([^"']+)["']/i)
      const videoMedia = item.match(/<media:content[^>]+url=["']([^"']+)["'][^>]+medium=["']video["']/i)
        || item.match(/<media:content[^>]+medium=["']video["'][^>]+url=["']([^"']+)["']/i)
      const videoUrl = videoEnc?.[1] || videoMedia?.[1] || undefined

      const imageUrl = extractImageFromRSS(item)

      if (videoUrl) {
        images.push({
          id: `rss-${sourceName}-v${i}`, url: imageUrl || videoUrl,
          title, source: sourceName, linkUrl, mediaType: "video", videoUrl,
        })
      } else if (imageUrl) {
        images.push({
          id: `rss-${sourceName}-${i}`, url: imageUrl,
          title, source: sourceName, linkUrl, mediaType: "image",
        })
      }
    }
    return images
  } catch {
    return []
  }
}

// ─── Color classification ───────────────────────────────────────────────────

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

export function classifyMood(r: number, g: number, b: number): ColorMood {
  const [h, s, l] = rgbToHsl(r, g, b)
  if (s < 0.08) return "neutral"
  if (s < 0.15 && l > 0.3 && l < 0.7) return "neutral"
  if (s > 0.55) return "vivid"
  if (s < 0.45 && ((h >= 20 && h <= 170)) && l < 0.7) return "sapling"
  if (h <= 50 || h >= 320) return "warm"
  if (h >= 180 && h <= 310) return "cool"
  if (h > 50 && h < 180) return s < 0.35 ? "sapling" : "cool"
  return "warm"
}

async function analyzeImageColor(url: string): Promise<{ mood: ColorMood; hue: number; saturation: number; lightness: number } | undefined> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "Dispatch/1.0 (gallery color analysis)" },
    })
    if (!res.ok) return undefined
    const buffer = Buffer.from(await res.arrayBuffer())
    const { data, info } = await sharp(buffer)
      .resize(8, 8, { fit: "cover" })
      .raw()
      .toBuffer({ resolveWithObject: true })
    if (info.channels < 3) return undefined

    let rSum = 0, gSum = 0, bSum = 0
    const pixels = 64
    for (let i = 0; i < pixels * info.channels; i += info.channels) {
      rSum += data[i]; gSum += data[i + 1]; bSum += data[i + 2]
    }
    const r = Math.round(rSum / pixels)
    const g = Math.round(gSum / pixels)
    const b = Math.round(bSum / pixels)
    const [h, s, l] = rgbToHsl(r, g, b)

    return {
      mood: classifyMood(r, g, b),
      hue: Math.round(h),
      saturation: Math.round(s * 100) / 100,
      lightness: Math.round(l * 100) / 100,
    }
  } catch {
    return undefined
  }
}

const MAX_CLASSIFY = 150

export async function classifyBatch(images: GalleryImage[]): Promise<GalleryImage[]> {
  const CONCURRENCY = 15
  const results = [...images]
  const toClassify = Math.min(results.length, MAX_CLASSIFY)

  for (let i = 0; i < toClassify; i += CONCURRENCY) {
    const batch = results.slice(i, Math.min(i + CONCURRENCY, toClassify))
    const analyses = await Promise.allSettled(
      batch.map(img => analyzeImageColor(img.url))
    )
    analyses.forEach((result, j) => {
      if (result.status === "fulfilled" && result.value) {
        const a = result.value
        results[i + j] = { ...results[i + j], mood: a.mood, hue: a.hue, saturation: a.saturation, lightness: a.lightness }
      }
    })
  }
  return results
}

// ─── Main entry point ───────────────────────────────────────────────────────
// Fetches all gallery sources and classifies images. Uses in-memory cache.

export async function fetchAndClassifyGalleryImages(): Promise<GalleryImage[]> {
  // Return cached if fresh
  if (cachedImages && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedImages
  }

  const results = await Promise.allSettled(
    GALLERY_SOURCES.map(src =>
      src.type === "arena"
        ? fetchArena(src.url, src.name)
        : fetchRSS(src.url, src.name)
    )
  )

  const allImages: GalleryImage[] = []
  for (const result of results) {
    if (result.status === "fulfilled") {
      allImages.push(...result.value)
    }
  }

  const classified = await classifyBatch(allImages)

  // Update cache
  cachedImages = classified
  cacheTimestamp = Date.now()

  return classified
}
