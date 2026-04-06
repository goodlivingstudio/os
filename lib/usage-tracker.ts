// ─── API Usage Tracking — self-instrumented cost monitoring ─────────────────
// Every Anthropic/Replicate call logs actual token usage to Vercel KV.
// Data flows: trackUsage() → KV events → /api/usage → Source Pulse panel.
//
// Three tiers:
//   events   (3-day TTL)  — granular per-call records
//   daily    (90-day TTL) — aggregated rollups, computed lazily
//   monthly  (365-day TTL) — summed from daily rollups on demand

import { kv } from "@vercel/kv"

const KV_AVAILABLE = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)

// ─── Pricing (per token / per image) ────────────────────────────────────────

const PRICING: Record<string, { input: number; output: number }> = {
  "claude-haiku-4-5-20251001":  { input: 1.00 / 1e6, output: 5.00 / 1e6 },
  "claude-sonnet-4-20250514":   { input: 3.00 / 1e6, output: 15.00 / 1e6 },
}
const REPLICATE_COST_PER_IMAGE = 0.003

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UsageEvent {
  ts: string
  endpoint: string
  provider: "anthropic" | "replicate"
  model: string
  inputTokens?: number
  outputTokens?: number
  imageCount?: number
  cost: number
  durationMs?: number
}

export interface EndpointSummary {
  calls: number
  inputTokens: number
  outputTokens: number
  imageCount: number
  cost: number
}

export interface DailyRollup {
  date: string
  totalCost: number
  totalInputTokens: number
  totalOutputTokens: number
  totalImages: number
  callCount: number
  byEndpoint: Record<string, EndpointSummary>
  byProvider: Record<string, { calls: number; cost: number }>
  byModel: Record<string, { calls: number; inputTokens: number; outputTokens: number; cost: number }>
}

// ─── Keys ───────────────────────────────────────────────────────────────────

const EVENTS_TTL  = 3 * 24 * 60 * 60   // 3 days
const DAILY_TTL   = 90 * 24 * 60 * 60  // 90 days
const MAX_EVENTS  = 500                  // cap per day

function eventsKey(date?: string): string {
  return `usage:events:${date || new Date().toISOString().slice(0, 10)}`
}
function dailyKey(date: string): string {
  return `usage:daily:${date}`
}

// ─── Core: track a single API call ──────────────────────────────────────────

export function computeCost(
  provider: "anthropic" | "replicate",
  model: string,
  inputTokens?: number,
  outputTokens?: number,
  imageCount?: number,
): number {
  if (provider === "replicate") {
    return (imageCount || 0) * REPLICATE_COST_PER_IMAGE
  }
  const pricing = PRICING[model]
  if (!pricing) return 0
  return (inputTokens || 0) * pricing.input + (outputTokens || 0) * pricing.output
}

/**
 * Log a single API usage event. Fire-and-forget — never throws, never blocks.
 * NOTE: Uses read-append-write on KV which is not atomic. Under concurrent API
 * calls (e.g., annotation + brief firing simultaneously), one event may be dropped.
 * Acceptable for a single-user tool — the cost tracking is approximate, not billing-grade.
 */
export async function trackUsage(event: Omit<UsageEvent, "ts" | "cost"> & { cost?: number }): Promise<void> {
  if (!KV_AVAILABLE) return
  try {
    const cost = event.cost ?? computeCost(event.provider, event.model, event.inputTokens, event.outputTokens, event.imageCount)
    const record: UsageEvent = {
      ts: new Date().toISOString(),
      endpoint: event.endpoint,
      provider: event.provider,
      model: event.model,
      inputTokens: event.inputTokens,
      outputTokens: event.outputTokens,
      imageCount: event.imageCount,
      cost,
      durationMs: event.durationMs,
    }

    const key = eventsKey()
    const existing = await kv.get<UsageEvent[]>(key) || []
    // Cap at MAX_EVENTS — drop oldest if exceeded
    if (existing.length >= MAX_EVENTS) existing.splice(0, existing.length - MAX_EVENTS + 1)
    existing.push(record)
    await kv.set(key, existing, { ex: EVENTS_TTL })

    // Lazy rollup: if yesterday's events exist but no rollup, compute it
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yStr = yesterday.toISOString().slice(0, 10)
    const yDailyKey = dailyKey(yStr)
    const hasRollup = await kv.exists(yDailyKey)
    if (!hasRollup) {
      const yEvents = await kv.get<UsageEvent[]>(eventsKey(yStr))
      if (yEvents && yEvents.length > 0) {
        const rollup = buildRollup(yStr, yEvents)
        await kv.set(yDailyKey, rollup, { ex: DAILY_TTL })
      }
    }
  } catch {
    // never break the calling route
  }
}

