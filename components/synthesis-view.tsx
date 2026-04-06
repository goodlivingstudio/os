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

interface CerebroTopic {
  title: string
  prompt: string
}

interface VelocityItem {
  topic: string
  delta: string
  prev: number
  curr: number
}

interface HeatmapLayer {
  name: string
  color: string
  data: number[]
}

interface SynthesisData {
  headline?: string
  briefing: string
  patterns: AIPattern[]
  blindSpotNote: string
  blindSpots?: BlindSpot[]
  cerebroProvocation?: string
  cerebroTopics?: CerebroTopic[]
  headerImageUrl?: string
  velocity?: { accelerating: VelocityItem[]; decelerating: VelocityItem[] }
  heatmap?: { days: string[]; layers: HeatmapLayer[] }
}

const SYNTHESIS_STATUSES = [
  "$ synthesis --analyze",
  "▸ reading annotated feed",
  "▸ loading 7-day history",
  "▸ detecting convergences",
  "▸ composing briefing",
]

const BLIND_SPOT_LABELS: Record<string, string> = {
  dropped: "Dropped Signal",
  missing: "Missing Signal",
  assumption: "Assumption Check",
  general: "Blind Spot",
}

const LAYER_DOT: Record<string, string> = {
  opportunity: "#D4A05A",
  position: "#5A9EB0",
  discipline: "#7BAF6A",
  landscape: "#9A85B8",
  culture: "#C87A6A",
}

// ─── Synthesis View ────────────────────────────────────────────────────────

