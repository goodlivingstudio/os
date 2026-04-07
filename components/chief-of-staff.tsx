"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronUp } from "lucide-react"
import type { Article, Signal } from "@/lib/types"
import { MONO, TYPE, labelStyle, bodyStyle, metaStyle } from "@/lib/styles"
import { renderCitedBody } from "@/components/citation"
import { storageKey } from "@/lib/config"

// ─── Chief of Staff — data hook ─────────────────────────────────────────────

const BRIEF_CACHE_KEY = storageKey("dcos-brief")
const BRIEF_TTL = 4 * 60 * 60 * 1000 // 4 hours — resilient to weak connections
const FETCH_TIMEOUT = 25_000 // 25s — allows for Vercel cold start + Anthropic latency

export function useChiefOfStaff(articles: Article[]) {
  const [signals, setSignals] = useState<Signal[]>([])
  const [briefLoading, setBriefLoading] = useState(false)
  const [briefError, setBriefError] = useState(false)
  const fetched = useRef(false)

  useEffect(() => {
    if (articles.length > 0 && !fetched.current) {
      fetched.current = true

      // Stale-while-revalidate: show cached data immediately, even if expired
      let hasStale = false
      try {
        const raw = localStorage.getItem(BRIEF_CACHE_KEY)
        if (raw) {
          const { ts, signals: cached } = JSON.parse(raw)
          if (Array.isArray(cached) && cached.length > 0) {
            setSignals(cached)
            hasStale = true
            // Fresh cache — skip API call entirely
            if (Date.now() - ts < BRIEF_TTL) return
          }
        }
      } catch { /* */ }

      // Fetch with timeout — show stale data while loading if available
      if (!hasStale) setBriefLoading(true)
      setBriefError(false)
      const abort = new AbortController()
      const timeout = setTimeout(() => abort.abort(), FETCH_TIMEOUT)

      fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: articles.slice(0, 25) }),
        signal: abort.signal,
      })
        .then(r => {
          clearTimeout(timeout)
          if (!r.ok) throw new Error(`${r.status}`)
          return r.json()
        })
        .then(data => {
          const sigs = data.signals || []
          setSignals(sigs)
          setBriefLoading(false)
          if (sigs.length > 0) {
            try { localStorage.setItem(BRIEF_CACHE_KEY, JSON.stringify({ ts: Date.now(), signals: sigs })) } catch { /* */ }
          }
        })
        .catch(() => {
          clearTimeout(timeout)
          // If we have stale data, silently keep it — no error state
          if (!hasStale) setBriefError(true)
          setBriefLoading(false)
        })
    }
  }, [articles.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const placeholder: Signal[] = [
    { headline: "ANALYZING FEED", label: "ANALYZING FEED", body: "", layer: "", urgency: 0 },
    { headline: "—", label: "—", body: "", layer: "", urgency: 0 },
    { headline: "—", label: "—", body: "", layer: "", urgency: 0 },
  ]

  return {
    signals: briefLoading || signals.length === 0 ? placeholder : signals,
    briefLoading,
    briefError,
  }
}

// ─── Chief of Staff Band — COS drawer with Bump overlay ────────────────────

export const SCAN_STATUSES = [
  "$ dispatch --init",
  "▸ scanning feed [27 sources]",
  "▸ clustering signals",
  "▸ cross-referencing mandate",
  "▸ composing brief",
]

