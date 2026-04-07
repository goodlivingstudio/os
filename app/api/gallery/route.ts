// Gallery API — aggregates images from Are.na and RSS feeds
import { GALLERY_SOURCES, type GalleryImage, type ColorMood, type ColorSwatch } from "@/lib/gallery"
import { storePaletteSnapshot, loadPaletteHistory, type PaletteSnapshot, type TrendingPalette } from "@/lib/article-store"
import sharp from "sharp"

export const revalidate = 1800 // 30 min cache

async function fetchArena(url: string, sourceName: string): Promise<GalleryImage[]> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const data = await res.json()
    const contents = data.contents || []
    return contents
      .filter((c: { class?: string; image?: { display?: { url?: string }; original?: { url?: string } } }) => {
        // Accept Image blocks, or any block with an image attachment
        if (c.image?.display?.url) return true
        if (c.image?.original?.url) return true
        return false
      })
      .map((c: { id: number; title?: string; class?: string; image?: { display?: { url?: string }; original?: { url?: string } }; source?: { url?: string } }) => ({
        id: `arena-${c.id}`,
        url: c.image?.display?.url || c.image?.original?.url || "",
        title: c.title || undefined,
        source: sourceName,
        linkUrl: c.source?.url || undefined,
      }))
      .filter((img: GalleryImage) => img.url.length > 0)
  } catch {
    return []
  }
}

function extractImageFromRSS(item: string): string | null {
  // Decode CDATA sections first so we can find img tags inside content:encoded
  const decoded = item.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")

  // Upgrade Dezeen square thumbnails to column (natural aspect ratio)
  // Tested patterns against static.dezeen.com CDN:
  //   _sq_N.jpg  → _col_N.jpg   (e.g. _sq_1.jpg → _col_1.jpg)
  //   _sqN.jpg   → _col_N.jpg   (e.g. _sq2.jpg → _col_2.jpg)
  //   _sq.jpg    → _col_0.jpg   (no number = default to _col_0)
  //   _sq-N.jpg  → _col_0.jpg   (variant suffix, fall back to _col_0)
  function upgradeDezeenUrl(url: string): string {
    if (url.includes("dezeen.com")) {
      // _sq_N.jpg → _col_N.jpg (underscore-separated number)
      url = url.replace(/_sq_(\d+)\./, "_col_$1.")
      // _sqN.jpg → _col_N.jpg (number directly after sq, no separator)
      url = url.replace(/_sq(\d+)\./, "_col_$1.")
      // _sq-N.jpg → _col_0.jpg (dash variant, fall back)
      url = url.replace(/_sq-\d+\./, "_col_0.")
      // _sq.jpg → _col_0.jpg (bare square, no number)
      url = url.replace(/_sq\./, "_col_0.")
    }
    // Strip WordPress dimension suffixes
    return url.replace(/-\d+x\d+\./, ".")
  }

  // First try: img in description/content/content:encoded — usually full-size
  const imgMatches = decoded.matchAll(/<img[^>]+src=["']([^"']{20,})["']/gi)
  for (const m of imgMatches) {
    if (m[1]?.startsWith("http")) {
      return upgradeDezeenUrl(m[1])
    }
  }

  // media:content url (may have medium="image" attr)
  const mc = item.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*/i)
  if (mc?.[1]) {
    return upgradeDezeenUrl(mc[1])
  }

  // enclosure with image type
  const enc = item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image[^"']*["']/i)
    || item.match(/<enclosure[^>]+type=["']image[^"']*["'][^>]+url=["']([^"']+)["']/i)
  if (enc?.[1]) return upgradeDezeenUrl(enc[1])

  // media:thumbnail as last resort
  const mt = item.match(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*/i)
  if (mt?.[1]) {
    return upgradeDezeenUrl(mt[1])
  }

  // og:image or similar in content
  const og = decoded.match(/(?:og:image|twitter:image)[^>]*content=["']([^"']+)["']/i)
  if (og?.[1]?.startsWith("http")) return og[1]

  return null
}

