"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Check, ArrowUpRight, X, RefreshCw, ChevronLeft, ChevronRight, Pen } from "lucide-react"
import { TYPE, MONO, DISPLAY, labelStyle, metaStyle } from "@/lib/styles"
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
  imageUrl?: string
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
  headerImageUrl?: string
  pitches: Pitch[]
  sparklines?: Record<string, number[]>
  articleCount?: number
  generatedAt?: string
  message?: string
}

const LAYER_DOT: Record<string, string> = Object.fromEntries(
  instanceConfig.layers.map((l, i) => [l.id, ["#D4A05A", "#5A9EB0", "#7BAF6A", "#9A85B8", "#C87A6A"][i] || "#888"])
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
  return (
    <div
      onClick={() => onDeliberate(
        `I want to explore this perspective from the weekly dispatch:\n\n"${perspective.title}"\n\n${perspective.body}\n\nDevelop this into a strategic argument. What are the implications and what should I do about it?`
      )}
      style={{
        background: "var(--bg-surface)",
        borderRadius: 12,
        padding: "16px 18px",
        cursor: "pointer",
        transition: "background 0.15s",
        display: "flex", flexDirection: "column",
        animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${150 + index * 80}ms both`,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
    >
      {/* Layer label */}
      <div style={{ ...labelStyle, marginBottom: 4 }}>
        {LAYER_LABELS[perspective.layer] || perspective.layer}
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
  const pitchMarkdown = `# ${pitch.title}\n\n**Thesis:** ${pitch.thesis}\n\n**Brief:** ${pitch.brief}\n\n**Platform:** ${pitch.platforms.primary}\n**Adaptations:**\n${pitch.platforms.adaptations.map(a => `- ${a}`).join("\n")}\n\n**Evidence:**\n${pitch.evidence.map(e => `- ${e}`).join("\n")}\n\n**Urgency:** ${pitch.urgency}`

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 6000, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", animation: "status-fade 0.15s ease both" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="pitch-overlay-inner"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 36px", width: 600, maxHeight: "85vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...TYPE.xs, textTransform: "uppercase", color: pitch.mode === "thought_leadership" ? "#5A9EB0" : "#C87A6A", fontWeight: 600, letterSpacing: "0.06em" }}>
              {pitch.mode === "thought_leadership" ? "Thought Leadership" : "Creative"}
            </span>
            {pitch.wildcard && (
              <span style={{ ...TYPE.xs, padding: "2px 8px", borderRadius: 8, background: "rgba(184, 150, 106, 0.12)", color: "var(--accent-secondary)", fontWeight: 600, letterSpacing: "0.03em" }}>
                WILDCARD
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: 0 }}>
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ fontSize: 32, fontWeight: 600, fontFamily: DISPLAY, color: "var(--text-primary)", marginBottom: 10, lineHeight: 1 }}>{pitch.title}</div>
        <div style={{ ...TYPE.body, color: "var(--text-secondary)", marginBottom: isConvergence(pitch) ? 12 : 24 }}>{pitch.thesis}</div>

        {/* Convergence callout */}
        {isConvergence(pitch) && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 24,
            padding: "10px 14px", borderRadius: 8, background: "var(--bg-elevated)",
          }}>
            <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
              Convergence — {pitch.layers.map(l => LAYER_LABELS[l] || l).join(", ")}
            </span>
          </div>
        )}

        {/* Signal strength */}
        {countUniqueSources(pitch) > 0 && (
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", marginBottom: 16 }}>
            {countUniqueSources(pitch)} unique sources
          </div>
        )}

        <div style={{ height: 1, background: "var(--border)", marginBottom: 24 }} />

        <div style={{ marginBottom: 24 }}>
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Brief</div>
          <div style={{ ...TYPE.body, color: "var(--text-secondary)" }}>{pitch.brief}</div>
        </div>

        {pitch.angle && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Angle</div>
            <div style={{ ...TYPE.body, color: "var(--text-secondary)" }}>{pitch.angle}</div>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Platform</div>
          <div style={{ ...TYPE.body, color: "var(--text-primary)", fontWeight: 500, marginBottom: 6 }}>{pitch.platforms.primary}</div>
          {pitch.platforms.adaptations.map((a, i) => (
            <div key={i} style={{ ...TYPE.body, color: "var(--text-tertiary)", marginBottom: 4 }}>{a}</div>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Evidence</div>
          {pitch.evidence.map((e, i) => (
            <div key={i} style={{ ...TYPE.body, color: "var(--text-secondary)", marginBottom: 6 }}>
              {renderCitedBody(e, pitch.evidenceSources?.[i])}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Why Now</div>
          <div style={{ ...TYPE.body, color: "var(--accent-muted)" }}>{pitch.urgency}</div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <CopyButton text={pitchMarkdown} label="Copy brief" />
          <CopyButton
            text={`---\ntype: dispatch-pitch\ndate: ${new Date().toISOString().slice(0, 10)}\nmode: ${pitch.mode}\nlayers: [${pitch.layers.join(", ")}]\nplatform: ${pitch.platforms.primary}\n---\n\n# ${pitch.title}\n\n**Thesis:** ${pitch.thesis}\n\n**Brief:** ${pitch.brief}\n\n${pitch.angle ? `**Angle:** ${pitch.angle}\n\n` : ""}**Evidence:**\n${pitch.evidence.map(e => `- ${e}`).join("\n")}\n\n**Urgency:** ${pitch.urgency}\n\n**Adaptations:**\n${pitch.platforms.adaptations.map(a => `- ${a}`).join("\n")}\n\n${pitch.wordCount ? `**Target:** ~${pitch.wordCount} words` : ""}`}
            label="Copy for Atlas"
          />
          <button
            onClick={() => { onDeliberate(`I want to develop this content pitch:\n\n"${pitch.title}"\n\nThesis: ${pitch.thesis}\n\nHelp me think through the argument structure, key points, and how to make it distinctive.`); onClose() }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", ...TYPE.sm, cursor: "pointer", fontWeight: 500, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
          >
            <ArrowUpRight size={12} />
            Develop in Cerebro
          </button>
          <button
            onClick={() => {
              onDeliberate(`Act as my co-writer — help me write this piece, not strategize about it.\n\nTitle: "${pitch.title}"\nPlatform: ${pitch.platforms.primary}${pitch.wordCount ? ` (~${pitch.wordCount} words)` : ""}\nThesis: ${pitch.thesis}\nBrief: ${pitch.brief}${pitch.angle ? `\nAngle: ${pitch.angle}` : ""}\nEvidence:\n${pitch.evidence.map(e => `- ${e}`).join("\n")}\n\nStart with an opening hook. Write in first person, conversational but authoritative. Make it publishable.`)
              onClose()
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px solid var(--accent-secondary)", background: "rgba(184, 150, 106, 0.08)", color: "var(--accent-secondary)", ...TYPE.sm, cursor: "pointer", fontWeight: 500, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(184, 150, 106, 0.15)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(184, 150, 106, 0.08)" }}
          >
            <Pen size={11} />
            Start drafting
          </button>
        </div>

        {/* Status toggles */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", marginRight: 4 }}>Status</span>
          {(["drafted", "published", "killed"] as PitchStatus[]).map(s => (
            <button
              key={s}
              onClick={() => onSetStatus(status === s ? null : s)}
              style={{
                ...TYPE.xs, padding: "3px 10px", borderRadius: 8,
                border: `1px solid ${status === s ? STATUS_COLORS[s] : "var(--border)"}`,
                background: status === s ? `${STATUS_COLORS[s]}18` : "transparent",
                color: status === s ? STATUS_COLORS[s] : "var(--text-tertiary)",
                cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
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

export function DispatchView({ onDeliberate }: { onDeliberate: (text: string) => void }) {
  const [data, setData] = useState<DispatchData | null>(_cachedDispatch)
  const [loading, setLoading] = useState(!_cachedDispatch)
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
      .then(d => {
        setData(d)
        if (weekOffset === 0) _cachedDispatch = d
        setLoading(false); clearInterval(t); clearInterval(timer)
      })
      .catch(() => { setLoading(false); clearInterval(t); clearInterval(timer) })
    return () => { clearInterval(t); clearInterval(timer) }
  }, [weekOffset])

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-primary)" }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, height: 40, display: "flex", alignItems: "center",
        padding: "0 20px", borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ ...TYPE.sm, color: "var(--accent-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Dispatch
        </span>

        {/* Regenerate — current week only */}
        {data && !loading && weekOffset === 0 && (
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            title="Regenerate weekly brief"
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "4px 10px", borderRadius: 6, marginLeft: "auto",
              border: "1px solid var(--border)", background: "transparent",
              ...TYPE.xs, color: "var(--text-tertiary)",
              cursor: regenerating ? "default" : "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!regenerating) e.currentTarget.style.background = "var(--bg-elevated)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
          >
            <RefreshCw size={11} style={{ animation: regenerating ? "spin 1s linear infinite" : "none" }} />
            {regenerating ? "Generating..." : "Regenerate"}
          </button>
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
          <div style={{ padding: "0 0 48px" }}>

            {/* ─ Header image — 21:9 cinematic hero ─ */}
            <div style={{
              position: "relative", width: "100%", paddingTop: `${(9 / 21) * 100}%`, overflow: "hidden",
              background: data.headerImageUrl
                ? "transparent"
                : "linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)",
              animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}>
              {data.headerImageUrl && (
                <img src={data.headerImageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>

            {/* ─ EDITORIAL HEADER — centered broadsheet ─ */}
            <div className="dispatch-header-content" style={{
              padding: "34px 0 24px",
              textAlign: "center",
              animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}>
              {/* Eyebrow */}
              <div style={{
                ...TYPE.xs, color: "var(--text-tertiary)",
                textTransform: "uppercase", letterSpacing: "0.08em",
                marginBottom: 16,
              }}>
                New ideas and opportunities &bull; {formatWeekRange(data.generatedAt)}
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
                padding: "24px 0 0",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 100ms both",
              }}>
                <div className="perspectives-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
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
                padding: "48px 0 0",
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 120ms both",
              }}>
                <div style={{ ...labelStyle, marginBottom: 16 }}>
                  Signal Intensity · 7 Days
                </div>
                <div style={{ display: "flex", gap: 20 }}>
                  {instanceConfig.layers.map(layer => {
                    const points = data.sparklines![layer.id] || []
                    if (points.length < 2) return null
                    const max = Math.max(...points, 1)
                    const h = 48
                    const w = 140
                    const step = w / (points.length - 1)
                    const scaled = points.map(v => h - (v / max) * (h - 4) - 2)
                    const polyline = scaled.map((y, i) => `${i * step},${y}`).join(" ")
                    const areaPath = scaled.map((y, i) => `${i * step},${y}`).join(" L") + ` L${(points.length - 1) * step},${h} L0,${h} Z`
                    const trending = points[points.length - 1] >= points[0]
                    const color = trending ? "#61BF6B" : "#BF6161"
                    const gradId = `spark-${layer.id}`
                    return (
                      <div key={layer.id} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
                          {layer.label}
                        </span>
                        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h }}>
                          <defs>
                            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                              <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <path d={`M${areaPath}`} fill={`url(#${gradId})`} />
                          <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx={(points.length - 1) * step} cy={scaled[scaled.length - 1]} r="3" fill={color} />
                        </svg>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ─ SIGNAL CONVERGENCE — orbital/scanner visualization ─ */}
            {data.pitches && data.pitches.length > 0 && (() => {
              const LAYER_POSITIONS: Record<string, [number, number]> = {}
              const layers = instanceConfig.layers
              // Distribute layers organically around center (not rigid pentagon)
              const cx = 248, cy = 210, baseR = 165
              const angleOffsets = [-90, -15, 55, 125, 200] // degrees, slightly irregular
              layers.forEach((l, i) => {
                const avgScore = data.sparklines?.[l.id]?.reduce((a, b) => a + b, 0) ?? 0
                const avgN = data.sparklines?.[l.id]?.length || 1
                const strength = (avgScore / avgN) / 10 // 0-1
                const r = baseR * (1 - strength * 0.3) // stronger = closer
                const angle = (angleOffsets[i] || i * 72) * Math.PI / 180
                LAYER_POSITIONS[l.id] = [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
              })

              // Compute convergence points from pitches
              const convergences = data.pitches.filter(p => p.layers && p.layers.length >= 2).map(pitch => {
                const pLayers = pitch.layers.filter(l => LAYER_POSITIONS[l])
                if (pLayers.length < 2) return null
                // Position = weighted centroid of contributing layers
                const x = pLayers.reduce((s, l) => s + (LAYER_POSITIONS[l]?.[0] || cx), 0) / pLayers.length
                const y = pLayers.reduce((s, l) => s + (LAYER_POSITIONS[l]?.[1] || cy), 0) / pLayers.length
                // Parse urgency (stored as string like "high" or number)
                const urg = typeof pitch.urgency === "number" ? pitch.urgency : (pitch.urgency?.match?.(/\d+/)?.[0] ? parseInt(pitch.urgency.match(/\d+/)![0]) : 6)
                const evCount = pitch.evidence?.length || 1
                return { title: pitch.title.split(/[:.—]/)[0].trim().slice(0, 28), x, y, urgency: urg, evidence: evCount, layers: pLayers, color: LAYER_DOT[pLayers[0]] || "#C87A6A" }
              }).filter(Boolean) as { title: string; x: number; y: number; urgency: number; evidence: number; layers: string[]; color: string }[]

              const w = 496, h = 420
              return (
                <div style={{
                  padding: "48px 0 0",
                  animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 140ms both",
                }}>
                  <div style={{ ...labelStyle, marginBottom: 16 }}>
                    Signal Convergence
                  </div>
                  <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxHeight: 420 }}>
                    {/* Concentric rings */}
                    {[180, 135, 90, 45].map(r => (
                      <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="0.5" opacity={0.3} />
                    ))}
                    {/* Crosshairs */}
                    <line x1={cx - 185} y1={cy} x2={cx + 185} y2={cy} stroke="var(--border)" strokeWidth="0.5" opacity={0.15} />
                    <line x1={cx} y1={cy - 185} x2={cx} y2={cy + 185} stroke="var(--border)" strokeWidth="0.5" opacity={0.15} />
                    {/* Tick marks on outer ring */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                      const rad = deg * Math.PI / 180
                      return <line key={deg} x1={cx + 177 * Math.cos(rad)} y1={cy + 177 * Math.sin(rad)} x2={cx + 183 * Math.cos(rad)} y2={cy + 183 * Math.sin(rad)} stroke="var(--border)" strokeWidth="0.5" opacity={0.4} />
                    })}

                    {/* Layer orbital ellipses */}
                    {layers.map((l, i) => {
                      const [lx, ly] = LAYER_POSITIONS[l.id] || [cx, cy]
                      const dist = Math.sqrt((lx - cx) ** 2 + (ly - cy) ** 2)
                      return (
                        <g key={l.id}>
                          <ellipse cx={cx} cy={cy} rx={dist + 5} ry={dist - 10} fill="none" stroke={LAYER_DOT[l.id]} strokeWidth="0.5" opacity={0.08} transform={`rotate(${angleOffsets[i] + 15} ${cx} ${cy})`} />
                          <circle cx={lx} cy={ly} r={2.5} fill={LAYER_DOT[l.id]} opacity={0.6} />
                        </g>
                      )
                    })}

                    {/* Convergence hotspots */}
                    {convergences.map((c, i) => {
                      const pulseR = Math.max(8, c.urgency * 2.5 + c.evidence * 2)
                      const dotR = Math.max(2, c.urgency * 0.4)
                      return (
                        <g key={i}>
                          {/* Pulse rings — animated */}
                          <circle cx={c.x} cy={c.y} r={pulseR} fill="none" stroke={c.color} strokeWidth="0.5" opacity={0.06}>
                            <animate attributeName="r" values={`${dotR};${pulseR * 1.8};${dotR}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.1;0;0.1" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                          </circle>
                          {pulseR > 14 && (
                            <circle cx={c.x} cy={c.y} r={pulseR * 0.6} fill="none" stroke={c.color} strokeWidth="0.5" opacity={0.1}>
                              <animate attributeName="r" values={`${dotR};${pulseR * 1.2};${dotR}`} dur={`${3 + i * 0.5}s`} begin="0.3s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.12;0;0.12" dur={`${3 + i * 0.5}s`} begin="0.3s" repeatCount="indefinite" />
                            </circle>
                          )}
                          {/* Center dot */}
                          <circle cx={c.x} cy={c.y} r={dotR} fill="var(--text-primary)" opacity={0.5 + c.urgency * 0.04} />
                          {/* Label */}
                          <text x={c.x + dotR + 6} y={c.y - 4} fill="var(--text-tertiary)" fontFamily={MONO} fontSize={8} letterSpacing="0.04em">{c.title.toUpperCase()}</text>
                          <text x={c.x + dotR + 6} y={c.y + 6} fill="var(--text-tertiary)" fontFamily={MONO} fontSize={7} opacity={0.5}>{c.urgency} URG · {c.evidence} SRC</text>
                        </g>
                      )
                    })}

                    {/* Center reticle */}
                    <circle cx={cx} cy={cy} r={3} fill="none" stroke="var(--border)" strokeWidth="0.5" opacity={0.3} />
                    <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="var(--border)" strokeWidth="0.5" opacity={0.2} />
                    <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="var(--border)" strokeWidth="0.5" opacity={0.2} />
                  </svg>
                  {/* Legend */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
                    {layers.map(l => (
                      <span key={l.id} style={{ fontFamily: MONO, fontSize: 8, color: LAYER_DOT[l.id], opacity: 0.5, letterSpacing: "0.04em" }}>● {l.label.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* ─ PITCHES — editorial grid ─ */}
            {data.pitches && data.pitches.length > 0 && (
              <div style={{
                paddingTop: 48,
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 150ms both",
              }}>
                {data.pitches.map((pitch, i) => (
                  <div
                    key={i}
                    onClick={() => setActivePitch(pitch)}
                    style={{
                      padding: "20px 20px",
                      margin: "0 -20px",
                      width: "calc(100% + 40px)",
                      cursor: "pointer",
                      transition: "background 0.15s",
                      animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 80}ms both`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
                  >
                    <div style={{ display: "flex", gap: 20 }}>
                      {/* Image thumbnail — left side (hidden on mobile) */}
                      <div className="pitch-thumb" style={{
                        width: 150, height: 100, borderRadius: 8, overflow: "hidden", flexShrink: 0,
                        background: pitch.imageUrl ? "transparent" : `linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)`,
                      }}>
                        {pitch.imageUrl && (
                          <img src={pitch.imageUrl} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                          {isConvergence(pitch) && (
                            <>
                              <span style={{ opacity: 0.5 }}> · </span>
                              {pitch.layers.map(l => LAYER_LABELS[l] || l).join(" · ")}
                            </>
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
                          marginBottom: pitch.evidence?.length > 0 ? 8 : 0,
                        }}>
                          {pitch.thesis}
                        </div>
                        {/* Evidence sources — with interactive citations */}
                        {pitch.evidence && pitch.evidence.length > 0 && (
                          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
                            {pitch.evidence.slice(0, 2).map((e, ei) => (
                              <span key={ei}>
                                {ei > 0 && <span style={{ opacity: 0.4 }}> · </span>}
                                {renderCitedBody(
                                  e.length > 80 ? e.slice(0, 77) + "..." : e,
                                  pitch.evidenceSources?.[ei]
                                )}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Copy all */}
                <div style={{ padding: "20px 20px" }}>
                  <CopyButton
                    text={`# Weekly Dispatch\n${data.weekSummary || ""}\n\n${data.pitches.map((p, i) => `## ${i + 1}. ${p.title}\n**Thesis:** ${p.thesis}\n**Mode:** ${p.mode}\n**Brief:** ${p.brief}\n**Platform:** ${p.platforms.primary}\n**Urgency:** ${p.urgency}\n`).join("\n")}`}
                    label="Copy all pitches"
                  />
                </div>
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
