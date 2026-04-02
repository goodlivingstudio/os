// Gallery API — aggregates images from Are.na and RSS feeds
import { GALLERY_SOURCES, type GalleryImage } from "@/lib/gallery"

export const revalidate = 1800 // 30 min cache

async function fetchArena(url: string, sourceName: string): Promise<GalleryImage[]> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const data = await res.json()
    const contents = data.contents || []
    return contents
      .filter((c: { class: string; image?: { display?: { url: string } } }) =>
        c.class === "Image" && c.image?.display?.url
      )
      .map((c: { id: number; title?: string; image: { display: { url: string } }; source?: { url?: string } }) => ({
        id: `arena-${c.id}`,
        url: c.image.display.url,
        title: c.title || undefined,
        source: sourceName,
        linkUrl: c.source?.url || undefined,
      }))
  } catch {
    return []
  }
}

function extractImageFromRSS(item: string): string | null {
  // media:content url
  const mc = item.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*/i)
  if (mc?.[1]) return mc[1]

  // media:thumbnail url
  const mt = item.match(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*/i)
  if (mt?.[1]) return mt[1]

  // enclosure
  const enc = item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image[^"']*["']/i)
    || item.match(/<enclosure[^>]+type=["']image[^"']*["'][^>]+url=["']([^"']+)["']/i)
  if (enc?.[1]) return enc[1]

  // img in description
  const img = item.match(/<img[^>]+src=["']([^"']{20,})["']/i)
  if (img?.[1]?.startsWith("http")) return img[1]

  return null
}

async function fetchRSS(url: string, sourceName: string): Promise<GalleryImage[]> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Dispatch/1.0 (personal gallery)" },
    })
    if (!res.ok) return []
    const xml = await res.text()

    const items = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || []
    const images: GalleryImage[] = []

    for (let i = 0; i < Math.min(items.length, 20); i++) {
      const item = items[i]
      const imageUrl = extractImageFromRSS(item)
      if (!imageUrl) continue

      const titleMatch = item.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)
      const title = titleMatch?.[1]?.trim().replace(/<[^>]+>/g, "") || undefined

      const linkMatch = item.match(/<link[^>]+href=["']([^"']+)["']/i) || item.match(/<link[^>]*>([^<]+)<\/link>/i)
      const linkUrl = linkMatch?.[1]?.trim() || undefined

      images.push({
        id: `rss-${sourceName}-${i}`,
        url: imageUrl,
        title,
        source: sourceName,
        linkUrl,
      })
    }

    return images
  } catch {
    return []
  }
}

export async function GET() {
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

  // Shuffle for variety
  for (let i = allImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[allImages[i], allImages[j]] = [allImages[j], allImages[i]]
  }

  return Response.json({
    images: allImages,
    count: allImages.length,
    sources: GALLERY_SOURCES.length,
  })
}
