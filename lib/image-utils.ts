// ─── Shared image utilities ─────────────────────────────────────────────────

/**
 * Download an image from a URL and return as a permanent data URI.
 * Used to convert temporary Replicate delivery URLs into permanent base64 strings.
 */
export async function downloadAsDataUri(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) return undefined
    const buffer = await res.arrayBuffer()

    // Try to compress via sharp if available (Vercel serverless has it)
    try {
      const sharp = (await import("sharp")).default
      const compressed = await sharp(Buffer.from(buffer))
        .jpeg({ quality: 72 })
        .toBuffer()
      return `data:image/jpeg;base64,${compressed.toString("base64")}`
    } catch {
      // sharp not available — use original
      const base64 = Buffer.from(buffer).toString("base64")
      const contentType = res.headers.get("content-type") || "image/webp"
      return `data:${contentType};base64,${base64}`
    }
  } catch {
    return undefined
  }
}
