"use client"

import { useState, useMemo } from "react"
import { Copy, Check, Upload } from "lucide-react"
import { TYPE, MONO } from "@/lib/styles"
import type { GalleryImage, ColorMood, ColorSwatch } from "@/lib/gallery"

// ─── Types ──────────────────────────────────────────────────────────────────

interface SurfaceTrendsProps {
  images: GalleryImage[]
  paletteIntel: {
    trend: string
    moodShifts: { mood: string; direction: "rising" | "falling"; delta: number }[]
    hueShift: number
    saturationShift: number
  } | null
  snapshot: {
    moods: Record<string, number>
    avgHue: number
    avgSaturation: number
    avgLightness: number
    trendingPalettes: { colors: string[]; sources: string[]; frequency: number }[]
  } | null
}

const MOOD_COLORS: Record<string, string> = {
  warm: "#D4A05A", cool: "#5A9EB0", earth: "#7BAF6A", vivid: "#C87A6A", neutral: "#888888",
}
const MOOD_NAMES: Record<string, string> = {
  warm: "Warm", cool: "Cool", earth: "Earth", vivid: "Vivid", neutral: "Neutral",
}
const HUE_SPECTRUM = [
  { name: "Red", hue: 0, color: "#C85050" },
  { name: "Orange", hue: 30, color: "#D4A05A" },
  { name: "Yellow", hue: 60, color: "#C8C85A" },
  { name: "Green", hue: 120, color: "#7BAF6A" },
  { name: "Blue", hue: 210, color: "#5A9EB0" },
  { name: "Purple", hue: 270, color: "#8C64B0" },
  { name: "Magenta", hue: 330, color: "#B05A8C" },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0]
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function deriveDarkAccessible(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  const lum = relativeLuminance(r, g, b)
  let dr: number, dg: number, db: number
  if (lum > 0.7) { dr = Math.round(255 - r * 0.7); dg = Math.round(255 - g * 0.7); db = Math.round(255 - b * 0.7) }
  else if (lum < 0.05) { dr = Math.min(255, r + 200); dg = Math.min(255, g + 200); db = Math.min(255, b + 200) }
  else if (lum < 0.2) { dr = Math.min(255, Math.round(r * 1.5 + 40)); dg = Math.min(255, Math.round(g * 1.5 + 40)); db = Math.min(255, Math.round(b * 1.5 + 40)) }
  else { dr = Math.max(0, Math.round(r * 0.82)); dg = Math.max(0, Math.round(g * 0.82)); db = Math.max(0, Math.round(b * 0.82)) }
  return `#${[dr, dg, db].map(c => Math.min(255, Math.max(0, c)).toString(16).padStart(2, "0")).join("")}`
}

function deriveLightAccessible(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  const lum = relativeLuminance(r, g, b)
  let lr: number, lg: number, lb: number
  if (lum < 0.1) { lr = Math.min(255, r + 60); lg = Math.min(255, g + 60); lb = Math.min(255, b + 60) }
  else if (lum > 0.8) { lr = Math.round(r * 0.3); lg = Math.round(g * 0.3); lb = Math.round(b * 0.3) }
  else if (lum > 0.5) { lr = Math.round(r * 0.5); lg = Math.round(g * 0.5); lb = Math.round(b * 0.5) }
  else { lr = Math.max(0, Math.round(r * 1.15)); lg = Math.max(0, Math.round(g * 1.15)); lb = Math.max(0, Math.round(b * 1.15)) }
  return `#${[lr, lg, lb].map(c => Math.min(255, Math.max(0, c)).toString(16).padStart(2, "0")).join("")}`
}

// ─── Section Label ──────────────────────────────────────────────────────────

function SectionLabel({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
      <span style={{
        ...TYPE.sm, fontWeight: 600, color: "var(--accent-secondary)",
        textTransform: "uppercase", letterSpacing: "0.04em",
      }}>
        {title}
      </span>
      {subtitle && <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>{subtitle}</span>}
    </div>
  )
}

// ─── 1. Global Mood Distribution ───────────────────────────────────────────

