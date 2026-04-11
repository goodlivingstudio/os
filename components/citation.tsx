"use client"

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { TYPE, labelStyle } from "@/lib/styles"
import type { CitationSource } from "@/lib/types"
export type { CitationSource }

// ─── Citation chip — shadcn tooltip with source details ──────────────────────

function CitationChip({ num, src }: { num: string; src: CitationSource }) {
  // Derive display name: use source if available, otherwise extract hostname
  const displayName = src.source || (() => {
    try { return new URL(src.url).hostname.replace("www.", "") } catch { return "Source" }
  })()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            style={{
              color: "var(--accent-secondary)",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
          />
        }
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          window.open(src.url, "_blank", "noopener,noreferrer")
        }}
      >
        {num}
      </TooltipTrigger>
      <TooltipContent
        className="max-w-none w-auto rounded-none bg-transparent p-0 text-inherit ring-0 shadow-none"
        style={{
          width: 220,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "10px 12px",
          boxShadow: "var(--shadow-tooltip)",
        }}
      >
        <div style={{ ...labelStyle, marginBottom: 4 }}>
          {displayName}
        </div>
        <a
          href={src.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            ...TYPE.sm, color: "var(--text-primary)",
            textDecoration: "none", display: "block",
            transition: "color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--accent-secondary)" }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-primary)" }}
        >
          {src.title}
        </a>
      </TooltipContent>
    </Tooltip>
  )
}

// ─── Citation renderer — parses [1][2] into hoverable chips ─────────────────

export function renderCitedBody(body: string, sources?: CitationSource[]) {
  if (!sources || sources.length === 0) return body
  // Clean up spacing: remove spaces between consecutive citations and before punctuation after citations
  const cleaned = body
    .replace(/\]\s+([.,;:!?])/g, "]$1")  // [2] . → [2].
  const parts = cleaned.split(/(\[\d+\])/)
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (!match) return part
    const idx = parseInt(match[1], 10) - 1
    const src = sources[idx]
    if (!src) return part
    return <CitationChip key={i} num={part} src={src} />
  })
}
