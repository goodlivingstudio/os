// Serve generated podcast artwork by show name
// Crops to square center, resizes to 256px, optimized webp
// Usage: /api/audio-image?show=The_Daily
import { kv } from "@vercel/kv"
import sharp from "sharp"

const TARGET_SIZE = 256 // 256px square — sharp at 2x retina for 96px modal + 64px card
const QUALITY = 75

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const show = searchParams.get("show")
  if (!show) return new Response("Missing show param", { status: 400 })

  if (!process.env.KV_REST_API_URL) return new Response("KV unavailable", { status: 500 })

  try {
    const key = `audio-image:${show}`
    const dataUri = await kv.get<string>(key)
    if (!dataUri || !dataUri.startsWith("data:")) {
      return new Response("Not found", { status: 404 })
    }

    // Parse data URI
    const match = dataUri.match(/^data:image\/\w+;base64,(.+)$/)
    if (!match) return new Response("Invalid data", { status: 500 })

    const source = Buffer.from(match[1], "base64")

    // Crop to square center + resize + compress
    const optimized = await sharp(source)
      .resize(TARGET_SIZE, TARGET_SIZE, {
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: QUALITY })
      .toBuffer()

    return new Response(new Uint8Array(optimized), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    })
  } catch {
    return new Response("Image processing error", { status: 500 })
  }
}
