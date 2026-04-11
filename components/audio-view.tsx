"use client"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, ArrowUpRight, ChevronUp, ChevronDown, Bookmark } from "lucide-react"
import { TYPE, MONO, DISPLAY, metaStyle, labelStyle } from "@/lib/styles"
import type { Article } from "@/lib/types"
import instanceConfig, { storageKey, MOBILE_BREAKPOINT } from "@/lib/config"

// ─── Audio DCOS Band ────────────────────────────────────────────────────────

interface AudioSignal {
  headline: string
  body: string
  layer: string
}

const AUDIO_BRIEF_CACHE_KEY = storageKey("dcos-audio-brief-v2")
const AUDIO_BRIEF_TTL = 4 * 60 * 60 * 1000 // 4 hours — resilient to weak connections
const FETCH_TIMEOUT = 10_000 // 10s — fail fast on slow networks

const AUDIO_SCAN_STATUSES = [
  "$ dispatch --sound",
  "▸ scanning podcast feeds",
  "▸ clustering episodes",
  "▸ cross-referencing mandate",
  "▸ composing brief",
]

function AudioBriefBand({ episodes, visible, defaultExpanded = true, onDeliberate }: { episodes: Episode[]; visible: boolean; defaultExpanded?: boolean; onDeliberate?: (text: string) => void }) {
  const [signals, setSignals] = useState<AudioSignal[]>([])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(defaultExpanded)
  const fetched = useRef(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const wasLoading = useRef(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Sync expanded state when toggle changes
  useEffect(() => { setExpanded(defaultExpanded) }, [defaultExpanded])

  useEffect(() => {
    if (episodes.length === 0 || fetched.current || !visible) return
    fetched.current = true

    // Stale-while-revalidate: show cached data immediately, even if expired
    let hasStale = false
    try {
      const raw = localStorage.getItem(AUDIO_BRIEF_CACHE_KEY)
      if (raw) {
        const { ts, signals: cached } = JSON.parse(raw)
        if (Array.isArray(cached) && cached.length > 0) {
          setSignals(cached)
          hasStale = true
          if (Date.now() - ts < AUDIO_BRIEF_TTL) return // fresh — skip fetch
        }
      }
    } catch { /* */ }

    if (!hasStale) setLoading(true)
    const abort = new AbortController()
    const timeout = setTimeout(() => abort.abort(), FETCH_TIMEOUT)

    fetch("/api/audio-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        episodes: episodes.slice(0, 20).map(e => ({
          title: e.title, showName: e.showName, category: e.category, summary: e.summary,
        })),
      }),
      signal: abort.signal,
    })
      .then(r => { clearTimeout(timeout); return r.json() })
      .then(data => {
        const sigs = data.signals || []
        setSignals(sigs)
        setLoading(false)
        if (sigs.length > 0) {
          try { localStorage.setItem(AUDIO_BRIEF_CACHE_KEY, JSON.stringify({ ts: Date.now(), signals: sigs })) } catch { /* */ }
        }
      })
      .catch(() => { clearTimeout(timeout); setLoading(false) })
  }, [episodes, visible])

  // Advance status text while fetching
  useEffect(() => {
    if (!loading) return
    setStatusIdx(0)
    wasLoading.current = true
    const t = setInterval(() => setStatusIdx(i => Math.min(i + 1, AUDIO_SCAN_STATUSES.length - 1)), 900)
    return () => clearInterval(t)
  }, [loading])

  // When real data arrives, reveal
  useEffect(() => {
    const hasRealData = !loading && signals.some(s => !!s.body)
    if (hasRealData && wasLoading.current) {
      wasLoading.current = false
      const t = setTimeout(() => setRevealed(true), 100)
      return () => clearTimeout(t)
    }
  }, [loading, signals])

  if (!visible) return null

  const realSignals = signals.filter(s => s.body)

  return (
    <div style={{ flexShrink: 0, position: "relative", overflow: "hidden" }}>
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "0 20px", height: 40,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span style={{ ...TYPE.sm, color: "var(--accent-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Sound
        </span>
        <button
          onClick={() => setExpanded(e => !e)}
          title={expanded ? "Collapse briefing" : "Expand briefing"}
          style={{
            width: 28, height: 28, borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none",
            cursor: "pointer", transition: "background 0.15s",
            padding: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
        >
          <ChevronUp size={14} strokeWidth={1.5} style={{
            color: "var(--text-tertiary)",
            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: expanded ? "rotate(0)" : "rotate(180deg)",
          }} />
        </button>
      </div>

      <div style={{
        maxHeight: expanded ? 400 : 0, overflow: "hidden",
        transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {loading || (wasLoading.current && !revealed) ? (
          <>
            <div style={{
              padding: "16px 24px",
              display: "flex", flexDirection: "column", gap: 4,
              minHeight: 80, justifyContent: "center",
            }}>
              {AUDIO_SCAN_STATUSES.slice(0, statusIdx + 1).map((line, i) => (
                <div
                  key={i}
                  style={{
                    ...TYPE.sm, fontFamily: "var(--font-sohne-mono), monospace",
                    color: i === statusIdx ? "var(--accent-muted)" : "var(--text-tertiary)",
                    opacity: i === statusIdx ? 1 : 0.5,
                    animation: i === statusIdx ? "status-fade 0.2s ease both" : "none",
                  }}
                >
                  {line}{i === statusIdx && i < AUDIO_SCAN_STATUSES.length - 1 && <span className="cursor-blink" style={{ marginLeft: 2 }}>_</span>}
                  {i === statusIdx && i === AUDIO_SCAN_STATUSES.length - 1 && <span className="loading-pulse" style={{ marginLeft: 4, ...TYPE.xs, opacity: 0.6 }}>…</span>}
                </div>
              ))}
            </div>
            <div style={{
              position: "absolute", bottom: 0, left: 0, width: "25%", height: 1,
              background: "var(--accent-secondary)", opacity: 0.4,
              animation: "band-scan 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }} />
          </>
        ) : realSignals.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${realSignals.length}, 1fr)`, gap: 8, padding: "8px 20px 16px" }}>
            {realSignals.map((signal, i) => (
              <div
                key={i}
                onClick={() => onDeliberate && signal.body && onDeliberate(`I want to explore this audio signal:\n\n"${signal.headline}"\n\n${signal.body}\n\nWhat does this mean strategically?`)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  padding: "20px",
                  borderRadius: 12,
                  animation: `signal-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms both`,
                  display: "flex",
                  flexDirection: "column",
                  cursor: signal.body ? "pointer" : "default",
                  background: hoveredIdx === i ? "var(--bg-elevated)" : "var(--bg-surface)",
                  transition: "background 0.15s",
                }}
              >
                {signal.layer && (
                  <div style={{
                    ...labelStyle,
                    marginBottom: 8,
                  }}>
                    {signal.layer}
                  </div>
                )}
                <div style={{
                  fontSize: 28,
                  fontFamily: DISPLAY,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  lineHeight: 1,
                  marginBottom: signal.body ? 14 : 0,
                }}>
                  {signal.headline}
                </div>
                {signal.body && (
                  <div style={{
                    ...TYPE.body,
                    color: hoveredIdx === i ? "var(--text-primary)" : "var(--text-secondary)",
                    lineHeight: 1.4,
                    flex: 1,
                    transition: "color 0.12s",
                  }}>
                    {signal.body}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Episode {
  id: string
  title: string
  showName: string
  url: string
  publishedAt: string
  summary: string
  duration: string
  artworkUrl: string
  category: string
  tag: string
  layer: string
  urgency?: number
  signalScores?: Record<string, number>
  synopsis?: string
  relevance?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 36e5)
  if (h < 1) return "< 1h"
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return `${Math.floor(d / 7)}w`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}

const LAYER_LABELS: Record<string, string> = Object.fromEntries(
  instanceConfig.layers.map(l => [l.id, l.label])
)

// ─── Episode Card ────────────────────────────────────────────────────────────

function EpisodeCard({ episode, index, onClick, onSignalEnter, onSignalMove, onSignalLeave, artworkMode = "off", isPinned, onTogglePin }: {
  episode: Episode; index?: number; onClick: () => void
  onSignalEnter?: (ep: Episode, x: number, y: number) => void
  onSignalMove?: (x: number, y: number) => void
  onSignalLeave?: () => void
  artworkMode?: "off" | "source"
  isPinned?: boolean
  onTogglePin?: (episode: Episode) => void
}) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const signalActive = useRef(false)
  const hasSignal = !!(episode.synopsis || episode.relevance)

  const isLeftHalf = (clientX: number) => {
    if (!cardRef.current) return true
    const rect = cardRef.current.getBoundingClientRect()
    return clientX < rect.left + rect.width * 0.5
  }

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={(e) => {
        setHovered(true)
        if (hasSignal && isLeftHalf(e.clientX) && onSignalEnter) {
          signalActive.current = true
          onSignalEnter(episode, e.clientX, e.clientY)
        }
      }}
      onMouseMove={(e) => {
        if (!hasSignal) return
        if (isLeftHalf(e.clientX)) {
          if (!signalActive.current && onSignalEnter) {
            signalActive.current = true
            onSignalEnter(episode, e.clientX, e.clientY)
          } else if (onSignalMove) {
            onSignalMove(e.clientX, e.clientY)
          }
        } else if (signalActive.current && onSignalLeave) {
          signalActive.current = false
          onSignalLeave()
        }
      }}
      onMouseLeave={() => {
        setHovered(false)
        if (signalActive.current && onSignalLeave) {
          signalActive.current = false
          onSignalLeave()
        }
      }}
      style={{
        display: "flex",
        gap: 16,
        padding: "18px 20px",
        background: hovered ? "var(--bg-elevated)" : "var(--bg-surface)",
        borderRadius: 12,
        cursor: "pointer",
        transition: "background 0.15s",
        animation: index !== undefined ? `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(index * 60, 600)}ms both` : undefined,
        position: "relative",
      }}
    >
      {/* Pin button */}
      {onTogglePin && (
        <button
          onClick={e => { e.stopPropagation(); onTogglePin(episode) }}
          title={isPinned ? "Unpin" : "Pin for later"}
          aria-label={isPinned ? "Unpin" : "Pin for later"}
          style={{
            position: "absolute", top: 10, right: 10,
            width: 24, height: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", borderRadius: 4,
            cursor: "pointer", padding: 0,
            opacity: isPinned ? 1 : hovered ? 0.6 : 0,
            color: isPinned ? "var(--accent-secondary)" : "var(--text-tertiary)",
            transition: "opacity 0.15s, color 0.15s",
          }}
        >
          <Bookmark size={14} strokeWidth={1.5} fill={isPinned ? "currentColor" : "none"} />
        </button>
      )}
      {/* Artwork — hidden when artworkMode is "off" */}
      {artworkMode === "source" && (
        episode.artworkUrl ? (
          <img
            src={episode.artworkUrl}
            alt={episode.showName}
            onError={(e) => { e.currentTarget.style.display = "none" }}
            style={{
              width: 64, height: 64, borderRadius: 8,
              objectFit: "cover", flexShrink: 0, background: "var(--bg-elevated)",
            }}
          />
        ) : (
          <div
            style={{
              width: 64, height: 64, borderRadius: 8, background: "var(--bg-elevated)",
              flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, color: "var(--text-tertiary)",
            }}
          >
            ◉
          </div>
        )
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Eyebrow */}
        <div
          style={{
            ...metaStyle,
            marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {episode.showName}
          {episode.duration && (
            <><span style={{ margin: "0 4px", opacity: 0.4 }}>·</span>{episode.duration}</>
          )}
          <span style={{ margin: "0 4px", opacity: 0.4 }}>·</span>
          {timeAgo(episode.publishedAt)}
        </div>

        {/* Episode title */}
        <div
          style={{
            ...TYPE.heading,
            fontSize: "var(--type-reading)",
            lineHeight: 1.3, fontWeight: 700, transition: "color 0.15s",
            color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const, overflow: "hidden",
          }}
        >
          {episode.title}
        </div>
      </div>
    </div>
  )
}

// ─── Audio View ──────────────────────────────────────────────────────────────

const LAYER_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "opportunity", label: "Opportunity" },
  { id: "position", label: "Position" },
  { id: "discipline", label: "Discipline" },
  { id: "landscape", label: "Landscape" },
  { id: "culture", label: "Culture" },
]

export function AudioView({ onDeliberate, excludedSources, sortBy = "urgency", onSortChange, pinnedArticleIds, onPinArticle }: { onDeliberate?: (text: string) => void; excludedSources?: Set<string>; sortBy?: "urgency" | "layer"; onSortChange?: (mode: "urgency" | "layer") => void; pinnedArticleIds?: Set<string>; onPinArticle?: (article: Article) => void }) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCount, setShowCount] = useState(0)
  const [activeLayer, setActiveLayer] = useState("all")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [signal, setSignal] = useState<{ episode: Episode; x: number; y: number } | null>(null)
  const [artworkMode, setArtworkMode] = useState<"off" | "source">("off")
  const isMobile = typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT
  const annotated = useRef(false)
  const [annotating, setAnnotating] = useState(false)

  useEffect(() => {
    const ANNOTATION_CACHE_KEY = storageKey("audio-annotations")
    const ANNOTATION_TTL = 4 * 60 * 60 * 1000 // 4 hours — resilient to weak connections

    fetch("/api/podcasts")
      .then(r => r.json())
      .then(data => {
        const eps: Episode[] = data.episodes || []
        setShowCount(data.showCount || 0)
        setLoading(false)

        // Check localStorage for cached annotations
        let cachedAnnotations: Map<string, { synopsis?: string; relevance?: string; signalScores?: { urgency: number } }> | null = null
        try {
          const raw = localStorage.getItem(ANNOTATION_CACHE_KEY)
          if (raw) {
            const { ts, entries } = JSON.parse(raw)
            if (Date.now() - ts < ANNOTATION_TTL && Array.isArray(entries)) {
              cachedAnnotations = new Map(entries)
            }
          }
        } catch { /* */ }

        // Apply cached annotations immediately if available
        if (cachedAnnotations && cachedAnnotations.size > 0) {
          const cache = cachedAnnotations
          setEpisodes(eps.map(ep => {
            const a = cache.get(ep.id)
            return a ? { ...ep, synopsis: a.synopsis, relevance: a.relevance, urgency: a.signalScores?.urgency } : ep
          }))
          return // skip API call — cache is fresh
        }

        setEpisodes(eps)

        // Client-side annotation (lazy — only when Audio tab is visited)
        if (!annotated.current && eps.length > 0) {
          annotated.current = true
          setAnnotating(true)
          fetch("/api/annotate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              articles: eps.slice(0, 15).map((ep: Episode) => ({
                id: ep.id, title: `${ep.showName}: ${ep.title}`, category: ep.category,
              })),
            }),
          })
            .then(r => r.json())
            .then(ann => {
              if (ann.annotations?.length > 0) {
                const map = new Map(ann.annotations.map((a: { id: string; synopsis: string; relevance: string; signalScores?: Record<string, number> }) => [a.id, a]))
                setEpisodes(prev => prev.map(ep => {
                  const a = map.get(ep.id) as { synopsis?: string; relevance?: string; signalScores?: { urgency: number } } | undefined
                  return a ? { ...ep, synopsis: a.synopsis, relevance: a.relevance, urgency: a.signalScores?.urgency } : ep
                }))
                // Cache to localStorage
                try {
                  const entries = ann.annotations.map((a: { id: string; synopsis?: string; relevance?: string; signalScores?: Record<string, number> }) => [a.id, { synopsis: a.synopsis, relevance: a.relevance, signalScores: a.signalScores }])
                  localStorage.setItem(ANNOTATION_CACHE_KEY, JSON.stringify({ ts: Date.now(), entries }))
                } catch { /* quota exceeded */ }
              }
              setAnnotating(false)
            })
            .catch(() => setAnnotating(false))
        }
      })
      .catch(() => setLoading(false))
  }, [])

  const TRIAGE_THRESHOLD = 6
  const sourceFiltered = excludedSources?.size ? episodes.filter(ep => !excludedSources.has(ep.showName)) : episodes
  const hasScores = sourceFiltered.some(ep => ep.urgency !== undefined && ep.urgency > 0)
  const layerFiltered = activeLayer === "all" ? sourceFiltered : sourceFiltered.filter(ep => ep.layer === activeLayer)
  // Triage: show urgency 6+ once scores exist. While annotating, show nothing (loading state handles it).
  // If annotation finished with no qualifying scores, fall back to recency.
  const triageWaiting = sortBy === "urgency" && annotating && !hasScores
  const filtered = sortBy === "urgency"
    ? hasScores
      ? layerFiltered.filter(ep => (ep.urgency ?? 0) >= TRIAGE_THRESHOLD).sort((a, b) => (b.urgency ?? 0) - (a.urgency ?? 0))
      : annotating ? [] : [...layerFiltered].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    : layerFiltered

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-primary)" }}>

      {/* Audio DCOS Band — desktop only (mobile uses shared carousel in page.tsx) */}
      {!isMobile && <AudioBriefBand episodes={episodes} visible={!loading} defaultExpanded={sortBy === "urgency"} onDeliberate={onDeliberate} />}

      {/* Layer filters + artwork toggle — dropdown on mobile, pills on desktop */}
      {!loading && (() => {
        const pool = sortBy === "urgency" && hasScores
          ? sourceFiltered.filter(ep => (ep.urgency ?? 0) >= TRIAGE_THRESHOLD)
          : sourceFiltered
        const activeLabel = activeLayer === "all" ? "All" : LAYER_FILTERS.find(l => l.id === activeLayer)?.label || activeLayer
        const activeCount = activeLayer === "all" ? pool.length : pool.filter(ep => ep.layer === activeLayer).length

        return (
          <div style={{ flexShrink: 0, padding: isMobile ? "8px 16px 0" : "12px 20px 0" }}>
            {isMobile ? (
              /* ── Mobile: dropdown + triage/explore toggle — matches Signal ── */
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setMobileFilterOpen(v => !v)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)",
                    background: "transparent", cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <span style={{ ...TYPE.sm, color: "var(--accent-secondary)", fontWeight: 400 }}>
                    {activeLabel}
                  </span>
                  <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.6, fontVariantNumeric: "tabular-nums" }}>
                    {activeCount}
                  </span>
                  <ChevronDown size={12} style={{ color: "var(--text-tertiary)", transition: "transform 0.2s", transform: mobileFilterOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {mobileFilterOpen && (
                  <div style={{
                    position: "absolute", top: 38, left: 0, zIndex: 100, minWidth: 180,
                    background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10,
                    padding: "4px 0", animation: "status-fade 0.15s ease both",
                  }}>
                    {LAYER_FILTERS.map(layer => {
                      const count = layer.id === "all" ? pool.length : pool.filter(ep => ep.layer === layer.id).length
                      if (layer.id !== "all" && count === 0) return null
                      const isActive = activeLayer === layer.id
                      return (
                        <button
                          key={layer.id}
                          onClick={() => { setActiveLayer(layer.id); setMobileFilterOpen(false) }}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                            padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer",
                            ...TYPE.sm, color: isActive ? "var(--accent-secondary)" : "var(--text-secondary)", fontWeight: 400,
                          }}
                        >
                          <span>{layer.label}</span>
                          <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>{count}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
              {/* Triage / Explore toggle — matches Signal */}
              <div role="group" aria-label="Sort mode" style={{
                marginLeft: "auto",
                display: "flex", gap: 2,
                background: "var(--bg-elevated)", borderRadius: 8, padding: 3,
              }}>
                {(["urgency", "layer"] as const).map(mode => {
                  const isActive = sortBy === mode
                  return (
                    <button
                      key={mode}
                      className="toggle-btn"
                      aria-pressed={isActive}
                      onClick={() => onSortChange?.(mode)}
                      style={{
                        padding: "4px 12px", border: "none", borderRadius: 6, cursor: "pointer",
                        background: isActive ? "var(--bg-surface)" : "transparent",
                        ...TYPE.xs, fontWeight: 400,
                        color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                        letterSpacing: "0.01em",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      {mode === "urgency" ? "Triage" : "Explore"}
                    </button>
                  )
                })}
              </div>
              </div>
            ) : (
              /* ── Desktop: pills + artwork toggle ── */
              <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginBottom: 8 }}>
                {LAYER_FILTERS.map(layer => {
                  const isActive = activeLayer === layer.id
                  const count = layer.id === "all" ? pool.length : pool.filter(ep => ep.layer === layer.id).length
                  if (layer.id !== "all" && count === 0) return null
                  return (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "4px 12px", borderRadius: 8, border: "none",
                        background: isActive ? "var(--accent-primary)" : "transparent",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-elevated)" }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? "var(--accent-primary)" : "transparent" }}
                    >
                      <span style={{
                        ...TYPE.sm,
                        color: isActive ? "var(--accent-secondary)" : "var(--text-tertiary)",
                        fontWeight: 400,
                        transition: "color 0.15s",
                      }}>
                        {layer.label}
                      </span>
                      <span style={{
                        ...TYPE.xs, fontVariantNumeric: "tabular-nums",
                        color: isActive ? "var(--accent-muted)" : "var(--text-tertiary)",
                        opacity: 0.5, transition: "color 0.15s",
                      }}>
                        {count}
                      </span>
                    </button>
                  )
                })}
                {/* Artwork switcher — desktop only */}
                {episodes.length > 0 && (
              <div style={{
                marginLeft: "auto",
                display: "flex",
                gap: 2,
                background: "var(--bg-elevated)",
                borderRadius: 8,
                padding: 3,
              }}>
                {([
                  { id: "off" as const, label: "Off" },
                  { id: "source" as const, label: "Source" },
                ]).map(mode => {
                  const isActive = artworkMode === mode.id
                  return (
                    <button
                      key={mode.id}
                      className="toggle-btn"
                      aria-pressed={isActive}
                      onClick={() => setArtworkMode(mode.id)}
                      style={{
                        padding: "4px 12px", border: "none",
                        borderRadius: 6, cursor: "pointer",
                        background: isActive ? "var(--bg-surface)" : "transparent",
                        ...TYPE.xs,
                        fontWeight: 400,
                        color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-secondary)" } }}
                      onMouseLeave={e => { e.currentTarget.style.background = isActive ? "var(--bg-surface)" : "transparent"; e.currentTarget.style.color = isActive ? "var(--text-primary)" : "var(--text-tertiary)" }}
                    >
                      {mode.label}
                    </button>
                  )
                })}
              </div>
                )}
              </div>
            )}
          </div>
        )
      })()}

      <div className="view-padding" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 0, paddingBottom: 8 }}>
      {/* Loading state — matches Signal feed skeleton pattern */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="loading-pulse"
              style={{
                padding: "16px 20px",
                borderRadius: 12,
                background: "var(--bg-surface)",
              }}
            >
              <div style={{ height: 10, width: `${60 + (i % 3) * 15}%`, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ height: 13, width: `${70 + (i % 4) * 8}%`, background: "var(--bg-elevated)", borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : triageWaiting ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="loading-pulse"
              style={{
                padding: "16px 20px",
                borderRadius: 12,
                background: "var(--bg-surface)",
              }}
            >
              <div style={{ height: 10, width: `${55 + (i % 3) * 12}%`, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
              <div style={{ height: 13, width: `${65 + (i % 4) * 10}%`, background: "var(--bg-elevated)", borderRadius: 4 }} />
            </div>
          ))}
        </div>
      ) : episodes.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, ...TYPE.reading, color: "var(--text-tertiary)" }}>
          No episodes loaded. Check podcast feed configuration.
        </div>
      ) : (
        <div className="episode-grid" style={{ gap: 16, padding: "8px 0" }}>
          {filtered.map((ep, i) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              index={i}
              onClick={() => {
                if (ep.url && ep.url !== "#") {
                  window.open(ep.url, "_blank", "noopener,noreferrer")
                }
              }}
              onSignalEnter={(e, x, y) => setSignal({ episode: e, x, y })}
              onSignalMove={(x, y) => setSignal(s => s ? { ...s, x, y } : s)}
              onSignalLeave={() => setSignal(null)}
              artworkMode={artworkMode}
              isPinned={pinnedArticleIds?.has(ep.id)}
              onTogglePin={onPinArticle ? (episode) => {
                const asArticle: Article = {
                  id: episode.id,
                  title: episode.title,
                  source: episode.showName,
                  url: episode.url,
                  publishedAt: episode.publishedAt,
                  summary: episode.summary,
                  category: episode.category,
                  tag: episode.tag,
                  signalType: "podcast",
                }
                onPinArticle(asArticle)
              } : undefined}
            />
          ))}
        </div>
      )}

      {/* Episode signal card — hover insight */}
      {signal && (signal.episode.synopsis || signal.episode.relevance) && (
        <div style={{
          position: "fixed",
          left: Math.min(signal.x + 18, (typeof window !== "undefined" ? window.innerWidth : 1200) - 276),
          top: Math.max(8, signal.y - 44),
          width: 260, pointerEvents: "none", zIndex: 1000,
          background: "var(--bg-elevated)", borderRadius: 8,
          border: "1px solid var(--border)", overflow: "hidden",
          boxShadow: "var(--shadow-tooltip)",
        }}>
          {signal.episode.synopsis && (
            <div style={{ padding: "12px 14px", borderBottom: signal.episode.relevance ? "1px solid var(--border)" : "none" }}>
              <div style={{ ...TYPE.sm, color: "var(--accent-secondary)", textTransform: "uppercase", fontWeight: 500, letterSpacing: "0.04em", marginBottom: 6 }}>Synopsis</div>
              <div style={{ ...TYPE.body, color: "var(--text-secondary)" }}>{signal.episode.synopsis}</div>
            </div>
          )}
          {signal.episode.relevance && (
            <div style={{ padding: "12px 14px" }}>
              <div style={{ ...TYPE.sm, color: "var(--accent-secondary)", textTransform: "uppercase", fontWeight: 500, letterSpacing: "0.04em", marginBottom: 6 }}>Relevance</div>
              <div style={{ ...TYPE.body, color: "var(--text-primary)" }}>{signal.episode.relevance}</div>
            </div>
          )}
        </div>
      )}

      {/* Episode modal removed — click now links out directly; hover signal card provides insight */}
      </div>
    </main>
  )
}
