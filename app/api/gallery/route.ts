// Gallery API — aggregates images from Are.na and RSS feeds
// Core fetch + classify logic lives in lib/gallery-fetch.ts (shared with color-intelligence)
import { GALLERY_SOURCES } from "@/lib/gallery"
import { fetchAndClassifyGalleryImages } from "@/lib/gallery-fetch"

export const revalidate = 1800 // 30 min cache

export async function GET() {
  const classified = await fetchAndClassifyGalleryImages()

  // Shuffle for variety
  for (let i = classified.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[classified[i], classified[j]] = [classified[j], classified[i]]
  }

  return Response.json({
    images: classified,
    count: classified.length,
    sources: GALLERY_SOURCES.length,
  })
}
