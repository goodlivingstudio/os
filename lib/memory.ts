// ─── Cerebro Memory — Vercel KV ──────────────────────────────────────────────
// Persists conversation threads across sessions.
// Gracefully no-ops when KV_REST_API_URL is not configured.
//
// Setup (one-time):
//   1. Vercel Dashboard → Storage → Create KV Database → name: "dispatch-memory"
//   2. Link to your Dispatch project — Vercel auto-injects KV_REST_API_URL + KV_REST_API_TOKEN
//   3. Redeploy

import { kv } from "@vercel/kv"
import { kvKey } from "@/lib/config"

export interface StoredMessage {
  role: "user" | "assistant"
  content: string
}

const KV_AVAILABLE = !!(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
)

// Max messages to persist per session — keeps storage and token count bounded
const MAX_STORED = 30

// TTL: 30 days in seconds — conversation threads expire after a month of inactivity
const TTL_SECONDS = 30 * 24 * 60 * 60

function sessionKey(sessionId: string) {
  return kvKey(`cerebro:${sessionId}`)
}

/**
 * Load stored messages for a session.
 * Returns [] if KV is not configured or session doesn't exist.
 */
export async function loadHistory(sessionId: string): Promise<StoredMessage[]> {
  if (!KV_AVAILABLE || !sessionId) return []
  try {
    const stored = await kv.get<StoredMessage[]>(sessionKey(sessionId))
    return Array.isArray(stored) ? stored : []
  } catch {
    return [] // never break the chat on memory failure
  }
}

/**
 * Persist the current message thread for a session.
 * Trims to MAX_STORED most recent messages.
 */
export async function saveHistory(
  sessionId: string,
  messages: StoredMessage[]
): Promise<void> {
  if (!KV_AVAILABLE || !sessionId) return
  try {
    const trimmed = messages.slice(-MAX_STORED)
    await kv.set(sessionKey(sessionId), trimmed, { ex: TTL_SECONDS })
  } catch {
    // never break the chat on memory failure
  }
}

/**
 * Clear a session's history (for future /reset or /forget commands).
 */
export async function clearHistory(sessionId: string): Promise<void> {
  if (!KV_AVAILABLE || !sessionId) return
  try {
    await kv.del(sessionKey(sessionId))
  } catch {
    // no-op
  }
}

export { KV_AVAILABLE }