// ─── Rollup builder ─────────────────────────────────────────────────────────

function buildRollup(date: string, events: UsageEvent[]): DailyRollup {
  const rollup: DailyRollup = {
    date,
    totalCost: 0,
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalImages: 0,
    callCount: events.length,
    byEndpoint: {},
    byProvider: {},
    byModel: {},
  }

  for (const e of events) {
    rollup.totalCost += e.cost
    rollup.totalInputTokens += e.inputTokens || 0
    rollup.totalOutputTokens += e.outputTokens || 0
    rollup.totalImages += e.imageCount || 0

    // By endpoint
    if (!rollup.byEndpoint[e.endpoint]) {
      rollup.byEndpoint[e.endpoint] = { calls: 0, inputTokens: 0, outputTokens: 0, imageCount: 0, cost: 0 }
    }
    const ep = rollup.byEndpoint[e.endpoint]
    ep.calls++
    ep.inputTokens += e.inputTokens || 0
    ep.outputTokens += e.outputTokens || 0
    ep.imageCount += e.imageCount || 0
    ep.cost += e.cost

    // By provider
    if (!rollup.byProvider[e.provider]) rollup.byProvider[e.provider] = { calls: 0, cost: 0 }
    rollup.byProvider[e.provider].calls++
    rollup.byProvider[e.provider].cost += e.cost

    // By model
    if (!rollup.byModel[e.model]) rollup.byModel[e.model] = { calls: 0, inputTokens: 0, outputTokens: 0, cost: 0 }
    const m = rollup.byModel[e.model]
    m.calls++
    m.inputTokens += e.inputTokens || 0
    m.outputTokens += e.outputTokens || 0
    m.cost += e.cost
  }

  return rollup
}

// ─── Query functions (used by /api/usage) ───────────────────────────────────

/**
 * Get today's events and computed summary.
 */
export async function getTodayUsage(): Promise<{ events: UsageEvent[]; summary: DailyRollup }> {
  if (!KV_AVAILABLE) return { events: [], summary: emptyRollup(today()) }
  try {
    const events = await kv.get<UsageEvent[]>(eventsKey()) || []
    return { events, summary: buildRollup(today(), events) }
  } catch {
    return { events: [], summary: emptyRollup(today()) }
  }
}

/**
 * Get daily rollups for the last N days (excludes today — today comes from live events).
 */
export async function getDailyRollups(days: number): Promise<DailyRollup[]> {
  if (!KV_AVAILABLE) return []
  try {
    const rollups: DailyRollup[] = []
    for (let i = 1; i <= days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      // Try rollup first, fall back to computing from events
      let rollup = await kv.get<DailyRollup>(dailyKey(dateStr))
      if (!rollup) {
        const events = await kv.get<UsageEvent[]>(eventsKey(dateStr))
        if (events && events.length > 0) {
          rollup = buildRollup(dateStr, events)
          await kv.set(dailyKey(dateStr), rollup, { ex: DAILY_TTL })
        }
      }
      if (rollup) rollups.push(rollup)
    }
    return rollups.sort((a, b) => a.date.localeCompare(b.date))
  } catch {
    return []
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptyRollup(date: string): DailyRollup {
  return {
    date, totalCost: 0, totalInputTokens: 0, totalOutputTokens: 0,
    totalImages: 0, callCount: 0, byEndpoint: {}, byProvider: {}, byModel: {},
  }
}
