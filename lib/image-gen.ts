// ─── Image Generation via Replicate (Recraft V3) ────────────────────────────
// Generates painterly gouache images for all surfaces.
// Instance-specific art direction via imageDirection config.
// Scene extrapolation via Haiku turns headlines into vivid landscape scenes.
// Cost: ~$0.04 per image (Recraft) + ~$0.001 per scene extrapolation (Haiku).

import { downloadAsDataUri } from "@/lib/image-utils"
import { trackUsage } from "@/lib/usage-tracker"
import { createHash } from "crypto"
import Anthropic from "@anthropic-ai/sdk"
import instanceConfig from "@/lib/config"
import { kvKey } from "@/lib/config"

export const REPLICATE_API = "https://api.replicate.com/v1"
export const REPLICATE_MODEL = "recraft-ai/recraft-v3"

// ─── Global Art Direction ───────────────────────────────────────────────────
// Fallback visual language for instances without imageDirection config.

export const GLOBAL_STYLE = `Painterly abstract. Wet-on-wet watercolor technique with visible paper texture. Pigment bleeding organically across damp surface. Translucent layered washes. Precise edges where color meets untouched paper. No text, no people, no logos, no icons, no UI elements, no objects, no literal depictions. Purely abstract — evocative, not illustrative.`

export const SURFACE_STYLES: Record<string, string> = {
  synthesis: `Analytical and layered. Cool grays, soft teals, and muted slate blue. Multiple translucent wash layers visible simultaneously — the feeling of patterns converging. Architectural undertone — structure emerging from fluid washes. More white paper breathing through. Measured, not expressive.`,
  dispatch: `Directional and decisive. Warm amber meeting cool steel. Deliberate brushwork — confident single strokes over atmospheric washes. The feeling of intelligence crystallizing into action. Slight asymmetric tension in the composition. Authority without aggression.`,
}

export const LAYER_PALETTES: Record<string, string> = {
  opportunity: "Lean cooler — soft clinical blues and teals suggesting analytical clarity.",
  position: "Lean warmer — amber and ochre suggesting decisive confidence.",
  discipline: "Lean greener — muted sage and deep indigo suggesting structural evolution.",
  landscape: "Stay neutral — silver grays with atmospheric depth.",
  culture: "Lean earthier — raw umber, oxide, burnt sienna suggesting material honesty.",
}

// ─── Scene Extrapolation ────────────────────────────────────────────────────
// Turns analytical headlines into vivid landscape scene descriptions.
// A fast Haiku call (~$0.001) that makes every image editorial, not decorative.
// Only used for thumbnails — hero/breather images stay anthemic.

async function extrapolateScene(title: string, skinId?: string): Promise<string> {
  const apiKey = process.env.DISPATCH_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY
  if (!apiKey) return title

  const dir = instanceConfig.imageDirection
  const skin = skinId && dir?.skins ? dir.skins[skinId] : undefined
  const biomeHint = skin?.geography ? `The scene should be set in: ${skin.geography}` : "Set in American wilderness."

  try {
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: `You translate analytical headlines into vivid landscape scene descriptions for gouache paintings. Output ONLY the scene description — no preamble, no quotes, no explanation. The scene must be a specific dramatic moment in nature that metaphorically evokes the headline's meaning. No people, no text, no buildings, no technology. Only landscape, weather, light, water, wildlife, and vegetation. ${biomeHint}`,
      messages: [{ role: "user", content: title }],
    })
    trackUsage({ endpoint: "scene-extrapolation", provider: "anthropic", model: "claude-haiku-4-5-20251001", inputTokens: response.usage?.input_tokens, outputTokens: response.usage?.output_tokens }).catch(() => {})
    const text = response.content[0]?.type === "text" ? response.content[0].text.trim() : ""
    return text || title
  } catch (err) {
    console.error("[scene-extrapolation] Failed:", err instanceof Error ? err.message : err)
    return title // Fallback to raw title if Haiku fails
  }
}

// ─── Prompt Assembly ────────────────────────────────────────────────────────

type Surface = "synthesis" | "dispatch"
type AspectRatio = "3:2" | "21:9"

function buildPrompt(
  surface: Surface,
  concept: string,
  layers?: string[],
  aspect?: AspectRatio,
  skinId?: string,
): string {
  const dir = instanceConfig.imageDirection
  const formatHint = aspect === "21:9" ? "Ultra-wide cinematic panoramic composition." : "Horizontal 3:2 landscape composition."

  if (dir) {
    // Instance-specific art direction with optional skin-driven geography
    const skin = skinId ? dir.skins?.[skinId] : undefined
    const geography = skin?.geography ?? ""
    const palette = skin?.palette ?? ""

    if (aspect === "21:9") {
      // Heroes/breathers: anthemic — geography is the protagonist, concept sets the mood
      return `${dir.style} ${formatHint} ${geography} ${palette} ${dir.mood} The atmosphere evokes: "${concept}". Do not include: ${dir.avoid}`.trim()
    }
    // Thumbnails: editorial — the scene IS the subject, geography and palette set the region
    return `${dir.style} ${formatHint} PRIMARY SUBJECT: ${concept}. Set in this region: ${geography} ${palette} Do not include: ${dir.avoid}`.trim()
  }

  // Fallback to global style for instances without imageDirection
  const surfaceStyle = SURFACE_STYLES[surface] || SURFACE_STYLES.synthesis
  const layerHint = layers?.[0] ? LAYER_PALETTES[layers[0]] || "" : ""
  return `${GLOBAL_STYLE} ${formatHint} ${surfaceStyle} Evoking: "${concept}". ${layerHint}`.trim()
}

