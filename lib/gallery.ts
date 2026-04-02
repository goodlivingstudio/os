// ─── Gallery Feed Sources ───────────────────────────────────────────────────
// Curated image feeds for the visual intelligence gallery.
// Uses Are.na channels and RSS image feeds.

export interface GallerySource {
  url: string
  name: string
  type: "arena" | "rss"
}

export const GALLERY_SOURCES: GallerySource[] = [
  // Are.na channels — curated visual streams
  { url: "https://api.are.na/v2/channels/dispatch-zen/contents?per=40", name: "Dispatch Zen", type: "arena" },

  // RSS image feeds — architecture, design, photography
  { url: "https://www.dezeen.com/architecture/feed/", name: "Dezeen Architecture", type: "rss" },
  { url: "https://www.dezeen.com/design/feed/", name: "Dezeen Design", type: "rss" },
  { url: "https://www.architectural-review.com/rss", name: "Architectural Review", type: "rss" },
]

export interface GalleryImage {
  id: string
  url: string
  title?: string
  source: string
  linkUrl?: string
}
