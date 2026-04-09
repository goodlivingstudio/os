"use client"

import { useState, useEffect, useMemo } from "react"
import { RefreshCw, ChevronUp } from "lucide-react"
import { TYPE, MONO, metaStyle, labelStyle } from "@/lib/styles"
import instanceConfig, { storageKey } from "@/lib/config"
import type { Article, FeedHealth } from "@/lib/types"

// ─── Types ──────────────────────────────────────────────────────────────────

interface SourceStat {
  name: string
  count: number
  annotated: number
  live: boolean
  tag: string
  avgUrgency: number
  highestUrgency: number
  consecutiveFailures: number
}

interface LayerHealth {
  layer: string
  articleCount: number
  annotatedCount: number
  avgUrgency: number
  sources: number
}

interface PipelineStatus {
  totalArticles: number
  annotatedServer: number
  annotatedClient: number
  unannotated: number
  deduped: boolean
}

interface CacheStatus {
  annotationAge: string | null
  kvAvailable: boolean
  isrAge: string | null
}

const LAYER_LABELS: Record<string, string> = Object.fromEntries(
  instanceConfig.layers.map(l => [l.id, l.label])
)

const LAYER_COLOR: Record<string, string> = Object.fromEntries(
  instanceConfig.layers.map((l, i) => [l.id, ["#D4A05A", "#5A9EB0", "#7BAF6A", "#9A85B8", "#C87A6A"][i] || "#888"])
)

// ─── Metric Card ────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, color, width }: {
  label: string
  value: string | number
  sub?: string
  color?: string
  width?: string
}) {
  return (
    <div style={{
      background: "var(--bg-surface)", borderRadius: 12, padding: "14px 16px",
      flex: width || "1", minWidth: 0,
    }}>
      <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: color || "var(--text-primary)", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", marginTop: 4 }}>{sub}</div>
      )}
    </div>
  )
}

// ─── Layer Bar ──────────────────────────────────────────────────────────────

function LayerBar({ layer, health, maxArticles }: { layer: LayerHealth; health: number; maxArticles: number }) {
  const barWidth = maxArticles > 0 ? (layer.articleCount / maxArticles) * 100 : 0
  const annotationPct = layer.articleCount > 0 ? Math.round((layer.annotatedCount / layer.articleCount) * 100) : 0

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
      <div style={{ width: 80, flexShrink: 0 }}>
        <div style={{ ...TYPE.sm, color: LAYER_COLOR[layer.layer] || "var(--text-secondary)", fontWeight: 500 }}>
          {LAYER_LABELS[layer.layer] || layer.layer}
        </div>
      </div>
      {/* Count — left of bar */}
      <div style={{ width: 28, flexShrink: 0, textAlign: "right" }}>
        <span style={{ ...TYPE.sm, fontVariantNumeric: "tabular-nums", color: "var(--text-secondary)", fontWeight: 500 }}>
          {layer.articleCount}
        </span>
      </div>
      <div style={{ flex: 1, position: "relative", height: 16, background: "var(--bg-surface)", borderRadius: 4, overflow: "hidden" }}>
        {/* Article volume bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          width: `${barWidth}%`,
          background: LAYER_COLOR[layer.layer] || "var(--accent-muted)",
          opacity: 0.25,
          borderRadius: 4,
          transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
        {/* Annotated portion */}
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          width: `${barWidth * (annotationPct / 100)}%`,
          background: LAYER_COLOR[layer.layer] || "var(--accent-muted)",
          opacity: 0.5,
          borderRadius: 4,
          transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
      <div style={{ width: 50, flexShrink: 0, textAlign: "right" }}>
        <span style={{ ...TYPE.xs, fontFamily: MONO, color: annotationPct === 100 ? "var(--live)" : annotationPct > 50 ? "var(--text-tertiary)" : "#ef4444" }}>
          {annotationPct}%
        </span>
      </div>
      <div style={{ width: 40, flexShrink: 0, textAlign: "right" }}>
        <span style={{ ...TYPE.xs, fontFamily: MONO, color: layer.avgUrgency >= 7 ? "#D4A05A" : "var(--text-tertiary)" }}>
          u{layer.avgUrgency.toFixed(1)}
        </span>
      </div>
    </div>
  )
}

