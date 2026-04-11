"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

/**
 * Copy-to-clipboard icon button, positioned absolute top-right of its parent.
 *
 * Pass `visible` (boolean) when the parent tracks hover in React state.
 * Omit `visible` and the CSS class `copy-card-btn` drives visibility via
 * `*:hover > .copy-card-btn` in globals.css.
 */
export function CopyCardButton({ text, visible }: { text: string; visible?: boolean }) {
  const [copied, setCopied] = useState(false)

  const controlled = typeof visible === "boolean"

  return (
    <button
      className={!controlled ? "copy-card-btn" : undefined}
      data-copied={copied ? "1" : undefined}
      onClick={(e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
      aria-label="Copy to clipboard"
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        border: "none",
        background: copied ? "var(--bg-elevated)" : "transparent",
        color: copied ? "var(--accent-secondary)" : "var(--text-tertiary)",
        cursor: "pointer",
        padding: 0,
        zIndex: 2,
        transition: "opacity 0.15s, background 0.15s, color 0.15s",
        ...(controlled ? { opacity: copied ? 1 : visible ? 0.6 : 0 } : {}),
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}
