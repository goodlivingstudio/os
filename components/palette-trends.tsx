"use client"

import { TYPE, MONO, metaStyle } from "@/lib/styles"
import type { ColorMood, ColorSwatch } from "@/lib/gallery"

// ─── Types ──────────────────────────────────────────────────────────────────

interface TrendingPalette {
  colors: string[]
  sources: string[]
  frequency: number
}

interface PaletteTrendsProps {
  snapshot: {
    moods: Record<string, number>
    avgHue: number
    avgSaturation: number
    avgLightness: number
    trendingPalettes: TrendingPalette[]
  } | null
  paletteIntel: {
    trend: string
    moodShifts: { mood: string; direction: "rising" | "falling"; delta: number }[]
    hueShift: number
    saturationShift: number
  } | null
  totalImages: number
  images: { source: string; mood?: ColorMood; palette?: ColorSwatch[] }[]
}

const MOOD_COLORS: Record<string, string> = {
  warm: "#D4A05A",
  cool: "#5A9EB0",
  earth: "#7BAF6A",
  vivid: "#C87A6A",
  neutral: "#888888",
}

// ─── Large Palette Card — the hero element ──────────────────────────────────

function PaletteCard({ colors, sources, frequency, index }: TrendingPalette & { index: number }) {
  return (
    <div style={{
      borderRadius: 16, overflow: "hidden",
      animation: `signal-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 120}ms both`,
      cursor: "pointer",
      transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.01)" }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
    >
      {/* Color bars — large, immersive, the colors ARE the content */}
      <div style={{ display: "flex", height: 160 }}>
        {colors.map((hex, i) => (
          <div key={i} style={{
            flex: 1,
            background: hex,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: "0 0 12px",
          }}>
            <span style={{
              ...TYPE.xs, fontFamily: MONO, letterSpacing: "0.02em",
              color: "rgba(255,255,255,0.5)",
              textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            }}>
              {hex}
            </span>
          </div>
        ))}
      </div>
      {/* Minimal attribution */}
      <div style={{
        padding: "10px 18px",
        background: "var(--bg-surface)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
          {sources.slice(0, 3).join(", ")}{sources.length > 3 ? ` +${sources.length - 3}` : ""}
        </span>
        <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
          {frequency} images
        </span>
      </div>
    </div>
  )
}

// ─── Mood Spectrum — horizontal gradient bar ────────────────────────────────

function MoodSpectrum({ moods, total }: { moods: Record<string, number>; total: number }) {
  if (total === 0) return null
  const entries = Object.entries(moods).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])

  return (
    <div style={{ animation: "signal-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
      {/* Vibrant gradient bar */}
      <div style={{ display: "flex", height: 48, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        {entries.map(([mood, count]) => {
          const pct = Math.round((count / total) * 100)
          return (
            <div key={mood} style={{
              width: `${pct}%`,
              background: MOOD_COLORS[mood] || "var(--text-tertiary)",
              transition: "width 0.6s",
              display: "flex", alignItems: "center", justifyContent: "center",
              minWidth: pct > 4 ? 40 : 0,
            }}>
              {pct > 6 && (
                <span style={{
                  ...TYPE.sm, color: "rgba(0,0,0,0.45)", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.02em",
                }}>
                  {pct}%
                </span>
              )}
            </div>
          )
        })}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {entries.map(([mood, count]) => (
          <div key={mood} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: MOOD_COLORS[mood] || "var(--text-tertiary)" }} />
            <span style={{ ...TYPE.sm, color: "var(--text-secondary)", textTransform: "capitalize", fontWeight: 500 }}>{mood}</span>
            <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Source Color Strip — compact per-source palette ─────────────────────────

function SourceStrip({ name, palette, mood }: { name: string; palette: string[]; mood: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "10px 0",
      borderBottom: "1px solid var(--border)",
    }}>
      {/* Palette swatches — generous size */}
      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
        {palette.map((hex, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: 6,
            background: hex,
          }} />
        ))}
      </div>
      <span style={{ flex: 1, ...TYPE.body, color: "var(--text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name}
      </span>
      <span style={{
        ...TYPE.xs, padding: "3px 10px", borderRadius: 9999,
        background: `${MOOD_COLORS[mood] || "var(--text-tertiary)"}22`,
        color: MOOD_COLORS[mood] || "var(--text-tertiary)",
        textTransform: "capitalize", fontWeight: 600,
      }}>
        {mood}
      </span>
    </div>
  )
}

// ─── Palette Trends Panel ───────────────────────────────────────────────────

export function PaletteTrends({ snapshot, paletteIntel, totalImages, images }: PaletteTrendsProps) {
  if (!snapshot) {
    return (
      <div style={{ padding: "48px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>Collecting palette data</div>
        <div style={{ ...TYPE.body, color: "var(--text-tertiary)", maxWidth: 400, margin: "0 auto", lineHeight: 1.7 }}>
          The visual landscape is being analyzed. Trends will emerge as the gallery refreshes and palette snapshots accumulate.
        </div>
      </div>
    )
  }

  // Derive per-source palettes
  const sourcePalettes = (() => {
    const map: Record<string, { palettes: string[][]; mood: Record<string, number> }> = {}
    for (const img of images) {
      if (!map[img.source]) map[img.source] = { palettes: [], mood: {} }
      if (img.palette && img.palette.length >= 2) {
        map[img.source].palettes.push(img.palette.slice(0, 3).map(c => c.hex))
      }
      if (img.mood) map[img.source].mood[img.mood] = (map[img.source].mood[img.mood] || 0) + 1
    }
    return Object.entries(map)
      .filter(([, v]) => v.palettes.length >= 2)
      .sort((a, b) => b[1].palettes.length - a[1].palettes.length)
      .slice(0, 10)
  })()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "24px 32px 48px" }}>

      {/* ── Mood Spectrum ── */}
      <div>
        <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Current Mood
        </div>
        <MoodSpectrum moods={snapshot.moods} total={totalImages} />
      </div>

      {/* ── Trend Shifts ── */}
      {paletteIntel && paletteIntel.moodShifts.length > 0 && (
        <div style={{ animation: "signal-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 200ms both" }}>
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Shifting
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {paletteIntel.moodShifts.map(shift => (
              <div key={shift.mood} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "var(--bg-surface)", borderRadius: 10, padding: "12px 18px",
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4,
                  background: MOOD_COLORS[shift.mood] || "var(--text-tertiary)",
                }} />
                <span style={{ ...TYPE.sm, color: "var(--text-primary)", textTransform: "capitalize", fontWeight: 500 }}>{shift.mood}</span>
                <span style={{
                  ...TYPE.heading, fontFamily: MONO,
                  color: shift.direction === "rising" ? "var(--live)" : "#ef4444",
                }}>
                  {shift.direction === "rising" ? "+" : "-"}{shift.delta}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recurring Palettes — the hero section ── */}
      {snapshot.trendingPalettes && snapshot.trendingPalettes.length > 0 && (
        <div>
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Recurring Palettes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {snapshot.trendingPalettes.map((p, i) => (
              <PaletteCard key={i} colors={p.colors} sources={p.sources} frequency={p.frequency} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Source Signatures ── */}
      {sourcePalettes.length > 0 && (
        <div style={{ animation: "signal-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 400ms both" }}>
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Source Signatures
          </div>
          <div style={{
            background: "var(--bg-surface)", borderRadius: 12, padding: "8px 18px",
          }}>
            {sourcePalettes.map(([source, data]) => {
              const topPalette = data.palettes[0] || []
              const topMood = Object.entries(data.mood).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral"
              return <SourceStrip key={source} name={source} palette={topPalette} mood={topMood} />
            })}
          </div>
        </div>
      )}
    </div>
  )
}
