// ─── Instance Configuration Schema ──────────────────────────────────────────
// Each white-label instance of this tool provides one of these.
// The mother (shared infrastructure) reads from this contract.
// Children own: identity, mandate, content sources, branding.
// Mother owns: components, layout, views, AI pipeline, theme engine, caching.

// ─── Content source types (defined here to avoid circular imports) ──────────
// The consumer files (feeds.ts, gallery.ts, podcasts.ts) re-export these.

export interface FeedDef {
  url: string
  source: string
  category: string
  tag: string
  layer: string
  type?: "news" | "social"
}

export interface GallerySource {
  url: string
  name: string
  type: "arena" | "rss"
}

export interface PodcastFeed {
  url: string
  show: string
  category: string
  tag: string
  layer: string
}

// ─── Intelligence Layer ─────────────────────────────────────────────────────

export interface LayerDef {
  id: string
  label: string
  description: string   // used in AI prompts to explain what this layer means
}

// ─── Ticker ─────────────────────────────────────────────────────────────────

export interface TickerHeadline {
  cat: string
  text: string
  url: string
}

export interface CategoryStyle {
  bg: string
  color: string
}

// ─── Skin ───────────────────────────────────────────────────────────────────

export interface SkinDef {
  id: string
  label: string
  dot: string           // color swatch in skin picker
}

// ─── Branding ───────────────────────────────────────────────────────────────

export interface BrandingConfig {
  name: string          // "Dispatch" | "Explore" | "Lilly"
  tagline: string
  domain: string        // "dispatch.goodliving.studio"
  port: number          // dev server port
  favicon: { light: string; dark: string; apple: string }
}

// ─── Mandate (AI context) ───────────────────────────────────────────────────

export interface MandateConfig {
  operator: string          // OPERATOR prompt block — who is using this tool
  clientContext: string     // LILLY_CONTEXT equivalent — primary intelligence target
  voice: string             // VOICE directive — behavioral rules for AI
  sourceModes: string       // INTELLIGENCE / FORMATION / POSITIONING framing
}

// ─── Gallery Scraper ────────────────────────────────────────────────────────

export interface ScrapeTarget {
  url: string
  name: string
  category: "archive" | "photography" | "editorial" | "gallery" | "agency"
}

export interface GalleryScraperConfig {
  arenaChannelSlug: string
  targets: ScrapeTarget[]
  tastePrompt: string        // Claude Vision curatorial mandate for this instance
}

// ─── Instance Config — the full contract ────────────────────────────────────

export interface InstanceConfig {
  // Identity
  id: string                // "dispatch" | "explore" | "lilly"
  branding: BrandingConfig

  // Mandate — AI personality and framing
  mandate: MandateConfig

  // Intelligence taxonomy
  layers: LayerDef[]
  layerColors: Record<string, string>

  // Content sources
  feeds: FeedDef[]
  podcasts: PodcastFeed[]
  gallerySources: GallerySource[]

  // Ticker
  headlines: TickerHeadline[]
  categoryStyleDay: Record<string, CategoryStyle>
  categoryStyleNight: Record<string, CategoryStyle>

  // Theme
  skins: SkinDef[]
  defaultSkin: string

  // Cerebro
  provocations?: string[]              // rotating prompt suggestions for Cerebro
  cerebroWelcome?: { title: string; subtitle: string }

  // Gallery scraper (optional — instances that don't use the scraper can omit)
  galleryScraper?: GalleryScraperConfig
  // UGC scraper — separate channel for authentic user-generated content
  ugcScraper?: GalleryScraperConfig
}
