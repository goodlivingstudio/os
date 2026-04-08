// ─── Vision-Based Taste Filter ──────────────────────────────────────────────
// Sends actual images to Claude Vision for visual evaluation.
// Shared by gallery-scraper.ts and gallery-collector.ts.

const VISION_BATCH_SIZE = 4
const VISION_MODEL = "claude-haiku-4-5-20251001"

export interface ImageCandidate {
  url: string
  alt?: string
  width?: number
  height?: number
}

// Detect actual image format from magic bytes
function detectMediaType(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  if (bytes[0] === 0xFF && bytes[1] === 0xD8) return "image/jpeg"
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "image/png"
  if (bytes[0] === 0x47 && bytes[1] === 0x49) return "image/gif"
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[8] === 0x57 && bytes[9] === 0x45) return "image/webp"
  return "image/jpeg" // fallback
}

// Download image as base64 — detects actual format from bytes, not headers
async function fetchImageBase64(url: string): Promise<{ data: string; mediaType: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    // Skip tiny images (likely icons/tracking pixels)
    if (buffer.byteLength < 5000) return null
    // Skip huge images to stay under API limits (>5MB)
    if (buffer.byteLength > 5 * 1024 * 1024) return null
    // Detect actual format from magic bytes — don't trust Content-Type header
    const mediaType = detectMediaType(buffer)
    const data = Buffer.from(buffer).toString("base64")
    return { data, mediaType }
  } catch {
    return null
  }
}

export async function visionFilter(
  images: ImageCandidate[],
  tastePrompt: string,
  siteName: string,
  minScore: number = 4,
): Promise<ImageCandidate[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || images.length === 0) return images

  const scored: { image: ImageCandidate; score: number }[] = []
  let fetchFails = 0

  for (let i = 0; i < images.length; i += VISION_BATCH_SIZE) {
    const batch = images.slice(i, i + VISION_BATCH_SIZE)

    // Download images as base64
    const downloaded: { image: ImageCandidate; data: string; mediaType: string }[] = []
    for (const img of batch) {
      const result = await fetchImageBase64(img.url)
      if (result) {
        downloaded.push({ image: img, ...result })
      } else {
        fetchFails++
        scored.push({ image: img, score: 1 }) // can't download = reject
      }
    }

    if (downloaded.length === 0) continue

    const content: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: `${tastePrompt}\n\nI'm showing you ${downloaded.length} candidate images from ${siteName}. Look at EACH image carefully and rate it 1-5 using the criteria above.\n\nFor each image, evaluate:\n- Is this an AMERICAN landscape/location? (non-US = automatic 1)\n- What is the visual quality and emotional impact?\n- Does it serve the mandate?\n\nReturn a JSON array of scores, one per image, in order. Example for ${downloaded.length} images: [${downloaded.map((_, j) => j === 0 ? "5" : "3").join(", ")}]\nReturn only the JSON array, nothing else.`,
      },
    ]

    for (const item of downloaded) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: item.mediaType,
          data: item.data,
        },
      })
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: VISION_MODEL,
          max_tokens: 200,
          messages: [{ role: "user", content }],
        }),
      })

      if (!response.ok) {
        const err = await response.text()
        console.log(`  Vision API error: ${response.status} ${err.slice(0, 300)}`)
        continue
      }

      const data = await response.json() as { content?: Array<{ text?: string }> }
      const text = data.content?.[0]?.text || ""
      const match = text.match(/\[[\d,\s]*\]/)

      if (match) {
        const scores: number[] = JSON.parse(match[0])
        for (let j = 0; j < downloaded.length; j++) {
          scored.push({ image: downloaded[j].image, score: scores[j] || 1 })
        }
      }
    } catch (err) {
      console.log(`  Vision error: ${err instanceof Error ? err.message : String(err)}`)
    }

    // Rate limit between batches
    if (i + VISION_BATCH_SIZE < images.length) {
      await new Promise(r => setTimeout(r, 1000))
    }

    // Progress indicator every 20 images
    if ((i + VISION_BATCH_SIZE) % 20 === 0) {
      process.stdout.write(`  [${Math.min(i + VISION_BATCH_SIZE, images.length)}/${images.length}]`)
    }
  }

  // Log score distribution
  const dist = [0, 0, 0, 0, 0]
  for (const s of scored) dist[(s.score || 1) - 1]++
  console.log(`  Vision scores: ${dist.map((c, i) => `${i + 1}:${c}`).join(" ")}`)

  const approved = scored.filter(s => s.score >= minScore).map(s => s.image)
  console.log(`  Vision filter: ${approved.length}/${images.length} approved`)

  return approved
}
