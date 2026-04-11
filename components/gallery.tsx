"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { X, ChevronLeft, ChevronRight, ChevronDown, Shuffle, ThumbsUp, ThumbsDown, Frown, Globe, LayoutGrid, Square } from "lucide-react"
import { TYPE, MONO, labelStyle } from "@/lib/styles"
import instanceConfig, { storageKey, MOBILE_BREAKPOINT } from "@/lib/config"
import { GALLERY_SOURCES, type GalleryImage, type ColorMood, type Biome } from "@/lib/gallery"
import type { Skin, Article } from "@/lib/types"
import { Ticker } from "@/components/ticker"

// ─── Color Mood Display ─────────────────────────────────────────────────────

const MOOD_LABELS: Record<ColorMood, string> = {
  warm: "Warm",
  cool: "Cool",
  sapling: "Sapling",
  vivid: "Vivid",
  neutral: "Neutral",
}

const MOOD_COLORS: Record<ColorMood, string> = {
  warm: "#D4A05A",
  cool: "#5A9EB0",
  sapling: "#7BAF6A",
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
        aria-label="Close gallery"
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
        aria-label="Previous image"
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
        aria-label="Next image"
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
  const [activeBiome, setActiveBiome] = useState<Biome | null>(null)
  // Trends + Sources panels removed — sources now in Config view

  // Detect if this instance has UGC sources (Are.na UGC channel)
  const hasUgc = instanceConfig.gallerySources.some(s => s.name.toLowerCase().includes("ugc"))
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [shuffleKey, setShuffleKey] = useState(0)
  const [curatedIds, setCuratedIds] = useState<Set<string>>(new Set()) // curated this session (any of approve/reject/low-quality/wrong-biome)
  const [approvedUrls, setApprovedUrls] = useState<Set<string>>(new Set()) // persistent approved set from server — hydrated on mount
  const isMobile = typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT

  // Hydrate the persistent approved set from the server on mount. This is what
  // makes liked images remember across sessions — the server-side APPROVED_KEY
  // set in KV has always been persistent, but the client used to start every
  // session with an empty curatedIds state, so there was no way to tell at a
  // glance which images had already been liked. Now on mount we fetch the
  // approved URL list and any image whose url is in that set gets a persistent
  // visual marker (see the approved dot below the hover menu).
  useEffect(() => {
    fetch("/api/gallery/curate?type=approved")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.urls && Array.isArray(data.urls)) {
          setApprovedUrls(new Set(data.urls))
        }
      })
      .catch(() => { /* silent — KV may be unavailable in dev */ })
  }, [])

  const handleCurate = useCallback(async (img: GalleryImage, action: "approve" | "reject" | "low-quality" | "wrong-biome") => {
    setCuratedIds(prev => new Set(prev).add(img.id))
    // Optimistic local update for the persistent approved set — keeps the UI
    // in sync with what the server is about to record, so the persistent dot
    // appears immediately on approve and disappears immediately on reject or
    // low-quality (both of which remove the image from the gallery anyway,
    // but also implicitly un-approve it server-side).
    if (action === "approve") {
      setApprovedUrls(prev => new Set(prev).add(img.url))
    } else if (action === "reject" || action === "low-quality") {
      setApprovedUrls(prev => {
        const next = new Set(prev)
        next.delete(img.url)
        return next
      })
    }
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
        // Image removed entirely
        setAllImages(prev => prev.filter(i => i.id !== img.id))
        setLightboxIdx(null)
      } else if (action === "wrong-biome") {
        // Image stays in the gallery; just clear its biome tag locally so the
        // UI matches the server state without waiting for a refetch. The image
        // drops out of any active biome filter immediately.
        setAllImages(prev => prev.map(i => i.id === img.id ? { ...i, biome: undefined } : i))
      }
    } catch { /* silent fail — image stays visible */ }
  }, [])
  const [mobileGalleryCols, setMobileGalleryCols] = useState(2)
  const galleryCols = isMobile ? mobileGalleryCols : 3

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
  const moodCounts: Record<ColorMood, number> = { warm: 0, cool: 0, sapling: 0, vivid: 0, neutral: 0 }
  for (const img of includedImages) { if (img.mood) moodCounts[img.mood]++ }
  const classifiedCount = includedImages.filter(img => img.mood).length

  // Biome counts — only for instances that opt in via config.features.galleryBiomes.
  // Explore uses biome as a first-class filter taxonomy for public-lands imagery;
  // Dispatch and other products leave this off. The hasBiomes check requires BOTH
  // the feature flag to be true AND at least one image to actually carry a biome
  // tag (a double-guard: config off → classification skipped in /api/gallery; UI
  // off → filter chips never render even if a stale cached image sneaks through).
  const biomesEnabled = instanceConfig.features?.galleryBiomes === true
  const BIOME_LABELS: Record<Biome, string> = {
    alpine: "Alpine", forest: "Forest", desert: "Desert", coastal: "Coastal",
    wetland: "Wetland", prairie: "Prairie", arctic: "Arctic", underwater: "Underwater",
  }
  const biomeCounts: Record<Biome, number> = { alpine: 0, forest: 0, desert: 0, coastal: 0, wetland: 0, prairie: 0, arctic: 0, underwater: 0 }
  if (biomesEnabled) {
    for (const img of includedImages) { if (img.biome) biomeCounts[img.biome]++ }
  }
  const hasBiomes = biomesEnabled && Object.values(biomeCounts).some(c => c > 0)

  // Apply biome filter first, then mood filter
  const biomeFiltered = activeBiome
    ? includedImages.filter(img => img.biome === activeBiome)
    : includedImages

  const filtered = activeMood
    ? biomeFiltered
        .filter(img => img.mood === activeMood)
        .sort((a, b) => (a.hue ?? 0) - (b.hue ?? 0))
    : biomeFiltered

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
      {/* Ticker — desktop only (mobile has shared app header) */}
      {onToggleMode && !isMobile && <Ticker isDay={isDay} onToggle={onToggleMode} skin={skin} onSkinChange={onSkinChange} />}

      {/* Header — desktop: single row (title + pills + close). Mobile: filter row only (title in app header) */}
      <div style={{ flexShrink: 0, borderBottom: isMobile ? "none" : "1px solid var(--border)" }}>
        {isMobile ? (
          /* ── Mobile: filter dropdown flush left, matching Signal/Sound pattern ── */
          <div style={{ display: "flex", alignItems: "center", padding: "8px 16px 8px", gap: 4 }}>
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
                <span style={{ ...TYPE.xs, color: "var(--accent-secondary)", fontWeight: 400 }}>
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
                  background: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: 10,
                  padding: "4px 0", animation: "dropdown-enter 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
                }}>
                  <button
                    onClick={() => { setActiveMood(null); setMobileFilterOpen(false) }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                      padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer",
                      ...TYPE.xs, color: !activeMood ? "var(--accent-secondary)" : "var(--text-secondary)", fontWeight: 400,
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
                          ...TYPE.xs, color: isActive ? "var(--accent-secondary)" : "var(--text-secondary)", fontWeight: 400,
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
                width: 36, height: 36, marginLeft: "auto",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none", borderRadius: 8,
                color: "var(--text-tertiary)", cursor: "pointer", padding: 0,
              }}
            >
              <Shuffle size={16} strokeWidth={1.5} />
            </button>
            {isMobile && (
              <button
                onClick={() => setMobileGalleryCols(c => c === 2 ? 1 : 2)}
                aria-label={mobileGalleryCols === 2 ? "Single column" : "Two columns"}
                style={{
                  width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", borderRadius: 8,
                  color: "var(--text-tertiary)", cursor: "pointer", padding: 0,
                }}
              >
                {mobileGalleryCols === 2 ? <Square size={16} strokeWidth={1.5} /> : <LayoutGrid size={16} strokeWidth={1.5} />}
              </button>
            )}
          </div>
        ) : (
          /* ── Desktop: title + pills + source chips + close ── */
          <div style={{
            height: 40, display: "flex", alignItems: "center",
            justifyContent: "space-between", padding: "0 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ ...labelStyle, color: "var(--accent-muted)" }}>
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
                  fontWeight: 400,
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
                      fontWeight: 400,
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
                          fontWeight: 400,
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
              {/* Biome filter chips — Explore only, after mood filters */}
              {hasBiomes && (
                <>
                  <span style={{ width: 1, height: 16, background: "var(--border)", flexShrink: 0, margin: "0 4px" }} />
                  {(Object.keys(BIOME_LABELS) as Biome[]).map(biome => {
                    const count = biomeCounts[biome]
                    if (count === 0) return null
                    const isActive = activeBiome === biome
                    return (
                      <button
                        key={biome}
                        onClick={() => setActiveBiome(isActive ? null : biome)}
                        style={{
                          ...TYPE.sm, padding: "3px 10px", borderRadius: 8, border: "none",
                          display: "inline-flex", alignItems: "center", gap: 5,
                          background: isActive ? "var(--accent-primary)" : "transparent",
                          color: isActive ? "var(--accent-secondary)" : "var(--text-tertiary)",
                          fontWeight: 400,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-elevated)" }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}
                      >
                        {BIOME_LABELS[biome]}
                        <span style={{ opacity: 0.5 }}>{count}</span>
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
        padding: "20px",
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
          const gridGap = galleryCols === 2 ? 8 : 16

          return (
            <div key={`${shuffleKey}-${activeMood ?? "all"}`} style={{ display: "flex", gap: gridGap, alignItems: "flex-start", transition: "gap 0.3s ease" }}>
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
                          animation: `gallery-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${Math.min(delay, 1400)}ms both`,
                          position: "relative",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.015)" }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)" }}
                      >
                        {/* Curation buttons — appear on hover only. The image is visually
                            untouched at rest (restraint discipline: no UI on the image unless
                            you hover). Approved state is communicated inside this menu, not
                            on top of the image itself. */}
                        {!curatedIds.has(img.id) && !isMobile && (
                          <div className="gallery-curate" style={{
                            position: "absolute", bottom: 8, right: 8, zIndex: 2,
                            display: "flex", gap: 3,
                            opacity: 0, transition: "opacity 0.2s",
                            pointerEvents: "none",
                          }}>
                            {/* The Like slot has two states:
                                - Not approved: clickable ThumbsUp button (adds to server APPROVED set)
                                - Already approved: non-interactive indicator showing the image is
                                  already liked and protected from the daily decay cron. Same slot,
                                  different treatment — the visual shift is the only signal that
                                  this image has been curated before. The other three buttons
                                  (wrong-biome, low-quality, reject) remain clickable so you can
                                  still change your mind about a previously-liked image. */}
                            {approvedUrls.has(img.url) ? (
                              <div
                                title="Liked — protected from daily decay"
                                style={{
                                  width: 26, height: 26, borderRadius: 5,
                                  background: "rgba(255,255,255,0.20)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  color: "rgba(255,255,255,0.95)", pointerEvents: "auto",
                                  backdropFilter: "blur(8px)",
                                }}
                              >
                                <ThumbsUp size={12} strokeWidth={2.2} fill="currentColor" />
                              </div>
                            ) : (
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
                            )}
                            {/* Wrong biome — only renders when the instance opted into biome
                                classification AND this specific image currently carries a
                                biome tag. The image stays in the gallery; only its biome
                                tag is cleared server-side. Explore-only at the moment. */}
                            {biomesEnabled && img.biome && (
                              <button
                                onClick={e => { e.stopPropagation(); handleCurate(img, "wrong-biome") }}
                                title={`Wrong biome — image is good, but "${BIOME_LABELS[img.biome]}" is the wrong category. Keeps the image, clears the tag.`}
                                style={{
                                  width: 26, height: 26, borderRadius: 5,
                                  background: "rgba(0,0,0,0.55)", border: "none",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  cursor: "pointer", color: "rgba(255,255,255,0.85)", pointerEvents: "auto",
                                  backdropFilter: "blur(8px)",
                                }}
                              >
                                <Globe size={12} strokeWidth={1.8} />
                              </button>
                            )}
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
