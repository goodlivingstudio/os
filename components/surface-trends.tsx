"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { useScrollGuard } from "@/lib/use-scroll-guard"
import { storageKey } from "@/lib/config"
import type { Article } from "@/lib/types"
import type { CuratedImage } from "@/lib/gallery"
import { TYPE, MONO, labelStyle } from "@/lib/styles"
import { DirectionGallery } from "@/components/direction-gallery"
import { PaletteSwatch } from "@/components/palette-swatch"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ColorDirection {
  title: string
  description: string
  palette?: string[]
  curatedImages?: CuratedImage[]
}

interface ForecastHighlight {
  authority: string
  insight: string
  timeframe?: string
}

interface CerebroTopic {
  title: string
  body?: string
  prompt: string
}

interface ColorIntelligenceData {
  headline?: string
  briefing: string
  colorDirections: ColorDirection[]
  forecastHighlights: ForecastHighlight[]
  cerebroTopics?: CerebroTopic[]
  headerImageUrl?: string
}

interface SurfaceTrendsProps {
  articles: Article[]
  onDeliberate: (text: string) => void
}

const CACHE_KEY = storageKey("color-intel")
const CACHE_TTL = 4 * 60 * 60 * 1000 // 4 hours
const FETCH_TIMEOUT = 45_000

const LOADING_STATUSES = [
  "$ color-intelligence --analyze",
  "▸ scanning visual culture feeds",
  "▸ loading 7-day color history",
  "▸ matching gallery images to directions",
  "▸ composing briefing",
]

// ─── B2 Broadsheet Layout ───────────────────────────────────────────────────

