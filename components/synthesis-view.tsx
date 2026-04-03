"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import type { Article } from "@/lib/types"
import { TYPE, MONO, labelStyle, metaStyle } from "@/lib/styles"

// ─── Types ───────────────────────────────────────────────────────────────────

interface SynthesisViewProps {
  articles: Article[]
  onDeliberate: (text: string) => void
}

type LayerKey = "opportunity" | "position" | "discipline" | "landscape" | "culture"

const LAYER_COLORS: Record<LayerKey, string> = {
  opportunity: "#D4A05A",
  position: "#5A9EB0",
  discipline: "#7BAF6A",
  landscape: "#9A85B8",
  culture: "#C87A6A",
}

const LAYER_LABELS: Record<LayerKey, string> = {
  opportunity: "Opportunity",
  position: "Position",
  discipline: "Discipline",
  landscape: "Landscape",
  culture: "Culture",
}

// ─── AI Synthesis Data ─────────────────────────────────────────────────────

interface AIPattern {
  title: string
  description: string
  layers: string[]
  signalCount: number
}

interface SynthesisData {
  briefing: string
  patterns: AIPattern[]
  blindSpotNote: string
  cerebroProvocation?: string
}

// ─── Loading Animation ─────────────────────────────────────────────────────

const SYNTHESIS_STATUSES = [
  "$ synthesis --analyze",
  "▸ reading annotated feed",
  "▸ loading 7-day history",
  "▸ detecting convergences",
  "▸ composing briefing",
]

// ─── Synthesis View ────────────────────────────────────────────────────────

export function SynthesisView({ articles, onDeliberate }: SynthesisViewProps) {
  const [data, setData] = useState<SynthesisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const fetched = useRef(false)

  useEffect(() => {
    if (articles.length === 0 || fetched.current) return
    const annotated = articles.filter(a => a.synopsis || a.relevance)
    if (annotated.length < 3) return
    fetched.current = true
    setLoading(true)
    setStatusIdx(0)

    const t = setInterval(() => setStatusIdx(i => Math.min(i + 1, SYNTHESIS_STATUSES.length - 1)), 1200)

    fetch("/api/synthesis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles: annotated.slice(0, 25) }),
    })
      .then(r => r.json())
      .then(result => {
        if (result.briefing) setData(result)
        setLoading(false)
        clearInterval(t)
      })
      .catch(() => { setLoading(false); clearInterval(t) })

    return () => clearInterval(t)
  }, [articles])

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-primary)" }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, height: 40, display: "flex", alignItems: "center",
        padding: "0 20px", borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--accent-muted)", textTransform: "uppercase" }}>
          Synthesis
        </span>
      </div>

      <div className="view-padding" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* ── Loading state — terminal boot ── */}
        {loading && (
          <div style={{ padding: "4px 0" }}>
            {SYNTHESIS_STATUSES.slice(0, statusIdx + 1).map((line, i) => (
              <div
                key={i}
                style={{
                  ...TYPE.sm, fontFamily: MONO,
                  color: i === statusIdx ? "var(--accent-muted)" : "var(--text-tertiary)",
                  opacity: i === statusIdx ? 1 : 0.5,
                  animation: i === statusIdx ? "status-fade 0.2s ease both" : "none",
                  marginBottom: 4,
                }}
              >
                {line}{i === statusIdx && i < SYNTHESIS_STATUSES.length - 1 && <span className="cursor-blink" style={{ marginLeft: 2 }}>_</span>}
                {i === statusIdx && i === SYNTHESIS_STATUSES.length - 1 && <span className="loading-pulse" style={{ marginLeft: 4, ...TYPE.xs, opacity: 0.6 }}>...</span>}
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !data && (
          <div style={{ ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.7 }}>
            Pattern intelligence will appear when annotated articles are available. The synthesis layer needs at least 3 annotated signals to detect convergences.
          </div>
        )}

        {/* ── Synthesis content ── */}
        {!loading && data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* ── The Briefing — the station chief's opening read ── */}
            <div style={{
              animation: "signal-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
              marginBottom: 32,
            }}>
              <div style={{
                ...TYPE.reading,
                color: "var(--text-primary)",
                lineHeight: 1.8,
                fontWeight: 400,
                maxWidth: 640,
              }}>
                {data.briefing}
              </div>
            </div>

            {/* ── Convergence Patterns ── */}
            {data.patterns.length > 0 && (
              <div style={{
                animation: "signal-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms both",
                marginBottom: 32,
              }}>
                <div style={{ ...labelStyle, marginBottom: 16 }}>Convergences</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {data.patterns.map((pattern, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--bg-surface)",
                        borderRadius: 12,
                        padding: "18px 20px",
                        cursor: "pointer",
                        transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 100}ms both`,
                      }}
                      onClick={() => onDeliberate(`I want to explore this convergence pattern:\n\n"${pattern.title}"\n\n${pattern.description}\n\nWhat does this mean strategically? What should I be paying attention to?`)}
                      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.01)" }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                    >
                      {/* Layer dots + signal count */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        {pattern.layers.map(l => (
                          <span
                            key={l}
                            style={{
                              ...TYPE.xs,
                              color: LAYER_COLORS[l as LayerKey] || "var(--text-tertiary)",
                              textTransform: "uppercase",
                              fontWeight: 500,
                            }}
                          >
                            {LAYER_LABELS[l as LayerKey] || l}
                          </span>
                        ))}
                        <span style={{ ...metaStyle, marginLeft: 4 }}>
                          {pattern.signalCount} signals
                        </span>
                      </div>
                      {/* Title */}
                      <div style={{ ...TYPE.heading, color: "var(--text-primary)", marginBottom: 6 }}>
                        {pattern.title}
                      </div>
                      {/* Description */}
                      <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                        {pattern.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Blind Spot — subtle, not a card ── */}
            {data.blindSpotNote && (
              <div style={{
                animation: "signal-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 600ms both",
                marginBottom: 32,
              }}>
                <div style={{ ...labelStyle, marginBottom: 8 }}>Blind Spot</div>
                <div style={{ ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.7, maxWidth: 640 }}>
                  {data.blindSpotNote}
                </div>
              </div>
            )}

            {/* ── Cerebro Provocation — single call to action ── */}
            {data.cerebroProvocation && (
              <div style={{
                animation: "signal-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 800ms both",
              }}>
                <button
                  onClick={() => onDeliberate(data.cerebroProvocation!)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12, width: "100%",
                    background: "var(--bg-surface)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "16px 20px",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.borderColor = "var(--accent-muted)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.borderColor = "var(--border)" }}
                >
                  <ArrowUpRight size={14} style={{ color: "var(--accent-secondary)", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ ...TYPE.xs, color: "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6, fontWeight: 500 }}>
                      Ask Cerebro
                    </div>
                    <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {data.cerebroProvocation}
                    </div>
                  </div>
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  )
}
