export const revalidate = 3600 // 1 hour cache — zen content doesn't need to be real-time

// ─── Types ───────────────────────────────────────────────────────────────────

interface ZenBlock {
  id: string
  imageUrl: string
  title: string
  source?: string
  sourceUrl?: string
  width: number
  height: number
}

// ─── Are.na Channel ──────────────────────────────────────────────────────────

const ARENA_CHANNEL = "dispatch-zen"
const ARENA_USER = "jeremy-grant"

async function fetchArenaBlocks(): Promise<ZenBlock[]> {
  try {
    const res = await fetch(
      `https://api.are.na/v2/channels/${ARENA_CHANNEL}?per=100`,
      {
        signal: AbortSignal.timeout(10000),
        headers: { "User-Agent": "Dispatch/1.0" },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    const contents = data.contents || []

    return contents
      .filter((block: { class: string; image?: { display?: { url?: string } } }) =>
        block.class === "Image" && block.image?.display?.url
      )
      .map((block: {
        id: number
        title?: string
        image: { display: { url: string }; original?: { url?: string } }
        source?: { url?: string; title?: string }
        metadata?: { description?: string }
      }) => ({
        id: `arena-${block.id}`,
        imageUrl: block.image.display.url,
        title: block.title || "",
        source: block.source?.title || "",
        sourceUrl: block.source?.url || "",
        width: 0,
        height: 0,
      }))
  } catch {
    return []
  }
}

// ─── GET Handler ─────────────────────────────────────────────────────────────
// Future: aggregate from MyMind, Savee, and other sources here

export async function GET() {
  const arenaBlocks = await fetchArenaBlocks()

  // Shuffle for ambient randomness
  const shuffled = [...arenaBlocks].sort(() => Math.random() - 0.5)

  return Response.json({
    blocks: shuffled,
    sources: {
      arena: { channel: ARENA_CHANNEL, user: ARENA_USER, count: arenaBlocks.length },
    },
    totalBlocks: shuffled.length,
  })
}