// ─── Content-Addressable Image Cache ────────────────────────────────────
// Same insight title + surface + aspect + skin = same painting. No wasted
// generations when a convergence pattern persists across daily refreshes.

const IMAGE_CACHE_TTL = 7 * 24 * 60 * 60 // 7 days — outlives any single synthesis/dispatch cache

function imageCacheKey(title: string, surface: string, aspect: string, skinId?: string): string {
  const hash = createHash("sha256").update(`${title}|${surface}|${aspect}|${skinId || ""}`).digest("hex").slice(0, 16)
  return kvKey(`img:${hash}`)
}

async function getCachedImage(key: string): Promise<string | null> {
  try {
    const { kv } = await import("@vercel/kv")
    return await kv.get<string>(key)
  } catch {
    return null
  }
}

async function setCachedImage(key: string, dataUri: string): Promise<void> {
  try {
    const { kv } = await import("@vercel/kv")
    await kv.set(key, dataUri, { ex: IMAGE_CACHE_TTL })
  } catch { /* KV write failure — image still returned, just not cached */ }
}

// ─── Image Generation ───────────────────────────────────────────────────────

export async function generateCardImage(
  title: string,
  layers?: string[],
  surface: Surface = "synthesis",
  aspect: AspectRatio = "3:2",
  skinId?: string,
): Promise<string | undefined> {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) return undefined

  // Content-addressable cache: same title = same painting
  const cacheKey = imageCacheKey(title, surface, aspect, skinId)
  const cached = await getCachedImage(cacheKey)
  if (cached) return cached

  // Scene extrapolation: thumbnails (3:2) get Haiku scene descriptions.
  // Heroes/breathers (21:9) stay anthemic — the biome geography speaks.
  const concept = aspect === "3:2"
    ? await extrapolateScene(title, skinId)
    : title

  const prompt = buildPrompt(surface, concept, layers, aspect, skinId)

  try {
    // Submit prediction with retry on rate limit
    let submitRes: Response | null = null
    for (let retry = 0; retry < 3; retry++) {
      submitRes = await fetch(`${REPLICATE_API}/models/${REPLICATE_MODEL}/predictions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            prompt,
            size: aspect === "21:9" ? "1536x1024" : "1365x1024",
          },
        }),
      })
      if (submitRes.ok) break
      if (submitRes.status === 429) {
        await new Promise(r => setTimeout(r, (retry + 1) * 5000))
        continue
      }
      return undefined
    }

    if (!submitRes?.ok) return undefined
    const prediction = await submitRes.json()
    const predictionId = prediction.id
    if (!predictionId) return undefined

    // Poll for result (max 60 seconds — Recraft V3 can take up to 45s)
    for (let attempt = 0; attempt < 20; attempt++) {
      await new Promise(r => setTimeout(r, 3000))

      const pollRes = await fetch(`${REPLICATE_API}/predictions/${predictionId}`, {
        headers: { "Authorization": `Bearer ${token}` },
      })
      if (!pollRes.ok) continue

      const result = await pollRes.json()
      // Recraft V3 returns output as a single URL string; Flux models return an array
      const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output
      if (result.status === "succeeded" && outputUrl) {
        trackUsage({ endpoint: "image-gen", provider: "replicate", model: "recraft-v3", imageCount: 1 }).catch(() => {})
        // Download image and convert to permanent data URI
        const dataUri = await downloadAsDataUri(outputUrl)
        if (dataUri) setCachedImage(cacheKey, dataUri).catch(() => {})
        return dataUri
      }
      if (result.status === "failed" || result.status === "canceled") {
        return undefined
      }
    }

    return undefined
  } catch {
    return undefined
  }
}


// Generate images sequentially with rate limit handling
export async function generateCardImages(
  cards: { title: string; layers?: string[] }[],
  surface: Surface = "synthesis",
  aspect: AspectRatio = "3:2",
  skinId?: string,
): Promise<(string | undefined)[]> {
  const results: (string | undefined)[] = []

  for (let i = 0; i < cards.length; i++) {
    const url = await generateCardImage(cards[i].title, cards[i].layers, surface, aspect, skinId)
    results.push(url)
    if (i < cards.length - 1) {
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  return results
}
