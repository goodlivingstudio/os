"use client"

import { useState, useEffect, useRef } from "react"
import { useScrollGuard } from "@/lib/use-scroll-guard"
import instanceConfig, { storageKey, MOBILE_BREAKPOINT } from "@/lib/config"
import { ArrowUpRight } from "lucide-react"
import { CopyCardButton } from "@/components/copy-card-button"
import type { Article } from "@/lib/types"
import { TYPE, MONO, DISPLAY, labelStyle, LAYER_COLORS } from "@/lib/styles"
import { renderCitedBody } from "@/components/citation"

const LAYER_LABELS: Record<string, string> = Object.fromEntries(
  instanceConfig.layers.map(l => [l.id, l.label])
)

// ─── Types ───────────────────────────────────────────────────────────────────

interface SynthesisViewProps {
  articles: Article[]
  onDeliberate: (text: string) => void
  sortBy?: "urgency" | "layer"
  skin?: string
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
  body?: string
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
  /** @deprecated Use cerebroTopics instead. Kept for backward compat with cached data. */
  cerebroProvocation?: string
  cerebroTopics?: CerebroTopic[]
  headerImageUrl?: string
  velocity?: { accelerating: VelocityItem[]; decelerating: VelocityItem[] }
  heatmap?: { days: string[]; layers: HeatmapLayer[] }
}

const SYNTHESIS_CACHE_KEY = storageKey("synthesis-v2") // v2: includes images
const SYNTHESIS_TTL = 24 * 60 * 60 * 1000 // 24 hours
const SYNTHESIS_FETCH_TIMEOUT = 180_000 // 3 min — synthesis + image gen via Recraft V3

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

const LAYER_DOT: Record<string, string> = Object.fromEntries(
  instanceConfig.layers.map((l, i) => [l.id, LAYER_COLORS[i] || "#888"])
)

// ─── Synthesis View ────────────────────────────────────────────────────────

