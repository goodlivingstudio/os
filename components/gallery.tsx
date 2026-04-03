"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { TYPE, MONO } from "@/lib/styles"
import type { GalleryImage } from "@/lib/gallery"

// ─── Color Mood Classification ──────────────────────────────────────────────

type ColorMood = "warm" | "cool" | "mono" | "earth" | "vivid" | "muted"

const MOOD_LABELS: Record<ColorMood, string> = {
  warm: "Warm",
  cool: "Cool",
  mono: "Mono",
  earth: "Earth",
  vivid: "Vivid",
  muted: "Muted",
}

const MOOD_COLORS: Record<ColorMood, string> = {
  warm: "#D4A05A",
  cool: "#5A9EB0",
  mono: "#888888",
  earth: "#7BAF6A",
  vivid: "#C87A6A",
  muted: "#9A85B8",
}

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

  // Mono: very low saturation
  if (s < 0.12) return "mono"

  // Muted: low saturation
  if (s < 0.3) return "muted"

  // Vivid: high saturation
  if (s > 0.7) return "vivid"

  // Earth: greens, browns, tans (low-medium saturation, warm hue range)
  if (s < 0.55 && ((h >= 30 && h <= 90) || (h >= 90 && h <= 160)) && l < 0.65) return "earth"

  // Warm: reds, oranges, yellows (hue 0-60 or 330-360)
  if (h <= 60 || h >= 330) return "warm"

  // Cool: blues, teals, purples (hue 180-300)
  if (h >= 180 && h <= 300) return "cool"

  // Green range — earth if desaturated, otherwise cool
  if (h > 60 && h < 180) return s < 0.5 ? "earth" : "cool"

  return "warm" // fallback
}

function extractDominantColor(img: HTMLImageElement): [number, number, number] | null {
  try {
    const canvas = document.createElement("canvas")
    const size = 50 // sample at 50px for speed
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.drawImage(img, 0, 0, size, size)
    const data = ctx.getImageData(0, 0, size, size).data
    let rSum = 0, gSum = 0, bSum = 0, count = 0
    for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
      rSum += data[i]
      gSum += data[i + 1]
      bSum += data[i + 2]
      count++
    }
    if (count === 0) return null
    return [Math.round(rSum / count), Math.round(gSum / count), Math.round(bSum / count)]
  } catch {
    return null // CORS or other canvas error
  }
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

      {/* Image — try loading, hide alt text on error */}
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

export function GalleryOverlay({ onClose }: { onClose: () => void }) {
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [activeMood, setActiveMood] = useState<ColorMood | null>(null)
  const [imageMoods, setImageMoods] = useState<Record<string, ColorMood>>({})
  const analyzedRef = useRef(new Set<string>())

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => { setAllImages(data.images || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Analyze image color on load — called from each img onLoad
  const analyzeImage = useCallback((img: HTMLImageElement, id: string) => {
    if (analyzedRef.current.has(id)) return
    analyzedRef.current.add(id)
    const color = extractDominantColor(img)
    if (color) {
      const mood = classifyMood(color[0], color[1], color[2])
      setImageMoods(prev => ({ ...prev, [id]: mood }))
    }
  }, [])

  // Mood counts
  const moodCounts: Record<ColorMood, number> = { warm: 0, cool: 0, mono: 0, earth: 0, vivid: 0, muted: 0 }
  for (const mood of Object.values(imageMoods)) moodCounts[mood]++

  // Apply mood filter
  const images = activeMood ? allImages.filter(img => imageMoods[img.id] === activeMood) : allImages

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
              onClick={() => setActiveMood(null)}
              style={{
                ...TYPE.sm, padding: "3px 10px", borderRadius: 9999, border: "none",
                background: activeMood === null ? "var(--accent-primary)" : "transparent",
                color: activeMood === null ? "var(--accent-secondary)" : "var(--text-tertiary)",
                fontWeight: activeMood === null ? 600 : 400,
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
              if (count === 0 && Object.keys(imageMoods).length > 10) return null
              return (
                <button
                  key={mood}
                  onClick={() => setActiveMood(isActive ? null : mood)}
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
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <span style={{ ...TYPE.sm, color: "var(--text-tertiary)" }}>
              {images.length} images
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

      {/* Masonry grid — manual 3-column distribution, vertical scroll */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: 32,
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
          // Build index lookup and distribute round-robin into 3 columns
          const idxMap = new Map<string, number>()
          images.forEach((img, i) => idxMap.set(img.id, i))
          const cols: typeof images[] = [[], [], []]
          images.forEach((img, i) => cols[i % 3].push(img))

          return (
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              {cols.map((col, colIdx) => (
                <div key={colIdx} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
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
                        <img
                          src={img.url}
                          alt={img.title || ""}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onLoad={e => analyzeImage(e.currentTarget, img.id)}
                          onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }}
                          style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })()}
      </div>

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
