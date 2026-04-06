// Usage tracking endpoint — serves live cost data to the Source Pulse panel
import { getTodayUsage, getDailyRollups } from "@/lib/usage-tracker"
import type { DailyRollup, UsageEvent } from "@/lib/usage-tracker"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "today"

  try {
    const { events, summary } = await getTodayUsage()

    // Recent events for the live feed (last 20, newest first)
    const recentEvents: UsageEvent[] = events.slice(-20).reverse()

    const result: {
      today: DailyRollup
      recentEvents: UsageEvent[]
      dailyHistory?: DailyRollup[]
    } = { today: summary, recentEvents }

    if (range === "7d" || range === "30d") {
      const days = range === "7d" ? 7 : 30
      result.dailyHistory = await getDailyRollups(days)
    }

    return Response.json(result, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}