export function SynthesisView({ articles, onDeliberate, sortBy = "layer", skin }: SynthesisViewProps) {
  const isTriage = sortBy === "urgency"
  const isMobile = typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT
  const scroll = useScrollGuard()
  const [data, setData] = useState<SynthesisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const fetched = useRef(false)

  const synthCacheKey = SYNTHESIS_CACHE_KEY

  // Load from localStorage on mount — independent of articles
  useEffect(() => {
    if (data) return // already have data
    try {
      const raw = localStorage.getItem(synthCacheKey)
      if (raw) {
        const { ts, data: cached } = JSON.parse(raw)
        if (cached?.briefing) {
          setData(cached)
        }
      }
    } catch { /* */ }
  }, [synthCacheKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // Self-sufficient article fetching — don't depend on Signal tab
  const [selfFetchedArticles, setSelfFetchedArticles] = useState<Article[]>([])
  useEffect(() => {
    if (articles.length > 0 || selfFetchedArticles.length > 0) return
    // No articles from parent — fetch our own
    fetch("/api/news")
      .then(r => r.json())
      .then(d => {
        if (d.articles?.length > 0) setSelfFetchedArticles(d.articles)
      })
      .catch(() => {})
  }, [articles.length, selfFetchedArticles.length])

  const effectiveArticles = articles.length > 0 ? articles : selfFetchedArticles

  useEffect(() => {
    if (effectiveArticles.length === 0 || fetched.current) return
    const annotated = effectiveArticles.filter(a => a.synopsis || a.relevance)
    if (annotated.length < 3) return
    fetched.current = true

    // Check if localStorage cache is still fresh — skip fetch if so
    let hasStale = false
    try {
      const raw = localStorage.getItem(synthCacheKey)
      if (raw) {
        const { ts, data: cached } = JSON.parse(raw)
        if (cached?.briefing) {
          hasStale = true
          if (Date.now() - ts < SYNTHESIS_TTL) return // fresh — skip fetch
        }
      }
    } catch { /* */ }

    if (!hasStale) {
      setLoading(true)
      setStatusIdx(0)
      setElapsed(0)
    }

    const abort = new AbortController()
    const timeout = setTimeout(() => abort.abort(), SYNTHESIS_FETCH_TIMEOUT)
    const t = !hasStale ? setInterval(() => setStatusIdx(i => Math.min(i + 1, SYNTHESIS_STATUSES.length - 1)), 1200) : undefined
    const timer = !hasStale ? setInterval(() => setElapsed(e => e + 1), 1000) : undefined

    fetch("/api/synthesis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles: annotated.slice(0, 25) }),
      signal: abort.signal,
    })
      .then(r => { clearTimeout(timeout); return r.json() })
      .then(result => {
        if (result.briefing) {
          setData(result)
          try { localStorage.setItem(synthCacheKey, JSON.stringify({ ts: Date.now(), data: result })) } catch { /* */ }
        } else if (!hasStale) {
          fetched.current = false
        }
        setLoading(false)
        if (t) clearInterval(t)
        if (timer) clearInterval(timer)
      })
      .catch((err) => {
        clearTimeout(timeout)
        if (err?.name === "AbortError" && !hasStale) {
          // Timeout with no stale data — allow retry
          fetched.current = false
        }
        setLoading(false)
        if (t) clearInterval(t)
        if (timer) clearInterval(timer)
      })

    return () => { abort.abort(); clearTimeout(timeout); if (t) clearInterval(t); if (timer) clearInterval(timer) }
  }, [effectiveArticles, retryCount, synthCacheKey]) // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* Header bar — desktop: title + date. Mobile: centered date only (title in app header) */}
      <div style={{
        flexShrink: 0, height: 40, display: "flex", alignItems: "center",
        justifyContent: isMobile ? "center" : "space-between",
        padding: "0 20px", borderBottom: "1px solid var(--border)",
      }}>
        {!isMobile && <span style={{ ...TYPE.xs, color: "var(--text-primary)", textTransform: "uppercase", fontWeight: 500, letterSpacing: "0.04em" }}>
          Synthesis
        </span>}
        <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)" }}>
          {weekRange}
        </span>
      </div>

      <div className="view-padding" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* ── Loading ── */}
        {loading && (
          <div role="status" aria-live="polite" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ padding: "32px 0" }}>
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
                  {i === statusIdx && i === SYNTHESIS_STATUSES.length - 1 && <span className="loading-pulse" style={{ marginLeft: 4, ...TYPE.xs, opacity: 0.6 }}>…</span>}
                </div>
              ))}
              {elapsed > 3 && (
                <div style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)", marginTop: 12, opacity: 0.6 }}>
                  {elapsed < 10 ? "analyzing patterns" : elapsed < 30 ? "composing images" : "finishing up"} · {elapsed}s
                </div>
              )}
            </div>
            <div style={{
              position: "absolute", bottom: 0, left: 0, width: "25%", height: 1,
              background: "var(--accent-secondary)", opacity: 0.4,
              animation: "band-scan 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }} />
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !data && (
          <div style={{ padding: "48px 20px", maxWidth: 520 }}>
            <div style={{ ...TYPE.body, color: "var(--text-tertiary)", marginBottom: 16 }}>
              Pattern intelligence will appear when annotated articles are available.
            </div>
            <button
              onClick={() => { fetched.current = false; setRetryCount(c => c + 1) }}
              aria-label="Retry loading synthesis"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 6,
                border: "1px solid var(--border)", background: "transparent",
                ...TYPE.sm, color: "var(--text-tertiary)", cursor: "pointer", fontWeight: 500,
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
              background: "var(--bg-primary)", padding: "24px 0 40px",
              animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}>
              <div style={{ ...labelStyle, marginBottom: 10 }}>
                Weekly Shift
              </div>
              <div style={{ fontSize: isMobile ? 42 : 44, fontFamily: DISPLAY, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>
                {data.headline || data.briefing.split(/[.!?]\s/)[0]}
              </div>
              {data.headline && data.briefing && (
                <div style={{ ...TYPE.body, color: "var(--text-secondary)", marginTop: 14 }}>
                  {data.briefing}
                </div>
              )}
            </div>

            {/* ─ IMAGE BAND — 21:9 cinematic hero ─ */}
            <div  style={{
              position: "relative", width: "100%", paddingTop: `${(9 / 21) * 100}%`, overflow: "hidden",
              background: data.headerImageUrl ? "transparent" : "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
            }}>
              {data.headerImageUrl && (
                <img src={data.headerImageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>

            {/* ─ SIGNAL VELOCITY ─ */}
            {data.velocity && (data.velocity.accelerating.length > 0 || data.velocity.decelerating.length > 0) && (
              <div style={{
                padding: "40px 0 16px",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 100ms both",
              }}>
                <div style={{ ...labelStyle, marginBottom: 16 }}>
                  Signal Velocity
                </div>
                <div className="synthesis-velocity" style={{ display: "flex", gap: 12 }}>
                  {/* Accelerating */}
                  <div style={{ flex: 1, background: "var(--bg-surface)", borderRadius: 8, padding: "16px 20px" }}>
                    <div style={{ ...labelStyle, color: "#61BF6B", marginBottom: 12 }}>
                      Accelerating
                    </div>
                    {data.velocity.accelerating.length > 0 ? data.velocity.accelerating.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
                        <span style={{ ...TYPE.body, color: "#61BF6B" }}>↑</span>
                        <span style={{ flex: 1, ...TYPE.body, color: "var(--text-primary)" }}>{item.topic}</span>
                        <span style={{ ...TYPE.sm, fontFamily: MONO, color: "#61BF6B", fontWeight: 600 }}>{item.delta}</span>
                      </div>
                    )) : (
                      <div style={{ ...TYPE.body, color: "var(--text-tertiary)" }}>No accelerating signals</div>
                    )}
                  </div>
                  {/* Decelerating */}
                  <div style={{ flex: 1, background: "var(--bg-surface)", borderRadius: 8, padding: "16px 20px" }}>
                    <div style={{ ...labelStyle, color: "#D46A6A", marginBottom: 12 }}>
                      Decelerating
                    </div>
                    {data.velocity.decelerating.length > 0 ? data.velocity.decelerating.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
                        <span style={{ ...TYPE.body, color: "#D46A6A" }}>↓</span>
                        <span style={{ flex: 1, ...TYPE.body, color: "var(--text-primary)" }}>{item.topic}</span>
                        <span style={{ ...TYPE.sm, fontFamily: MONO, color: "#D46A6A", fontWeight: 600 }}>{item.delta}</span>
                      </div>
                    )) : (
                      <div style={{ ...TYPE.body, color: "var(--text-tertiary)" }}>No decelerating signals</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─ CONVERGENCES ─ */}
            {data.patterns.length > 0 && (
              <div style={{
                paddingTop: 40,
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 200ms both",
              }}>
                <div style={{ ...labelStyle, marginBottom: isMobile ? 8 : 12 }}>
                  Convergences
                </div>
                {data.patterns.map((pattern, i) => {
                  const copyText = `[Dispatch Convergence Pattern — ${pattern.layers.map(l => LAYER_LABELS[l] || l).join(" \u00d7 ")}]\n\n${pattern.title}\n\n${pattern.description}\n\nSignals: ${pattern.signalCount}\n---\nSource: dispatch.goodliving.studio/synthesis`
                  return (
                  <div
                    role="button"
                    tabIndex={0}
                    key={i}
                    onClick={scroll.guardedClick(() => {
                      if (window.getSelection()?.toString()) return
                      onDeliberate(`I want to explore this convergence pattern:\n\n"${pattern.title}"\n\n${pattern.description}\n\nWhat does this mean strategically?`)
                    })}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(`I want to explore this convergence pattern:\n\n"${pattern.title}"\n\n${pattern.description}\n\nWhat does this mean strategically?`) } }}
                    style={{
                      position: "relative",
                      padding: isMobile ? "32px 20px" : "24px 20px",
                      margin: "0 -20px",
                      borderBottom: "1px solid var(--border)",
                      cursor: "pointer", transition: "background 0.15s",
                      border: "none", background: "transparent", textAlign: "left", width: "calc(100% + 40px)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                  >
                    {!isMobile && <CopyCardButton text={copyText} />}
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : 20 }}>
                      {/* Image thumbnail — 3:2 aspect ratio on both mobile and desktop */}
                      <div style={{
                        width: isMobile ? "100%" : 150,
                        height: isMobile ? undefined : 100,
                        paddingTop: isMobile ? `${(2 / 3) * 100}%` : undefined,
                        position: isMobile ? "relative" : undefined,
                        overflow: "hidden", flexShrink: 0,
                        background: pattern.imageUrl ? "transparent" : "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
                      }}>
                        {pattern.imageUrl && (
                          <img src={pattern.imageUrl} alt="" loading="lazy" style={{ position: isMobile ? "absolute" : undefined, inset: isMobile ? 0 : undefined, width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Eyebrow: layers + signal count */}
                        <div style={{ ...labelStyle, marginBottom: 4 }}>
                          {pattern.layers.map(l => LAYER_LABELS[l] || l).join(" · ")}
                          <span style={{ opacity: 0.5, marginLeft: 6 }}>({pattern.signalCount})</span>
                        </div>
                        {/* Title */}
                        <div style={{ fontSize: isMobile ? 36 : 32, fontFamily: DISPLAY, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>
                          {pattern.title}
                        </div>
                        {/* Description — aligned with eyebrow and title */}
                        {pattern.description && (
                          <div style={{
                            ...TYPE.body, color: "var(--text-secondary)", marginTop: 8,
                            ...(!isMobile ? { display: "-webkit-box", WebkitLineClamp: isTriage ? 2 : 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" } : {}),
                          }}>
                            {pattern.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}

            {/* ─ URGENCY HEATMAP ─ */}
            {!isTriage && data.heatmap && data.heatmap.layers.length > 0 && (
              <div style={{
                padding: "40px 0 16px",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 300ms both",
              }}>
                <div style={{ ...labelStyle, marginBottom: 16 }}>
                  Urgency Heatmap
                </div>
                <div className="synthesis-heatmap" style={{
                  background: "var(--bg-surface)", borderRadius: 8,
                  overflowX: "scroll", overflowY: "hidden",
                  WebkitOverflowScrolling: "touch",
                } as React.CSSProperties}>
                  <div style={{ minWidth: 540, padding: "18px 20px" }}>
                  {/* Day headers */}
                  <div style={{ display: "flex", marginBottom: 8 }}>
                    <div style={{ width: 96, flexShrink: 0 }} />
                    {data.heatmap.days.map((day, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center", ...TYPE.sm, color: "var(--text-tertiary)", fontWeight: 500 }}>
                        {day}
                      </div>
                    ))}
                  </div>
                  {/* Layer rows — dynamic max for better contrast */}
                  {(() => {
                    const allVals = data.heatmap!.layers.flatMap(l => l.data).filter(v => v > 0)
                    const maxVal = allVals.length > 0 ? Math.max(...allVals, 1) : 10
                    return data.heatmap!.layers.map((layer, li) => (
                      <div key={li} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ width: 96, flexShrink: 0, ...TYPE.sm, color: layer.color, fontWeight: 500 }}>
                          {layer.name}
                        </div>
                        {layer.data.map((val, di) => {
                          const bgOpacity = val > 0 ? Math.max(0.12, (val / maxVal) * 0.65) : 0.04
                          return (
                            <div key={di} style={{ flex: 1, padding: "0 2px" }}>
                              <div style={{
                                height: 32, borderRadius: 4, position: "relative",
                                display: "flex", alignItems: "center", justifyContent: "center",
                              }}>
                                <div style={{
                                  position: "absolute", inset: 0, borderRadius: 4,
                                  background: layer.color, opacity: bgOpacity,
                                }} />
                                {val > 0 && (
                                  <span style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--text-primary)", position: "relative", zIndex: 1 }}>
                                    {val}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))
                  })()}
                  </div>
                </div>
              </div>
            )}

            {/* ─ BLIND SPOTS — 3 cards ─ */}
            {data.blindSpots && data.blindSpots.length > 0 && (
              <div style={{
                padding: "40px 0 0",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 400ms both",
              }}>
                <div style={{ ...labelStyle, marginBottom: 14 }}>
                  Blind Spots
                </div>
                <div className="synthesis-blindspots" onScroll={scroll.onScroll} style={isMobile ? {
                  display: "flex", gap: 12, overflowX: "auto", overflowY: "hidden",
                  WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory",
                  paddingBottom: 4,
                  msOverflowStyle: "none", scrollbarWidth: "none",
                } as React.CSSProperties : { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {data.blindSpots.map((spot, i) => {
                    const typeLabel = BLIND_SPOT_LABELS[spot.type] || "Blind Spot"
                    const copyText = `[Dispatch Blind Spot — ${typeLabel}]\n\n${spot.title}\n\n${spot.body}\n\n---\nSource: dispatch.goodliving.studio/synthesis`
                    return (
                    <div
                      role="button"
                      tabIndex={0}
                      key={i}
                      onClick={scroll.guardedClick(() => {
                        if (window.getSelection()?.toString()) return
                        onDeliberate(`Explore this blind spot:\n\n**${typeLabel}: ${spot.title}**\n\n${spot.body}\n\nWhat am I missing and what should I do about it?`)
                      })}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(`Explore this blind spot:\n\n**${typeLabel}: ${spot.title}**\n\n${spot.body}\n\nWhat am I missing and what should I do about it?`) } }}
                      style={{
                        position: "relative",
                        background: "var(--bg-surface)", borderRadius: 12, padding: "16px 18px",
                        cursor: "pointer", transition: "background 0.15s",
                        display: "flex", flexDirection: "column",
                        ...(isMobile ? { flex: "0 0 80%", scrollSnapAlign: "start" } : {}),
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                    >
                      {!isMobile && <CopyCardButton text={copyText} />}
                      <div style={{ ...labelStyle, marginBottom: 4 }}>
                        {typeLabel}
                      </div>
                      <div style={{ fontSize: isMobile ? 32 : 28, fontFamily: DISPLAY, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1, marginBottom: 10 }}>
                        {spot.title}
                      </div>
                      <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.4, flex: 1 }}>
                        {spot.body}
                      </div>
                    </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ─ ASK CEREBRO — 4 cards ─ */}
            {cerebroTopics.length > 0 && (
              <div style={{
                padding: "40px 0 0",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 500ms both",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                  <ArrowUpRight size={12} style={{ color: "var(--accent-secondary)" }} />
                  <span style={{ ...labelStyle }}>
                    Ask Cerebro
                  </span>
                </div>
                <div className="synthesis-cerebro" onScroll={scroll.onScroll} style={isMobile ? {
                  display: "flex", gap: 12, overflowX: "auto", overflowY: "hidden",
                  WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory",
                  paddingBottom: 4, msOverflowStyle: "none", scrollbarWidth: "none",
                } as React.CSSProperties : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {cerebroTopics.slice(0, 4).map((topic, i) => (
                    <div
                      role="button"
                      tabIndex={0}
                      key={i}
                      onClick={scroll.guardedClick(() => {
                        if (window.getSelection()?.toString()) return
                        onDeliberate(topic.prompt)
                      })}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(topic.prompt) } }}
                      style={{
                        background: "var(--bg-surface)", borderRadius: 10, padding: "18px 20px",
                        cursor: "pointer", transition: "background 0.15s",
                        ...(isMobile ? { flex: "0 0 80%", scrollSnapAlign: "start" } : {}),
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                    >
                      <div style={{ ...TYPE.heading, color: "var(--text-primary)", marginBottom: topic.body ? 6 : 0, fontSize: "var(--type-body)" }}>
                        {topic.title}
                      </div>
                      {topic.body && (
                        <div style={{
                          ...TYPE.body, color: "var(--text-tertiary)",
                        }}>
                          {topic.body}
                        </div>
                      )}
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
