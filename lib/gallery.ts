// ─── Gallery Feed Sources ───────────────────────────────────────────────────
// Gallery source list is now config-driven.

import config from "@/lib/config"
export type { GallerySource } from "@/lib/config/types"

export const GALLERY_SOURCES = config.gallerySources

export type ColorMood = "warm" | "cool" | "earth" | "vivid" | "neutral"

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
}

/** Display-only image subset for color direction galleries */
export interface CuratedImage {
  id: string
  url: string
  title?: string
  source: string
  linkUrl?: string
}
