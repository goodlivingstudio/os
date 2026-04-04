"use client"

import { useState, useEffect } from "react"
import { TYPE, MONO, metaStyle } from "@/lib/styles"
import type { ColorMood, ColorSwatch, GalleryImage } from "@/lib/gallery"
import { PaletteTrends } from "@/components/palette-trends"

// ─── Trends View — standalone main nav view ─────────────────────────────────

export function TrendsView() {
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [snapshot, setSnapshot] = useState<{
    moods: Record<string, number>
    avgHue: number
    avgSaturation: number
    avgLightness: number
    trendingPalettes: { colors: string[]; sources: string[]; frequency: number }[]
  } | null>(null)
  const [paletteIntel, setPaletteIntel] = useState<{
    trend: string
    moodShifts: { mood: string; direction: "rising" | "falling"; delta: number }[]
    hueShift: number
    saturationShift: number
  } | null>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => {
        setImages(data.images || [])
        if (data.snapshot) setSnapshot(data.snapshot)
        if (data.paletteIntel) setPaletteIntel(data.paletteIntel)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--bg-primary)" }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, height: 40, display: "flex", alignItems: "center",
        padding: "0 20px", borderBottom: "1px solid var(--border)",
      }}>
        <span style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--accent-muted)", textTransform: "uppercase" }}>
          Visual Trends
        </span>
        {images.length > 0 && (
          <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", marginLeft: 10 }}>
            {images.length} images analyzed
          </span>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {loading ? (
          <div style={{ padding: "20px 32px", ...TYPE.body, color: "var(--text-tertiary)" }}>
            <span className="loading-pulse">Analyzing visual landscape...</span>
          </div>
        ) : (
          <PaletteTrends
            snapshot={snapshot}
            paletteIntel={paletteIntel}
            totalImages={images.length}
            images={images}
          />
        )}
      </div>
    </main>
  )
}
