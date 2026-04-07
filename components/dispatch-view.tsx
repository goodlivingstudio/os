"use client"

import { useState, useEffect, useCallback } from "react"
import { Copy, Check, ArrowUpRight, X, RefreshCw, ChevronLeft, ChevronRight, Pen } from "lucide-react"
import { TYPE, MONO, labelStyle, metaStyle } from "@/lib/styles"
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
        ...TYPE.sm, cursor: "pointer", transition: "all 0.2s",
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
        padding: "20px 24px",
        cursor: "pointer",
        transition: "background 0.15s",
        animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${150 + index * 80}ms both`,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
    >
      {/* Layer dot + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: LAYER_DOT[perspective.layer] || "var(--text-tertiary)",
        }} />
        <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {LAYER_LABELS[perspective.layer] || perspective.layer}
        </span>
      </div>
      {/* Title */}
      <div style={{
        fontSize: 20,
        fontWeight: 400,
        fontFamily: "var(--font-grenette), Georgia, serif",
        color: "var(--text-primary)",
        lineHeight: 1.35,
        letterSpacing: "-0.01em",
        marginBottom: 8,
      }}>
        {perspective.title}
      </div>
      {/* Body with citations */}
      <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.7 }}>
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

        <div style={{ fontSize: 22, fontWeight: 400, fontFamily: "var(--font-grenette), Georgia, serif", color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.35, letterSpacing: "-0.01em" }}>{pitch.title}</div>
        <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: isConvergence(pitch) ? 12 : 24 }}>{pitch.thesis}</div>

        {/* Convergence callout */}
        {isConvergence(pitch) && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 24,
            padding: "10px 14px", borderRadius: 8, background: "var(--bg-elevated)",
          }}>
            <div style={{ display: "flex", gap: 3 }}>
              {pitch.layers.map(l => (
                <span key={l} style={{ width: 6, height: 6, borderRadius: "50%", background: LAYER_DOT[l] || "var(--text-tertiary)" }} />
              ))}
            </div>
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
          <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.7 }}>{pitch.brief}</div>
        </div>

        {pitch.angle && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Angle</div>
            <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.7 }}>{pitch.angle}</div>
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
            <div key={i} style={{ ...TYPE.body, color: "var(--text-secondary)", marginBottom: 6, lineHeight: 1.7 }}>
              {renderCitedBody(e, pitch.evidenceSources?.[i])}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Why Now</div>
          <div style={{ ...TYPE.body, color: "var(--accent-muted)", lineHeight: 1.7 }}>{pitch.urgency}</div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <CopyButton text={pitchMarkdown} label="Copy brief" />
          <CopyButton
            text={`---\ntype: dispatch-pitch\ndate: ${new Date().toISOString().slice(0, 10)}\nmode: ${pitch.mode}\nlayers: [${pitch.layers.join(", ")}]\nplatform: ${pitch.platforms.primary}\n---\n\n# ${pitch.title}\n\n**Thesis:** ${pitch.thesis}\n\n**Brief:** ${pitch.brief}\n\n${pitch.angle ? `**Angle:** ${pitch.angle}\n\n` : ""}**Evidence:**\n${pitch.evidence.map(e => `- ${e}`).join("\n")}\n\n**Urgency:** ${pitch.urgency}\n\n**Adaptations:**\n${pitch.platforms.adaptations.map(a => `- ${a}`).join("\n")}\n\n${pitch.wordCount ? `**Target:** ~${pitch.wordCount} words` : ""}`}
            label="Copy for Atlas"
          />
          <button
            onClick={() => { onDeliberate(`I want to develop this content pitch:\n\n"${pitch.title}"\n\nThesis: ${pitch.thesis}\n\nHelp me think through the argument structure, key points, and how to make it distinctive.`); onClose() }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text-secondary)", ...TYPE.sm, cursor: "pointer", transition: "all 0.15s" }}
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
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px solid var(--accent-secondary)", background: "rgba(184, 150, 106, 0.08)", color: "var(--accent-secondary)", ...TYPE.sm, cursor: "pointer", transition: "all 0.15s" }}
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
        <span style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--accent-muted)", textTransform: "uppercase" }}>
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

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ padding: "32px 20px" }}>
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
              padding: "36px 48px 32px",
              borderBottom: "1px solid var(--border)",
              textAlign: "center",
              animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}>
              {/* Eyebrow */}
              <div style={{
                ...TYPE.xs, color: "var(--text-tertiary)",
                textTransform: "uppercase", letterSpacing: "0.08em",
                marginBottom: 16,
              }}>
                New ideas and opportunities for week of {formatWeekRange(data.generatedAt)}
              </div>
              {/* Headline — Grenette Pro display serif, centered */}
              <div className="dispatch-headline" style={{
                fontSize: 34,
                fontWeight: 400,
                fontFamily: "var(--font-grenette), Georgia, serif",
                color: "var(--text-primary)",
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
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
                    {data.articleCount} articles · {new Date(data.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  {/* Week carousel dots with arrows */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, marginBottom: -4 }}>
                    <button
                      onClick={() => setWeekOffset(o => Math.max(o - 1, -6))}
                      style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: weekOffset <= -6 ? "var(--border)" : "var(--text-tertiary)", cursor: weekOffset <= -6 ? "default" : "pointer", borderRadius: 6, transition: "all 0.15s", padding: 0 }}
                      onMouseEnter={e => { if (weekOffset > -6) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-elevated)" } }}
                      onMouseLeave={e => { e.currentTarget.style.color = weekOffset <= -6 ? "var(--border)" : "var(--text-tertiary)"; e.currentTarget.style.background = "transparent" }}
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
                              width: isActive ? 20 : 6,
                              height: 6,
                              borderRadius: 3,
                              border: "none",
                              background: isActive ? "var(--accent-secondary)" : "var(--border)",
                              cursor: "pointer",
                              padding: 0,
                              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                              opacity: isActive ? 1 : 0.5,
                            }}
                          />
                        )
                      })}
                    </div>
                    <button
                      onClick={() => setWeekOffset(o => Math.min(o + 1, 0))}
                      style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", color: weekOffset >= 0 ? "var(--border)" : "var(--text-tertiary)", cursor: weekOffset >= 0 ? "default" : "pointer", borderRadius: 6, transition: "all 0.15s", padding: 0 }}
                      onMouseEnter={e => { if (weekOffset < 0) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-elevated)" } }}
                      onMouseLeave={e => { e.currentTarget.style.color = weekOffset >= 0 ? "var(--border)" : "var(--text-tertiary)"; e.currentTarget.style.background = "transparent" }}
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
                padding: "24px 20px",
                borderBottom: "1px solid var(--border)",
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

            {/* ─ PITCHES — editorial grid ─ */}
            {data.pitches && data.pitches.length > 0 && (
              <div style={{
                animation: "signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) 150ms both",
              }}>
                {data.pitches.map((pitch, i) => (
                  <div
                    key={i}
                    onClick={() => setActivePitch(pitch)}
                    style={{
                      padding: "28px 20px",
                      borderBottom: "1px solid var(--border)",
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
                          <img src={pitch.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      {/* Text content — right side */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Mode + platform + indicators */}
                        <div style={{
                          ...TYPE.xs, textTransform: "uppercase", letterSpacing: "0.06em",
                          fontWeight: 600, marginBottom: 8,
                          display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4,
                        }}>
                          <span style={{ color: pitch.mode === "thought_leadership" ? "#5A9EB0" : "#C87A6A" }}>
                            {pitch.mode === "thought_leadership" ? "Thought Leadership" : "Creative"}
                          </span>
                          <span style={{ color: "var(--text-tertiary)" }}>·</span>
                          <span style={{ color: "var(--text-primary)" }}>{pitch.platforms.primary}</span>
                          {countUniqueSources(pitch) > 0 && (
                            <>
                              <span style={{ color: "var(--text-tertiary)" }}>·</span>
                              <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>{countUniqueSources(pitch)} sources</span>
                            </>
                          )}
                          {isConvergence(pitch) && (
                            <>
                              <span style={{ color: "var(--text-tertiary)" }}>·</span>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                                {pitch.layers.slice(0, 4).map(l => (
                                  <span key={l} style={{ width: 5, height: 5, borderRadius: "50%", background: LAYER_DOT[l] || "var(--text-tertiary)", display: "inline-block" }} />
                                ))}
                              </span>
                            </>
                          )}
                          {pitch.wildcard && (
                            <span style={{
                              padding: "1px 6px", borderRadius: 8, fontSize: 9,
                              background: "rgba(184, 150, 106, 0.12)",
                              color: "var(--accent-secondary)",
                              fontWeight: 600, letterSpacing: "0.03em",
                            }}>
                              WILDCARD
                            </span>
                          )}
                          {pitchStatuses[pitchKey(pitch.title)] && (
                            <span style={{
                              padding: "1px 6px", borderRadius: 8, fontSize: 9,
                              background: `${STATUS_COLORS[pitchStatuses[pitchKey(pitch.title)]]}18`,
                              color: STATUS_COLORS[pitchStatuses[pitchKey(pitch.title)]],
                              textTransform: "capitalize", fontWeight: 500,
                            }}>
                              {pitchStatuses[pitchKey(pitch.title)]}
                            </span>
                          )}
                        </div>
                        {/* Title */}
                        <div style={{
                          fontSize: 18,
                          fontWeight: 400,
                          fontFamily: "var(--font-grenette), Georgia, serif",
                          color: "var(--text-primary)",
                          lineHeight: 1.35,
                          letterSpacing: "-0.01em",
                          marginBottom: 6,
                        }}>
                          {pitch.title}
                        </div>
                        {/* Thesis */}
                        <div style={{
                          ...TYPE.body,
                          color: "var(--text-secondary)",
                          lineHeight: 1.7,
                          marginBottom: pitch.evidence?.length > 0 ? 8 : 0,
                        }}>
                          {pitch.thesis}
                        </div>
                        {/* Evidence sources — with interactive citations */}
                        {pitch.evidence && pitch.evidence.length > 0 && (
                          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
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
            <div style={{ ...TYPE.body, color: "var(--text-tertiary)", lineHeight: 1.8 }}>
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
