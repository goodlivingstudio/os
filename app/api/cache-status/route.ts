// Returns TTL / age info for cached surfaces
import { kv } from "@vercel/kv"

function getWeekKey(): string {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const weekNum = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
  return `dispatch:weekly:${now.getFullYear()}-w${weekNum}`
}

export async function GET() {
  if (!process.env.KV_REST_API_URL) {
    return Response.json({ synthesis: null, dispatch: null, colorIntelligence: null })
  }

  try {
    const [synthTTL, dispatchTTL, colorTTL] = await Promise.all([
      kv.ttl("synthesis:weekly"),
      kv.ttl(getWeekKey()),
      kv.ttl("color-intelligence:weekly"),
    ])

    // Convert TTL (seconds remaining) to approximate "last refreshed" timestamp
    const ttlToAge = (ttl: number, maxTTL: number) => {
      if (ttl <= 0) return null // key missing or no expiry
      const ageSeconds = maxTTL - ttl
      return new Date(Date.now() - ageSeconds * 1000).toISOString()
    }

    return Response.json({
      synthesis: ttlToAge(synthTTL, 60 * 60 * 12),         // 12-hour TTL
      dispatch: ttlToAge(dispatchTTL, 60 * 60 * 24 * 7),   // 7-day TTL
      colorIntelligence: ttlToAge(colorTTL, 60 * 60 * 12), // 12-hour TTL
    })
  } catch {
    return Response.json({ synthesis: null, dispatch: null, colorIntelligence: null })
  }
}
