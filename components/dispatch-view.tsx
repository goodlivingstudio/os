"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Copy, Check, TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { CopyCardButton } from "@/components/copy-card-button"
import { TYPE, MONO, DISPLAY, labelStyle, metaStyle, LAYER_COLORS } from "@/lib/styles"
import instanceConfig, { storageKey } from "@/lib/config"
import { renderCitedBody } from "@/components/citation"
import type { CitationSource } from "@/lib/types"

// ─── Types ──────────────────────────────────────────────────────────────────

interface Pitch {
  title: string
  thesis: string
  mode: "thought_leadership" | "creative"
  layers: string[]
  brief: string
  platforms: {
    primary: string
    adaptations: string[]
  }
  evidence: string[]
  evidenceSources?: CitationSource[][]
  angle?: string
  urgency: string
  wordCount?: number
  imageUrl?: string    // legacy single-skin
  images?: Record<string, string>  // per-skin images
  wildcard?: boolean
}

interface Perspective {
  title: string
  body: string
  layer: string
  sources?: CitationSource[]
}

interface DispatchData {
  available: boolean
  weekSummary: string | null
  weekSummarySources?: CitationSource[]
  perspectives?: Perspective[]
  headerImageUrl?: string   // legacy single-skin
  headerImages?: Record<string, string>  // per-skin hero images
  pitches: Pitch[]
  sparklines?: Record<string, { thisWeek: number[]; lastWeek: number[] } | number[]>
  articleCount?: number
  generatedAt?: string
  message?: string
}

const LAYER_DOT: Record<string, string> = Object.fromEntries(
  instanceConfig.layers.map((l, i) => [l.id, LAYER_COLORS[i] || "#888"])
)
const LAYER_LABELS: Record<string, string> = Object.fromEntries(
  instanceConfig.layers.map(l => [l.id, l.label])
)

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatWeekRange(generatedAt?: string): string {
  const ref = generatedAt ? new Date(generatedAt) : new Date()
  const day = ref.getDay()
  const monday = new Date(ref)
  monday.setDate(ref.getDate() - (day === 0 ? 6 : day - 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${fmt(monday)} – ${fmt(sunday)}`
}

// ─── Signal Strength + Convergence helpers ─────────────────────────────────

function countUniqueSources(pitch: Pitch): number {
  if (!pitch.evidenceSources) return 0
  const names = new Set<string>()
  for (const group of pitch.evidenceSources) {
    if (group) for (const s of group) {
      if (s.source) names.add(s.source)
      else if (s.title) names.add(s.title)
    }
  }
  return names.size
}

function isConvergence(pitch: Pitch): boolean {
  return (pitch.layers?.length ?? 0) >= 3
}

// ─── Pitch Status helpers ──────────────────────────────────────────────────

type PitchStatus = "drafted" | "published" | "killed"

const STATUS_COLORS: Record<PitchStatus, string> = {
  drafted: "#D4A05A",
  published: "#7BAF6A",
  killed: "var(--text-tertiary)",
}

function pitchKey(title: string): string {
  let h = 0
  for (let i = 0; i < title.length; i++) h = ((h << 5) - h + title.charCodeAt(i)) | 0
  return String(Math.abs(h))
}

function loadPitchStatuses(): Record<string, PitchStatus> {
  try {
    const raw = localStorage.getItem(storageKey("pitch-status"))
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function savePitchStatuses(statuses: Record<string, PitchStatus>) {
  try { localStorage.setItem(storageKey("pitch-status"), JSON.stringify(statuses)) } catch { /* */ }
}

// ─── Week key helpers ──────────────────────────────────────────────────────

function getWeekId(offset = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offset * 7)
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${date.getUTCFullYear()}-w${week}`
}

function formatWeekRangeForOffset(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset * 7)
  return formatWeekRange(d.toISOString())
}

// ─── Copy Button ────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 6,
        border: "1px solid var(--border)",
        background: copied ? "var(--accent-secondary)" : "transparent",
        color: copied ? "var(--bg-primary)" : "var(--text-tertiary)",
        ...TYPE.sm, cursor: "pointer", fontWeight: 500, transition: "all 0.2s",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : label}
    </button>
  )
}

// ─── Perspective Card ──────────────────────────────────────────────────────