// ─── Source Row ──────────────────────────────────────────────────────────────

function SourceRow({ source }: { source: SourceStat }) {
  const isPersistentFailure = source.consecutiveFailures >= 5
  const isWarning = source.consecutiveFailures >= 2

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
      background: isPersistentFailure ? "rgba(239, 68, 68, 0.06)" : "transparent",
      borderRadius: isPersistentFailure ? 4 : 0,
      margin: isPersistentFailure ? "0 -4px" : 0,
      paddingLeft: isPersistentFailure ? 4 : 0,
      paddingRight: isPersistentFailure ? 4 : 0,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
        background: source.live ? "var(--live)" : "#ef4444",
      }} />
      <span style={{
        flex: 1, ...TYPE.sm, fontFamily: MONO,
        color: isPersistentFailure ? "#ef4444" : source.live ? "var(--text-secondary)" : "var(--text-tertiary)",
        opacity: source.live && !isPersistentFailure ? 1 : isPersistentFailure ? 0.9 : 0.5,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {source.name}
        {isWarning && (
          <span style={{
            ...TYPE.xs, fontFamily: MONO, marginLeft: 6,
            color: isPersistentFailure ? "#ef4444" : "#D4A05A",
            fontWeight: 600,
          }}>
            {source.consecutiveFailures}x
          </span>
        )}
      </span>
      <span style={{
        ...TYPE.xs, fontFamily: MONO, color: LAYER_COLOR[source.tag] || "var(--text-tertiary)",
        textTransform: "uppercase", width: 30, textAlign: "center",
      }}>
        {source.tag.slice(0, 3)}
      </span>
      <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)", width: 24, textAlign: "right" }}>
        {source.count}
      </span>
      <span style={{
        ...TYPE.xs, fontFamily: MONO, width: 28, textAlign: "right",
        color: source.annotated > 0 ? "var(--accent-muted)" : "var(--text-tertiary)",
        opacity: source.annotated > 0 ? 1 : 0.3,
      }}>
        {source.annotated > 0 ? `${source.annotated}` : "—"}
      </span>
      <span style={{
        ...TYPE.xs, fontFamily: MONO, width: 24, textAlign: "right",
        color: source.highestUrgency >= 8 ? "#D4A05A" : source.highestUrgency >= 6 ? "var(--text-tertiary)" : "var(--text-tertiary)",
        opacity: source.highestUrgency > 0 ? 1 : 0.3,
      }}>
        {source.highestUrgency > 0 ? source.highestUrgency : "—"}
      </span>
    </div>
  )
}

// ─── Cache Management ─────────────────────────────────────────────────────

