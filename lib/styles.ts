// ─── OS Type Scale ──────────────────────────────────────────────────────────
// Six sizes. No exceptions outside Cerebro.
//
// xs      11px  — minimum chrome: badges, dots, status indicators
// sm      12px  — labels, metadata, eyebrows, counts
// body    13px  — body text, descriptions, summaries
// reading 14px  — primary reading: user input, episode details
// heading 16px  — article headlines, card titles
// display 18px+ — masthead, clock (set per-component, not tokenized)

import type { CSSProperties } from "react"

// ─── Font stacks ────────────────────────────────────────────────────────────

/** Söhne Mono — Cerebro's voice (machine intelligence register) */
export const MONO = "var(--font-sohne-mono), monospace"

/** Söhne Schmal — headlines and display type across all products */
export const DISPLAY = "var(--font-sohne-schmal), system-ui, sans-serif"

// ─── Type scale tokens ──────────────────────────────────────────────────────

export const TYPE = {
  xs:      { fontSize: "var(--type-xs)", lineHeight: "140%" } as CSSProperties,
  sm:      { fontSize: "var(--type-sm)", lineHeight: "140%" } as CSSProperties,
  body:    { fontSize: "var(--type-body)", lineHeight: "140%" } as CSSProperties,
  reading: { fontSize: "var(--type-reading)", lineHeight: "140%" } as CSSProperties,
  heading: { fontSize: "var(--type-heading)", fontWeight: 600, lineHeight: "140%" } as CSSProperties,
}

// ─── Semantic composites ────────────────────────────────────────────────────
// Pre-built combinations for the most common patterns.

/** Uppercase label: 11px, accent-secondary, semibold, tracked */
export const labelStyle: CSSProperties = {
  ...TYPE.sm,
  color: "var(--accent-secondary)",
  textTransform: "uppercase",
  fontWeight: 600,
  letterSpacing: "0.06em",
}

/** Body text: 12px, text-secondary */
export const bodyStyle: CSSProperties = {
  ...TYPE.body,
  color: "var(--text-secondary)",
}

/** Tertiary metadata: 11px, text-tertiary */
export const metaStyle: CSSProperties = {
  ...TYPE.sm,
  color: "var(--text-tertiary)",
}

/** Layer colors — canonical palette, indexed by layer order */
export const LAYER_COLORS = ["#D4A05A", "#5A9EB0", "#7BAF6A", "#9A85B8", "#C87A6A"] as const

/** Cerebro message: 13px mono, text-secondary (machine voice) */
export const cerebroTextStyle: CSSProperties = {
  ...TYPE.reading,
  fontFamily: MONO,
  color: "var(--text-secondary)",
  lineHeight: 1.75,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}