export function ChiefOfStaffBand({ signals, briefLoading, briefError, onDeliberate, defaultExpanded = true }: {
  signals: Signal[]
  briefLoading: boolean
  briefError?: boolean
  onDeliberate?: (signal: Signal) => void
  defaultExpanded?: boolean
}) {
  const [statusIdx,  setStatusIdx]  = useState(0)
  const [revealed,   setRevealed]   = useState(false)
  const [expanded,   setExpanded]   = useState(defaultExpanded)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const wasLoading = useRef(true)

  // Sync expanded state when mode changes (Triage → open, Explore → close)
  useEffect(() => { setExpanded(defaultExpanded) }, [defaultExpanded])

  // Advance status text while fetching
  useEffect(() => {
    if (!briefLoading) return
    setStatusIdx(0)
    wasLoading.current = true
    const t = setInterval(() => setStatusIdx(i => Math.min(i + 1, SCAN_STATUSES.length - 1)), 900)
    return () => clearInterval(t)
  }, [briefLoading])

  // When real data arrives, reveal
  useEffect(() => {
    const hasRealData = !briefLoading && signals.some(s => !!s.body)
    if (hasRealData && wasLoading.current) {
      wasLoading.current = false
      const t = setTimeout(() => setRevealed(true), 100)
      return () => clearTimeout(t)
    }
  }, [briefLoading, signals])

  const isLoading = !revealed

  return (
    <div
      style={{
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {briefError ? (
        /* ── Error state ── */
        <div style={{
          padding: "16px 24px",
          display: "flex", flexDirection: "column", gap: 8,
          minHeight: 80, justifyContent: "center",
        }}>
          <div style={{
            ...labelStyle, fontWeight: 600,
          }}>
            API Unavailable
          </div>
          <div style={{ ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.7 }}>
            Intelligence briefing will resume when the API connection is restored.
          </div>
        </div>
      ) : isLoading ? (
        /* ── Loading state: terminal boot ── */
        <>
          <div style={{
            padding: "16px 24px",
            display: "flex", flexDirection: "column", gap: 4,
            minHeight: 80, justifyContent: "center",
          }}>
            {SCAN_STATUSES.slice(0, statusIdx + 1).map((line, i) => (
              <div
                key={i}
                style={{
                  ...TYPE.sm, fontFamily: "var(--font-geist-mono), monospace",
                  color: i === statusIdx ? "var(--accent-muted)" : "var(--text-tertiary)",
                  opacity: i === statusIdx ? 1 : 0.5,
                  animation: i === statusIdx ? "status-fade 0.2s ease both" : "none",
                }}
              >
                {line}{i === statusIdx && i < SCAN_STATUSES.length - 1 && <span className="cursor-blink" style={{ marginLeft: 2 }}>_</span>}
                {i === statusIdx && i === SCAN_STATUSES.length - 1 && <span className="loading-pulse" style={{ marginLeft: 4, ...TYPE.xs, opacity: 0.6 }}>…</span>}
              </div>
            ))}
          </div>
          <div style={{
            position: "absolute", bottom: 0, left: 0, width: "25%", height: 1,
            background: "var(--accent-secondary)", opacity: 0.4,
            animation: "band-scan 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }} />
        </>
      ) : (
        <>
          {/* ── COS drawer handle ── */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "0 20px", height: 40,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span style={{
              ...TYPE.sm, fontFamily: "var(--font-geist-mono), monospace",
              color: "var(--accent-secondary)", textTransform: "uppercase",
            }}>
              Signal
            </span>
            <button
              onClick={() => setExpanded(e => !e)}
              aria-label={expanded ? "Collapse brief" : "Expand brief"}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 28, height: 28, borderRadius: 6,
                background: "none", border: "none",
                cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "none" }}
            >
              <ChevronUp
                size={14}
                strokeWidth={1.5}
                style={{
                  color: "var(--text-tertiary)",
                  transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: expanded ? "rotate(0)" : "rotate(180deg)",
                }}
              />
            </button>
          </div>

          {/* ── Expanded: horizontal scrollable carousel ── */}
          <div style={{
            maxHeight: expanded ? 600 : 0,
            overflow: "hidden",
            transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${signals.filter(s => s.body).length || 1}, 1fr)`, gap: 8, padding: "8px 16px 16px" }}>
              {signals.filter(s => s.body).map((signal, i) => (
                  <div
                    key={i}
                    onClick={() => onDeliberate && signal.body && onDeliberate(signal)}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{
                      padding: "16px 18px",
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
                        marginBottom: 4,
                      }}>
                        {signal.layer}
                      </div>
                    )}
                    <div style={{
                      ...TYPE.body,
                      color: "var(--text-primary)",
                      fontWeight: 500,
                      lineHeight: 1.5,
                      marginBottom: signal.body ? 8 : 0,
                    }}>
                      {signal.headline}
                    </div>
                    {signal.body && (
                      <div style={{
                        ...TYPE.body,
                        color: hoveredIdx === i ? "var(--text-primary)" : "var(--text-secondary)",
                        lineHeight: 1.7,
                        flex: 1,
                        transition: "color 0.12s",
                      }}>
                        {renderCitedBody(signal.body, signal.sources)}
                      </div>
                    )}
                  </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Analysis Panel — mobile stacked view ───────────────────────────────────

export function AnalysisPanelMobile({ signals, briefLoading }: { signals: Signal[]; briefLoading: boolean }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg-primary)" }}>
      {signals.map((signal, i) => (
        <div
          key={i}
          style={{
            padding: "24px 24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--accent-primary)",
          }}
        >
          {signal.layer && (
            <div style={{ ...labelStyle, marginBottom: 4 }}>
              {signal.layer}
            </div>
          )}
          <div
            style={{
              ...TYPE.body, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: 8,
            }}
            className={briefLoading && i === 0 ? "loading-pulse" : ""}
          >
            {signal.headline}
          </div>
          {signal.body ? (
            <div style={{ ...TYPE.body, color: "var(--text-primary)", lineHeight: 1.7 }}>
              {signal.body}
            </div>
          ) : briefLoading ? (
            <div className="loading-pulse" style={{ ...TYPE.reading, color: "var(--accent-muted)", opacity: 0.4 }}>
              ▊
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