function formatCacheAge(iso: string | null): string {
  if (!iso) return "no cache"
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function CacheManagement() {
  const [synthStatus, setSynthStatus] = useState<"idle" | "running" | "done" | "error">("idle")
  const [dispatchStatus, setDispatchStatus] = useState<"idle" | "running" | "done" | "error">("idle")
  const [purgeStatus, setPurgeStatus] = useState<"idle" | "running" | "done" | "error">("idle")
  const [cacheAges, setCacheAges] = useState<{ synthesis: string | null; dispatch: string | null }>({ synthesis: null, dispatch: null })

  useEffect(() => {
    fetch("/api/cache-status").then(r => r.json()).then(setCacheAges).catch(() => {})
  }, [synthStatus, dispatchStatus, purgeStatus]) // refetch after any action

  const purge = async (
    endpoint: string,
    setStatus: (s: "idle" | "running" | "done" | "error") => void,
    label: string,
  ) => {
    setStatus("running")
    try {
      const res = await fetch(endpoint, { method: "POST" })
      if (res.ok) setStatus("done")
      else setStatus("error")
    } catch { setStatus("error") }
    setTimeout(() => setStatus("idle"), 3000)
  }

  const actions = [
    {
      label: "Synthesis",
      desc: "Clear cache — regenerates on next visit",
      status: synthStatus,
      action: () => purge("/api/synthesis-purge", setSynthStatus, "Synthesis"),
      age: cacheAges.synthesis,
    },
    {
      label: "Dispatch",
      desc: "Clear cache — regenerates on next visit",
      status: dispatchStatus,
      action: () => purge("/api/dispatch-purge", setDispatchStatus, "Dispatch"),
      age: cacheAges.dispatch,
    },
    {
      label: "Purge Images",
      desc: "Clear all generated artwork",
      status: purgeStatus,
      action: () => purge("/api/purge-images", setPurgeStatus, "Purge"),
      age: null,
    },
  ]

  return (
    <div>
      <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 10 }}>
        Cache Management
      </div>
      <div className="cache-row" style={{ display: "flex", gap: 8 }}>
        {actions.map(a => (
          <button
            key={a.label}
            onClick={a.action}
            disabled={a.status === "running"}
            style={{
              flex: 1, background: "var(--bg-surface)", borderRadius: 8, padding: "14px 16px",
              border: "none", cursor: a.status === "running" ? "wait" : "pointer",
              display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (a.status !== "running") e.currentTarget.style.background = "var(--bg-elevated)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
              <RefreshCw
                size={10}
                style={{
                  color: a.status === "done" ? "var(--live)" : a.status === "error" ? "var(--text-tertiary)" : "var(--text-tertiary)",
                  animation: a.status === "running" ? "spin 1s linear infinite" : "none",
                }}
              />
              <span style={{
                ...TYPE.sm, fontFamily: MONO,
                color: a.status === "done" ? "var(--live)" : a.status === "error" ? "#D4A05A" : "var(--text-secondary)",
              }}>
                {a.label}
              </span>
            </div>
            <span style={{ ...TYPE.xs, color: a.status === "error" ? "#D4A05A" : "var(--text-tertiary)", textAlign: "left" }}>
              {a.status === "running" ? "Working..." : a.status === "done" ? "Done" : a.status === "error" ? "Issue — try again" : a.desc}
            </span>
            {a.status === "idle" && (
              <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)", opacity: 0.6, marginTop: 2 }}>
                {formatCacheAge(a.age)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Sparkline ─────────────────────────────────────────────────────────────

function Sparkline({ values, width = 200, height = 40 }: { values: number[]; width?: number; height?: number }) {
  if (values.length < 2) return null
  const max = Math.max(...values, 0.001)
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - (v / max) * (height - 4) - 2
    return `${x},${y}`
  }).join(" ")
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-muted)" stopOpacity={0.15} />
          <stop offset="100%" stopColor="var(--accent-muted)" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#spark-fill)"
      />
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent-muted)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Usage Panel (live) ────────────────────────────────────────────────────

interface UsageData {
  today: {
    date: string
    totalCost: number
    totalInputTokens: number
    totalOutputTokens: number
    totalImages: number
    callCount: number
    byEndpoint: Record<string, { calls: number; inputTokens: number; outputTokens: number; imageCount: number; cost: number }>
    byProvider: Record<string, { calls: number; cost: number }>
    byModel: Record<string, { calls: number; inputTokens: number; outputTokens: number; cost: number }>
  }
  recentEvents: { ts: string; endpoint: string; provider: string; model: string; inputTokens?: number; outputTokens?: number; imageCount?: number; cost: number }[]
  dailyHistory?: { date: string; totalCost: number; callCount: number; totalInputTokens: number; totalOutputTokens: number; totalImages: number }[]
}

const MODEL_LABELS: Record<string, string> = {
  "claude-haiku-4-5-20251001": "Haiku",
  "claude-sonnet-4-20250514": "Sonnet",
  "flux-schnell": "Flux",
}

const ENDPOINT_LABELS: Record<string, string> = {
  "news-annotate": "Annotation (ISR)",
  "annotate": "Annotation (client)",
  "brief": "DCOS Brief",
  "audio-brief": "Audio Brief",
  "chat": "Cerebro",
  "synthesis": "Synthesis",
  "dispatch": "Dispatch",
  "image-gen": "Image gen",
}

function formatTokens(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return String(n)
}

function UsagePanel() {
  const [data, setData] = useState<UsageData | null>(null)
  const [range, setRange] = useState<"today" | "7d" | "30d">("today")
  const [recentExpanded, setRecentExpanded] = useState(false)

  useEffect(() => {
    fetch(`/api/usage?range=${range}`).then(r => r.json()).then(setData).catch(() => {})
  }, [range])

  // Auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(() => {
      fetch(`/api/usage?range=${range}`).then(r => r.json()).then(setData).catch(() => {})
    }, 60000)
    return () => clearInterval(id)
  }, [range])

  const today = data?.today
  const periodCost = data?.dailyHistory
    ? data.dailyHistory.reduce((sum, d) => sum + d.totalCost, 0) + (today?.totalCost || 0)
    : today?.totalCost || 0
  // Project monthly cost from whatever period we have
  const periodDays = range === "today" ? 1 : range === "7d" ? Math.max(1, (data?.dailyHistory?.length || 0) + 1) : Math.max(1, (data?.dailyHistory?.length || 0) + 1)
  const monthlyProjection = (periodCost / periodDays) * 30
  const isHealthy = monthlyProjection < 40
  const isWarning = monthlyProjection >= 40 && monthlyProjection < 80
  const costColor = isHealthy ? "var(--live)" : isWarning ? "#D4A05A" : "#ef4444"

  // Endpoint breakdown — always show all endpoints, active ones sorted by cost desc
  const ALL_ENDPOINTS = ["news-annotate", "annotate", "brief", "audio-brief", "chat", "synthesis", "dispatch", "image-gen"] as const
  const ENDPOINT_MODELS: Record<string, string> = {
    "news-annotate": "claude-haiku-4-5-20251001", "annotate": "claude-haiku-4-5-20251001",
    "brief": "claude-haiku-4-5-20251001", "audio-brief": "claude-haiku-4-5-20251001",
    "chat": "claude-sonnet-4-20250514", "synthesis": "claude-haiku-4-5-20251001",
    "dispatch": "claude-sonnet-4-20250514", "image-gen": "flux-schnell",
  }
  const emptyStats = { calls: 0, inputTokens: 0, outputTokens: 0, imageCount: 0, cost: 0 }
  const endpoints: [string, typeof emptyStats][] = ALL_ENDPOINTS.map(ep =>
    [ep, today?.byEndpoint?.[ep] || emptyStats] as [string, typeof emptyStats]
  ).sort(([, a], [, b]) => b.cost - a.cost)

  // Sparkline data: daily history + today
  const sparkValues = data?.dailyHistory
    ? [...data.dailyHistory.map(d => d.totalCost), today?.totalCost || 0]
    : []

  const ranges: ("today" | "7d" | "30d")[] = ["today", "7d", "30d"]

  return (
    <div>
      <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 10 }}>
        API Usage
      </div>

      {/* Range toggle */}
      <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: "3px 10px", borderRadius: 4, border: "none",
              background: range === r ? "var(--bg-elevated)" : "transparent",
              ...TYPE.xs, fontFamily: MONO, color: range === r ? "var(--text-primary)" : "var(--text-tertiary)",
              cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <MetricCard label="Today" value={`$${(today?.totalCost || 0).toFixed(3)}`} color={costColor} />
        <MetricCard
          label="Projected/mo"
          value={`$${monthlyProjection.toFixed(2)}`}
          color={costColor}
          sub={!isHealthy ? (isWarning ? "WATCH" : "HIGH") : undefined}
        />
        <MetricCard label="Calls" value={today?.callCount || 0} />
        <MetricCard label="Tokens" value={formatTokens((today?.totalInputTokens || 0) + (today?.totalOutputTokens || 0))} />
      </div>

      <div style={{ background: "var(--bg-surface)", borderRadius: 12, padding: "16px 18px" }}>
        {/* Endpoint breakdown */}
        {endpoints.length > 0 && (
          <>
            {endpoints.map(([ep, stats]) => {
              const model = ENDPOINT_MODELS[ep] || ""
              const inactive = stats.calls === 0
              return (
                <div key={ep} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", opacity: inactive ? 0.4 : 1 }}>
                  <span style={{ flex: 1, ...TYPE.sm, fontFamily: MONO, color: "var(--text-secondary)" }}>
                    {ENDPOINT_LABELS[ep] || ep}
                  </span>
                  <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", width: 24, textAlign: "right" }}>
                    {stats.calls > 0 ? `${stats.calls}x` : "—"}
                  </span>
                  <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", width: 44 }}>
                    {MODEL_LABELS[model] || "—"}
                  </span>
                  <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)", width: 54, textAlign: "right" }}>
                    {stats.cost > 0 ? `$${stats.cost.toFixed(4)}` : "—"}
                  </span>
                </div>
              )
            })}
          </>
        )}

        {/* Provider split */}
        {today?.byProvider && Object.keys(today.byProvider).length > 0 && (
          <>
            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <div style={{ display: "flex", gap: 12 }}>
              {Object.entries(today.byProvider).map(([provider, stats]) => {
                const pct = today.totalCost > 0 ? Math.round((stats.cost / today.totalCost) * 100) : 0
                return (
                  <span key={provider} style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
                    {provider === "anthropic" ? "Anthropic" : "Replicate"} {pct}%
                  </span>
                )
              })}
            </div>
          </>
        )}

        {/* Sparkline for 7d/30d */}
        {sparkValues.length > 1 && (
          <>
            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Daily Cost
            </div>
            <Sparkline values={sparkValues} width={280} height={36} />
          </>
        )}

        {/* Live event feed — collapsible */}
        {data?.recentEvents && data.recentEvents.length > 0 && (
          <>
            <div style={{ height: 1, background: "var(--border)", margin: "10px 0" }} />
            <button
              onClick={() => setRecentExpanded(e => !e)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                background: "none", border: "none", cursor: "pointer", padding: "2px 0", marginBottom: recentExpanded ? 6 : 0,
              }}
            >
              <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Recent
                <span style={{ marginLeft: 6, opacity: 0.5 }}>{data.recentEvents.length}</span>
              </span>
              <ChevronUp size={12} strokeWidth={1.5} style={{
                color: "var(--text-tertiary)",
                transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: recentExpanded ? "rotate(0)" : "rotate(180deg)",
              }} />
            </button>
            <div style={{ maxHeight: recentExpanded ? 400 : 0, overflow: "hidden", transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              {data.recentEvents.map((event, i) => {
                const ago = Math.round((Date.now() - new Date(event.ts).getTime()) / 60000)
                const timeLabel = ago < 1 ? "now" : ago < 60 ? `${ago}m` : `${Math.round(ago / 60)}h`
                const tokens = (event.inputTokens || 0) + (event.outputTokens || 0)
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 0" }}>
                    <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)", width: 28, flexShrink: 0 }}>
                      {timeLabel}
                    </span>
                    <span style={{ flex: 1, ...TYPE.xs, fontFamily: MONO, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ENDPOINT_LABELS[event.endpoint] || event.endpoint}
                    </span>
                    <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)", width: 40, textAlign: "right" }}>
                      {event.imageCount ? `${event.imageCount} img` : tokens > 0 ? formatTokens(tokens) : "—"}
                    </span>
                    <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)", width: 46, textAlign: "right" }}>
                      ${event.cost.toFixed(4)}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}

        <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />
        <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.6 }}>
          Self-tracked · refreshes every 60s
        </div>
      </div>
    </div>
  )
}

