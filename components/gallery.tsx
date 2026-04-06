"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, LayoutGrid, Columns2, Square } from "lucide-react"
import { TYPE, MONO } from "@/lib/styles"
import type { GalleryImage, ColorMood } from "@/lib/gallery"
import { PaletteTrends } from "@/components/palette-trends"

// ─── Color Mood Display ─────────────────────────────────────────────────────

const MOOD_LABELS: Record<ColorMood, string> = {
  warm: "Warm",
  cool: "Cool",
  earth: "Earth",
  vivid: "Vivid",
  neutral: "Neutral",
}

const MOOD_COLORS: Record<ColorMood, string> = {
  warm: "#D4A05A",
  cool: "#5A9EB0",
  earth: "#7BAF6A",
  vivid: "#C87A6A",
  neutral: "#888888",
}

// ─── Lightbox ───────────────────────────────────────────────────────────────

function Lightbox({ image, onClose, onPrev, onNext }: {
  image: GalleryImage
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, onPrev, onNext])

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "zoom-out",
      }}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose() }}
        style={{
          position: "absolute", top: 20, right: 20, zIndex: 2,
          background: "transparent", border: "none",
          color: "rgba(255,255,255,0.6)", cursor: "pointer",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,1)" }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)" }}
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        style={{
          position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
          background: "transparent", border: "none",
          color: "rgba(255,255,255,0.4)", cursor: "pointer",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.8)" }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}
      >
        <ChevronLeft size={32} strokeWidth={1} />
      </button>

      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        style={{
          position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
          background: "transparent", border: "none",
          color: "rgba(255,255,255,0.4)", cursor: "pointer",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.8)" }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}
      >
        <ChevronRight size={32} strokeWidth={1} />
      </button>

      {/* Media — image or video */}
      {image.mediaType === "video" && image.videoUrl ? (
        <video
          src={image.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          controls
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: "90vw", maxHeight: "80vh",
            objectFit: "contain", cursor: "default",
            borderRadius: 4,
          }}
        />
      ) : (
        <img
          src={image.url}
          alt=""
          referrerPolicy="no-referrer"
          onClick={e => e.stopPropagation()}
          onError={e => { e.currentTarget.style.display = "none" }}
          style={{
            maxWidth: "90vw", maxHeight: "80vh",
            objectFit: "contain", cursor: "default",
            borderRadius: 4,
          }}
        />
      )}

      {/* Caption — entire block is clickable to source */}
      <div style={{
        position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
        maxWidth: "80vw", textAlign: "center",
      }}>
        {image.linkUrl ? (
          <a
            href={image.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              ...TYPE.sm, color: "rgba(255,255,255,0.5)",
              textDecoration: "none", transition: "color 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; e.currentTarget.style.textDecoration = "underline" }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.textDecoration = "none" }}
          >
            {image.title && <span>{image.title}</span>}
            {image.title && image.source && <span style={{ opacity: 0.4 }}>·</span>}
            <span style={{ fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em" }}>{image.source}</span>
          </a>
        ) : (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            ...TYPE.sm, color: "rgba(255,255,255,0.5)",
          }}>
            {image.title && <span>{image.title}</span>}
            {image.title && image.source && <span style={{ opacity: 0.4 }}>·</span>}
            <span style={{ fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.04em" }}>{image.source}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Gallery Overlay ────────────────────────────────────────────────────────

export function GalleryOverlay({ onClose, excludedSources }: { onClose: () => void; excludedSources?: Set<string> }) {
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [activeMood, setActiveMood] = useState<ColorMood | null>(null)
  const [showTrends, setShowTrends] = useState(false)
  const [galleryCols, setGalleryCols] = useState(typeof window !== "undefined" && window.innerWidth <= 768 ? 2 : 3)
  const [paletteIntel, setPaletteIntel] = useState<{
    trend: string
    moodShifts: { mood: string; direction: "rising" | "falling"; delta: number }[]
    hueShift: number
    saturationShift: number
  } | null>(null)
  const [snapshot, setSnapshot] = useState<{
    moods: Record<string, number>
    avgHue: number
    avgSaturation: number
    avgLightness: number
    trendingPalettes: { colors: string[]; sources: string[]; frequency: number }[]
  } | null>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => {
        setAllImages(data.images || [])
        if (data.paletteIntel) setPaletteIntel(data.paletteIntel)
        if (data.snapshot) setSnapshot(data.snapshot)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Filter out excluded sources first
  const includedImages = excludedSources?.size
    ? allImages.filter(img => !img.source || !excludedSources.has(img.source))
    : allImages

  // Mood counts from server-classified data
  const moodCounts: Record<ColorMood, number> = { warm: 0, cool: 0, earth: 0, vivid: 0, neutral: 0 }
  for (const img of includedImages) { if (img.mood) moodCounts[img.mood]++ }
  const classifiedCount = includedImages.filter(img => img.mood).length

  // Apply mood filter + sort by hue for tonal coherence
  const images = activeMood
    ? includedImages
        .filter(img => img.mood === activeMood)
        .sort((a, b) => (a.hue ?? 0) - (b.hue ?? 0))
    : includedImages

  // Close on Escape (when lightbox isn't open)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxIdx === null) onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose, lightboxIdx])

  const handlePrev = useCallback(() => {
    setLightboxIdx(i => i !== null ? (i - 1 + images.length) % images.length : null)
  }, [images.length])

  const handleNext = useCallback(() => {
    setLightboxIdx(i => i !== null ? (i + 1) % images.length : null)
  }, [images.length])

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 5000,
      background: "var(--bg-primary)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        flexShrink: 0, display: "flex", flexDirection: "column",
        borderBottom: "1px solid var(--border)",
      }}>
        {/* Top row: title + mood filters + count + close */}
        <div style={{
          height: 52, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 24px",
        }}>
          <span style={{
            ...TYPE.sm, fontFamily: MONO,
            color: "var(--accent-muted)", textTransform: "uppercase",
            letterSpacing: "0.08em", flexShrink: 0,
          }}>
            Gallery
          </span>

          {/* Color mood filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" }}>
            <button
              onClick={() => { setActiveMood(null); setShowTrends(false) }}
              style={{
                ...TYPE.sm, padding: "3px 10px", borderRadius: 9999, border: "none",
                background: activeMood === null && !showTrends ? "var(--accent-primary)" : "transparent",
                color: activeMood === null && !showTrends ? "var(--accent-secondary)" : "var(--text-tertiary)",
                fontWeight: activeMood === null && !showTrends ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (activeMood !== null) e.currentTarget.style.background = "var(--bg-elevated)" }}
              onMouseLeave={e => { if (activeMood !== null) e.currentTarget.style.background = "transparent" }}
            >
              All
            </button>
            {(Object.keys(MOOD_LABELS) as ColorMood[]).map(mood => {
              const isActive = activeMood === mood
              const count = moodCounts[mood]
              if (count === 0 && classifiedCount > 10) return null
              return (
                <button
                  key={mood}
                  onClick={() => { setActiveMood(isActive ? null : mood); setShowTrends(false) }}
                  style={{
                    ...TYPE.sm, padding: "3px 10px", borderRadius: 9999, border: "none",
                    display: "inline-flex", alignItems: "center", gap: 5,
                    background: isActive ? "var(--accent-primary)" : "transparent",
                    color: isActive ? "var(--accent-secondary)" : "var(--text-tertiary)",
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-elevated)" }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? "var(--accent-primary)" : "transparent" }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: MOOD_COLORS[mood], flexShrink: 0 }} />
                  {MOOD_LABELS[mood]}
                  {count > 0 && <span style={{ opacity: 0.5 }}>{count}</span>}
                </button>
              )
            })}
            {/* Trends toggle — inline with mood filters */}
            <button
              onClick={() => { setShowTrends(!showTrends); if (!showTrends) setActiveMood(null) }}
              style={{
                ...TYPE.sm, padding: "3px 10px", borderRadius: 9999, border: "none",
                background: showTrends ? "var(--accent-primary)" : "transparent",
                color: showTrends ? "var(--accent-secondary)" : "var(--text-tertiary)",
                fontWeight: showTrends ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!showTrends) e.currentTarget.style.background = "var(--bg-elevated)" }}
              onMouseLeave={e => { if (!showTrends) e.currentTarget.style.background = showTrends ? "var(--accent-primary)" : "transparent" }}
            >
              Trends
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {/* Column toggle */}
            <div style={{ display: "flex", gap: 2, background: "var(--bg-elevated)", borderRadius: 6, padding: 2 }}>
              {([1, 2, 3] as const).map(n => (
                <button
                  key={n}
                  onClick={() => setGalleryCols(n)}
                  title={`${n} column${n > 1 ? "s" : ""}`}
                  style={{
                    width: 26, height: 26, borderRadius: 4, border: "none",
                    background: galleryCols === n ? "var(--bg-surface)" : "transparent",
                    color: galleryCols === n ? "var(--text-primary)" : "var(--text-tertiary)",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 0, transition: "all 0.15s",
                  }}
                >
                  {n === 1 ? <Square size={12} strokeWidth={1.5} /> : n === 2 ? <Columns2 size={12} strokeWidth={1.5} /> : <LayoutGrid size={12} strokeWidth={1.5} />}
                </button>
              ))}
            </div>
            <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
              {images.length}
            </span>
            <button
              onClick={onClose}
              style={{
                background: "transparent", border: "none",
                color: "var(--text-tertiary)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)" }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)" }}
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

      </div>

      {/* Trends panel — replaces grid when active */}
      {showTrends && (
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <PaletteTrends
            snapshot={snapshot}
            paletteIntel={paletteIntel}
            totalImages={allImages.length}
            images={allImages}
          />
        </div>
      )}

      {/* Masonry grid — hidden when trends is active */}
      {!showTrends && <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: galleryCols === 1 ? "16px 8px" : "24px 16px",
      }}>
        {loading ? (
          <div style={{ ...TYPE.body, color: "var(--text-tertiary)", padding: 32 }}>
            <span className="loading-pulse">Loading gallery...</span>
          </div>
        ) : images.length === 0 ? (
          <div style={{ ...TYPE.body, color: "var(--text-tertiary)", padding: 32 }}>
            No images available.
          </div>
        ) : (() => {
          // Build index lookup and distribute round-robin into N columns
          const idxMap = new Map<string, number>()
          images.forEach((img, i) => idxMap.set(img.id, i))
          const cols: typeof images[] = Array.from({ length: galleryCols }, () => [])
          images.forEach((img, i) => cols[i % galleryCols].push(img))
          const gridGap = galleryCols === 1 ? 8 : galleryCols === 2 ? 10 : 14

          return (
            <div style={{ display: "flex", gap: gridGap, alignItems: "flex-start" }}>
              {cols.map((col, colIdx) => (
                <div key={colIdx} style={{ flex: 1, display: "flex", flexDirection: "column", gap: gridGap, minWidth: 0 }}>
                  {col.map((img) => {
                    const globalIdx = idxMap.get(img.id) ?? 0
                    return (
                      <div
                        key={img.id}
                        onClick={() => setLightboxIdx(globalIdx)}
                        style={{
                          borderRadius: 8,
                          overflow: "hidden",
                          cursor: "zoom-in",
                          transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                          animation: `signal-reveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(globalIdx * 20, 600)}ms both`,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.015)" }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                      >
                        {img.mediaType === "video" && img.videoUrl ? (
                          <video
                            src={img.videoUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                            }}
                          />
                        ) : (
                          <img
                            src={img.url}
                            alt={img.title || ""}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }}
                            style={{
                              width: "100%",
                              height: "auto",
                              display: "block",
                            }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })()}
      </div>}

      {/* Lightbox */}
      {lightboxIdx !== null && images[lightboxIdx] && (
        <Lightbox
          image={images[lightboxIdx]}
          onClose={() => setLightboxIdx(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