async function fetchRSS(url: string, sourceName: string): Promise<GalleryImage[]> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Dispatch/1.0 (personal gallery)" },
    })
    if (!res.ok) return []
    const xml = await res.text()

    const items = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || []
    const images: GalleryImage[] = []

    for (let i = 0; i < Math.min(items.length, 30); i++) {
      const item = items[i]

      const titleMatch = item.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)
      const title = titleMatch?.[1]?.trim().replace(/<[^>]+>/g, "") || undefined

      const linkMatch = item.match(/<link[^>]+href=["']([^"']+)["']/i) || item.match(/<link[^>]*>([^<]+)<\/link>/i)
      const linkUrl = linkMatch?.[1]?.trim() || undefined

      // Check for video enclosures first
      const videoEnc = item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']video[^"']*["']/i)
        || item.match(/<enclosure[^>]+type=["']video[^"']*["'][^>]+url=["']([^"']+)["']/i)
      const videoMedia = item.match(/<media:content[^>]+url=["']([^"']+)["'][^>]+medium=["']video["']/i)
        || item.match(/<media:content[^>]+medium=["']video["'][^>]+url=["']([^"']+)["']/i)
      const videoUrl = videoEnc?.[1] || videoMedia?.[1] || undefined

      // Extract image (thumbnail for videos, or main image)
      const imageUrl = extractImageFromRSS(item)

      if (videoUrl) {
        images.push({
          id: `rss-${sourceName}-v${i}`,
          url: imageUrl || videoUrl, // use thumbnail if available, else video URL
          title,
          source: sourceName,
          linkUrl,
          mediaType: "video",
          videoUrl,
        })
      } else if (imageUrl) {
        images.push({
          id: `rss-${sourceName}-${i}`,
          url: imageUrl,
          title,
          source: sourceName,
          linkUrl,
          mediaType: "image",
        })
      }
    }

    return images
  } catch {
    return []
  }
}

// ─── Server-side color mood classification ─────────────────────────────────

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

function classifyMood(r: number, g: number, b: number): ColorMood {
  const [h, s, l] = rgbToHsl(r, g, b)
  // Neutral: truly grayscale only — very low saturation AND mid-range lightness
  if (s < 0.08) return "neutral"
  if (s < 0.15 && l > 0.3 && l < 0.7) return "neutral"
  // Vivid: high saturation, bold color
  if (s > 0.55) return "vivid"
  // Earth: greens, browns, tans, natural materials, warm desaturated
  if (s < 0.45 && ((h >= 20 && h <= 170)) && l < 0.7) return "earth"
  // Warm: reds, oranges, yellows, golden tones
  if (h <= 50 || h >= 320) return "warm"
  // Cool: blues, teals, purples
  if (h >= 180 && h <= 310) return "cool"
  // Green-to-warm transition
  if (h > 50 && h < 180) return s < 0.35 ? "earth" : "cool"
  return "warm"
}

interface ColorAnalysis {
  mood: ColorMood
  hue: number
  saturation: number
  lightness: number
  palette: ColorSwatch[]
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(c => c.toString(16).padStart(2, "0")).join("")
}

// Median-cut-style clustering: quantize pixels into perceptually distinct buckets
function extractPalette(pixelData: Buffer, channels: number, pixelCount: number): ColorSwatch[] {
  // Sample pixels into color buckets (quantize to 16-step per channel for finer resolution)
  const buckets = new Map<string, { r: number; g: number; b: number; count: number }>()

  for (let i = 0; i < pixelCount * channels; i += channels) {
    const r = pixelData[i]
    const g = pixelData[i + 1]
    const b = pixelData[i + 2]
    // Finer quantization: 16-step (16 values per channel = 4096 possible colors)
    const qr = Math.round(r / 16) * 16
    const qg = Math.round(g / 16) * 16
    const qb = Math.round(b / 16) * 16
    const key = `${qr},${qg},${qb}`
    const existing = buckets.get(key)
    if (existing) {
      existing.r += r
      existing.g += g
      existing.b += b
      existing.count++
    } else {
      buckets.set(key, { r, g, b, count: 1 })
    }
  }

  // Sort by frequency
  const sorted = [...buckets.values()]
    .sort((a, b) => b.count - a.count)

  // Deduplicate: skip colors too similar to already-selected ones
  const selected: typeof sorted = []
  for (const b of sorted) {
    if (selected.length >= 5) break
    const avgR = Math.round(b.r / b.count)
    const avgG = Math.round(b.g / b.count)
    const avgB = Math.round(b.b / b.count)
    const tooClose = selected.some(s => {
      const sr = Math.round(s.r / s.count)
      const sg = Math.round(s.g / s.count)
      const sb = Math.round(s.b / s.count)
      const dist = Math.sqrt((avgR - sr) ** 2 + (avgG - sg) ** 2 + (avgB - sb) ** 2)
      return dist < 45 // minimum perceptual distance between palette entries
    })
    if (!tooClose) selected.push(b)
  }

  const totalPixels = sorted.reduce((s, b) => s + b.count, 0)

  return selected.map(b => {
    const r = Math.round(b.r / b.count)
    const g = Math.round(b.g / b.count)
    const bl = Math.round(b.b / b.count)
    const [h, s, l] = rgbToHsl(r, g, bl)
    return {
      hex: rgbToHex(r, g, bl),
      hue: Math.round(h),
      saturation: Math.round(s * 100) / 100,
      lightness: Math.round(l * 100) / 100,
      percentage: Math.round((b.count / totalPixels) * 100),
    }
  })
}

async function analyzeImageColor(url: string): Promise<ColorAnalysis | undefined> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      headers: { "User-Agent": "Dispatch/1.0 (gallery color analysis)" },
    })
    if (!res.ok) return undefined
    const buffer = Buffer.from(await res.arrayBuffer())
    // Resize to 32x32 grid for palette extraction (1024 pixels)
    const { data, info } = await sharp(buffer)
      .resize(32, 32, { fit: "cover" })
      .raw()
      .toBuffer({ resolveWithObject: true })
    if (info.channels < 3) return undefined

    const palette = extractPalette(data, info.channels, 1024)

    // Overall mood from the dominant color
    const dominant = palette[0]
    if (!dominant) return undefined
    const hexToRgb = (hex: string) => {
      const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
      return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] as const : [0, 0, 0] as const
    }
    const [dr, dg, db] = hexToRgb(dominant.hex)

    return {
      mood: classifyMood(dr, dg, db),
      hue: dominant.hue,
      saturation: dominant.saturation,
      lightness: dominant.lightness,
      palette,
    }
  } catch {
    return undefined
  }
}