export function SurfaceTrends({ articles, onDeliberate }: SurfaceTrendsProps) {
  const [data, setData] = useState<ColorIntelligenceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const fetched = useRef(false)
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768
  const scroll = useScrollGuard()

  useEffect(() => {
    if (articles.length === 0 || fetched.current) return
    const annotated = articles.filter(a => a.synopsis || a.relevance)
    if (annotated.length < 3) return
    fetched.current = true

    // Stale-while-revalidate — reject cache missing curatedImages
    let hasStale = false
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const { ts, data: cached } = JSON.parse(raw)
        const hasImages = cached?.colorDirections?.some((d: { curatedImages?: unknown[] }) => (d.curatedImages?.length ?? 0) > 0)
        if (cached?.briefing && hasImages) {
          setData(cached)
          hasStale = true
          if (Date.now() - ts < CACHE_TTL) return
        } else {
          // Stale format — clear it
          localStorage.removeItem(CACHE_KEY)
        }
      }
    } catch { /* */ }

    if (!hasStale) {
      setLoading(true)
      setStatusIdx(0)
      setElapsed(0)
    }

    const abort = new AbortController()
    const timeout = setTimeout(() => abort.abort(), FETCH_TIMEOUT)
    const t = !hasStale ? setInterval(() => setStatusIdx(i => Math.min(i + 1, LOADING_STATUSES.length - 1)), 1200) : undefined
    const timer = !hasStale ? setInterval(() => setElapsed(e => e + 1), 1000) : undefined

    fetch("/api/color-intelligence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles: annotated.slice(0, 25) }),
      signal: abort.signal,
    })
      .then(r => { clearTimeout(timeout); return r.json() })
      .then(result => {
        if (result.briefing) {
          setData(result)
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: result })) } catch { /* */ }
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
          fetched.current = false
        }
        setLoading(false)
        if (t) clearInterval(t)
        if (timer) clearInterval(timer)
      })

    return () => { abort.abort(); clearTimeout(timeout); if (t) clearInterval(t); if (timer) clearInterval(timer) }
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

  return (
    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header bar */}
      <div style={{
        flexShrink: 0, height: 40, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--accent-muted)", textTransform: "uppercase" }}>
          Color Intelligence
        </span>
        <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)" }}>
          {weekRange}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* ── Loading ── */}
        {loading && (
          <div role="status" aria-live="polite" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ padding: "32px 20px" }}>
              {LOADING_STATUSES.slice(0, statusIdx + 1).map((line, i) => (
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
                  {line}{i === statusIdx && i < LOADING_STATUSES.length - 1 && <span className="cursor-blink" style={{ marginLeft: 2 }}>_</span>}
                  {i === statusIdx && i === LOADING_STATUSES.length - 1 && <span className="loading-pulse" style={{ marginLeft: 4, ...TYPE.xs, opacity: 0.6 }}>…</span>}
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
            <div style={{ ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.8, marginBottom: 16 }}>
              Color intelligence will appear when annotated articles are available.
            </div>
            <button
              onClick={() => { fetched.current = false; setRetryCount(c => c + 1) }}
              aria-label="Retry loading color intelligence"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 6,
                border: "1px solid var(--border)", background: "transparent",
                ...TYPE.sm, color: "var(--text-tertiary)", cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── B2 Broadsheet Content ── */}
        {!loading && data && (
          <div style={{ animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" }}>

            {/* ─ HEADLINE BANNER — full width ─ */}
            <div style={{
              background: "var(--bg-primary)", padding: "16px 16px",
              borderBottom: "1px solid var(--border)",
              animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}>
              <div style={{ ...TYPE.sm, color: "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 10 }}>
                Weekly Color Shift
              </div>
              <div style={{ ...TYPE.heading, color: "var(--text-primary)", lineHeight: 1.5, fontSize: isMobile ? 16 : 20 }}>
                {data.headline || data.briefing.split(/[.!?]\s/)[0]}
              </div>
            </div>

            {/* ─ TWO-COLUMN BROADSHEET ─ */}
            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              minHeight: 0,
            }}>

              {/* ═══ LEFT COLUMN: Briefing + Forecasts ═══ */}
              <div style={{
                flex: isMobile ? "none" : "0 0 40%",
                padding: "24px 24px 24px 24px",
                borderRight: isMobile ? "none" : "1px solid var(--border)",
                borderBottom: isMobile ? "1px solid var(--border)" : "none",
              }}>
                {/* Briefing */}
                <div style={{ ...labelStyle, letterSpacing: "0.04em", fontSize: 11, marginBottom: 12 }}>
                  Briefing
                </div>
                {data.headline && data.briefing && (
                  <div style={{ ...TYPE.reading, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
                    {data.briefing}
                  </div>
                )}

                {/* Hero image (3:2 — matches narrower left column) */}
                {data.headerImageUrl && (
                  <div style={{
                    position: "relative", width: "100%", paddingTop: `${(2 / 3) * 100}%`,
                    overflow: "hidden", borderRadius: 8, marginBottom: 24,
                    background: "var(--bg-elevated)",
                  }}>
                    <img src={data.headerImageUrl} alt="" style={{
                      position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                    }} />
                  </div>
                )}

                {/* Divider */}
                <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />

                {/* Forecast Highlights — vertical stack with accent bars */}
                {data.forecastHighlights.length > 0 && (
                  <div style={{
                    animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 200ms both",
                  }}>
                    <div style={{ ...labelStyle, letterSpacing: "0.04em", fontSize: 11, marginBottom: 16 }}>
                      Forecast Highlights
                    </div>
                    {data.forecastHighlights.map((highlight, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                        {/* Vertical accent bar */}
                        <div style={{
                          width: 2, flexShrink: 0, borderRadius: 1,
                          background: "var(--accent-secondary)",
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ ...TYPE.sm, color: "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                              {highlight.authority}
                            </span>
                            {highlight.timeframe && (
                              <span style={{
                                ...TYPE.xs, padding: "1px 6px", borderRadius: 6,
                                background: "rgba(184, 150, 106, 0.12)", color: "var(--accent-secondary)",
                                fontWeight: 500, letterSpacing: "0.03em",
                              }}>
                                {highlight.timeframe}
                              </span>
                            )}
                          </div>
                          <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                            {highlight.insight}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ═══ RIGHT COLUMN: Color Directions with Image Galleries ═══ */}
              <div style={{
                flex: 1,
                padding: "24px 24px",
                minWidth: 0,
              }}>
                <div style={{ ...labelStyle, letterSpacing: "0.04em", fontSize: 11, marginBottom: 16 }}>
                  Color Directions
                </div>

                {data.colorDirections.map((direction, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: i < data.colorDirections.length - 1 ? 28 : 0,
                      animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 100}ms both`,
                    }}
                  >
                    {/* Title */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={scroll.guardedClick(() => onDeliberate(`I want to explore this color direction:\n\n"${direction.title}"\n\n${direction.description}\n\nWhat does this mean for the current engagement? How should the team think about this shift?`))}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(`Explore this color direction: "${direction.title}" — ${direction.description}`) } }}
                      style={{
                        ...TYPE.heading, color: "var(--text-primary)",
                        cursor: "pointer", transition: "color 0.15s",
                        marginBottom: 6,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--accent-secondary)" }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-primary)" }}
                    >
                      {direction.title}
                    </div>

                    {/* Description */}
                    <div style={{
                      ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.6,
                      marginBottom: 12,
                    }}>
                      {direction.description}
                    </div>

                    {/* Swatch Palette — light/dark ground */}
                    {direction.palette && direction.palette.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <PaletteSwatch palette={direction.palette} />
                      </div>
                    )}

                    {/* Curated Image Gallery */}
                    {direction.curatedImages && direction.curatedImages.length > 0 && (
                      <DirectionGallery images={direction.curatedImages} />
                    )}

                    {/* Divider between directions */}
                    {i < data.colorDirections.length - 1 && (
                      <div style={{ height: 1, background: "var(--border)", marginTop: 24 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ─ ASK CEREBRO — full width row ─ */}
            {data.cerebroTopics && data.cerebroTopics.length > 0 && (
              <div style={{
                padding: "24px 24px",
                borderTop: "1px solid var(--border)",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 600ms both",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <ArrowUpRight size={12} style={{ color: "var(--accent-secondary)" }} />
                  <span style={{ ...labelStyle, letterSpacing: "0.04em", fontSize: 11, color: "var(--accent-secondary)" }}>
                    Ask Cerebro
                  </span>
                </div>
                <div className="color-intel-cerebro" style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
                  gap: 12,
                }}>
                  {data.cerebroTopics.slice(0, 3).map((topic, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      onClick={scroll.guardedClick(() => onDeliberate(topic.prompt))}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDeliberate(topic.prompt) } }}
                      style={{
                        background: "var(--bg-surface)", borderRadius: 10, padding: "16px 18px",
                        cursor: "pointer", transition: "background 0.15s", outline: "none",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                    >
                      <div style={{ ...TYPE.heading, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: topic.body ? 6 : 0, fontSize: 13 }}>
                        {topic.title}
                      </div>
                      {topic.body && (
                        <div style={{
                          ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.6,
                          display: "-webkit-box", WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical" as const, overflow: "hidden",
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
    </div>
  )
}
