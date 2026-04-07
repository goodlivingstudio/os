"use client"

import { TYPE } from "@/lib/styles"

// ─── Palette Swatch ─────────────────────────────────────────────────────────
// Renders a color direction's palette as two rows of swatches:
// top row on a light ground, bottom row on a dark ground.
// Shows how the palette reads in both modes.

interface PaletteSwatchProps {
  palette: string[]
  showLabels?: boolean
}

export function PaletteSwatch({ palette, showLabels = true }: PaletteSwatchProps) {
  if (!palette?.length) return null

  const swatchH = 28
  const gap = 3
  const radius = 4

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* Light ground row */}
      <div style={{
        display: "flex", gap, padding: 4,
        background: "rgba(240, 238, 235, 0.95)", borderRadius: 6,
      }}>
        {palette.map((hex, i) => (
          <div key={`light-${i}`} style={{
            flex: 1, height: swatchH,
            background: hex, borderRadius: radius,
          }} />
        ))}
      </div>

      {/* Dark ground row */}
      <div style={{
        display: "flex", gap, padding: 4,
        background: "rgba(18, 18, 20, 0.95)", borderRadius: 6,
      }}>
        {palette.map((hex, i) => (
          <div key={`dark-${i}`} style={{
            flex: 1, height: swatchH,
            background: hex, borderRadius: radius,
          }} />
        ))}
      </div>

      {/* Hex labels */}
      {showLabels && (
        <div style={{ display: "flex", gap }}>
          {palette.map((hex, i) => (
            <span key={`label-${i}`} style={{
              flex: 1,
              ...TYPE.xs,
              color: "var(--text-tertiary)",
              letterSpacing: "0.02em",
            }}>
              {hex}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
