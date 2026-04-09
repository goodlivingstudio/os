// ─── Shared Prompt Context — Config-Driven ──────────────────────────────────
// Every AI surface reads from the active instance config.
// Instance-specific content lives in lib/config/{instance}.ts
// This file re-exports config-derived prompt blocks for backward compatibility.

import config, { buildPreamble } from "@/lib/config"

// ─── Config-derived exports (backward compatible) ───────────────────────────

export const OPERATOR = config.mandate.operator

// Build FIVE_LAYERS from config layer definitions
export const FIVE_LAYERS = (() => {
  const layerDescriptions = config.layers
    .map(l => `${l.label.toUpperCase()} (0–10): ${l.description}`)
    .join("\n\n")
  return `Every article in the feed is scored across ${config.layers.length} intelligence layers plus urgency. Scores run 0–10.\n\n${layerDescriptions}\n\nURGENCY (0–10): Time-sensitivity of the signal regardless of layer. 9–10: demands attention today. 7–8: relevant this week. 5–6: useful context. Below 5: background intelligence. Multi-layer signals (high on 2+ layers) are the highest value.`
})()

// ─── System Preamble — combines all shared context ──────────────────────────
// Assembled from the active instance's mandate blocks (operator, clientContext,
// layer definitions, sourceModes, voice). Returns whichever instance loaded at
// module init — Dispatch by default, Explore when NEXT_PUBLIC_INSTANCE=explore,
// Lilly Direct when NEXT_PUBLIC_INSTANCE=lilly-direct, etc.

export const INSTANCE_PREAMBLE = buildPreamble(config)
