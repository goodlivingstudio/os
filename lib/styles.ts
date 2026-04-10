// ─── Dispatch Type Scale ────────────────────────────────────────────────────
// Six sizes. No exceptions outside Cerebro.
//
// xs      10px  — tiny chrome: badges, dots, remove buttons
// sm      11px  — labels, metadata, eyebrows, counts
// body    12px  — body text, descriptions, summaries
// reading 13px  — primary reading: user input, episode details
// heading 15px  — article headlines, card titles
// display 18px+ — masthead, clock (set per-component, not tokenized)

import type { CSSProperties } from "react"

// ─── Font stacks ────────────────────────────────────────────────────────────

/** Söhne Mono — Cerebro's voice (machine intelligence register) */
export const MONO = "var(--font-sohne-mono), monospace"

/** Söhne Breit — headlines and display type across all products */
export const DISPLAY = "var(--font-sohne-breit), system-ui, sans-serif"

// ─── Type scale tokens ──────────────────────────────────────────────────────

export const TYPE = {
  xs:      { fontSize: 10 } as CSSProperties,
  sm:      { fontSize: 11 } as CSSProperties,
  body:    { fontSize: 12, lineHeight: 1.6 } as CSSProperties,
  reading: { fontSize: 13, lineHeight: 1.6 } as CSSProperties,
  heading: { fontSize: 15, fontWeight: 600, lineHeight: 1.4 } as CSSProperties,
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

/** Cerebro message: 13px mono, text-secondary (machine voice) */
export const cerebroTextStyle: CSSProperties = {
  ...TYPE.reading,
  fontFamily: MONO,
  color: "var(--text-secondary)",
  lineHeight: 1.75,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}
