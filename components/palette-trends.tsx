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

// ─── Palette Swatch Row ─────────────────────────────────────────────────────

function PaletteRow({ colors, sources, frequency }: TrendingPalette) {
  return (
    <div style={{
      background: "var(--bg-surface)", borderRadius: 10, padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      {/* Color swatches */}
      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
        {colors.map((hex, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: 6,
            background: hex,
            border: "1px solid rgba(255,255,255,0.08)",
          }} />
        ))}
      </div>

      {/* Hex values */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-secondary)", marginBottom: 4 }}>
          {colors.join(" · ")}
        </div>
        <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
          {sources.slice(0, 3).join(", ")}{sources.length > 3 ? ` +${sources.length - 3}` : ""}
        </div>
      </div>

      {/* Frequency */}
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
          {frequency}
        </div>
        <div style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>images</div>
      </div>
    </div>
  )
}

// ─── Mood Distribution Bar ──────────────────────────────────────────────────

function MoodBar({ moods, total }: { moods: Record<string, number>; total: number }) {
  if (total === 0) return null
  const entries = Object.entries(moods).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])

  return (
    <div>
      {/* Stacked bar */}
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 10 }}>
        {entries.map(([mood, count]) => (
          <div key={mood} style={{
            width: `${(count / total) * 100}%`,
            background: MOOD_COLORS[mood] || "var(--text-tertiary)",
            transition: "width 0.6s",
          }} />
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {entries.map(([mood, count]) => (
          <div key={mood} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: MOOD_COLORS[mood] || "var(--text-tertiary)" }} />
            <span style={{ ...TYPE.xs, color: "var(--text-secondary)", textTransform: "capitalize" }}>{mood}</span>
            <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)" }}>{Math.round((count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Palette Trends Panel ───────────────────────────────────────────────────

export function PaletteTrends({ snapshot, paletteIntel, totalImages, images }: PaletteTrendsProps) {
  if (!snapshot) {
    return (
      <div style={{ padding: 32, ...TYPE.body, color: "var(--text-tertiary)" }}>
        Palette data collecting. Trends will appear after the first gallery refresh cycle.
      </div>
    )
  }

  // Derive per-source dominant palettes
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
      .slice(0, 8)
  })()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "0 32px 32px" }}>

      {/* ── Today's Palette Read ── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          {/* Average color swatch */}
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `hsl(${snapshot.avgHue}, ${Math.round(snapshot.avgSaturation * 100)}%, ${Math.round(snapshot.avgLightness * 100)}%)`,
            border: "1px solid rgba(255,255,255,0.08)",
          }} />
          <div>
            <div style={{ ...TYPE.sm, color: "var(--text-primary)", fontWeight: 500 }}>
              Today's Average
            </div>
            <div style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)" }}>
              hue {snapshot.avgHue}° · sat {Math.round(snapshot.avgSaturation * 100)}% · light {Math.round(snapshot.avgLightness * 100)}%
            </div>
          </div>
        </div>

        {/* Mood distribution bar */}
        <MoodBar moods={snapshot.moods} total={totalImages} />
      </div>

      {/* ── Trend Shifts ── */}
      {paletteIntel && paletteIntel.moodShifts.length > 0 && (
        <div>
          <div style={{ ...metaStyle, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Shifts from Weekly Average
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {paletteIntel.moodShifts.map(shift => (
              <div key={shift.mood} style={{
                background: "var(--bg-surface)", borderRadius: 8, padding: "8px 14px",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: MOOD_COLORS[shift.mood] || "var(--text-tertiary)" }} />
                <span style={{ ...TYPE.sm, color: "var(--text-secondary)", textTransform: "capitalize" }}>{shift.mood}</span>
                <span style={{
                  ...TYPE.sm, fontFamily: MONO, fontWeight: 600,
                  color: shift.direction === "rising" ? "var(--live)" : "#ef4444",
                }}>
                  {shift.direction === "rising" ? "↑" : "↓"}{shift.delta}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Trending Palettes ── */}
      {snapshot.trendingPalettes && snapshot.trendingPalettes.length > 0 && (
        <div>
          <div style={{ ...metaStyle, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Recurring Palettes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {snapshot.trendingPalettes.map((p, i) => (
              <PaletteRow key={i} colors={p.colors} sources={p.sources} frequency={p.frequency} />
            ))}
          </div>
        </div>
      )}

      {/* ── Source Color Signatures ── */}
      {sourcePalettes.length > 0 && (
        <div>
          <div style={{ ...metaStyle, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
            Source Signatures
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sourcePalettes.map(([source, data]) => {
              // Show the first palette from this source as representative
              const topPalette = data.palettes[0]
              const topMood = Object.entries(data.mood).sort((a, b) => b[1] - a[1])[0]
              return (
                <div key={source} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "6px 0",
                }}>
                  {/* Source palette swatches */}
                  <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                    {topPalette?.map((hex, i) => (
                      <div key={i} style={{
                        width: 18, height: 18, borderRadius: 4,
                        background: hex,
                        border: "1px solid rgba(255,255,255,0.06)",
                      }} />
                    ))}
                  </div>
                  <span style={{ flex: 1, ...TYPE.sm, fontFamily: MONO, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {source}
                  </span>
                  <span style={{ ...TYPE.xs, color: MOOD_COLORS[topMood?.[0] || "neutral"], textTransform: "capitalize" }}>
                    {topMood?.[0] || "—"}
                  </span>
                  <span style={{ ...TYPE.xs, fontFamily: MONO, color: "var(--text-tertiary)" }}>
                    {data.palettes.length}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
