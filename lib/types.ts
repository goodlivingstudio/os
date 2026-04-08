// ─── Shared types ────────────────────────────────────────────────────────────

import config, { getLayerConfig } from "@/lib/config"

export interface Article {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  summary: string       // raw RSS description — used in feed row only
  imageUrl?: string     // RSS source image (media:content, enclosure, etc.)
  synopsis?: string     // AI-generated: what it's about, mandate-framed
  category: string
  tag: string
  relevance?: string    // AI-generated: why it matters to the mandate
  signalType?: string
  signalLens?: string
  signalScores?: Record<string, number>  // layer scores (dynamic per instance) + urgency
}

export interface Message {
  role: "user" | "assistant" | "search"
  content: string
}

export interface SignalSource {
  title: string
  url: string
  source: string
}

export interface Signal {
  headline: string
  body: string
  layer: string
  urgency: number
  source?: string
  /** @deprecated Use headline instead — kept for backward compat during transition */
  label: string
  sources?: SignalSource[]
}

export interface FeedHealth {
  sourcesLive:   number
  sourcesTotal:  number
  sourcesFailed: number
  stubCategories: string[]
  sourceFailures?: Record<string, number> // { "Source Name": consecutiveFailureCount }
}

export type Skin = string  // now dynamic per instance — skin IDs come from config

export type ViewMode = "signal" | "audio" | "synthesis" | "dispatch" | "config" | "pulse"

// ─── Intelligence layers (config-driven) ─────────────────────────────────────

export type IntelLayer = string  // now dynamic per instance

export const LAYER_CONFIG = getLayerConfig()


// ─── Helpers ─────────────────────────────────────────────────────────────────

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 36e5)
  if (h < 1) return "< 1h"
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

// ─── Citation sources ────────────────────────────────────────────────────────

export interface CitationSource {
  title: string
  url: string
  source?: string
}

// ─── Layer colors (config-driven) ────────────────────────────────────────────

export const LAYER_COLOR: Record<string, string> = config.layerColors

