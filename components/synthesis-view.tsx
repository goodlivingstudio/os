"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import type { Article } from "@/lib/types"
import { TYPE, MONO, labelStyle } from "@/lib/styles"
import { renderCitedBody } from "@/components/citation"

// ─── Types ───────────────────────────────────────────────────────────────────

interface SynthesisViewProps {
  articles: Article[]
  onDeliberate: (text: string) => void
  sortBy?: "urgency" | "layer"
}

interface AIPattern {
  title: string
  description: string
  layers: string[]
  signalCount: number
  imageUrl?: string
  sources?: string[]
}

interface BlindSpot {
  type: "dropped" | "missing" | "assumption" | "general"
  title: string
  body: string
}

interface SynthesisData {
  headline?: string
  briefing: string
  patterns: AIPattern[]
  blindSpotNote: string
  blindSpots?: BlindSpot[]
  cerebroProvocation?: string
  headerImageUrl?: string
}

const SYNTHESIS_STATUSES = [
  "$ synthesis --analyze",
  "▸ reading annotated feed",
  "▸ loading 7-day history",
  "▸ detecting convergences",
  "▸ composing briefing",
]

// ─── Synthesis View ────────────────────────────────────────────────────────

export function SynthesisView({ articles, onDeliberate, sortBy = "layer" }: SynthesisViewProps) {
  const [data, setData] = useState<SynthesisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [hoveredCerebro, setHoveredCerebro] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const fetched = useRef(false)

  const isTriage = sortBy === "urgency"

  useEffect(() => {
    if (articles.length === 0 || fetched.current) return
    const annotated = articles.filter(a => a.synopsis || a.relevance)
    if (annotated.length < 3) return
    fetched.current = true
    setLoading(true)
    setStatusIdx(0)
    setElapsed(0)

    const t = setInterval(() => setStatusIdx(i => Math.min(i + 1, SYNTHESIS_STATUSES.length - 1)), 1200)
    const timer = setInterval(() => setElapsed(e => e + 1), 1000)

    fetch("/api/synthesis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles: annotated.slice(0, 25) }),
    })
      .then(r => r.json())
      .then(result => {
        if (result.briefing) setData(result)
        else fetched.current = false
        setLoading(false)
        clearInterval(t)
        clearInterval(timer)
      })
      .catch(() => {
        fetched.current = false
        setLoading(false)
        clearInterval(t)
        clearInterval(timer)
      })

    return () => { clearInterval(t); clearInterval(timer) }
  }, [articles, retryCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main
      role="main"
      aria-label="Synthesis intelligence view"
      style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div
        role="banner"
        style={{
          flexShrink: 0, height: 40, display: "flex", alignItems: "center",
          padding: "0 20px", borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--accent-muted)", textTransform: "uppercase" }}>
          Synthesis
        </span>
      </div>

      <div
        role="region"
        aria-label="Synthesis content"
        style={{ flex: 1, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column" }}
      >

        {/* ── Loading ── */}
        {loading && (
          <div role="status" aria-live="polite" style={{ padding: "32px 20px" }}>
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
            {elapsed > 3 && (
              <div style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)", marginTop: 12, opacity: 0.6 }}>
                {elapsed < 10 ? "analyzing patterns" : elapsed < 30 ? "composing images" : "finishing up"} · {elapsed}s
              </div>
            )}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !data && (
          <div style={{ padding: "48px 20px", maxWidth: 520 }}>
            <div style={{ ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.8, marginBottom: 16 }}>
              Pattern intelligence will appear when annotated articles are available.
            </div>
            <button
              onClick={() => { fetched.current = false; setRetryCount(c => c + 1) }}
              aria-label="Retry loading synthesis"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 6,
                border: "1px solid var(--border)", background: "transparent",
                ...TYPE.sm, color: "var(--text-tertiary)", cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Editorial layout ── */}
        {!loading && data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "0 20px 48px" }}>

            {/* ─ HERO — image + headline + summary ─ */}
            <article style={{
              background: "var(--bg-surface)", borderRadius: 12, overflow: "hidden",
              animation: "signal-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
              marginTop: 20,
            }}>
              {/* Hero image */}
              <div style={{
                height: 280, overflow: "hidden",
                background: data.headerImageUrl ? "transparent" : "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
              }}>
                {data.headerImageUrl && (
                  <img
                    src={data.headerImageUrl}
                    alt="Weekly intelligence visual"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>

              {/* Headline + summary */}
              <div style={{ padding: "32px 32px 36px" }}>
                {/* Eyebrow — no color, no category references */}
                <div style={{
                  ...TYPE.xs, color: "var(--text-tertiary)",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  marginBottom: 14,
                }}>
                  Weekly Intelligence · {(() => {
                    const now = new Date()
                    const day = now.getDay()
                    const monday = new Date(now)
                    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
                    const sunday = new Date(monday)
                    sunday.setDate(monday.getDate() + 6)
                    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    return `${fmt(monday)} – ${fmt(sunday)}`
                  })()}
                </div>
                {/* Headline — Grenette Pro, white, matching Dispatch scale */}
                <h1 style={{
                  fontSize: 28, fontWeight: 400,
                  fontFamily: "var(--font-grenette), Georgia, serif",
                  color: "var(--text-primary)",
                  lineHeight: 1.4, letterSpacing: "-0.01em",
                  marginBottom: isTriage ? 0 : 16,
                  margin: 0,
                }}>
                  {data.headline || data.briefing.split(/[.!?]\s/)[0]}
                </h1>

                {/* Summary — Explore only */}
                {!isTriage && (() => {
                  const text = data.headline ? data.briefing : data.briefing.split(/(?<=[.!?])\s+/).slice(1).join(" ")
                  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim())
                  const summary = sentences[0] || ""
                  const bullets = sentences.slice(1)
                  return (
                    <>
                      {summary && (
                        <p style={{ ...TYPE.reading, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: bullets.length > 0 ? 14 : 0, marginTop: 0 }}>
                          {summary}
                        </p>
                      )}
                      {bullets.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                          {bullets.map((s, i) => (
                            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                              <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--text-tertiary)", flexShrink: 0, marginTop: 8 }} />
                              <span style={{ ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.7 }}>{s}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )
                })()}
              </div>
            </article>

            {/* ─ CONVERGENCES ─ */}
            {data.patterns.length > 0 && (
              <section aria-label="Convergence patterns" style={{ animation: "signal-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 150ms both" }}>
                <h2 style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 14, fontSize: 11 }}>
                  Convergences
                </h2>
                <div className="convergence-grid" style={{
                  display: "grid",
                  gridTemplateColumns: data.patterns.length === 1 ? "1fr" : "1fr 1fr",
                  gap: 16,
                }}>
                  {data.patterns.map((pattern, i) => (
                    <article
                      key={i}
                      role="button"
                      tabIndex={0}
                      aria-label={`Explore convergence: ${pattern.title}`}
                      onClick={() => onDeliberate(`I want to explore this convergence pattern:\n\n"${pattern.title}"\n\n${pattern.description}\n\nWhat does this mean strategically?`)}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(`I want to explore this convergence pattern:\n\n"${pattern.title}"\n\n${pattern.description}\n\nWhat does this mean strategically?`) } }}
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        background: hoveredCard === i ? "var(--bg-elevated)" : "var(--bg-surface)",
                        borderRadius: 12,
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "background 0.15s",
                        animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 60}ms both`,
                        outline: "none",
                      }}
                    >
                      {/* Card image */}
                      <div style={{
                        height: 160, overflow: "hidden",
                        background: pattern.imageUrl ? "transparent" : "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
                      }}>
                        {pattern.imageUrl && (
                          <img src={pattern.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      {/* Card content */}
                      <div style={{ padding: "24px 28px 28px" }}>
                        {/* Eyebrow — no color, tertiary only */}
                        <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
                          {pattern.signalCount} signals
                        </div>
                        {/* Title — white, Grenette Pro, sized to match Dispatch pitch cards */}
                        <h3 style={{
                          fontSize: 20, fontWeight: 400,
                          fontFamily: "var(--font-grenette), Georgia, serif",
                          color: "var(--text-primary)",
                          lineHeight: 1.35, letterSpacing: "-0.01em",
                          margin: 0,
                          marginBottom: pattern.description ? 12 : 0,
                        }}>
                          {pattern.title}
                        </h3>
                        {/* Description — rendered with citation support */}
                        {pattern.description && (
                          <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                            {renderCitedBody(pattern.description)}
                          </div>
                        )}
                        {/* Sources — quiet attribution */}
                        {!isTriage && pattern.sources && pattern.sources.length > 0 && (
                          <div style={{ marginTop: 12, ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.5, lineHeight: 1.6 }}>
                            Based on {pattern.sources.join(" · ")}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ─ BLIND SPOTS + ASK CEREBRO ─ */}
            <section
              aria-label="Blind spots and provocations"
              className="blindspots-grid"
              style={{
                display: "grid",
                gridTemplateColumns: (data.blindSpots || data.blindSpotNote) && data.cerebroProvocation ? "1fr 1fr" : "1fr",
                gap: 20,
                animation: "signal-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 500ms both",
              }}
            >
              {/* Blind Spots */}
              {(data.blindSpots || data.blindSpotNote) && (
                <div style={{ background: "var(--bg-surface)", borderRadius: 12, padding: "24px 28px" }}>
                  <h2 style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, margin: 0, marginBottom: 16 }}>
                    Blind Spots
                  </h2>
                  {data.blindSpots && data.blindSpots.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {(isTriage ? data.blindSpots.slice(0, 1) : data.blindSpots).map((spot, i) => {
                        const typeLabels: Record<string, string> = { dropped: "Dropped Signal", missing: "Missing Signal", assumption: "Assumption Check", general: "Blind Spot" }
                        return (
                          <div
                            key={i}
                            role="button"
                            tabIndex={0}
                            aria-label={`Explore blind spot: ${spot.title}`}
                            onClick={() => onDeliberate(`Explore this blind spot:\n\n**${typeLabels[spot.type] || "Blind Spot"}: ${spot.title}**\n\n${spot.body}\n\nWhat am I missing and what should I do about it?`)}
                            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(`Explore this blind spot: ${spot.title}`) } }}
                            style={{ cursor: "pointer", transition: "background 0.15s", padding: "10px 12px", borderRadius: 8, marginLeft: -12, marginRight: -12, outline: "none" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                          >
                            {/* Eyebrow — no color, tertiary only */}
                            <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500, marginBottom: 6 }}>
                              {typeLabels[spot.type] || "Blind Spot"}
                            </div>
                            <h3 style={{
                              fontSize: 16, fontWeight: 400,
                              fontFamily: "var(--font-grenette), Georgia, serif",
                              color: "var(--text-primary)",
                              marginBottom: 6, lineHeight: 1.4, letterSpacing: "-0.01em",
                              margin: "0 0 6px 0",
                            }}>
                              {spot.title}
                            </h3>
                            <div style={{ ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.7 }}>
                              {spot.body}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : data.blindSpotNote ? (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => onDeliberate(`Explore this blind spot:\n\n"${data.blindSpotNote}"\n\nWhat am I missing and why does it matter?`)}
                      style={{ ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.7, cursor: "pointer" }}
                    >
                      {data.blindSpotNote}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Ask Cerebro */}
              {data.cerebroProvocation && (
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Send this question to Cerebro"
                  onClick={() => onDeliberate(data.cerebroProvocation!)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(data.cerebroProvocation!) } }}
                  onMouseEnter={() => setHoveredCerebro(true)}
                  onMouseLeave={() => setHoveredCerebro(false)}
                  style={{
                    background: hoveredCerebro ? "var(--bg-elevated)" : "var(--bg-surface)",
                    borderRadius: 12, padding: "24px 28px",
                    cursor: "pointer", transition: "background 0.15s",
                    outline: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <ArrowUpRight size={11} style={{ color: "var(--text-tertiary)" }} />
                    <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Ask Cerebro
                    </span>
                  </div>
                  <div style={{
                    fontSize: 16, fontWeight: 400,
                    fontFamily: "var(--font-grenette), Georgia, serif",
                    color: hoveredCerebro ? "var(--text-primary)" : "var(--text-secondary)",
                    lineHeight: 1.5, transition: "color 0.15s",
                    letterSpacing: "-0.01em",
                  }}>
                    {data.cerebroProvocation}
                  </div>
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </main>
  )
}
