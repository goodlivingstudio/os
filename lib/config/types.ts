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

// ─── Feature Flags — per-instance opt-ins ──────────────────────────────────
// Optional map of feature flags controlling shared-layer behavior that only
// applies to certain products. Default behavior for every flag is `false` or
// equivalent — the shared layer treats an omitted flag as "off." A product
// opts in by setting the flag in its config file.
//
// Rule: features here are always OS-level features that some products want
// and others don't. Product-specific UI surfaces that no other product will
// ever need belong in the product config, not as a feature flag.

export interface FeatureFlags {
  /**
   * Classify gallery images by biome taxonomy (alpine, forest, desert, coastal,
   * wetland, prairie, arctic, underwater) using keyword matching in title/source/URL.
   * When enabled, the gallery overlay renders biome filter chips. Currently used
   * by Explore for its public-lands imagery; Dispatch and other products leave
   * it off (default).
   */
  galleryBiomes?: boolean
}

// ─── Instance Config — the full contract ────────────────────────────────────

export interface InstanceConfig {
  // Identity
  id: string                // "dispatch" | "explore" | "lilly-direct"
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
  themes: SkinDef[]
  defaultTheme: string

  // Cerebro
  provocations?: string[]              // rotating prompt suggestions for Cerebro
  cerebroWelcome?: { title: string; subtitle: string }

  // Gallery scraper (optional — instances that don't use the scraper can omit)
  galleryScraper?: GalleryScraperConfig
  // UGC scraper — separate channel for authentic user-generated content
  ugcScraper?: GalleryScraperConfig

  // Dispatch surface editorial directive (optional — defines what the weekly
  // intelligence brief produces). Each product interprets the Dispatch surface
  // differently: personal products generate publishable content pitches,
  // team products generate platform build recommendations, etc.
  dispatchDirective?: {
    role: string         // what the Dispatch surface is for this product
    modes: { name: string; description: string }[]  // pitch categories
    pitchSchema: string  // JSON schema fragment the AI should return per pitch
    rules: string        // additional constraints specific to this product
  }

  // Image generation art direction (optional — falls back to global style)
  imageDirection?: {
    style: string      // base medium + period + treatment
    avoid: string      // negative prompt
    mood: string       // emotional register
    skins?: Record<string, {
      geography: string  // regional landscape description
      palette: string    // color direction specific to this skin
    }>
  }

  // Feature flags — per-instance opt-ins for shared-layer behaviors
  features?: FeatureFlags
}
