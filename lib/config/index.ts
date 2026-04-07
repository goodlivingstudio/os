// ─── Instance Config Loader ─────────────────────────────────────────────────
// Reads NEXT_PUBLIC_INSTANCE env var to determine which child config to load.
// Default: "dispatch"
//
// Usage:
//   NEXT_PUBLIC_INSTANCE=explore npm run dev    → loads Explore config
//   NEXT_PUBLIC_INSTANCE=lilly npm run dev      → loads Lilly config
//   npm run dev                                 → loads Dispatch config (default)

import type { InstanceConfig } from "./types"
import dispatchConfig from "./dispatch"
import exploreConfig from "./explore"

const CONFIGS: Record<string, InstanceConfig> = {
  dispatch: dispatchConfig,
  explore: exploreConfig,
  // lilly: lillyConfig,  // TODO: add when ready
}

const instanceId = process.env.NEXT_PUBLIC_INSTANCE || "dispatch"
const config: InstanceConfig = CONFIGS[instanceId] || dispatchConfig

export default config

// Re-export types for convenience
export type { InstanceConfig, LayerDef, TickerHeadline, CategoryStyle, SkinDef, BrandingConfig, MandateConfig } from "./types"

// ─── Storage key helper ─────────────────────────────────────────────────────
// Prefixes all localStorage/KV keys with the instance ID to prevent collisions.

export function storageKey(key: string): string {
  return `${config.id}-${key}`
}

/** KV cache key — prefixed with instance ID for namespace isolation */
export function kvKey(key: string): string {
  return `${config.id}:${key}`
}

// ─── AI prompt helpers ──────────────────────────────────────────────────────

/** Layer names for use in AI prompts: "Opportunity / Position / Discipline / Landscape / Culture" */
export function layerLabelsSlash(cfg: InstanceConfig = config): string {
  return cfg.layers.map(l => l.label).join(" / ")
}

/** Layer IDs for use in AI prompt pipe-separated: "opportunity|position|discipline|landscape|culture" */
export function layerIdsPipe(cfg: InstanceConfig = config): string {
  return cfg.layers.map(l => l.id).join("|")
}

/** JSON score example for AI prompts: { "access": 0, "experience": 0, ... "urgency": 0 } */
export function scoreJsonExample(cfg: InstanceConfig = config): string {
  const entries = cfg.layers.map(l => `  "${l.id}": 0`).concat(['  "urgency": 0'])
  return `{\n${entries.join(",\n")}\n}`
}

/** JSON score range for AI prompts: { "access": 0-10, "experience": 0-10, ... "urgency": 0-10 } */
export function scoreJsonRange(cfg: InstanceConfig = config): string {
  const entries = cfg.layers.map(l => `"${l.id}": 0-10`).concat(['"urgency": 0-10'])
  return `{ ${entries.join(", ")} }`
}

// ─── Derived helpers (computed from config) ─────────────────────────────────

/** Build the full AI preamble from mandate config */
export function buildPreamble(cfg: InstanceConfig = config): string {
  const layerDescriptions = cfg.layers
    .map(l => `${l.label.toUpperCase()} (0–10): ${l.description}`)
    .join("\n\n")

  const layerBlock = `Every article in the feed is scored across ${cfg.layers.length} intelligence layers plus urgency. Scores run 0–10.\n\n${layerDescriptions}\n\nURGENCY (0–10): Time-sensitivity of the signal regardless of layer. 9–10: demands attention today. 7–8: relevant this week. 5–6: useful context. Below 5: background intelligence. Multi-layer signals (high on 2+ layers) are the highest value.`

  return `${cfg.mandate.operator}\n\n${cfg.mandate.clientContext}\n\n${layerBlock}\n\n${cfg.mandate.sourceModes}\n\n${cfg.mandate.voice}`
}

/** Layer config in the format the UI expects (with "all" prepended) */
export function getLayerConfig(cfg: InstanceConfig = config) {
  return [
    { id: "all" as const, label: "All" },
    ...cfg.layers.map(l => ({ id: l.id, label: l.label })),
  ]
}

/** Layer IDs as a union-friendly array */
export function getLayerIds(cfg: InstanceConfig = config): string[] {
  return cfg.layers.map(l => l.id)
}
