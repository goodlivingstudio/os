// ─── Gallery Feed Sources ───────────────────────────────────────────────────
// Gallery source list is now config-driven.

import config from "@/lib/config"
export type { GallerySource } from "@/lib/config/types"

export const GALLERY_SOURCES = config.gallerySources

export type ColorMood = "warm" | "cool" | "sapling" | "vivid" | "neutral"

export type Biome = "alpine" | "forest" | "desert" | "coastal" | "wetland" | "prairie" | "arctic" | "underwater"

// ─── Biome classification — keyword-based from source/title/URL ─────────────

const BIOME_KEYWORDS: Record<Biome, RegExp> = {
  alpine: /mountain|peak|ridge|alpine|summit|teton|rainier|denali|rocky\s?mountain|sierra|cascad|himalaya|alps|elevation|snow.*peak|high\s?altitude/i,
  forest: /forest|redwood|sequoia|old.growth|woodland|canopy|moss|fern|tree|timber|grove|smoky|shenandoah|olympic.*rain|temperate/i,
  desert: /desert|canyon|mesa|dune|arid|sand|red\s?rock|monument\s?valley|death\s?valley|joshua\s?tree|arches|bryce|canyonlands|badlands|white\s?sands|southwest|slot\s?canyon/i,
  coastal: /coast|ocean|sea|shore|beach|cliff|tidal|surf|lighthouse|acadia|big\s?sur|pacific|atlantic|wave|cove|headland|bluff/i,
  wetland: /wetland|river|lake|marsh|swamp|bayou|everglade|reflection|waterfall|stream|creek|pond|bog|delta|mangrove/i,
  prairie: /prairie|grassland|plain|wheat|meadow|steppe|savanna|field|rolling\s?hill|heartland|big\s?sky/i,
  arctic: /arctic|glacier|ice|tundra|aurora|northern\s?light|polar|frozen|permafrost|fjord|iceland|norway.*winter/i,
  underwater: /underwater|ocean.*deep|coral|reef|kelp|marine|whale|dolphin|sea\s?life|blue\s?planet|bioluminescen|dive|aquatic/i,
}

export function classifyBiome(title?: string, source?: string, url?: string): Biome | undefined {
  const text = [title, source, url].filter(Boolean).join(" ").toLowerCase()
  let bestMatch: Biome | undefined
  let bestScore = 0
  for (const [biome, regex] of Object.entries(BIOME_KEYWORDS) as [Biome, RegExp][]) {
    const matches = text.match(regex)
    if (matches && matches[0].length > bestScore) {
      bestMatch = biome
      bestScore = matches[0].length
    }
  }
  return bestMatch
}

export interface ColorSwatch {
  hex: string
  hue: number
  saturation: number
  lightness: number
  percentage: number  // how much of the image this color represents
}

export interface GalleryImage {
  id: string
  url: string
  title?: string
  source: string
  linkUrl?: string
  mood?: ColorMood
  hue?: number
  saturation?: number
  lightness?: number
  palette?: ColorSwatch[]  // top 3-5 dominant colors
  mediaType?: "image" | "video"
  videoUrl?: string
  arenaBlockId?: string    // Are.na block ID for curation actions
  biome?: Biome            // classified biome (Explore only)
}

/** Display-only image subset for color direction galleries */
export interface CuratedImage {
  id: string
  url: string
  title?: string
  source: string
  linkUrl?: string
}
