// Generate images for a specific skin/biome — called after initial load
// to populate additional biome variants without blocking the main response
import { generateCardImages } from "@/lib/image-gen"

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return Response.json({ error: "No Replicate token" }, { status: 500 })
  }

  try {
    const { skinId, titles, heroTitle, surface } = await req.json()
    if (!skinId || !titles?.length) {
      return Response.json({ error: "skinId and titles required" }, { status: 400 })
    }

    const results: Record<string, string | undefined> = {}

    // Hero image
    if (heroTitle) {
      const heroUrls = await generateCardImages(
        [{ title: heroTitle, layers: ["landscape"] }],
        surface || "synthesis", "21:9", skinId
      )
      results._hero = heroUrls[0] || undefined
    }

    // Thumbnails
    const cards = titles.map((t: string) => ({ title: t, layers: [] }))
    const imageUrls = await generateCardImages(cards, surface || "synthesis", "3:2", skinId)
    titles.forEach((t: string, i: number) => {
      results[t] = imageUrls[i] || undefined
    })

    return Response.json({ skinId, images: results })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
