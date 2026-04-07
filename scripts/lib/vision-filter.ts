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

export async function visionFilter(
  images: ImageCandidate[],
  tastePrompt: string,
  siteName: string,
  minScore: number = 4,
): Promise<ImageCandidate[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || images.length === 0) return images

  const scored: { image: ImageCandidate; score: number }[] = []

  for (let i = 0; i < images.length; i += VISION_BATCH_SIZE) {
    const batch = images.slice(i, i + VISION_BATCH_SIZE)

    const content: Array<Record<string, unknown>> = [
      {
        type: "text",
        text: `${tastePrompt}\n\nI'm showing you ${batch.length} candidate images from ${siteName}. Look at EACH image carefully and rate it 1-5 using the criteria above.\n\nFor each image, evaluate:\n- Is this an AMERICAN landscape/location? (non-US = automatic 1)\n- What is the visual quality and emotional impact?\n- Does it serve the mandate?\n\nReturn a JSON array of scores, one per image, in order. Example for ${batch.length} images: [${batch.map((_, j) => j === 0 ? "5" : "3").join(", ")}]\nReturn only the JSON array, nothing else.`,
      },
    ]

    for (const img of batch) {
      content.push({
        type: "image",
        source: {
          type: "url",
          media_type: "image/jpeg",
          url: img.url,
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
        console.log(`  Vision API error: ${response.status} ${err.slice(0, 100)}`)
        // On error, skip this batch entirely (strict mode)
        continue
      }

      const data = await response.json() as { content?: Array<{ text?: string }> }
      const text = data.content?.[0]?.text || ""
      const match = text.match(/\[[\d,\s]*\]/)

      if (match) {
        const scores: number[] = JSON.parse(match[0])
        for (let j = 0; j < batch.length; j++) {
          scored.push({ image: batch[j], score: scores[j] || 1 })
        }
      }
    } catch (err) {
      console.log(`  Vision error: ${err instanceof Error ? err.message : String(err)}`)
    }

    // Rate limit between batches
    if (i + VISION_BATCH_SIZE < images.length) {
      await new Promise(r => setTimeout(r, 1000))
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