// ─── Source Pulse View ──────────────────────────────────────────────────────

export function SourcePulseView({ articles, feedHealth, fetchedAt }: {
  articles: Article[]
  feedHealth: FeedHealth | null
  fetchedAt: string | null
}) {
  const [health, setHealth] = useState<Record<string, unknown> | null>(null)
  const [healthLoading, setHealthLoading] = useState(false)
  const [now, setNow] = useState(Date.now())

  // Live clock tick for freshness indicators
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000)
    return () => clearInterval(id)
  }, [])

  const fetchDiagnostics = () => {
    setHealthLoading(true)
    fetch("/api/health")
      .then(r => r.json())
      .then(data => { setHealth(data); setHealthLoading(false) })
      .catch(() => setHealthLoading(false))
  }

  useEffect(() => { fetchDiagnostics() }, [])

  // ── Derived metrics ─────────────────────────────────────────────────────

  const failures = feedHealth?.sourceFailures || {}

  const sourceStats = useMemo((): SourceStat[] => {
    const map: Record<string, SourceStat> = {}
    articles.forEach(a => {
      if (!map[a.source]) map[a.source] = { name: a.source, count: 0, annotated: 0, live: a.url !== "#", tag: a.tag, avgUrgency: 0, highestUrgency: 0, consecutiveFailures: 0 }
      map[a.source].count++
      if (a.synopsis || a.relevance) map[a.source].annotated++
      const u = a.signalScores?.urgency ?? 0
      map[a.source].avgUrgency += u
      if (u > map[a.source].highestUrgency) map[a.source].highestUrgency = u
    })
    // Merge failure counts from KV
    for (const [name, count] of Object.entries(failures)) {
      if (map[name]) map[name].consecutiveFailures = count
    }
    return Object.values(map)
      .map(s => ({ ...s, avgUrgency: s.count > 0 ? s.avgUrgency / s.count : 0 }))
      .sort((a, b) => {
        // Primary: highest urgency first (10 → 1 → 0/unannotated)
        if (b.highestUrgency !== a.highestUrgency) return b.highestUrgency - a.highestUrgency
        // Secondary: article count
        return b.count - a.count
      })
  }, [articles, failures])

  const layerHealth = useMemo((): LayerHealth[] => {
    const layers = instanceConfig.layers.map(l => l.id)
    return layers.map(layer => {
      const layerArticles = articles.filter(a => a.tag === layer)
      const annotated = layerArticles.filter(a => a.synopsis || a.relevance)
      const urgencies = layerArticles.map(a => a.signalScores?.urgency ?? 0)
      const avgUrgency = urgencies.length > 0 ? urgencies.reduce((s, v) => s + v, 0) / urgencies.length : 0
      const sources = new Set(layerArticles.map(a => a.source)).size
      return { layer, articleCount: layerArticles.length, annotatedCount: annotated.length, avgUrgency, sources }
    })
  }, [articles])

  const pipeline = useMemo((): PipelineStatus => {
    const annotated = articles.filter(a => a.synopsis || a.relevance)
    return {
      totalArticles: articles.length,
      annotatedServer: annotated.filter(a => a.signalScores !== undefined).length,
      annotatedClient: annotated.filter(a => a.signalScores === undefined).length,
      unannotated: articles.length - annotated.length,
      deduped: true,
    }
  }, [articles])

  const cache = useMemo((): CacheStatus => {
    let annotationAge: string | null = null
    try {
      const raw = localStorage.getItem(storageKey("annotations-v3"))
      if (raw) {
        const { ts } = JSON.parse(raw)
        const mins = Math.round((now - ts) / 60000)
        annotationAge = mins < 60 ? `${mins}m` : `${Math.round(mins / 60)}h`
      }
    } catch { /* */ }

    return {
      annotationAge,
      kvAvailable: !!(health?.env && typeof health.env === "object" && (health.env as Record<string, string>).KV_REST_API_URL?.startsWith("set")),
      isrAge: fetchedAt ? `${Math.round((now - new Date(fetchedAt).getTime()) / 60000)}m` : null,
    }
  }, [now, health, fetchedAt])

  const totalSources = feedHealth?.sourcesTotal ?? sourceStats.length
  const liveSources = feedHealth?.sourcesLive ?? sourceStats.filter(s => s.live).length
  const failedSources = feedHealth?.sourcesFailed ?? sourceStats.filter(s => !s.live).length
  const healthPct = totalSources > 0 ? Math.round((liveSources / totalSources) * 100) : 0
  const maxLayerArticles = Math.max(...layerHealth.map(l => l.articleCount), 1)
  const annotationPct = pipeline.totalArticles > 0 ? Math.round(((pipeline.annotatedServer + pipeline.annotatedClient) / pipeline.totalArticles) * 100) : 0

  const overallColor = healthPct >= 90 ? "var(--live)" : healthPct >= 70 ? "#D4A05A" : "#ef4444"

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-primary)" }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, height: 40, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ ...TYPE.sm, color: "var(--accent-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Source Pulse
          </span>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: overallColor,
          }} />
          <span style={{ ...TYPE.xs, fontFamily: MONO, color: overallColor }}>{healthPct}%</span>
        </div>
        <button
          onClick={fetchDiagnostics}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 10px", borderRadius: 6,
            border: "1px solid var(--border)", background: "transparent",
            ...metaStyle, cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
        >
          <RefreshCw size={11} style={{ animation: healthLoading ? "spin 1s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      <div className="view-padding" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ── Top metrics row ── */}
          <div className="metric-row" style={{ display: "flex", gap: 8 }}>
            <MetricCard label="Sources" value={`${liveSources}/${totalSources}`} sub={failedSources > 0 ? `${failedSources} failed` : "all healthy"} color={failedSources > 0 ? "#D4A05A" : "var(--live)"} />
            <MetricCard label="Articles" value={pipeline.totalArticles} sub={`${sourceStats.length} sources reporting`} />
            <MetricCard label="Annotated" value={`${annotationPct}%`} sub={`${pipeline.annotatedServer} server · ${pipeline.annotatedClient} client`} color={annotationPct >= 80 ? "var(--live)" : annotationPct >= 50 ? "#D4A05A" : "#ef4444"} />
            <MetricCard label="ISR Cache" value={cache.isrAge || "—"} sub={cache.annotationAge ? `annotations: ${cache.annotationAge}` : "no cache"} />
          </div>

          {/* ── API Status ── */}
          <div>
            <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 10 }}>
              API Connections
            </div>
            <div className="api-row" style={{ display: "flex", gap: 8 }}>
              {[
                { name: "Anthropic", key: "anthropic" },
                { name: "Exa Search", key: "exa" },
                { name: "KV Memory", key: "kv" },
                { name: "Are.na", key: "arena" },
                { name: "Replicate", key: "replicate" },
              ].map(api => {
                const status = health ? (health as Record<string, string>)[api.key] : null
                const ok = status === null ? null : status === "ok" ? true : status === "no key" ? false : false
                return (
                  <div key={api.name} style={{
                    flex: 1, background: "var(--bg-surface)", borderRadius: 8, padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span
                      className={ok ? "live-beacon" : undefined}
                      style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: ok === null ? "var(--text-tertiary)" : ok ? "var(--live)" : "#ef4444",
                      }}
                    />
                    <span style={{ ...TYPE.sm, fontFamily: MONO, color: ok === null ? "var(--text-tertiary)" : ok ? "var(--text-secondary)" : "#ef4444" }}>
                      {api.name}
                    </span>
                    {status && status !== "ok" && status !== "no key" && (
                      <span style={{ ...TYPE.xs, color: "#ef4444", opacity: 0.7, marginLeft: "auto" }} title={status}>!</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Cache Management ── */}
          <CacheManagement />

          {/* ── Layer Coverage ── */}
          <div>
            <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 10 }}>
              Layer Coverage
            </div>
            <div style={{ background: "var(--bg-surface)", borderRadius: 12, padding: "10px 14px" }}>
              {/* Column headers — match LayerBar layout */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <div style={{ width: 80, flexShrink: 0 }} />
                <div style={{ width: 28, flexShrink: 0, textAlign: "right" }}>
                  <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>vol</span>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ width: 50, flexShrink: 0, textAlign: "right" }}>
                  <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>annot.</span>
                </div>
                <div style={{ width: 40, flexShrink: 0, textAlign: "right" }}>
                  <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>urg.</span>
                </div>
              </div>
              {layerHealth.map(lh => (
                <LayerBar key={lh.layer} layer={lh} health={0} maxArticles={maxLayerArticles} />
              ))}
            </div>
          </div>

          {/* ── Intelligence Layers (reference) ── */}
          <div>
            <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 10 }}>
              Intelligence Layers
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {instanceConfig.layers.map((l) => {
                // First sentence as the short description
                const shortDesc = l.description.split(". ")[0]
                // High scores examples (after "High scores:")
                const highScores = l.description.split("High scores: ")[1] || ""
                return (
                  <div key={l.id} style={{
                    background: "var(--bg-surface)", borderRadius: 10, padding: "14px 16px",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 3, background: "var(--accent-secondary)", flexShrink: 0 }} />
                      <span style={{ ...TYPE.body, color: "var(--text-primary)", fontWeight: 500 }}>{l.label}</span>
                    </div>
                    <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.6, paddingLeft: 16 }}>
                      {shortDesc}.
                    </div>
                    {highScores && (
                      <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", lineHeight: 1.5, paddingLeft: 16, marginTop: 6 }}>
                        {highScores.charAt(0).toUpperCase() + highScores.slice(1).replace(/, ([A-Z])(?![A-Z])/g, (_, l) => `, ${l.toLowerCase()}`)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Annotation Pipeline ── */}
          <div>
            <div style={{ ...labelStyle, letterSpacing: "0.04em", marginBottom: 10 }}>
              Annotation Pipeline
            </div>
            <div style={{ background: "var(--bg-surface)", borderRadius: 12, padding: "16px 18px" }}>
              {/* Pipeline bar */}
              <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: "var(--bg-elevated)", marginBottom: 12 }}>
                {pipeline.annotatedServer > 0 && (
                  <div style={{ width: `${(pipeline.annotatedServer / pipeline.totalArticles) * 100}%`, background: "var(--live)", transition: "width 0.6s" }} title={`Server: ${pipeline.annotatedServer}`} />
                )}
                {pipeline.annotatedClient > 0 && (
                  <div style={{ width: `${(pipeline.annotatedClient / pipeline.totalArticles) * 100}%`, background: "#D4A05A", transition: "width 0.6s" }} title={`Client: ${pipeline.annotatedClient}`} />
                )}
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--live)" }} />
                  <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-secondary)" }}>Server ISR ({pipeline.annotatedServer})</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "#D4A05A" }} />
                  <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-secondary)" }}>Client fallback ({pipeline.annotatedClient})</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--bg-elevated)" }} />
                  <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)" }}>Unannotated ({pipeline.unannotated})</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Source Grid ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ ...labelStyle, letterSpacing: "0.04em" }}>
                Source Grid
                <span style={{ color: "var(--text-tertiary)", marginLeft: 8, fontWeight: 400 }}>
                  {sourceStats.length} sources
                </span>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", fontFamily: MONO }}>layer</span>
                <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", fontFamily: MONO, width: 24, textAlign: "right" }}>qty</span>
                <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", fontFamily: MONO, width: 28, textAlign: "right" }}>ann</span>
                <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", fontFamily: MONO, width: 24, textAlign: "right" }}>urg</span>
              </div>
            </div>
            <div style={{ background: "var(--bg-surface)", borderRadius: 12, padding: "10px 14px" }}>
              {sourceStats.map(source => (
                <SourceRow key={source.name} source={source} />
              ))}
            </div>
          </div>

          {/* ── API Usage (live) ── */}
          <UsagePanel />

          {/* ── Stub Fallback ── */}
          {feedHealth?.stubCategories && feedHealth.stubCategories.length > 0 && (
            <div style={{
              background: "rgba(239, 68, 68, 0.08)", borderRadius: 12, padding: "12px 16px",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}>
              <div style={{ ...TYPE.xs, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                Stub Fallback Active
              </div>
              <div style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--text-secondary)" }}>
                Layers on curated stubs: {feedHealth.stubCategories.join(", ")}
              </div>
            </div>
          )}

          <div style={{ height: 24 }} />
        </div>
      </div>
    </main>
  )
}
