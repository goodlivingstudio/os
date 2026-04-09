// Returns TTL / age info for cached surfaces
import { kv } from "@vercel/kv"
import { kvKey } from "@/lib/config"

function getWeekKey(): string {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const weekNum = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7)
  return kvKey(`weekly:${now.getFullYear()}-w${weekNum}`)
}

export async function GET() {
  if (!process.env.KV_REST_API_URL) {
    return Response.json({ synthesis: null, dispatch: null })
  }

  try {
    const [synthTTL, dispatchTTL] = await Promise.all([
      kv.ttl(kvKey("synthesis:weekly")),
      kv.ttl(getWeekKey()),
    ])

    const ttlToAge = (ttl: number, maxTTL: number) => {
      if (ttl <= 0) return null
      const ageSeconds = maxTTL - ttl
      return new Date(Date.now() - ageSeconds * 1000).toISOString()
    }

    return Response.json({
      synthesis: ttlToAge(synthTTL, 60 * 60 * 12),
      dispatch: ttlToAge(dispatchTTL, 60 * 60 * 24 * 7),
    })
  } catch {
    return Response.json({ synthesis: null, dispatch: null })
  }
}
