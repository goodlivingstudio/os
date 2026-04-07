// ─── Color Utilities for Direction Matching ─────────────────────────────────
// Converts hex palettes to HSL, computes perceptual distance, and matches
// classified gallery images to color directions.

import type { GalleryImage } from "@/lib/gallery"

export interface HSL {
  h: number // 0-360
  s: number // 0-1
  l: number // 0-1
}

export interface CuratedImage {
  id: string
  url: string
  title?: string
  source: string
  linkUrl?: string
}

// ─── Conversions ────────────────────────────────────────────────────────────

export function hexToHsl(hex: string): HSL {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const lum = (max + min) / 2

  if (max === min) return { h: 0, s: 0, l: lum }

  const d = max - min
  const sat = lum > 0.5 ? d / (2 - max - min) : d / (max + min)
  let hue = 0

  if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) hue = ((b - r) / d + 2) / 6
  else hue = ((r - g) / d + 4) / 6

  return { h: hue * 360, s: sat, l: lum }
}

// ─── Distance ───────────────────────────────────────────────────────────────
// Cylindrical HSL distance with hue wrapping and perceptual weighting.
// Hue is weighted 2x because it's the primary discriminator for palette matching.

export function hslDistance(a: HSL, b: HSL): number {
  // Hue wraps at 360
  const hueDiff = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h))
  const hueNorm = hueDiff / 180 // normalize to 0-1

  const satDiff = Math.abs(a.s - b.s)
  const lumDiff = Math.abs(a.l - b.l)

  // Weight: hue 2x, saturation 1x, lightness 0.5x
  return Math.sqrt(
    (hueNorm * 2) ** 2 +
    satDiff ** 2 +
    (lumDiff * 0.5) ** 2
  )
}

// ─── Matching ───────────────────────────────────────────────────────────────
// Matches classified gallery images to a direction's palette colors.
// Returns the closest N images with source diversity constraint.

export function matchImagesToDirection(
  images: GalleryImage[],
  palette: string[],
  count: number = 6,
): CuratedImage[] {
  if (!palette?.length || !images?.length) return []

  const paletteHsl = palette.map(hexToHsl)

  // Score each image: minimum distance to any palette color
  const scored = images
    .filter(img => img.hue !== undefined && img.saturation !== undefined && img.lightness !== undefined)
    .map(img => {
      const imgHsl: HSL = { h: img.hue!, s: img.saturation!, l: img.lightness! }
      const minDist = Math.min(...paletteHsl.map(p => hslDistance(imgHsl, p)))
      return { img, dist: minDist }
    })
    .sort((a, b) => a.dist - b.dist)

  // Select with source diversity: max 2 from same source
  const selected: CuratedImage[] = []
  const sourceCounts = new Map<string, number>()

  for (const { img } of scored) {
    if (selected.length >= count) break
    const srcCount = sourceCounts.get(img.source) || 0
    if (srcCount >= 2) continue
    sourceCounts.set(img.source, srcCount + 1)
    selected.push({
      id: img.id,
      url: img.url,
      title: img.title,
      source: img.source,
      linkUrl: img.linkUrl,
    })
  }

  return selected
}

// ─── Met Museum API ─────────────────────────────────────────────────────────
// Searches the Metropolitan Museum of Art's open-access collection by keyword
// and returns images that can be mixed into color direction galleries.
// No API key needed. Rate limit: 80 req/sec.

const MET_SEARCH = "https://collectionapi.metmuseum.org/public/collection/v1/search"
const MET_OBJECT = "https://collectionapi.metmuseum.org/public/collection/v1/objects"

// Map palette hex colors to evocative search terms for the Met collection
function paletteToSearchTerms(palette: string[]): string[] {
  const terms: string[] = []
  for (const hex of palette) {
    const hsl = hexToHsl(hex)
    // Map hue ranges to art-relevant search terms
    if (hsl.s < 0.1) {
      terms.push("silver", "gray", "monochrome")
    } else if (hsl.h <= 30 || hsl.h >= 340) {
      terms.push("vermilion", "red", "terracotta")
    } else if (hsl.h > 30 && hsl.h <= 60) {
      terms.push("gold", "amber", "ochre")
    } else if (hsl.h > 60 && hsl.h <= 150) {
      terms.push("green", "verdant", "botanical")
    } else if (hsl.h > 150 && hsl.h <= 250) {
      terms.push("blue", "azure", "ultramarine")
    } else if (hsl.h > 250 && hsl.h < 340) {
      terms.push("purple", "mauve", "violet")
    }
  }
  // Deduplicate
  return [...new Set(terms)].slice(0, 3)
}

export async function fetchMetMuseumImages(
  palette: string[],
  count: number = 2,
): Promise<CuratedImage[]> {
  try {
    const terms = paletteToSearchTerms(palette)
    if (terms.length === 0) return []

    // Search with first term + "painting" for best visual results
    const query = `${terms[0]} painting`
    const searchRes = await fetch(
      `${MET_SEARCH}?hasImages=true&isHighlight=true&q=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!searchRes.ok) return []

    const searchData = await searchRes.json()
    const objectIds: number[] = searchData.objectIDs || []
    if (objectIds.length === 0) return []

    // Fetch details for a handful of top results (highlights are pre-sorted by relevance)
    const toFetch = objectIds.slice(0, Math.min(count * 3, 8))
    const objects = await Promise.allSettled(
      toFetch.map(id =>
        fetch(`${MET_OBJECT}/${id}`, { signal: AbortSignal.timeout(4000) })
          .then(r => r.json())
      )
    )

    const images: CuratedImage[] = []
    for (const result of objects) {
      if (images.length >= count) break
      if (result.status !== "fulfilled") continue
      const obj = result.value
      // Only use objects with public-domain images
      if (!obj.primaryImageSmall || !obj.isPublicDomain) continue
      images.push({
        id: `met-${obj.objectID}`,
        url: obj.primaryImageSmall,
        title: obj.title || undefined,
        source: "Met Museum",
        linkUrl: obj.objectURL || `https://www.metmuseum.org/art/collection/search/${obj.objectID}`,
      })
    }

    return images
  } catch {
    return []
  }
}
