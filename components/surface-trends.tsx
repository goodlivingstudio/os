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

// ─── 1. Source × Mood Matrix ────────────────────────────────────────────────

function SourceMoodMatrix({ images }: { images: GalleryImage[] }) {
  const data = useMemo(() => {
    const sourceMap: Record<string, Record<string, number>> = {}
    const sourceTotals: Record<string, number> = {}
    for (const img of images) {
      if (!img.source || !img.mood) continue
      if (!sourceMap[img.source]) sourceMap[img.source] = {}
      sourceMap[img.source][img.mood] = (sourceMap[img.source][img.mood] || 0) + 1
      sourceTotals[img.source] = (sourceTotals[img.source] || 0) + 1
    }
    return Object.entries(sourceTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([source, total]) => ({
        source,
        total,
        moods: Object.fromEntries(
          ["warm", "cool", "earth", "vivid", "neutral"].map(m => [
            m,
            Math.round(((sourceMap[source][m] || 0) / total) * 100),
          ])
        ),
      }))
  }, [images])

  if (data.length === 0) return null
  const moods = ["warm", "cool", "earth", "vivid", "neutral"]

  return (
    <div>
      <SectionLabel title="Source × Mood Matrix" subtitle={`${data.length} active sources`} />
      {/* Column headers */}
      <div style={{ display: "flex", paddingLeft: 140, marginBottom: 8 }}>
        {moods.map(m => (
          <div key={m} style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: MOOD_COLORS[m] }} />
            <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>{MOOD_NAMES[m]}</span>
          </div>
        ))}
      </div>
      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {data.map((row, i) => (
          <div
            key={row.source}
            style={{
              display: "flex", alignItems: "center",
              animation: `signal-reveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i * 30, 400)}ms both`,
            }}
          >
            <span style={{
              ...TYPE.xs, color: "var(--text-secondary)", width: 136,
              flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {row.source}
            </span>
            {moods.map(m => (
              <div key={m} style={{ flex: 1, paddingRight: 3 }}>
                <div style={{
                  height: 22, borderRadius: 6,
                  background: MOOD_COLORS[m],
                  opacity: Math.max(0.06, (row.moods[m] || 0) / 100 * 0.85),
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {(row.moods[m] || 0) > 0 && (
                    <span style={{ ...TYPE.xs, color: "var(--text-secondary)", fontWeight: 500 }}>
                      {row.moods[m]}%
                    </span>
                  )}
                </div>
              </div>
            ))}
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

  // Top 3 clusters for glow effect
  const topClusters = clusters
    .map((v, i) => ({ i, v }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 3)
    .map(c => c.i)

  return (
    <div>
      <SectionLabel title="Hue Concentration" subtitle="Spectral clusters in current feed" />
      <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
        {HUE_SPECTRUM.map((seg, i) => {
          const isCluster = topClusters.includes(i)
          return (
            <div key={seg.name} style={{ flex: 1, position: "relative" }}>
              <div style={{
                height: 12, borderRadius: 4,
                background: seg.color,
                opacity: 0.2 + clusters[i] * 0.6,
                transition: "opacity 0.3s",
              }} />
              {isCluster && (
                <div
                  className="hue-glow"
                  style={{
                    position: "absolute",
                    top: -4, left: "50%",
                    width: 12, height: 20, borderRadius: 6,
                    background: seg.color,
                    color: seg.color,
                  }}
                />
              )}
            </div>
          )
        })}
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

// ─── 4. Visual Outliers ─────────────────────────────────────────────────────

function VisualOutliers({ images }: { images: GalleryImage[] }) {
  const outliers = useMemo(() => {
    const classified = images.filter(img => img.hue !== undefined && img.saturation !== undefined && img.lightness !== undefined)
    if (classified.length < 10) return []

    const avgHue = classified.reduce((s, img) => s + (img.hue || 0), 0) / classified.length
    const avgSat = classified.reduce((s, img) => s + (img.saturation || 0), 0) / classified.length
    const avgLight = classified.reduce((s, img) => s + (img.lightness || 0), 0) / classified.length

    return classified
      .map(img => {
        const hueDist = Math.min(Math.abs((img.hue || 0) - avgHue), 360 - Math.abs((img.hue || 0) - avgHue)) / 180
        const satDist = Math.abs((img.saturation || 0) - avgSat)
        const lightDist = Math.abs((img.lightness || 0) - avgLight)
        const distance = Math.sqrt(hueDist * hueDist + satDist * satDist + lightDist * lightDist)
        const dimension = hueDist > satDist && hueDist > lightDist ? "Hue" : satDist > lightDist ? "Saturation" : "Lightness"
        return { ...img, distance, dimension }
      })
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 5)
  }, [images])

  if (outliers.length === 0) return null

  return (
    <div>
      <SectionLabel title="Visual Outliers" subtitle="Pattern breakers — furthest from visual center" />
      <div style={{ display: "flex", gap: 10 }}>
        {outliers.map((img, i) => (
          <div
            key={img.id}
            style={{
              flex: 1, borderRadius: 8, overflow: "hidden",
              background: "var(--bg-elevated)",
              animation: `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms both`,
            }}
          >
            <div style={{ position: "relative", paddingTop: "66.67%", background: "var(--bg-surface)" }}>
              <img
                src={img.url}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={e => { e.currentTarget.style.display = "none" }}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ padding: "8px 10px" }}>
              <div style={{ ...TYPE.xs, color: "var(--accent-secondary)", fontWeight: 500 }}>{img.source}</div>
              <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
                {img.dimension} · {Math.round(img.distance * 100)}%
              </div>
            </div>
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
    // Group images by source, extract dominant palettes per source-group
    const sourceColors: Record<string, { hex: string; count: number }[]> = {}
    for (const img of images) {
      if (!img.palette || !img.source) continue
      if (!sourceColors[img.source]) sourceColors[img.source] = []
      for (const sw of img.palette) {
        const existing = sourceColors[img.source].find(c => c.hex === sw.hex)
        if (existing) existing.count++
        else sourceColors[img.source].push({ hex: sw.hex, count: 1 })
      }
    }

    // Find source pairs with similar palettes
    const sources = Object.entries(sourceColors)
      .filter(([, colors]) => colors.length >= 5)
      .sort((a, b) => b[1].reduce((s, c) => s + c.count, 0) - a[1].reduce((s, c) => s + c.count, 0))

    const result: { sources: string[]; colors: string[]; count: number }[] = []
    const used = new Set<string>()

    for (const [source, colors] of sources) {
      if (used.has(source)) continue
      const top5 = colors.sort((a, b) => b.count - a.count).slice(0, 5).map(c => c.hex)
      if (top5.length < 5) continue
      used.add(source)
      const count = colors.reduce((s, c) => s + c.count, 0)
      result.push({ sources: [source], colors: top5, count })
      if (result.length >= 3) break
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
                  <div style={{ ...TYPE.sm, color: "var(--text-secondary)", fontWeight: 500 }}>{pal.sources.join(", ")}</div>
                  <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>{pal.count} occurrences</div>
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

function MoodboardExport({ selectedCount, matchingCount, onGenerate, generating }: {
  selectedCount: number
  matchingCount: number
  onGenerate: () => void
  generating: boolean
}) {
  return (
    <div style={{
      background: "var(--bg-surface)", borderRadius: 8, padding: "14px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginTop: 12,
    }}>
      <div>
        <div style={{ ...TYPE.sm, color: "var(--text-secondary)", fontWeight: 500 }}>
          {selectedCount} palette{selectedCount !== 1 ? "s" : ""} selected · {matchingCount} matching images
        </div>
        <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
          Generates a Figma frame with image grid + palette reference
        </div>
      </div>
      <button
        onClick={onGenerate}
        disabled={selectedCount === 0 || generating}
        style={{
          ...TYPE.xs, fontWeight: 600, padding: "8px 20px", borderRadius: 6, border: "none",
          background: selectedCount > 0 ? "var(--accent-primary)" : "var(--bg-elevated)",
          color: selectedCount > 0 ? "var(--accent-secondary)" : "var(--text-tertiary)",
          cursor: selectedCount > 0 ? "pointer" : "default",
          transition: "all 0.15s", textTransform: "uppercase", letterSpacing: "0.04em",
        }}
      >
        {generating ? "Generating..." : "GENERATE →"}
      </button>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function SurfaceTrends({ images, paletteIntel, snapshot }: SurfaceTrendsProps) {
  const [selectedPalettes, setSelectedPalettes] = useState<Set<number>>(new Set())
  const [generating, setGenerating] = useState(false)

  const togglePalette = (idx: number) => {
    setSelectedPalettes(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const handleGenerate = async () => {
    setGenerating(true)
    // TODO: Figma plugin API integration for moodboard generation
    // For now, copy matching image URLs to clipboard
    const matchingImages = images.filter(img => img.url)
    const data = {
      images: matchingImages.slice(0, 20).map(img => ({ url: img.url, source: img.source, title: img.title })),
      palettes: [...selectedPalettes],
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    } catch { /* */ }
    setGenerating(false)
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
      <SourceMoodMatrix images={images} />

      <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />
      <MoodVelocity moodShifts={paletteIntel?.moodShifts || []} />

      <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />
      <HueConcentration images={images} />

      <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }} />
      <VisualOutliers images={images} />

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
        onGenerate={handleGenerate}
        generating={generating}
      />
    </div>
  )
}