export function SynthesisView({ articles, onDeliberate }: SynthesisViewProps) {
  const [data, setData] = useState<SynthesisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const fetched = useRef(false)

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

  // Week range for header
  const weekRange = (() => {
    const now = new Date()
    const day = now.getDay()
    const monday = new Date(now)
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return `${fmt(monday)} – ${fmt(sunday)}`
  })()

  // Resolve cerebro topics — support both old and new format
  const cerebroTopics: CerebroTopic[] = data?.cerebroTopics
    || (data?.cerebroProvocation ? [{ title: "Strategic question", prompt: data.cerebroProvocation }] : [])

  return (
    <main
      role="main"
      aria-label="Synthesis intelligence view"
      style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-primary)" }}
    >
      {/* Header bar */}
      <div style={{
        flexShrink: 0, height: 40, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--accent-muted)", textTransform: "uppercase" }}>
          Synthesis
        </span>
        <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)" }}>
          {weekRange}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

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

        {/* ── Content — D7 Dashboard Intelligence ── */}
        {!loading && data && (
          <div>

            {/* ─ WEEKLY SHIFT banner ─ */}
            <div style={{
              background: "var(--bg-surface)", padding: "14px 20px",
              animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}>
              <div style={{ ...TYPE.xs, color: "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>
                Weekly Shift
              </div>
              <div style={{ ...TYPE.body, color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.5 }}>
                {data.headline || data.briefing.split(/[.!?]\s/)[0]}
              </div>
            </div>

            {/* ─ IMAGE BAND ─ */}
            <div style={{
              height: 130, overflow: "hidden",
              background: data.patterns[0]?.imageUrl ? "transparent" : "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
            }}>
              {data.patterns[0]?.imageUrl && (
                <img src={data.patterns[0].imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>

            {/* ─ SIGNAL VELOCITY ─ */}
            {data.velocity && (data.velocity.accelerating.length > 0 || data.velocity.decelerating.length > 0) && (
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 100ms both",
              }}>
                <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 12, fontSize: 11 }}>
                  Signal Velocity
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {/* Accelerating */}
                  <div style={{ flex: 1, background: "var(--bg-surface)", borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ ...TYPE.xs, color: "#61BF6B", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 10 }}>
                      Accelerating
                    </div>
                    {data.velocity.accelerating.length > 0 ? data.velocity.accelerating.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
                        <span style={{ ...TYPE.sm, color: "#61BF6B" }}>↑</span>
                        <span style={{ flex: 1, ...TYPE.sm, color: "var(--text-primary)" }}>{item.topic}</span>
                        <span style={{ ...TYPE.xs, fontFamily: MONO, color: "#61BF6B", fontWeight: 600 }}>{item.delta}</span>
                      </div>
                    )) : (
                      <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>No accelerating signals</div>
                    )}
                  </div>
                  {/* Decelerating */}
                  <div style={{ flex: 1, background: "var(--bg-surface)", borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ ...TYPE.xs, color: "#BF6161", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 10 }}>
                      Decelerating
                    </div>
                    {data.velocity.decelerating.length > 0 ? data.velocity.decelerating.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
                        <span style={{ ...TYPE.sm, color: "#BF6161" }}>↓</span>
                        <span style={{ flex: 1, ...TYPE.sm, color: "var(--text-primary)" }}>{item.topic}</span>
                        <span style={{ ...TYPE.xs, fontFamily: MONO, color: "#BF6161", fontWeight: 600 }}>{item.delta}</span>
                      </div>
                    )) : (
                      <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>No decelerating signals</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─ CONVERGENCES table ─ */}
            {data.patterns.length > 0 && (
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 200ms both",
              }}>
                <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 12, fontSize: 11 }}>
                  Convergences
                </div>
                {/* Table header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 0 6px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ flex: 1, ...TYPE.xs, color: "var(--text-tertiary)", fontWeight: 600 }}>Pattern</span>
                  <span style={{ width: 36, textAlign: "right", ...TYPE.xs, color: "var(--text-tertiary)", fontWeight: 600 }}>Sig.</span>
                  <span style={{ width: 60, ...TYPE.xs, color: "var(--text-tertiary)", fontWeight: 600 }}>Layers</span>
                </div>
                {/* Table rows */}
                {data.patterns.map((pattern, i) => (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    onClick={() => onDeliberate(`I want to explore this convergence pattern:\n\n"${pattern.title}"\n\n${pattern.description}\n\nWhat does this mean strategically?`)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(`I want to explore this convergence pattern:\n\n"${pattern.title}"\n\n${pattern.description}\n\nWhat does this mean strategically?`) } }}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 8,
                      padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer", transition: "background 0.15s", outline: "none",
                      margin: "0 -4px", paddingLeft: 4, paddingRight: 4, borderRadius: 4,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...TYPE.body, color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.4, letterSpacing: "-0.01em" }}>
                        {pattern.title}
                      </div>
                      <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", lineHeight: 1.5, marginTop: 2 }}>
                        {renderCitedBody(pattern.description)}
                      </div>
                    </div>
                    <span style={{ width: 36, textAlign: "right", ...TYPE.sm, fontFamily: MONO, color: "var(--text-secondary)", flexShrink: 0, paddingTop: 2 }}>
                      {pattern.signalCount}
                    </span>
                    <div style={{ width: 60, display: "flex", gap: 4, flexShrink: 0, paddingTop: 4 }}>
                      {pattern.layers.map(l => (
                        <span key={l} style={{ width: 7, height: 7, borderRadius: "50%", background: LAYER_DOT[l] || "var(--text-tertiary)" }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─ URGENCY HEATMAP ─ */}
            {data.heatmap && data.heatmap.layers.length > 0 && (
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 300ms both",
              }}>
                <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 12, fontSize: 11 }}>
                  Urgency Heatmap
                </div>
                <div style={{ background: "var(--bg-surface)", borderRadius: 8, padding: "14px 16px", overflow: "hidden" }}>
                  {/* Day headers */}
                  <div style={{ display: "flex", marginBottom: 6 }}>
                    <div style={{ width: 80, flexShrink: 0 }} />
                    {data.heatmap.days.map((day, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center", ...TYPE.xs, color: "var(--text-tertiary)", fontWeight: 500 }}>
                        {day}
                      </div>
                    ))}
                  </div>
                  {/* Layer rows */}
                  {data.heatmap.layers.map((layer, li) => (
                    <div key={li} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ width: 80, flexShrink: 0, ...TYPE.xs, color: layer.color, fontWeight: 500 }}>
                        {layer.name}
                      </div>
                      {layer.data.map((val, di) => {
                        const maxVal = 10
                        const opacity = val > 0 ? Math.max(0.08, (val / maxVal) * 0.65) : 0.03
                        return (
                          <div key={di} style={{ flex: 1, padding: "0 1px" }}>
                            <div style={{
                              height: 24, borderRadius: 3,
                              background: layer.color, opacity,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              {val > 0 && (
                                <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-secondary)", fontSize: 9 }}>
                                  {val}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─ BLIND SPOTS — 3 cards ─ */}
            {data.blindSpots && data.blindSpots.length > 0 && (
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 400ms both",
              }}>
                <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 12, fontSize: 11 }}>
                  Blind Spots
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {data.blindSpots.map((spot, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => onDeliberate(`Explore this blind spot:\n\n**${BLIND_SPOT_LABELS[spot.type] || "Blind Spot"}: ${spot.title}**\n\n${spot.body}\n\nWhat am I missing and what should I do about it?`)}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(`Explore this blind spot: ${spot.title}`) } }}
                      style={{
                        background: "var(--bg-surface)", borderRadius: 8, padding: "14px 16px",
                        cursor: "pointer", transition: "background 0.15s", outline: "none",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                    >
                      <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600, marginBottom: 8 }}>
                        {BLIND_SPOT_LABELS[spot.type] || "Blind Spot"}
                      </div>
                      <div style={{ ...TYPE.sm, color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.4, marginBottom: 6 }}>
                        {spot.title}
                      </div>
                      <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
                        {spot.body.length > 120 ? spot.body.slice(0, 117) + "..." : spot.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─ ASK CEREBRO — 4 cards ─ */}
            {cerebroTopics.length > 0 && (
              <div style={{
                padding: "16px 20px",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 500ms both",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                  <ArrowUpRight size={11} style={{ color: "var(--accent-secondary)" }} />
                  <span style={{ ...labelStyle, letterSpacing: "0.04em", fontSize: 11, color: "var(--accent-secondary)" }}>
                    Ask Cerebro
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                  {cerebroTopics.slice(0, 4).map((topic, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={() => onDeliberate(topic.prompt)}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(topic.prompt) } }}
                      style={{
                        background: "var(--bg-surface)", borderRadius: 8, padding: "14px 16px",
                        cursor: "pointer", transition: "background 0.15s", outline: "none",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                    >
                      <div style={{ ...TYPE.sm, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                        {topic.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom padding */}
            <div style={{ height: 48 }} />
          </div>
        )}
      </div>
    </main>
  )
}