// Classify colors for a batch of images (parallel, with concurrency limit)
// Cap at 150 images to stay within Vercel function timeout
const MAX_CLASSIFY = 150

async function classifyBatch(images: GalleryImage[]): Promise<GalleryImage[]> {
  const CONCURRENCY = 15
  const results = [...images]
  const toClassify = Math.min(results.length, MAX_CLASSIFY)

  for (let i = 0; i < toClassify; i += CONCURRENCY) {
    const batch = results.slice(i, Math.min(i + CONCURRENCY, toClassify))
    const analyses = await Promise.allSettled(
      batch.map(img => analyzeImageColor(img.url))
    )
    analyses.forEach((result, j) => {
      if (result.status === "fulfilled" && result.value) {
        const a = result.value
        results[i + j] = { ...results[i + j], mood: a.mood, hue: a.hue, saturation: a.saturation, lightness: a.lightness, palette: a.palette }
      }
    })
  }

  return results
}

export async function GET() {
  const results = await Promise.allSettled(
    GALLERY_SOURCES.map(src =>
      src.type === "arena"
        ? fetchArena(src.url, src.name)
        : fetchRSS(src.url, src.name)
    )
  )

  const allImages: GalleryImage[] = []
  for (const result of results) {
    if (result.status === "fulfilled") {
      allImages.push(...result.value)
    }
  }

  // Classify color moods server-side (parallel, 10 at a time)
  const classified = await classifyBatch(allImages)

  // Shuffle for variety
  for (let i = classified.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[classified[i], classified[j]] = [classified[j], classified[i]]
  }

  // ── Capture palette snapshot for trend detection ──────────────────────────
  const today = new Date().toISOString().slice(0, 10)
  const moods: Record<string, number> = { warm: 0, cool: 0, earth: 0, vivid: 0, neutral: 0 }
  let hueSum = 0, satSum = 0, lightSum = 0, colorCount = 0
  const sourceData: Record<string, { count: number; hueSum: number; moods: Record<string, number> }> = {}

  for (const img of classified) {
    if (img.mood) moods[img.mood]++
    if (img.hue !== undefined) {
      hueSum += img.hue
      satSum += (img.saturation ?? 0)
      lightSum += (img.lightness ?? 0)
      colorCount++
    }
    if (!sourceData[img.source]) sourceData[img.source] = { count: 0, hueSum: 0, moods: {} }
    sourceData[img.source].count++
    if (img.hue !== undefined) sourceData[img.source].hueSum += img.hue
    if (img.mood) sourceData[img.source].moods[img.mood] = (sourceData[img.source].moods[img.mood] || 0) + 1
  }

  // Detect trending palettes — find recurring color combinations across images
  const trendingPalettes: TrendingPalette[] = (() => {
    // Group images by their quantized dominant+secondary color pair
    const pairMap = new Map<string, { colors: string[]; sources: Set<string>; count: number }>()
    for (const img of classified) {
      if (!img.palette || img.palette.length < 2) continue
      // Use top 2 colors as the "pair signature" (quantized to reduce noise)
      const top2 = img.palette.slice(0, 2).map(c => {
        const qh = Math.round(c.hue / 30) * 30
        const qs = Math.round(c.saturation * 4) / 4
        const ql = Math.round(c.lightness * 4) / 4
        return { qKey: `${qh}-${qs}-${ql}`, hex: c.hex }
      })
      const pairKey = top2.map(c => c.qKey).sort().join("|")
      const existing = pairMap.get(pairKey)
      if (existing) {
        existing.count++
        existing.sources.add(img.source)
      } else {
        pairMap.set(pairKey, {
          colors: top2.map(c => c.hex),
          sources: new Set([img.source]),
          count: 1,
        })
      }
    }
    // Return top 5 most recurring pairs that appear across 2+ sources
    return [...pairMap.values()]
      .filter(p => p.sources.size >= 2 || p.count >= 3)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(p => ({
        colors: p.colors,
        sources: [...p.sources],
        frequency: p.count,
      }))
  })()

  const snapshot: PaletteSnapshot = {
    date: today,
    totalImages: classified.length,
    moods,
    avgHue: colorCount > 0 ? Math.round(hueSum / colorCount) : 0,
    avgSaturation: colorCount > 0 ? Math.round((satSum / colorCount) * 100) / 100 : 0,
    avgLightness: colorCount > 0 ? Math.round((lightSum / colorCount) * 100) / 100 : 0,
    trendingPalettes,
    sourceBreakdown: Object.fromEntries(
      Object.entries(sourceData).map(([name, data]) => {
        const topMood = Object.entries(data.moods).sort((a, b) => b[1] - a[1])[0]
        return [name, {
          count: data.count,
          dominantMood: topMood?.[0] || "neutral",
          avgHue: data.count > 0 ? Math.round(data.hueSum / data.count) : 0,
        }]
      })
    ),
  }

  storePaletteSnapshot(snapshot).catch(() => {})

  // ── Load history for trend analysis ─────────────────────────────────────
  const history = await loadPaletteHistory(7).catch(() => [])

  // Calculate trends: compare today vs 7-day average
  let paletteIntel: {
    trend: string
    moodShifts: { mood: string; direction: "rising" | "falling"; delta: number }[]
    hueShift: number
    saturationShift: number
  } | null = null

  const priorDays = history.filter(h => h.date !== today)
  if (priorDays.length >= 1) {
    // Average mood percentages across prior days
    const avgMoods: Record<string, number> = {}
    for (const day of priorDays) {
      const dayTotal = day.totalImages || 1
      for (const [mood, count] of Object.entries(day.moods)) {
        avgMoods[mood] = (avgMoods[mood] || 0) + (count / dayTotal) / priorDays.length
      }
    }

    const todayTotal = classified.length || 1
    const moodShifts: { mood: string; direction: "rising" | "falling"; delta: number }[] = []
    for (const mood of Object.keys(moods)) {
      const todayPct = (moods[mood] || 0) / todayTotal
      const avgPct = avgMoods[mood] || 0
      const delta = Math.round((todayPct - avgPct) * 100)
      if (Math.abs(delta) >= 3) {
        moodShifts.push({ mood, direction: delta > 0 ? "rising" : "falling", delta: Math.abs(delta) })
      }
    }
    moodShifts.sort((a, b) => b.delta - a.delta)

    const avgHue = priorDays.reduce((s, d) => s + d.avgHue, 0) / priorDays.length
    const avgSat = priorDays.reduce((s, d) => s + d.avgSaturation, 0) / priorDays.length

    // Build trend description
    const rising = moodShifts.filter(m => m.direction === "rising")
    const falling = moodShifts.filter(m => m.direction === "falling")
    let trend = ""
    if (rising.length > 0) trend += `${rising.map(m => `${m.mood} +${m.delta}%`).join(", ")} rising`
    if (rising.length > 0 && falling.length > 0) trend += ". "
    if (falling.length > 0) trend += `${falling.map(m => `${m.mood} -${m.delta}%`).join(", ")} falling`
    if (!trend) trend = "Palette stable — no significant shifts from the weekly average"

    paletteIntel = {
      trend,
      moodShifts,
      hueShift: Math.round(snapshot.avgHue - avgHue),
      saturationShift: Math.round((snapshot.avgSaturation - avgSat) * 100),
    }
  }

  return Response.json({
    images: classified,
    count: classified.length,
    sources: GALLERY_SOURCES.length,
    paletteIntel,
    snapshot: { moods, avgHue: snapshot.avgHue, avgSaturation: snapshot.avgSaturation, avgLightness: snapshot.avgLightness, trendingPalettes },
  })
}
