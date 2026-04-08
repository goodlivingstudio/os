"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { X, ChevronLeft, ChevronRight, ChevronDown, Shuffle, ThumbsUp, ThumbsDown, Frown } from "lucide-react"
import { TYPE, MONO } from "@/lib/styles"
import instanceConfig, { storageKey } from "@/lib/config"
import { GALLERY_SOURCES, type GalleryImage, type ColorMood } from "@/lib/gallery"
import type { Skin, Article } from "@/lib/types"
import { Ticker } from "@/components/ticker"
// SurfaceTrends removed — Trends feature abandoned globally

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

const GALLERY_CACHE_KEY = storageKey("gallery")
const GALLERY_TTL = 15 * 60 * 1000 // 15 min — shortened during content buildout (restore to 4hr later)
const GALLERY_FETCH_TIMEOUT = 10_000

// ─── Gallery Overlay ────────────────────────────────────────────────────────

export function GalleryOverlay({ onClose, excludedSources, onToggleSource, isDay, onToggleMode, skin, onSkinChange, articles, onDeliberate }: { onClose: () => void; excludedSources?: Set<string>; onToggleSource?: (source: string) => void; isDay?: boolean; onToggleMode?: () => void; skin?: Skin; onSkinChange?: (s: Skin) => void; articles?: Article[]; onDeliberate?: (text: string) => void }) {
  const [allImages, setAllImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [activeMood, setActiveMood] = useState<ColorMood | null>(null)
  const [sourceType, setSourceType] = useState<"all" | "curated" | "ugc">("all")
  // Trends + Sources panels removed — sources now in Config view

  // Detect if this instance has UGC sources (Are.na UGC channel)
  const hasUgc = instanceConfig.gallerySources.some(s => s.name.toLowerCase().includes("ugc"))
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [shuffleKey, setShuffleKey] = useState(0)
  const [curatedIds, setCuratedIds] = useState<Set<string>>(new Set()) // track which images have been curated this session
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768

  const handleCurate = useCallback(async (img: GalleryImage, action: "approve" | "reject" | "low-quality") => {
    setCuratedIds(prev => new Set(prev).add(img.id))
    try {
      await fetch("/api/gallery/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          imageUrl: img.url,
          arenaBlockId: img.arenaBlockId,
          source: img.source,
        }),
      })
      if (action === "reject" || action === "low-quality") {
        setAllImages(prev => prev.filter(i => i.id !== img.id))
        setLightboxIdx(null)
      }
    } catch { /* silent fail — image stays visible */ }
  }, [])
  const galleryCols = isMobile ? 2 : 3

  useEffect(() => {
    // Stale-while-revalidate
    let hasStale = false
    try {
      const raw = localStorage.getItem(GALLERY_CACHE_KEY)
      if (raw) {
        const { ts, data } = JSON.parse(raw)
        if (data?.images?.length) {
          setAllImages(data.images)
          setLoading(false)
          hasStale = true
          if (Date.now() - ts < GALLERY_TTL) return // fresh — skip fetch
        }
      }
    } catch { /* */ }

    if (!hasStale) setLoading(true)
    const abort = new AbortController()
    const timeout = setTimeout(() => abort.abort(), GALLERY_FETCH_TIMEOUT)

    fetch("/api/gallery", { signal: abort.signal })
      .then(r => { clearTimeout(timeout); return r.json() })
      .then(data => {
        setAllImages(data.images || [])
        setLoading(false)
        try { localStorage.setItem(GALLERY_CACHE_KEY, JSON.stringify({ ts: Date.now(), data })) } catch { /* */ }
      })
      .catch(() => { clearTimeout(timeout); setLoading(false) })
  }, [])

  // Filter out excluded sources first
  const sourceFiltered = excludedSources?.size
    ? allImages.filter(img => !img.source || !excludedSources.has(img.source))
    : allImages

  // Source type filter (curated vs UGC)
  const includedImages = sourceType === "all"
    ? sourceFiltered
    : sourceType === "ugc"
      ? sourceFiltered.filter(img => img.source?.toLowerCase().includes("ugc"))
      : sourceFiltered.filter(img => !img.source?.toLowerCase().includes("ugc"))

  // Source type counts
  const ugcCount = sourceFiltered.filter(img => img.source?.toLowerCase().includes("ugc")).length
  const curatedCount = sourceFiltered.length - ugcCount

  // Mood counts from server-classified data
  const moodCounts: Record<ColorMood, number> = { warm: 0, cool: 0, earth: 0, vivid: 0, neutral: 0 }
  for (const img of includedImages) { if (img.mood) moodCounts[img.mood]++ }
  const classifiedCount = includedImages.filter(img => img.mood).length

  // Apply mood filter + sort by hue for tonal coherence
  const filtered = activeMood
    ? includedImages
        .filter(img => img.mood === activeMood)
        .sort((a, b) => (a.hue ?? 0) - (b.hue ?? 0))
    : includedImages

  // Fisher-Yates shuffle, seeded by shuffleKey
  const images = useMemo(() => {
    if (shuffleKey === 0) return filtered
    const arr = [...filtered]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [filtered, shuffleKey]) // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* Ticker — matches main layout */}
      {onToggleMode && <Ticker isDay={isDay} onToggle={onToggleMode} skin={skin} onSkinChange={onSkinChange} />}

      {/* Header — desktop: single row (title + pills + close). Mobile: filter row only (title in app header) */}
      <div style={{ flexShrink: 0, borderBottom: "1px solid var(--border)" }}>
        {isMobile ? (
          /* ── Mobile: filter dropdown flush left, matching Signal/Sound pattern ── */
          <div style={{ display: "flex", alignItems: "center", padding: "12px 16px 0", gap: 8 }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMobileFilterOpen(v => !v)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)",
                  background: "transparent", cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {activeMood && <span style={{ width: 6, height: 6, borderRadius: "50%", background: MOOD_COLORS[activeMood], flexShrink: 0 }} />}
                <span style={{ ...TYPE.sm, color: "var(--accent-secondary)", fontWeight: 500 }}>
                  {activeMood ? MOOD_LABELS[activeMood] : "All"}
                </span>
                <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.6, fontVariantNumeric: "tabular-nums" }}>
                  {images.length}
                </span>
                <ChevronDown size={12} style={{ color: "var(--text-tertiary)", transition: "transform 0.2s", transform: mobileFilterOpen ? "rotate(180deg)" : "none" }} />
              </button>
              {mobileFilterOpen && (
                <div style={{
                  position: "absolute", top: 38, left: 0, zIndex: 100, minWidth: 180,
                  background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 10,
                  padding: "4px 0", animation: "status-fade 0.15s ease both",
                }}>
                  <button
                    onClick={() => { setActiveMood(null); setMobileFilterOpen(false) }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                      padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer",
                      ...TYPE.sm, color: !activeMood ? "var(--accent-secondary)" : "var(--text-secondary)", fontWeight: !activeMood ? 600 : 400,
                    }}
                  >
                    <span>All</span>
                    <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>{includedImages.length}</span>
                  </button>
                  {(Object.keys(MOOD_LABELS) as ColorMood[]).map(mood => {
                    const count = moodCounts[mood]
                    if (count === 0 && classifiedCount > 10) return null
                    const isActive = activeMood === mood
                    return (
                      <button
                        key={mood}
                        onClick={() => { setActiveMood(isActive ? null : mood); setMobileFilterOpen(false) }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                          padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer",
                          ...TYPE.sm, color: isActive ? "var(--accent-secondary)" : "var(--text-secondary)", fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: MOOD_COLORS[mood] }} />
                          {MOOD_LABELS[mood]}
                        </span>
                        <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>{count}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <button
              onClick={() => setShuffleKey(k => k + 1)}
              aria-label="Shuffle images"
              style={{
                width: 28, height: 28, marginLeft: "auto",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none", borderRadius: 6,
                color: "var(--text-tertiary)", cursor: "pointer", padding: 0,
              }}
            >
              <Shuffle size={14} strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          /* ── Desktop: title + pills + source chips + close ── */
          <div style={{
            height: 52, display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ ...TYPE.sm, color: "var(--accent-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Surface
              </span>
              <button
                onClick={() => setShuffleKey(k => k + 1)}
                title="Shuffle"
                aria-label="Shuffle images"
                style={{
                  width: 28, height: 28,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", borderRadius: 6,
                  color: "var(--text-tertiary)", cursor: "pointer",
                  transition: "all 0.15s", padding: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-secondary)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)" }}
              >
                <Shuffle size={14} strokeWidth={1.5} />
              </button>
              <span style={{ ...TYPE.xs, color: "var(--text-tertiary)" }}>
                {images.length}
              </span>
            </div>

            {/* Color mood pills */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" }}>
              <button
                onClick={() => { setActiveMood(null) }}
                style={{
                  ...TYPE.sm, padding: "3px 10px", borderRadius: 8, border: "none",
                  background: !activeMood ? "var(--accent-primary)" : "transparent",
                  color: !activeMood ? "var(--accent-secondary)" : "var(--text-tertiary)",
                  fontWeight: !activeMood ? 600 : 400,
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
                    onClick={() => { setActiveMood(isActive ? null : mood) }}
                    style={{
                      ...TYPE.sm, padding: "3px 10px", borderRadius: 8, border: "none",
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

              {/* Source type chips — Explore only */}
              {hasUgc && (
                <>
                  <span style={{ width: 1, height: 16, background: "var(--border)", flexShrink: 0, margin: "0 4px" }} />
                  {([
                    { id: "curated" as const, label: "Curated", count: curatedCount },
                    { id: "ugc" as const, label: "UGC", count: ugcCount },
                  ] as const).map(opt => {
                    const isActive = sourceType === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSourceType(isActive ? "all" : opt.id)}
                        style={{
                          ...TYPE.sm, padding: "3px 10px", borderRadius: 8, border: "none",
                          display: "inline-flex", alignItems: "center", gap: 5,
                          background: isActive ? "var(--accent-primary)" : "transparent",
                          color: isActive ? "var(--accent-secondary)" : "var(--text-tertiary)",
                          fontWeight: isActive ? 600 : 400,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-elevated)" }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}
                      >
                        {opt.label}
                        {opt.count > 0 && <span style={{ opacity: 0.5 }}>{opt.count}</span>}
                      </button>
                    )
                  })}
                </>
              )}
            </div>

            {/* Close — desktop only */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <button
                onClick={onClose}
                title="Close"
                style={{
                  width: 28, height: 28,
                  background: "transparent", border: "none", borderRadius: 6,
                  color: "var(--text-tertiary)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s", padding: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-secondary)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-tertiary)" }}
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Masonry grid */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        padding: "24px 16px",
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
          const gridGap = galleryCols === 2 ? 10 : 14

          return (
            <div key={`${shuffleKey}-${activeMood ?? "all"}`} style={{ display: "flex", gap: gridGap, alignItems: "flex-start" }}>
              {cols.map((col, colIdx) => (
                <div key={colIdx} style={{ flex: 1, display: "flex", flexDirection: "column", gap: gridGap, minWidth: 0 }}>
                  {col.map((img, rowIdx) => {
                    const globalIdx = idxMap.get(img.id) ?? 0
                    // Stagger by row position within column + slight column offset
                    const delay = rowIdx * 60 + colIdx * 30
                    return (
                      <div
                        key={img.id}
                        className="gallery-card"
                        onClick={() => setLightboxIdx(globalIdx)}
                        style={{
                          borderRadius: 8,
                          overflow: "hidden",
                          cursor: "zoom-in",
                          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                          animation: `gallery-reveal 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(delay, 1400)}ms both`,
                          position: "relative",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.015)" }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                      >
                        {/* Curation buttons — appear on hover */}
                        {!curatedIds.has(img.id) && (
                          <div className="gallery-curate" style={{
                            position: "absolute", bottom: 8, right: 8, zIndex: 2,
                            display: "flex", gap: 3,
                            opacity: 0, transition: "opacity 0.2s",
                            pointerEvents: "none",
                          }}>
                            <button
                              onClick={e => { e.stopPropagation(); handleCurate(img, "approve") }}
                              title="Like — keep this image"
                              style={{
                                width: 26, height: 26, borderRadius: 5,
                                background: "rgba(0,0,0,0.55)", border: "none",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "rgba(255,255,255,0.85)", pointerEvents: "auto",
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              <ThumbsUp size={12} strokeWidth={1.8} />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleCurate(img, "low-quality") }}
                              title="Bad quality — subject is fine, image isn't"
                              style={{
                                width: 26, height: 26, borderRadius: 5,
                                background: "rgba(0,0,0,0.55)", border: "none",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "rgba(255,255,255,0.85)", pointerEvents: "auto",
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              <Frown size={12} strokeWidth={1.8} />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleCurate(img, "reject") }}
                              title="Don't like — remove and avoid content like this"
                              style={{
                                width: 26, height: 26, borderRadius: 5,
                                background: "rgba(0,0,0,0.55)", border: "none",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", color: "rgba(255,255,255,0.85)", pointerEvents: "auto",
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              <ThumbsDown size={12} strokeWidth={1.8} />
                            </button>
                          </div>
                        )}
                        {curatedIds.has(img.id) && (
                          <div style={{
                            position: "absolute", bottom: 8, right: 8, zIndex: 2,
                            padding: "2px 7px", borderRadius: 5,
                            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                            ...TYPE.xs, color: "rgba(255,255,255,0.6)",
                          }}>
                            ✓
                          </div>
                        )}
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