function PerspectiveCard({ perspective, index, onDeliberate }: {
  perspective: Perspective
  index: number
  onDeliberate: (text: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const layerLabel = LAYER_LABELS[perspective.layer] || perspective.layer
  const copyText = `[Dispatch Perspective — ${layerLabel}]\n\n${perspective.title}\n\n${perspective.body}\n\n---\nSource: dispatch.goodliving.studio/dispatch`
  return (
    <div
      onClick={() => {
        if (window.getSelection()?.toString()) return
        onDeliberate(
          `I want to explore this perspective from the weekly dispatch:\n\n"${perspective.title}"\n\n${perspective.body}\n\nDevelop this into a strategic argument. What are the implications and what should I do about it?`
        )
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)"; setHovered(true) }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)"; setHovered(false) }}
      style={{
        position: "relative",
        background: "var(--bg-surface)",
        borderRadius: 12,
        padding: "20px",
        cursor: "pointer",
        transition: "background 0.15s",
        display: "flex", flexDirection: "column",
        animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${150 + index * 80}ms both`,
      }}
    >
      <CopyCardButton text={copyText} visible={hovered} />
      {/* Layer label */}
      <div style={{ ...labelStyle, marginBottom: 4 }}>
        {layerLabel}
      </div>
      {/* Title */}
      <div style={{
        fontSize: 28,
        fontWeight: 600,
        fontFamily: DISPLAY,
        color: "var(--text-primary)",
        lineHeight: 1,
        marginBottom: 10,
      }}>
        {perspective.title}
      </div>
      {/* Body with citations */}
      <div style={{ ...TYPE.body, color: "var(--text-secondary)", flex: 1 }}>
        {renderCitedBody(perspective.body, perspective.sources)}
      </div>
    </div>
  )
}

// ─── Pitch Overlay ──────────────────────────────────────────────────────────

function PitchOverlay({ pitch, onClose, onDeliberate, status, onSetStatus }: {
  pitch: Pitch; onClose: () => void; onDeliberate: (text: string) => void
  status?: PitchStatus; onSetStatus: (s: PitchStatus | null) => void
}) {
  return (
    <Dialog open={!!pitch} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        showCloseButton={false}
        className="pitch-overlay-inner max-w-none rounded-none bg-transparent p-0 ring-0 gap-0"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 36px", width: 600, maxWidth: 600, maxHeight: "85vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ ...labelStyle }}>
            {pitch.mode === "thought_leadership" ? "Thought Leadership" : "Creative"}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: 0 }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Title */}
        <div style={{ fontSize: 32, fontWeight: 600, fontFamily: DISPLAY, color: "var(--text-primary)", marginBottom: 28, lineHeight: 1 }}>{pitch.title}</div>

        {/* Brief */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Brief</div>
          <div style={{ ...TYPE.body, color: "var(--text-secondary)" }}>{pitch.brief}</div>
        </div>

        {/* Angle */}
        {pitch.angle && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...labelStyle, marginBottom: 8 }}>Angle</div>
            <div style={{ ...TYPE.body, color: "var(--text-secondary)" }}>{pitch.angle}</div>
          </div>
        )}

        {/* Evidence */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Evidence</div>
          {pitch.evidence.map((e, i) => (
            <div key={i} style={{ ...TYPE.body, color: "var(--text-secondary)", marginBottom: 6 }}>
              {renderCitedBody(e, pitch.evidenceSources?.[i])}
            </div>
          ))}
        </div>

        {/* Convergences */}
        {isConvergence(pitch) && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...labelStyle, marginBottom: 8 }}>Convergences</div>
            <div style={{ ...TYPE.body, color: "var(--text-secondary)" }}>
              {pitch.layers.map(l => LAYER_LABELS[l] || l).join(" · ")}
            </div>
          </div>
        )}

        {/* Why Now */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ ...labelStyle, marginBottom: 8 }}>Why Now</div>
          <div style={{ ...TYPE.body, color: "var(--text-secondary)" }}>{pitch.urgency}</div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => { onDeliberate(`I want to develop this content pitch:\n\n"${pitch.title}"\n\nThesis: ${pitch.thesis}\n\nHelp me think through the argument structure, key points, and how to make it distinctive.`); onClose() }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", ...TYPE.sm, cursor: "pointer", fontWeight: 500, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
          >
            <ArrowUpRight size={12} />
            Develop in Cerebro
          </button>
          <button
            onClick={() => {
              const copyText = `[Dispatch Content Pitch — ${pitch.mode === "thought_leadership" ? "Thought Leadership" : "Creative"}]\n\n${pitch.title}\n\nThesis: ${pitch.thesis}\n\nBrief: ${pitch.brief}${pitch.angle ? `\n\nAngle: ${pitch.angle}` : ""}\n\nEvidence:\n${pitch.evidence.map(e => `- ${e}`).join("\n")}${isConvergence(pitch) ? `\n\nConvergences: ${pitch.layers.map(l => LAYER_LABELS[l] || l).join(", ")}` : ""}\n\nWhy now: ${pitch.urgency}\n\n---\nSource: dispatch.goodliving.studio/dispatch`
              navigator.clipboard.writeText(copyText)
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", ...TYPE.sm, cursor: "pointer", fontWeight: 500, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
          >
            <Copy size={12} />
            Copy to clipboard
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── DispatchView ───────────────────────────────────────────────────────────

const DISPATCH_STATUSES = [
  "$ dispatch --weekly",
  "▸ loading 7-day article history",
  "▸ scoring multi-layer convergences",
  "▸ identifying publishable angles",
  "▸ generating content briefs",
]

let _cachedDispatch: DispatchData | null = null

const DISPATCH_CACHE_KEY = storageKey("dispatch-v4") // v4: background skin gen
const DISPATCH_TTL = 24 * 60 * 60 * 1000 // 24 hours

export function DispatchView({ onDeliberate, skin }: { onDeliberate: (text: string) => void; skin?: string }) {
  // Try localStorage first, then module cache
  const initial = (() => {
    if (_cachedDispatch) return _cachedDispatch
    try {
      const raw = localStorage.getItem(DISPATCH_CACHE_KEY)
      if (raw) {
        const { ts, data } = JSON.parse(raw)
        if (data?.pitches?.length > 0 && Date.now() - ts < DISPATCH_TTL) {
          _cachedDispatch = data
          return data
        }
      }
    } catch { /* */ }
    return null
  })()

  const [data, setData] = useState<DispatchData | null>(initial)
  const [loading, setLoading] = useState(!initial)
  const [statusIdx, setStatusIdx] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [activePitch, setActivePitch] = useState<Pitch | null>(null)
  const [regenerating, setRegenerating] = useState(false)
  const [pitchStatuses, setPitchStatuses] = useState<Record<string, PitchStatus>>({})
  const [weekOffset, setWeekOffset] = useState(0)

  // Load pitch statuses from localStorage
  useEffect(() => { setPitchStatuses(loadPitchStatuses()) }, [])

  const setStatus = useCallback((title: string, status: PitchStatus | null) => {
    setPitchStatuses(prev => {
      const next = { ...prev }
      if (status) next[pitchKey(title)] = status
      else delete next[pitchKey(title)]
      savePitchStatuses(next)
      return next
    })
  }, [])

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      await fetch("/api/dispatch-purge", { method: "POST" })
      _cachedDispatch = null
      setData(null)
      setLoading(true)
      setStatusIdx(0)
      const t = setInterval(() => setStatusIdx(i => Math.min(i + 1, DISPATCH_STATUSES.length - 1)), 1800)
      const res = await fetch("/api/dispatch")
      const d = await res.json()
      setData(d)
      _cachedDispatch = d
      try { localStorage.setItem(DISPATCH_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: d })) } catch { /* */ }
      setLoading(false)
      clearInterval(t)
    } catch {
      setLoading(false)
    }
    setRegenerating(false)
  }

  useEffect(() => {
    // Only use module cache for current week
    if (weekOffset === 0 && _cachedDispatch) return
    setData(null)
    setStatusIdx(0)
    setElapsed(0)
    setLoading(true)
    const t = setInterval(() => setStatusIdx(i => Math.min(i + 1, DISPATCH_STATUSES.length - 1)), 1800)
    const timer = setInterval(() => setElapsed(e => e + 1), 1000)
    const weekParam = weekOffset !== 0 ? `?week=${getWeekId(weekOffset)}` : ""
    fetch(`/api/dispatch${weekParam}`)
      .then(r => r.json())
      .then(async (d) => {
        setData(d)
        if (weekOffset === 0) {
          _cachedDispatch = d
          try { localStorage.setItem(DISPATCH_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: d })) } catch { /* */ }
        }
        setLoading(false); clearInterval(t); clearInterval(timer)

        // Generate remaining skins in background — one at a time
        if (weekOffset === 0 && d.pitches?.length > 0) {
          const defaultSkin = d.pitches[0]?.images ? Object.keys(d.pitches[0].images)[0] : null
          const allSkins = instanceConfig.themes.map((th: { id: string }) => th.id)
          const remaining = allSkins.filter((s: string) => s !== defaultSkin)
          const heroTitle = d.weekSummary?.split(/[.!?]/)[0] || "Weekly pitch"
          const pitchTitles = d.pitches.map((p: { title: string }) => p.title)

          for (const skinId of remaining) {
            try {
              const res = await fetch("/api/generate-skin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skinId, titles: pitchTitles, heroTitle, surface: "dispatch" }),
              })
              const skinData = await res.json()
              if (skinData.images) {
                setData((prev: DispatchData | null) => {
                  if (!prev) return prev
                  const updated = { ...prev }
                  if (skinData.images._hero) {
                    updated.headerImages = { ...(updated.headerImages || {}), [skinId]: skinData.images._hero }
                  }
                  updated.pitches = (updated.pitches || []).map((p: Pitch) => ({
                    ...p,
                    images: { ...(p.images || {}), [skinId]: skinData.images[p.title] || undefined },
                  }))
                  _cachedDispatch = updated
                  try { localStorage.setItem(DISPATCH_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: updated })) } catch { /* */ }
                  return updated
                })
              }
            } catch { /* skin gen failed — continue */ }
          }
        }
      })
      .catch(() => { setLoading(false); clearInterval(t); clearInterval(timer) })
    return () => { clearInterval(t); clearInterval(timer) }
  }, [weekOffset]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-primary)" }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, height: 40, display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px", borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ ...TYPE.xs, color: "var(--text-primary)", textTransform: "uppercase", fontWeight: 500, letterSpacing: "0.04em" }}>
          Pitch
        </span>
        {data?.generatedAt && (
          <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)" }}>
            {formatWeekRange(data.generatedAt)}
          </span>
        )}
      </div>

      <div className="view-padding" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ padding: "32px 0" }}>
            {DISPATCH_STATUSES.slice(0, statusIdx + 1).map((line, idx) => (
              <div
                key={idx}
                style={{
                  ...TYPE.sm, fontFamily: MONO,
                  color: idx === statusIdx ? "var(--accent-muted)" : "var(--text-tertiary)",
                  opacity: idx === statusIdx ? 1 : 0.5,
                  animation: idx === statusIdx ? "status-fade 0.2s ease both" : "none",
                  marginBottom: 4,
                }}
              >
                {line}{idx === statusIdx && idx < DISPATCH_STATUSES.length - 1 && <span className="cursor-blink" style={{ marginLeft: 2 }}>_</span>}
                {idx === statusIdx && idx === DISPATCH_STATUSES.length - 1 && <span className="loading-pulse" style={{ marginLeft: 4, ...TYPE.xs, opacity: 0.6 }}>...</span>}
              </div>
            ))}
            {elapsed > 3 && (
              <div style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)", marginTop: 12, opacity: 0.6 }}>
                {elapsed < 15 ? "analyzing intelligence" : elapsed < 40 ? "composing images" : "finishing up"} · {elapsed}s
              </div>
            )}
          </div>
        )}

        {/* ── Content ── */}
        {!loading && data && (
          <div style={{ padding: "0 0 64px" }}>

            {/* ─ Header image — 21:9 cinematic hero ─ */}
            {(() => {
              const heroImg = (skin && data.headerImages?.[skin]) || data.headerImageUrl
              return (
                <div style={{
                  position: "relative", width: "100%", paddingTop: `${(9 / 21) * 100}%`, overflow: "hidden",
                  background: heroImg ? "transparent" : "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
                  animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
                }}>
                  {heroImg && (
                    <img src={heroImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              )
            })()}

            {/* ─ EDITORIAL HEADER — centered broadsheet ─ */}
            <div className="dispatch-header-content" style={{
              padding: "48px 0 32px",
              textAlign: "center",
              animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}>
              {/* Eyebrow */}
              <div style={{
                ...labelStyle,
                marginBottom: 20,
              }}>
                New ideas and opportunities
              </div>
              {/* Headline — Söhne Schmal display, centered */}
              <div className="dispatch-headline" style={{
                fontSize: 44,
                fontWeight: 600,
                fontFamily: DISPLAY,
                color: "var(--text-primary)",
                lineHeight: 1,
                maxWidth: 820,
                margin: "0 auto",
              }}>
                {renderCitedBody(
                  data.message || data.weekSummary || "Weekly intelligence brief and content pitches.",
                  data.weekSummarySources
                )}
              </div>
              {data.articleCount && data.generatedAt && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={metaStyle}>
                    Parsing {data.articleCount} articles
                  </div>
                  {/* Week carousel dots with arrows — loops infinitely */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, marginBottom: 0 }}>
                    <button
                      onClick={() => setWeekOffset(o => o <= -6 ? 0 : o - 1)}
                      style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", borderRadius: 6, transition: "all 0.15s", padding: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-elevated)" }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent" }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {Array.from({ length: 7 }, (_, i) => {
                        const offset = -(6 - i)
                        const isActive = weekOffset === offset
                        return (
                          <button
                            key={offset}
                            onClick={() => setWeekOffset(offset)}
                            title={offset === 0 ? "This week" : formatWeekRangeForOffset(offset)}
                            style={{
                              width: isActive ? 22 : 8,
                              height: 8,
                              borderRadius: 4,
                              border: "none",
                              background: isActive ? "var(--accent-secondary)" : "var(--text-tertiary)",
                              cursor: "pointer",
                              padding: 0,
                              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                              opacity: isActive ? 1 : 0.3,
                            }}
                          />
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setWeekOffset(o => o >= 0 ? -6 : o + 1)}
                      style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", borderRadius: 6, transition: "all 0.15s", padding: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-elevated)" }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent" }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ─ PERSPECTIVES — intelligence layer cards ─ */}
            {data.perspectives && data.perspectives.length > 0 && (
              <div style={{
                padding: "48px 0 0",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 100ms both",
              }}>
                <div className="perspectives-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}>
                  {data.perspectives.map((p, i) => (
                    <PerspectiveCard
                      key={i}
                      perspective={p}
                      index={i}
                      onDeliberate={onDeliberate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ─ SIGNAL INTENSITY — sparklines per layer ─ */}
            {data.sparklines && Object.keys(data.sparklines).length > 0 && (
              <div style={{
                padding: "56px 0 0",
                margin: "0 -20px",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 120ms both",
              }}>
                <div style={{ ...labelStyle, marginBottom: 24, paddingLeft: 20 }}>
                  Signal
                </div>
                {(() => {
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                  const layerColors = instanceConfig.layers.map((l, i) =>
                    [LAYER_DOT[l.id] || "#888"]
                  ).map(c => c[0])

                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "0 20px" }}>
                      {/* 5 area charts */}
                      {instanceConfig.layers.map((layer, layerIdx) => {
                        const raw = data.sparklines![layer.id]
                        // Support both old format (number[]) and new format ({ thisWeek, lastWeek })
                        const thisWeek = Array.isArray(raw) ? raw : (raw?.thisWeek || [])
                        const lastWeek = Array.isArray(raw) ? [] : (raw?.lastWeek || [])
                        if (thisWeek.length < 2) return null
                        const chartData = thisWeek.map((v, i) => ({
                          day: days[i] || `D${i}`,
                          thisWeek: v,
                          lastWeek: lastWeek[i] || 0,
                        }))
                        const color = layerColors[layerIdx]
                        const gradId = `spark-fill-${layer.id}`
                        const areaConfig: ChartConfig = {
                          thisWeek: { label: "This week", color },
                          lastWeek: { label: "Last week", color: "var(--text-tertiary)" },
                        }
                        return (
                          <div key={layer.id} style={{
                            background: "var(--bg-surface)", borderRadius: 12, padding: "20px 20px 12px",
                            display: "flex", flexDirection: "column",
                          }}>
                            <span style={{ ...labelStyle, marginBottom: 8 }}>
                              {layer.label}
                            </span>
                            <ChartContainer config={areaConfig} className="h-40 w-full">
                              <AreaChart data={chartData} margin={{ top: 10, right: 8, bottom: 4, left: 8 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.3} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel formatter={(value, name) => `${(value as number).toFixed(1)} avg ${name === "thisWeek" ? "this week" : "last week"}`} />} />
                                <defs>
                                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                                  </linearGradient>
                                  <linearGradient id={`${gradId}-last`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--text-tertiary)" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="var(--text-tertiary)" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="natural"
                                  dataKey="lastWeek"
                                  stroke="var(--text-tertiary)"
                                  strokeWidth={1}
                                  strokeDasharray="4 4"
                                  strokeOpacity={0.4}
                                  fill={`url(#${gradId}-last)`}
                                  fillOpacity={0.15}
                                  dot={false}
                                  activeDot={{ r: 3, fill: "var(--text-tertiary)", stroke: "var(--bg-surface)", strokeWidth: 2 }}
                                  stackId="a"
                                />
                                <Area
                                  type="natural"
                                  dataKey="thisWeek"
                                  stroke={color}
                                  strokeWidth={1.5}
                                  fill={`url(#${gradId})`}
                                  fillOpacity={0.4}
                                  dot={false}
                                  activeDot={{ r: 4, fill: color, stroke: "var(--bg-surface)", strokeWidth: 2 }}
                                  stackId="b"
                                />
                              </AreaChart>
                            </ChartContainer>
                            {/* Trend footer */}
                            {(() => {
                              const twSum = thisWeek.reduce((a, b) => a + b, 0)
                              const lwSum = lastWeek.reduce((a, b) => a + b, 0)
                              const pct = lwSum > 0 ? Math.round(((twSum - lwSum) / lwSum) * 100) : 0
                              const up = pct >= 0
                              if (lwSum === 0) return (
                                <div style={{ padding: "12px 0 4px", ...TYPE.body, color: "var(--text-tertiary)" }}>
                                  First week of data
                                </div>
                              )
                              return (
                                <div style={{ padding: "12px 0 4px", display: "flex", flexDirection: "column", gap: 3 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 5, ...TYPE.body, fontWeight: 600, color: "var(--text-secondary)" }}>
                                    {up ? "Up" : "Down"} {Math.abs(pct)}% from last week
                                    {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                  </div>
                                  <div style={{ ...TYPE.sm, color: "var(--text-tertiary)" }}>
                                    {Math.round(twSum)} avg this week vs {Math.round(lwSum)} last
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        )
                      })}

                      {/* Bar chart — layer distribution this week vs last */}
                      <div style={{
                        background: "var(--bg-surface)", borderRadius: 12, padding: "20px 20px 12px",
                        display: "flex", flexDirection: "column",
                      }}>
                        <span style={{ ...labelStyle, marginBottom: 8 }}>
                          Distribution
                        </span>
                        {(() => {
                          const barData = instanceConfig.layers.map((l, i) => {
                            const raw = data.sparklines![l.id]
                            const tw = Array.isArray(raw) ? raw : (raw?.thisWeek || [])
                            const lw = Array.isArray(raw) ? [] : (raw?.lastWeek || [])
                            return {
                              layer: l.label,
                              thisWeek: Math.round(tw.reduce((a: number, b: number) => a + b, 0) * 10) / 10,
                              lastWeek: Math.round(lw.reduce((a: number, b: number) => a + b, 0) * 10) / 10,
                              fill: layerColors[i],
                            }
                          })
                          const barConfig: ChartConfig = {
                            thisWeek: { label: "This week", color: "var(--accent-secondary)" },
                            lastWeek: { label: "Last week", color: "var(--text-tertiary)" },
                          }
                          const strongest = barData.reduce((best, d) => d.thisWeek > best.thisWeek ? d : best, barData[0])
                          const totalTw = barData.reduce((s, d) => s + d.thisWeek, 0)
                          const totalLw = barData.reduce((s, d) => s + d.lastWeek, 0)
                          const overallPct = totalLw > 0 ? Math.round(((totalTw - totalLw) / totalLw) * 100) : 0
                          const up = overallPct >= 0
                          return (
                            <>
                              <ChartContainer config={barConfig} className="h-40 w-full">
                                <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.3} />
                                  <XAxis dataKey="layer" tickLine={false} tickMargin={8} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} />
                                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" hideLabel formatter={(value, name) => `${(value as number).toFixed(1)} ${name === "thisWeek" ? "this week" : "last week"}`} />} />
                                  <Bar dataKey="thisWeek" fill="var(--accent-secondary)" radius={3} />
                                  <Bar dataKey="lastWeek" fill="var(--text-tertiary)" fillOpacity={0.3} radius={3} />
                                </BarChart>
                              </ChartContainer>
                              <div style={{ padding: "12px 0 4px", display: "flex", flexDirection: "column", gap: 3 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 5, ...TYPE.body, fontWeight: 600, color: "var(--text-secondary)" }}>
                                  {strongest.layer} leading this week
                                  {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                </div>
                                <div style={{ ...TYPE.sm, color: "var(--text-tertiary)" }}>
                                  Overall signal {up ? "up" : "down"} {Math.abs(overallPct)}% week-over-week
                                </div>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* ─ BREATHER IMAGE — visual pause between data and editorial ─ */}
            {data.pitches && data.pitches.length > 0 && (() => {
              const firstPitchWithImg = data.pitches.find(p => (skin && p.images?.[skin]) || p.imageUrl)
              const breakImage = firstPitchWithImg ? ((skin && firstPitchWithImg.images?.[skin]) || firstPitchWithImg.imageUrl) : undefined
              return (
                <div  style={{
                  position: "relative", width: "100%", paddingTop: `${(9 / 21) * 100}%`, overflow: "hidden",
                  marginTop: 56,
                  background: breakImage ? "transparent" : "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
                  animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 140ms both",
                }}>
                  {breakImage && (
                    <img src={breakImage} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              )
            })()}

            {/* ─ PITCHES — editorial grid ─ */}
            {data.pitches && data.pitches.length > 0 && (
              <div style={{
                paddingTop: 48,
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 150ms both",
              }}>
                {data.pitches.map((pitch, i) => {
                  const pitchCopyText = `[Dispatch Content Pitch — ${pitch.mode === "thought_leadership" ? "Thought Leadership" : "Creative"}]\n\n${pitch.title}\n\nThesis: ${pitch.thesis}\n\nBrief: ${pitch.brief}\n\nEvidence:\n${pitch.evidence.join("\n")}\n\n---\nSource: dispatch.goodliving.studio/dispatch`
                  return (
                  <div
                    key={i}
                    onClick={() => {
                      if (window.getSelection()?.toString()) return
                      setActivePitch(pitch)
                    }}
                    style={{
                      position: "relative",
                      padding: "28px 20px",
                      margin: "0 -20px",
                      width: "calc(100% + 40px)",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 80}ms both`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                  >
                    <CopyCardButton text={pitchCopyText} />
                    <div style={{ display: "flex", gap: 20 }}>
                      {/* Image thumbnail — left side (hidden on mobile) */}
                      <div className="pitch-thumb" style={{
                        width: 150, height: 100, overflow: "hidden", flexShrink: 0,
                        background: ((skin && pitch.images?.[skin]) || pitch.imageUrl) ? "transparent" : `linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)`,
                      }}>
                        {((skin && pitch.images?.[skin]) || pitch.imageUrl) && (
                          <img src={(skin && pitch.images?.[skin]) || pitch.imageUrl} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      {/* Text content — right side */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Eyebrow */}
                        <div style={{ ...labelStyle, marginBottom: 4 }}>
                          {pitch.mode === "thought_leadership" ? "Thought Leadership" : "Creative"}
                          {countUniqueSources(pitch) > 0 && (
                            <span style={{ opacity: 0.5 }}> ({countUniqueSources(pitch)})</span>
                          )}
                        </div>
                        {/* Title */}
                        <div style={{
                          fontSize: 32,
                          fontWeight: 600,
                          fontFamily: DISPLAY,
                          color: "var(--text-primary)",
                          lineHeight: 1,
                          marginBottom: 8,
                        }}>
                          {pitch.title}
                        </div>
                        {/* Thesis */}
                        <div style={{
                          ...TYPE.body,
                          color: "var(--text-secondary)",
                        }}>
                          {pitch.thesis}
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })}

              </div>
            )}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && !data?.pitches?.length && !data?.message && !data?.weekSummary && (
          <div style={{ padding: "48px 20px", maxWidth: 520 }}>
            <div style={{ ...TYPE.body, color: "var(--text-tertiary)" }}>
              Content pitches will appear after the weekly intelligence brief generates.
            </div>
          </div>
        )}
      </div>

      {/* Pitch overlay */}
      {activePitch && (
        <PitchOverlay
          pitch={activePitch}
          onClose={() => setActivePitch(null)}
          onDeliberate={onDeliberate}
          status={pitchStatuses[pitchKey(activePitch.title)]}
          onSetStatus={(s) => setStatus(activePitch.title, s)}
        />
      )}
    </main>
  )
}