function GlobalMoodDistribution({ images }: { images: GalleryImage[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = { warm: 0, cool: 0, earth: 0, vivid: 0, neutral: 0 }
    let total = 0
    for (const img of images) {
      if (!img.mood) continue
      counts[img.mood]++
      total++
    }
    if (total === 0) return null
    return {
      total,
      moods: Object.entries(counts)
        .map(([mood, count]) => ({ mood, count, pct: Math.round((count / total) * 100) }))
        .sort((a, b) => b.count - a.count),
    }
  }, [images])

  if (!data) return null

  return (
    <div>
      <SectionLabel title="Mood Distribution" subtitle={`${data.total} images classified`} />
      {/* Stacked bar */}
      <div style={{ display: "flex", height: 40, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
        {data.moods.filter(m => m.pct > 0).map(m => (
          <div
            key={m.mood}
            style={{
              flex: m.pct,
              background: MOOD_COLORS[m.mood],
              opacity: 0.7,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "flex 0.3s",
            }}
          >
            {m.pct >= 8 && (
              <span style={{ ...TYPE.xs, color: "#000", fontWeight: 600, opacity: 0.8 }}>
                {m.pct}%
              </span>
            )}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16 }}>
        {data.moods.map(m => (
          <div key={m.mood} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: MOOD_COLORS[m.mood] }} />
            <span style={{ ...TYPE.xs, color: "var(--text-secondary)" }}>
              {MOOD_NAMES[m.mood]} ({m.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 2. Mood Velocity ───────────────────────────────────────────────────────

function MoodVelocity({ moodShifts }: { moodShifts: { mood: string; direction: "rising" | "falling"; delta: number }[] }) {
  if (!moodShifts || moodShifts.length === 0) return null

  // Ensure all 5 moods are represented
  const allMoods = ["warm", "cool", "earth", "vivid", "neutral"]
  const shiftMap = new Map(moodShifts.map(s => [s.mood, s]))
  const display = allMoods.map(m => {
    const shift = shiftMap.get(m)
    return {
      mood: m,
      arrow: shift ? (shift.direction === "rising" ? "↑" : "↓") : "→",
      delta: shift ? `${shift.direction === "rising" ? "+" : "−"}${shift.delta}%` : "0%",
      color: MOOD_COLORS[m] || "var(--text-tertiary)",
    }
  })

  return (
    <div>
      <SectionLabel title="Mood Velocity" subtitle="7-day directional shifts" />
      <div style={{ display: "flex", gap: 8 }}>
        {display.map((v, i) => (
          <div
            key={v.mood}
            style={{
              flex: 1, padding: "12px 14px",
              background: "var(--bg-surface)", borderRadius: 8,
              animation: `signal-reveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 50}ms both`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.color }} />
              <span style={{ ...TYPE.xs, color: "var(--text-secondary)" }}>{MOOD_NAMES[v.mood]}</span>
            </div>
            <span style={{ ...TYPE.body, fontWeight: 600, color: v.color }}>
              {v.arrow} {v.delta}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 3. Hue Concentration ───────────────────────────────────────────────────

function HueConcentration({ images }: { images: GalleryImage[] }) {
  const clusters = useMemo(() => {
    const buckets = new Array(7).fill(0)
    for (const img of images) {
      if (img.hue === undefined) continue
      // Map hue (0-360) to bucket index
      const normalized = ((img.hue % 360) + 360) % 360
      if (normalized < 15 || normalized >= 345) buckets[0]++      // Red
      else if (normalized < 45) buckets[1]++   // Orange
      else if (normalized < 75) buckets[2]++   // Yellow
      else if (normalized < 165) buckets[3]++  // Green
      else if (normalized < 255) buckets[4]++  // Blue
      else if (normalized < 315) buckets[5]++  // Purple
      else buckets[6]++                         // Magenta
    }
    const max = Math.max(...buckets, 1)
    return buckets.map(b => b / max)
  }, [images])

  return (
    <div>
      <SectionLabel title="Hue Concentration" subtitle="Spectral clusters in current feed" />
      <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
        {HUE_SPECTRUM.map((seg, i) => (
          <div key={seg.name} style={{ flex: 1 }}>
            <div style={{
              height: 12, borderRadius: 4,
              background: seg.color,
              opacity: 0.2 + clusters[i] * 0.6,
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        {HUE_SPECTRUM.map(seg => (
          <div key={seg.name} style={{ flex: 1 }}>
            <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", fontSize: 8 }}>{seg.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


// ─── 5. Palette Extraction ──────────────────────────────────────────────────

function PaletteExtraction({ images, selectedPalettes, onTogglePalette }: {
  images: GalleryImage[]
  selectedPalettes: Set<number>
  onTogglePalette: (idx: number) => void
}) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const palettes = useMemo(() => {
    // Collect all colors across all images globally
    const allColors: { hex: string; hue: number; sat: number; light: number; count: number }[] = []
    const colorMap = new Map<string, { hex: string; hue: number; sat: number; light: number; count: number }>()

    for (const img of images) {
      if (!img.palette) continue
      for (const sw of img.palette) {
        const existing = colorMap.get(sw.hex)
        if (existing) {
          existing.count++
        } else {
          const entry = { hex: sw.hex, hue: sw.hue, sat: sw.saturation, light: sw.lightness, count: 1 }
          colorMap.set(sw.hex, entry)
          allColors.push(entry)
        }
      }
    }

    if (allColors.length < 10) return []

    // Filter out very dark (<15% lightness) and very light (>85% lightness) colors — these are backgrounds
    const chromatic = allColors.filter(c => c.light > 0.15 && c.light < 0.85 && c.sat > 0.08)
    if (chromatic.length < 5) return []

    // Sort by frequency
    chromatic.sort((a, b) => b.count - a.count)

    const result: { label: string; colors: string[]; count: number }[] = []

    // Palette 1: Top 5 most frequent chromatic colors (global dominant)
    const dominant5: typeof chromatic = []
    for (const c of chromatic) {
      if (dominant5.length >= 5) break
      const [r1, g1, b1] = hexToRgb(c.hex)
      const tooClose = dominant5.some(d => {
        const [r2, g2, b2] = hexToRgb(d.hex)
        return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2) < 50
      })
      if (!tooClose) dominant5.push(c)
    }
    if (dominant5.length >= 3) {
      result.push({
        label: "Dominant Palette",
        colors: dominant5.map(c => c.hex),
        count: dominant5.reduce((s, c) => s + c.count, 0),
      })
    }

    // Palette 2: Most saturated colors (vivid/bold)
    const bySat = [...chromatic].sort((a, b) => b.sat - a.sat)
    const vivid5: typeof chromatic = []
    for (const c of bySat) {
      if (vivid5.length >= 5) break
      const [r1, g1, b1] = hexToRgb(c.hex)
      const tooClose = vivid5.some(d => {
        const [r2, g2, b2] = hexToRgb(d.hex)
        return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2) < 50
      })
      if (!tooClose) vivid5.push(c)
    }
    if (vivid5.length >= 3) {
      result.push({
        label: "Vivid Palette",
        colors: vivid5.map(c => c.hex),
        count: vivid5.reduce((s, c) => s + c.count, 0),
      })
    }

    // Palette 3: Warm/earth tones (hue 0-60 or 330-360)
    const warm = chromatic.filter(c => c.hue <= 60 || c.hue >= 330)
    const warm5: typeof chromatic = []
    for (const c of warm) {
      if (warm5.length >= 5) break
      const [r1, g1, b1] = hexToRgb(c.hex)
      const tooClose = warm5.some(d => {
        const [r2, g2, b2] = hexToRgb(d.hex)
        return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2) < 50
      })
      if (!tooClose) warm5.push(c)
    }
    if (warm5.length >= 3) {
      result.push({
        label: "Warm Palette",
        colors: warm5.map(c => c.hex),
        count: warm5.reduce((s, c) => s + c.count, 0),
      })
    }

    return result
  }, [images])

  const handleCopy = (idx: number, format: string) => {
    const pal = palettes[idx]
    if (!pal) return
    let text = ""
    if (format === "hex") text = pal.colors.join(", ")
    else if (format === "css") text = pal.colors.map((c, i) => `--palette-${idx + 1}-${i + 1}: ${c};`).join("\n")
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }

  if (palettes.length === 0) return null

  return (
    <div>
      <SectionLabel title="Palette Extraction" subtitle="Select palettes to build moodboard" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {palettes.map((pal, idx) => {
          const isSelected = selectedPalettes.has(idx)
          const darkColors = pal.colors.map(deriveDarkAccessible)
          const lightColors = pal.colors.map(deriveLightAccessible)

          return (
            <div
              key={idx}
              style={{
                background: "var(--bg-surface)", borderRadius: 8, padding: "16px 20px",
                animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 80}ms both`,
              }}
            >
              {/* Header: checkbox + source + export */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <button
                  onClick={() => onTogglePalette(idx)}
                  style={{
                    width: 18, height: 18, borderRadius: 4, border: "none", cursor: "pointer",
                    background: isSelected ? "var(--accent-secondary)" : "var(--bg-elevated)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginRight: 10, flexShrink: 0, transition: "background 0.15s",
                  }}
                >
                  {isSelected && <Check size={11} strokeWidth={2.5} style={{ color: "var(--bg-primary)" }} />}
                </button>
                <div style={{ flex: 1 }}>
                  <div style={{ ...TYPE.sm, color: "var(--text-secondary)", fontWeight: 500 }}>{pal.label}</div>
                  <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>{pal.count} occurrences across feed</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["CSS", "HEX"].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => handleCopy(idx, fmt.toLowerCase())}
                      style={{
                        ...TYPE.xs, padding: "3px 10px", borderRadius: 6, border: "none",
                        background: copiedIdx === idx ? "var(--accent-secondary)" : "var(--bg-elevated)",
                        color: copiedIdx === idx ? "var(--bg-primary)" : "var(--text-tertiary)",
                        cursor: "pointer", transition: "all 0.15s", fontWeight: 500,
                      }}
                    >
                      {copiedIdx === idx ? "Copied" : fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Swatches: Source | Dark | Light */}
              <div style={{ display: "flex", gap: 24 }}>
                {/* Source — large swatches */}
                <div style={{ flex: 1 }}>
                  <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.03em" }}>Source</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {pal.colors.map((hex, i) => (
                      <div key={i} style={{ flex: 1 }}>
                        <div style={{ paddingTop: "100%", borderRadius: 8, background: hex, position: "relative" }} />
                        <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", marginTop: 4, fontSize: 7 }}>{hex.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dark + Light — stacked chips on native BGs */}
                <div style={{ flex: 1 }}>
                  <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.03em" }}>Dark</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    {darkColors.map((hex, i) => (
                      <div key={i} style={{
                        flex: 1, aspectRatio: "1", borderRadius: 8,
                        background: "var(--bg-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <div style={{ width: "55%", height: "55%", borderRadius: "50%", background: hex }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.03em" }}>Light</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {lightColors.map((hex, i) => (
                      <div key={i} style={{
                        flex: 1, aspectRatio: "1", borderRadius: 8,
                        background: "#F7F4EF",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <div style={{ width: "55%", height: "55%", borderRadius: "50%", background: hex }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ ...TYPE.xs, color: "#7BAF6A", fontWeight: 500, marginTop: 6 }}>AA 4.5:1+ compliant</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 6. Moodboard Export ────────────────────────────────────────────────────

function MoodboardExport({ selectedCount, matchingCount, onExport, exported }: {
  selectedCount: number
  matchingCount: number
  onExport: () => void
  exported: boolean
}) {
  if (selectedCount === 0) return null

  return (
    <div style={{
      background: "var(--bg-surface)", borderRadius: 8, padding: "14px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginTop: 12,
    }}>
      <div>
        <div style={{ ...TYPE.sm, color: "var(--text-secondary)", fontWeight: 500 }}>
          {selectedCount} palette{selectedCount !== 1 ? "s" : ""} selected · {matchingCount} images
        </div>
        <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
          Copy palette data + image URLs as JSON
        </div>
      </div>
      <button
        onClick={onExport}
        style={{
          ...TYPE.xs, fontWeight: 600, padding: "8px 20px", borderRadius: 6, border: "none",
          background: exported ? "var(--accent-secondary)" : "var(--accent-primary)",
          color: exported ? "var(--bg-primary)" : "var(--accent-secondary)",
          cursor: "pointer",
          transition: "all 0.15s", textTransform: "uppercase", letterSpacing: "0.04em",
        }}
      >
        {exported ? "COPIED" : "COPY DATA"}
      </button>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function SurfaceTrends({ images, paletteIntel, snapshot }: SurfaceTrendsProps) {
  const [selectedPalettes, setSelectedPalettes] = useState<Set<number>>(new Set())
  const [exported, setExported] = useState(false)

  const togglePalette = (idx: number) => {
    setSelectedPalettes(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const handleExport = async () => {
    const matchingImages = images.filter(img => img.url)
    const data = {
      images: matchingImages.slice(0, 20).map(img => ({ url: img.url, source: img.source, title: img.title })),
      palettes: [...selectedPalettes],
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      setExported(true)
      setTimeout(() => setExported(false), 2000)
    } catch { /* */ }
  }

  const classifiedCount = images.filter(img => img.mood).length

  if (classifiedCount < 5) {
    return (
      <div style={{ padding: "48px 32px", textAlign: "center" }}>
        <div style={{ ...TYPE.body, color: "var(--text-tertiary)", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
          Visual intelligence will emerge as gallery images are classified. Check back after the next refresh cycle.
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, padding: "24px 24px 48px" }}>
      {/* Each section separated by consistent dividers */}
      <GlobalMoodDistribution images={images} />

      <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />
      <MoodVelocity moodShifts={paletteIntel?.moodShifts || []} />

      <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />
      <HueConcentration images={images} />

      <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />
      {/* Palette Extraction + Moodboard — shared feature, no separator between them */}
      <PaletteExtraction
        images={images}
        selectedPalettes={selectedPalettes}
        onTogglePalette={togglePalette}
      />
      <MoodboardExport
        selectedCount={selectedPalettes.size}
        matchingCount={images.length}
        onExport={handleExport}
        exported={exported}
      />
    </div>
  )
}
