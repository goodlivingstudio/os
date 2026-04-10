"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { Radio, AudioLines, Blend, Newspaper, Settings, Aperture, Keyboard, FileDown, Activity, X } from "lucide-react"
import type { Article, FeedHealth, ViewMode } from "@/lib/types"
import { LAYER_CONFIG, LAYER_COLOR } from "@/lib/types"
import { TYPE, DISPLAY, metaStyle, labelStyle } from "@/lib/styles"
import instanceConfig, { storageKey } from "@/lib/config"

// ─── Live Clock — 24hr with seconds ──────────────────────────────────────────

function useClock() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: tz,
          hour12: false,
        })
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

// ─── Source Filter Flyout ─────────────────────────────────────────────────────

function SourceFilter({ articles, excludedSources, onToggleSource }: {
  articles: Article[]
  excludedSources: Set<string>
  onToggleSource: (source: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Derive unique sources with counts
  const sources = useMemo(() => {
    const map: Record<string, number> = {}
    articles.forEach(a => { if (a.source) map[a.source] = (map[a.source] || 0) + 1 })
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))
  }, [articles])

  // Close on click outside
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const activeCount = sources.length - excludedSources.size

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          ...metaStyle,
          padding: "4px 8px", borderRadius: 8,
          display: "inline-flex", alignItems: "center", gap: 3,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-elevated)" }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent" }}
      >
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{activeCount}</span>
        <span>sources</span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 2000,
          width: 220,
          maxHeight: 320,
          overflowY: "auto",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "4px 0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}>
          {/* Reset */}
          <div style={{ display: "flex", padding: "4px 16px 8px", borderBottom: "1px solid var(--border)" }}>
            <button
              onClick={() => sources.forEach(s => { if (excludedSources.has(s.name)) onToggleSource(s.name) })}
              style={{ background: "none", border: "none", ...TYPE.sm, color: "var(--accent-secondary)", cursor: "pointer", padding: 0, fontWeight: 500 }}
            >
              Reset
            </button>
          </div>
          {sources.map(s => {
            const active = !excludedSources.has(s.name)
            return (
              <button
                key={s.name}
                onClick={() => onToggleSource(s.name)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 16px", background: "transparent", border: "none", cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
              >
                {/* Checkbox */}
                <span style={{
                  width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                  border: active ? "none" : "1.5px solid var(--border)",
                  background: active ? "var(--accent-secondary)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                  {active && (
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="var(--bg-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span style={{
                  flex: 1, ...TYPE.body,
                  color: active ? "var(--text-secondary)" : "var(--text-tertiary)",
                  opacity: active ? 1 : 0.5,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  textAlign: "left",
                }}>
                  {s.name}
                </span>
                <span style={{
                  ...TYPE.sm, fontVariantNumeric: "tabular-nums",
                  color: "var(--text-tertiary)",
                  opacity: active ? 0.7 : 0.4,
                }}>
                  {s.count}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Source Pulse Flyout ────────────────────────────────────────────────────

function SourcePulse({ articles, feedHealth }: {
  articles: Article[]
  feedHealth: FeedHealth | null
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // Derive per-source health from articles
  const sourceStats = useMemo(() => {
    const map: Record<string, { count: number; annotated: number; live: boolean; tag: string }> = {}
    articles.forEach(a => {
      if (!map[a.source]) map[a.source] = { count: 0, annotated: 0, live: a.url !== "#", tag: a.tag }
      map[a.source].count++
      if (a.synopsis || a.relevance) map[a.source].annotated++
    })
    return Object.entries(map)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, stats]) => ({ name, ...stats }))
  }, [articles])

  const liveCount = feedHealth?.sourcesLive ?? 0
  const totalCount = feedHealth?.sourcesTotal ?? 0
  const failedCount = feedHealth?.sourcesFailed ?? 0
  const healthPct = totalCount > 0 ? Math.round((liveCount / totalCount) * 100) : 0
  const healthColor = healthPct >= 80 ? "var(--live)" : healthPct >= 50 ? "#D4A05A" : "#ef4444"

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        title="Source Pulse"
        aria-label="Source Pulse"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, borderRadius: 8,
          border: "none", background: open ? "var(--bg-elevated)" : "transparent",
          color: open ? "var(--accent-secondary)" : "var(--text-tertiary)",
          cursor: "pointer", transition: "all 0.15s", padding: 0,
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-secondary)" } }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)" } }}
      >
        <Activity size={18} strokeWidth={1.5} />
      </button>

      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: 0, zIndex: 2000,
          width: 280, maxHeight: 400, overflowY: "auto",
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "12px 0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}>
          {/* Header */}
          <div style={{ padding: "4px 16px 12px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ ...TYPE.sm, fontWeight: 600, color: "var(--text-primary)" }}>Source Pulse</span>
              <span style={{
                ...TYPE.xs, padding: "1px 8px", borderRadius: 8,
                background: `${healthColor}22`, color: healthColor, fontWeight: 600,
              }}>
                {healthPct}%
              </span>
            </div>
            <div style={{ ...TYPE.sm, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
              {liveCount} live · {failedCount} failed · {articles.length} articles
              {feedHealth?.stubCategories && feedHealth.stubCategories.length > 0 && (
                <span> · Stubs: {feedHealth.stubCategories.join(", ")}</span>
              )}
            </div>
          </div>

          {/* Per-source list */}
          <div style={{ padding: "8px 0" }}>
            {sourceStats.map(src => (
              <div
                key={src.name}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "5px 16px",
                }}
              >
                <span style={{
                  width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
                  background: src.live ? "var(--live)" : "#ef4444",
                }} />
                <span style={{
                  flex: 1, ...TYPE.sm,
                  color: src.live ? "var(--text-secondary)" : "var(--text-tertiary)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  opacity: src.live ? 1 : 0.6,
                }}>
                  {src.name}
                </span>
                <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums" }}>
                  {src.count}
                </span>
                {src.annotated > 0 && (
                  <span style={{ ...TYPE.xs, color: "var(--accent-muted)", fontVariantNumeric: "tabular-nums" }}>
                    ✓{src.annotated}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Expanded Nav Button — tracks hover via React state ──────────────────────

function ExpandedNavButton({ icon, label, isActive, onClick }: {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "10px 16px",
        background: isActive ? "#1E1E1E" : hovered ? "#1A1A1A" : "transparent",
        border: "none", cursor: "pointer", transition: "background 0.15s, color 0.15s",
        color: isActive ? "var(--text-primary)" : hovered ? "var(--text-secondary)" : "var(--text-tertiary)",
        fontSize: 13, fontWeight: isActive ? 500 : 400,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// ─── Triage / Explore Button — tracks hover via React state ──────────────────

function TriageExploreButton({ label, isActive, onClick }: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isActive ? "#1E1E1E" : hovered ? "#1A1A1A" : "transparent",
        border: "none", cursor: "pointer",
        fontSize: 11, fontWeight: isActive ? 600 : 400,
        color: isActive ? "var(--accent-secondary)" : hovered ? "var(--text-primary)" : "var(--text-tertiary)",
        padding: "4px 6px", borderRadius: 4,
        transition: "color 0.15s, background 0.15s",
      }}
    >
      {label}
    </button>
  )
}

// ─── Left Rail ───────────────────────────────────────────────────────────────

export function LeftRail({
  articles,
  activeLayers,
  onToggleLayer,
  sortBy,
  onSortChange,
  isLive,
  feedLoading,
  width,
  viewMode,
  onViewChange,
  excludedSources,
  onToggleSource,
  onGalleryOpen,
  onHotkeysOpen,
  onExportOpen,
  feedHealth,
  dailyBrief,
  pinnedArticles,
  onUnpinArticle,
}: {
  articles: Article[]
  activeLayers: Set<string>
  onToggleLayer: (layer: string) => void
  sortBy: "urgency" | "layer"
  onSortChange: (sort: "urgency" | "layer") => void
  isLive: boolean
  feedHealth?: FeedHealth | null
  feedLoading: boolean
  width: number
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  excludedSources: Set<string>
  onToggleSource: (source: string) => void
  onGalleryOpen?: () => void
  onHotkeysOpen?: () => void
  onExportOpen?: () => void
  dailyBrief?: string
  pinnedArticles?: Article[]
  onUnpinArticle?: (articleId: string) => void
}) {
  const RAIL_MODE_KEY = storageKey("rail-mode")
  const isMobileRail = width < 100
  const [railMode, setRailMode] = useState<"compact" | "expanded">("compact")
  useEffect(() => {
    if (isMobileRail) return // no expanded mode on mobile
    const saved = localStorage.getItem(RAIL_MODE_KEY)
    if (saved === "expanded") setRailMode("expanded")
  }, [RAIL_MODE_KEY, isMobileRail])
  // Force compact on mobile
  useEffect(() => {
    if (isMobileRail && railMode === "expanded") setRailMode("compact")
  }, [isMobileRail, railMode])
  const toggleRailMode = useCallback(() => {
    setRailMode(prev => {
      const next = prev === "compact" ? "expanded" : "compact"
      localStorage.setItem(RAIL_MODE_KEY, next)
      return next
    })
  }, [RAIL_MODE_KEY])

  // Keyboard shortcut: [ to toggle rail mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "[" && !e.metaKey && !e.ctrlKey && !e.altKey && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        toggleRailMode()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggleRailMode])

  const time = useClock()
  const now  = new Date()
  const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  const day  = now.toLocaleDateString("en-US", { weekday: "long" })

  const isError  = !feedLoading && !isLive
  const dotColor = feedLoading ? "var(--text-tertiary)" : isError ? "#ef4444" : "var(--live)"
  const statusLabel = feedLoading ? "Loading" : isError ? "Offline" : "Live"
  const annotatedCount = articles.filter(a => a.synopsis || a.relevance).length

  const countFor = (id: string) =>
    id === "all" ? articles.length : articles.filter(a => a.tag === id).length

  return (
    <aside
      style={{
        width,
        height: "100%",
        flexShrink: 0,
        background: "var(--bg-surface)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ═══ EXPANDED MODE ═══ */}
      {railMode === "expanded" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          {/* Row 1 — Title, matches content header height */}
          <div style={{
            height: 40, flexShrink: 0,
            display: "flex", alignItems: "center",
            padding: "0 16px", borderBottom: "1px solid var(--border)",
          }}>
            <span style={{ fontSize: 12, lineHeight: "18px", letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--accent-muted)" }}>{instanceConfig.branding.name}</span>
          </div>

          {/* Row 2 — Clock + Triage/Explore */}
          <div style={{
            flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px", borderBottom: "1px solid var(--border)",
          }}>
            <span style={{ fontFamily: "var(--font-sohne-mono)", fontSize: 11, color: "var(--text-tertiary)" }}>{time}</span>
            {(viewMode === "signal" || viewMode === "audio" || viewMode === "synthesis") && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {([
                  { id: "urgency" as const, label: "Triage" },
                  { id: "layer" as const,   label: "Explore" },
                ]).map((mode, i) => {
                  const isActive = sortBy === mode.id
                  return (
                    <span key={mode.id}>
                      {i > 0 && <span style={{ color: "var(--border)", margin: "0 4px" }}>/</span>}
                      <TriageExploreButton
                        label={mode.label}
                        isActive={isActive}
                        onClick={() => onSortChange(mode.id)}
                      />
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* View navigation */}
          <div style={{ flex: 1, padding: "8px 0" }}>
            {([
              { id: "signal" as const,    Icon: Radio,      label: "Signal" },
              { id: "audio" as const,     Icon: AudioLines, label: "Sound" },
              { id: "gallery" as const,   Icon: Aperture,   label: "Surface", action: "gallery" },
              { id: "synthesis" as const, Icon: Blend,      label: "Synthesis" },
              { id: "dispatch" as const,  Icon: Newspaper,  label: "Dispatch" },
            ]).map(item => {
              const isActive = item.action === "gallery" ? false : viewMode === item.id
              return (
                <ExpandedNavButton
                  key={item.id}
                  icon={<item.Icon size={16} strokeWidth={1.5} />}
                  label={item.label}
                  isActive={isActive}
                  onClick={() => item.action === "gallery" && onGalleryOpen ? onGalleryOpen() : onViewChange(item.id as ViewMode)}
                />
              )
            })}

            {/* Triage/Explore moved to Row 2 header area */}
          </div>

          {/* Utility bar — same sizing as top nav for uniform vertical list */}
          <div style={{ borderTop: "1px solid var(--border)", padding: "8px 0" }}>
            {([
              { id: "config" as const,    Icon: Settings,  label: "Config",       isView: true },
              { id: "pulse" as const,     Icon: Activity,  label: "Source Pulse",  isView: true },
              { id: "shortcuts" as const, Icon: Keyboard,  label: "Shortcuts",    isView: false },
              { id: "export" as const,    Icon: FileDown,  label: "Export",        isView: false },
            ]).map(item => {
              const isActive = item.isView && viewMode === item.id
              return (
                <ExpandedNavButton
                  key={item.id}
                  icon={<item.Icon size={16} strokeWidth={1.5} />}
                  label={item.label}
                  isActive={isActive}
                  onClick={() => {
                    if (item.id === "shortcuts" && onHotkeysOpen) onHotkeysOpen()
                    else if (item.id === "export" && onExportOpen) onExportOpen()
                    else if (item.isView) onViewChange(item.id as ViewMode)
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* ═══ COMPACT MODE (original) ═══ */}
      {railMode === "compact" && <>
      {/* ── Identity zone ── */}
      <div style={{ padding: "24px 16px 20px" }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1,
            margin: 0,
          }}
        >
          {instanceConfig.branding.name}
        </h1>
        <div
          style={{
            ...TYPE.body,
            color: "var(--text-tertiary)",
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          {instanceConfig.branding.tagline}
        </div>
      </div>

      {/* ── Separator ── */}
      <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />

      {/* ── Operational status zone ── */}
      <div style={{ padding: "20px 16px" }}>
        {/* LIVE | date | time */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span
            className={!feedLoading && !isError ? "live-beacon" : undefined}
            style={{
              width: 5, height: 5, borderRadius: "50%",
              background: dotColor, flexShrink: 0, marginRight: 6,
            }}
          />
          <span style={{
            ...TYPE.sm,
            textTransform: "uppercase",
            color: dotColor,
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}>
            {statusLabel}
          </span>
          <span style={{ width: 1, height: 12, background: "var(--border)", margin: "0 10px", flexShrink: 0 }} />
          <span style={{ ...TYPE.body, color: "var(--text-secondary)", fontWeight: 500 }}>
            {day}, {date}
          </span>
          <span style={{ width: 1, height: 12, background: "var(--border)", margin: "0 10px", flexShrink: 0 }} />
          <span style={{ ...TYPE.body, color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums" }}>
            {time}
          </span>
        </div>
      </div>

      {/* ── Separator — indented ── */}
      <div style={{ height: 1, background: "var(--border)", margin: "0 16px" }} />

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "0" }}>
        {/* Signal / Audio / Synthesis — three-state toggle (arrow keys to cycle) */}
        <div style={{ padding: "20px 16px 0" }}>
          <div
            style={{
              display: "flex",
              background: "var(--bg-elevated)",
              borderRadius: 8,
              padding: 3,
              gap: 0,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Sliding indicator — hidden when config is active */}
            {(() => {
              const modes = ["signal", "audio", "synthesis", "gallery"]
              const idx = modes.indexOf(viewMode)
              return (
                <div
                  style={{
                    position: "absolute",
                    top: 3,
                    left: idx >= 0 ? `calc(${idx * 25}% + 3px)` : "3px",
                    width: "calc(25% - 4px)",
                    height: "calc(100% - 6px)",
                    background: "var(--bg-surface)",
                    borderRadius: 8,
                    transition: "left 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s",
                    zIndex: 0,
                    opacity: idx >= 0 ? 1 : 0,
                  }}
                />
              )
            })()}
            {([
              { id: "signal" as const,    Icon: Radio,      title: "Signal",    action: null },
              { id: "audio" as const,     Icon: AudioLines, title: "Sound",     action: null },
              { id: "gallery" as const,   Icon: Aperture,   title: "Surface",   action: "gallery" },
              { id: "synthesis" as const, Icon: Blend,      title: "Synthesis", action: null },
            ]).map(tab => {
              const isActive = tab.action === "gallery" ? false : viewMode === tab.id
              return (
                <button
                  key={tab.id}
                  className="toggle-btn"
                  onClick={() => tab.action === "gallery" && onGalleryOpen ? onGalleryOpen() : onViewChange(tab.id as ViewMode)}
                  title={tab.title}
                  aria-label={tab.title}
                  aria-pressed={isActive}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 0",
                    minHeight: 42,
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 1,
                    color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                    transition: "background 0.2s ease, color 0.3s ease",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-surface)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                >
                  <tab.Icon size={20} strokeWidth={1.6} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Triage/Explore toggle — visible for Signal, Audio, and Synthesis */}
        {(viewMode === "signal" || viewMode === "audio" || viewMode === "synthesis") && (
          <div style={{ padding: "0 16px" }}>
            {/* Mode switch — Triage / Explore — same visual language as the view toggle above */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-elevated)",
                borderRadius: 8,
                padding: 3,
                position: "relative",
                overflow: "hidden",
                marginTop: 12,
                marginBottom: 0,
              }}
            >
              {/* Sliding indicator */}
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: sortBy === "urgency" ? "3px" : "calc(50% + 2px)",
                  width: "calc(50% - 5px)",
                  height: "calc(100% - 6px)",
                  background: "var(--bg-surface)",
                  borderRadius: 8,
                  transition: "left 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  zIndex: 0,
                }}
              />
              {([
                { id: "urgency" as const, label: "Triage" },
                { id: "layer" as const,   label: "Explore" },
              ]).map(mode => {
                const isActive = sortBy === mode.id
                return (
                  <button
                    key={mode.id}
                    className="toggle-btn"
                    aria-pressed={isActive}
                    onClick={() => onSortChange(mode.id)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 0",
                      minHeight: 42,
                      background: "transparent",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                      fontSize: 13,
                      fontWeight: 400,
                      color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                      transition: "background 0.2s ease, color 0.3s ease",
                      letterSpacing: "0.01em",
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-surface)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                  >
                    {mode.label}
                  </button>
                )
              })}
            </div>

            {/* Layer pills moved to Signal feed area */}
          </div>
        )}

        {/* ── Daily Brief — ambient one-liner ── */}
        {dailyBrief && (
          <div style={{ padding: "0 16px" }}>
            <div style={{ height: 1, background: "var(--border)", margin: "20px 0" }} />
            <div style={{ padding: "0 0 0" }}>
              <div style={{ ...labelStyle, marginBottom: 6 }}>
                Today&apos;s Lens
              </div>
              <div style={{
                ...TYPE.body,
                color: "var(--text-tertiary)",
                lineHeight: 1.7,
                opacity: 0.8,
              }}>
                {dailyBrief}
              </div>
            </div>
          </div>
        )}

        {/* ── Pinned Signals ── */}
        {pinnedArticles && pinnedArticles.length > 0 && (
          <div style={{ padding: "0 16px" }}>
            <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
              <span style={{ ...labelStyle }}>Pinned</span>
              <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>({pinnedArticles.length})</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {pinnedArticles.map(article => {
                const isExternal = article.url !== "#"
                const isPodcast = article.signalType === "podcast"
                const TypeIcon = isPodcast ? AudioLines : Radio
                return (
                  <div
                    key={article.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "6px 4px",
                      borderRadius: 6,
                      transition: "background 0.15s",
                      cursor: isExternal ? "pointer" : "default",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                    onClick={() => { if (isExternal) window.open(article.url, "_blank", "noopener,noreferrer") }}
                  >
                    <TypeIcon size={16} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2, color: "var(--text-tertiary)" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        ...TYPE.body,
                        color: "var(--text-secondary)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        overflow: "hidden",
                        lineHeight: 1.4,
                      }}>
                        <span style={{ color: "var(--text-tertiary)" }}>{article.source}: </span>
                        {article.title}
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); onUnpinArticle?.(article.id) }}
                      title="Unpin"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 18, height: 18, flexShrink: 0, marginTop: 0,
                        background: "transparent", border: "none", borderRadius: 4,
                        color: "var(--text-tertiary)", cursor: "pointer",
                        transition: "all 0.15s",
                        padding: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-surface)" }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent" }}
                    >
                      <X size={11} strokeWidth={2} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </nav>

      {/* Bottom bar — Config, Pulse, Shortcuts, Export, Dispatch (compact only) */}
      {railMode === "compact" && (
      <div style={{ flexShrink: 0, padding: "12px 10px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {([
          { id: "config" as const,   Icon: Settings,  title: "Configuration",        isView: true },
          { id: "pulse" as const,    Icon: Activity,  title: "Source Pulse",          isView: true },
          { id: "shortcuts" as const, Icon: Keyboard, title: "Keyboard shortcuts",   isView: false },
          { id: "export" as const,   Icon: FileDown,  title: "Quick Export",          isView: false },
          { id: "dispatch" as const, Icon: Newspaper,  title: instanceConfig.branding.name, isView: true },
        ]).map(item => {
          const isActive = item.isView && viewMode === item.id
          const hasBadge = item.id === "pulse" && feedHealth && feedHealth.sourcesFailed > 0
          return (
            <button
              key={item.id}
              className="toggle-btn"
              aria-pressed={isActive}
              onClick={() => {
                if (item.id === "shortcuts" && onHotkeysOpen) onHotkeysOpen()
                else if (item.id === "export" && onExportOpen) onExportOpen()
                else if (item.isView) onViewChange(item.id as ViewMode)
              }}
              title={item.title}
              aria-label={item.title}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: 8,
                border: "none",
                background: isActive ? "var(--accent-primary)" : "transparent",
                color: isActive ? "var(--accent-secondary)" : hasBadge ? "#D4A05A" : "var(--text-tertiary)",
                cursor: "pointer", transition: "all 0.15s", padding: 0,
                position: "relative",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-secondary)" } }}
              onMouseLeave={e => { e.currentTarget.style.background = isActive ? "var(--accent-primary)" : "transparent"; e.currentTarget.style.color = isActive ? "var(--accent-secondary)" : hasBadge ? "#D4A05A" : "var(--text-tertiary)" }}
            >
              <item.Icon size={18} strokeWidth={1.5} />
              {hasBadge && (
                <span style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
              )}
            </button>
          )
        })}
      </div>
      )}
      </>}

      {/* ═══ MODE TOGGLE — both modes, desktop only ═══ */}
      {!isMobileRail && <div style={{
        flexShrink: 0, padding: "8px 16px 12px", borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <button
          onClick={toggleRailMode}
          title={`Switch to ${railMode === "compact" ? "expanded" : "compact"} view (or press [)`}
          aria-label={`Switch to ${railMode === "compact" ? "expanded" : "compact"} rail mode`}
          style={{
            display: "flex", alignItems: "center",
            background: "var(--bg-elevated)", border: "none", borderRadius: 10,
            padding: 2, cursor: "pointer", position: "relative",
            width: 36, height: 20,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--border)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
        >
          <span style={{
            width: 16, height: 16, borderRadius: 8,
            background: "var(--text-tertiary)",
            transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: railMode === "expanded" ? "translateX(16px)" : "translateX(0)",
          }} />
        </button>
      </div>}
    </aside>
  )
}

