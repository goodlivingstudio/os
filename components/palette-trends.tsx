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
    }}>
      {/* Color bars — large, immersive */}
      <div style={{ display: "flex", height: 120 }}>
        {colors.map((hex, i) => (
          <div key={i} style={{
            flex: 1,
            background: hex,
            transition: "flex 0.3s ease",
          }} />
        ))}
      </div>
      {/* Details */}
      <div style={{
        padding: "14px 18px",
        background: "var(--bg-surface)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-secondary)", letterSpacing: "0.02em" }}>
            {colors.join("  ·  ")}
          </div>
          <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", marginTop: 4 }}>
            {sources.slice(0, 3).join(", ")}{sources.length > 3 ? ` +${sources.length - 3}` : ""}
          </div>
        </div>
        <div style={{
          ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)",
          background: "var(--bg-elevated)", padding: "3px 8px", borderRadius: 6,
        }}>
          {frequency} images
        </div>
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
      {/* Thick gradient bar */}
      <div style={{ display: "flex", height: 32, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
        {entries.map(([mood, count]) => (
          <div key={mood} style={{
            width: `${(count / total) * 100}%`,
            background: MOOD_COLORS[mood] || "var(--text-tertiary)",
            transition: "width 0.6s",
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {(count / total) > 0.12 && (
              <span style={{
                ...TYPE.xs, color: "rgba(0,0,0,0.5)", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                {Math.round((count / total) * 100)}%
              </span>
            )}
          </div>
        ))}
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
      display: "flex", alignItems: "center", gap: 12, padding: "8px 0",
    }}>
      {/* Mini palette */}
      <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
        {palette.map((hex, i) => (
          <div key={i} style={{
            width: 24, height: 24, borderRadius: 5,
            background: hex,
          }} />
        ))}
      </div>
      <span style={{ flex: 1, ...TYPE.sm, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name}
      </span>
      <span style={{
        ...TYPE.xs, padding: "2px 8px", borderRadius: 9999,
        background: `${MOOD_COLORS[mood] || "var(--text-tertiary)"}22`,
        color: MOOD_COLORS[mood] || "var(--text-tertiary)",
        textTransform: "capitalize", fontWeight: 500,
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
