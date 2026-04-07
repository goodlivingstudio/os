"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { createPortal } from "react-dom"
import { Radio, AudioLines, Blend, Send, Brain, Settings, ChevronRight, ChevronLeft, Minimize2, Aperture, SunMedium, MoonStar, Menu, ChevronDown, Activity } from "lucide-react"
import { Ticker } from "@/components/ticker"
import { LeftRail } from "@/components/left-rail"
import { useChiefOfStaff, ChiefOfStaffBand } from "@/components/chief-of-staff"
import { FeedCard, SignalCard } from "@/components/feed-card"
import { Cerebro } from "@/components/cerebro"
import { SynthesisView } from "@/components/synthesis-view"
import { AudioView } from "@/components/audio-view"
import { ConfigView } from "@/components/config-view"
import { DispatchView } from "@/components/dispatch-view"
import { SourcePulseView } from "@/components/source-pulse"
import { GalleryOverlay } from "@/components/gallery"
import { HotkeysOverlay } from "@/components/hotkeys"
import { ExportPanel } from "@/components/export-panel"
import { Divider } from "@/components/divider"
import type { Article, Signal, FeedHealth, Skin, ViewMode } from "@/lib/types"
import { CATEGORY_CONFIG } from "@/lib/types"
import { TYPE, MONO } from "@/lib/styles"

// ─── Skin + mode system ───────────────────────────────────────────────────────


function applyThemeClasses(skin: Skin, day: boolean) {
  const el = document.documentElement
  el.classList.remove("day", "skin-slate", "skin-forest")
  if (day) el.classList.add("day")
  if (skin === "slate")  el.classList.add("skin-slate")
  if (skin === "forest") el.classList.add("skin-forest")
}

function useTheme() {
  const [skin, setSkinState] = useState<Skin>("mineral")
  const [isDay, setIsDay]     = useState(false)
  const [mounted, setMounted] = useState(false)
  const skinRef               = useRef<Skin>("mineral")

  useEffect(() => {
    const storedSkin = (localStorage.getItem("dispatch-skin") as Skin) || "mineral"
    const storedMode = localStorage.getItem("dispatch-theme")
    const storedModeTs = localStorage.getItem("dispatch-theme-ts")
    const THEME_SESSION_TTL = 4 * 60 * 60 * 1000 // 4 hours
    const modeExpired = !storedModeTs || (Date.now() - parseInt(storedModeTs, 10)) > THEME_SESSION_TTL
    const h   = new Date().getHours()
    const day = storedMode && !modeExpired ? (storedMode === "day") : h >= 6 && h < 20
    if (modeExpired) { localStorage.removeItem("dispatch-theme"); localStorage.removeItem("dispatch-theme-ts") }
    skinRef.current = storedSkin
    setSkinState(storedSkin)
    setIsDay(day)
    applyThemeClasses(storedSkin, day)
    setMounted(true)
  }, [])

  const toggleMode = useCallback(() => {
    setIsDay(prev => {
      const next = !prev
      applyThemeClasses(skinRef.current, next)
      localStorage.setItem("dispatch-theme", next ? "day" : "night")
      localStorage.setItem("dispatch-theme-ts", String(Date.now()))
      return next
    })
  }, [])

  const setSkin = useCallback((newSkin: Skin) => {
    skinRef.current = newSkin
    setSkinState(newSkin)
    localStorage.setItem("dispatch-skin", newSkin)
    setIsDay(prev => { applyThemeClasses(newSkin, prev); return prev })
  }, [])

  return { skin, isDay, toggleMode, setSkin, mounted }
}

// ─── Annotation cache helpers ─────────────────────────────────────────────────
// Annotations live in localStorage with a 2-hour TTL.
// Single-user tool; 5-10 visits/day — fresh enough, eliminates every load cost.

const ANNOTATION_CACHE_KEY = "dispatch-annotations-v3"
const ANNOTATION_TTL_MS    = 4 * 60 * 60 * 1000 // 4 hours — resilient to weak connections

interface AnnotationEntry {
  id: string
  synopsis: string
  relevance: string
  signalType: string
  signalLens: string
  signalScores?: { opportunity: number; position: number; discipline: number; landscape: number; culture: number; urgency: number }
}

function loadAnnotationCache(): AnnotationEntry[] | null {
  try {
    const raw = localStorage.getItem(ANNOTATION_CACHE_KEY)
    if (!raw) return null
    const { ts, data } = JSON.parse(raw)
    if (Date.now() - ts > ANNOTATION_TTL_MS) return null
    // Reject empty-content caches — these are artifacts of failed annotation runs
    const hasContent = Array.isArray(data) && data.some((a: AnnotationEntry) => (a.synopsis && a.synopsis.length > 10) || (a.relevance && a.relevance.length > 10))
    if (!hasContent) return null
    return data
  } catch { return null }
}

function saveAnnotationCache(data: AnnotationEntry[]) {
  try { localStorage.setItem(ANNOTATION_CACHE_KEY, JSON.stringify({ ts: Date.now(), data })) }
  catch { /* quota exceeded — silently skip */ }
}

function mergeAnnotations(articles: Article[], annotations: AnnotationEntry[]): Article[] {
  const map = new Map(annotations.map(a => [a.id, a]))
  return articles.map(a => {
    const ann = map.get(a.id)
    return ann ? { ...a, ...ann } : a
  })
}

async function fetchAnnotationBatch(articles: { id: string; title: string; category: string }[]): Promise<AnnotationEntry[]> {
  try {
    const res = await fetch("/api/annotate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles }),
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.annotations || []
  } catch { return [] }
}

async function fetchAnnotations(articles: Article[]): Promise<AnnotationEntry[] | null> {
  // Return cached if still fresh
  const cached = loadAnnotationCache()
  if (cached) return cached

  // Find unannotated articles (server may have annotated some already)
  const unannotated = articles.filter(a => !a.synopsis && !a.relevance && a.url !== "#")
  if (unannotated.length === 0) return null

  // Annotate in a single batch of 20 client-side (supplements server's 40)
  const BATCH_SIZE = 20
  const MAX_BATCHES = 1
  const toAnnotate = unannotated.slice(0, BATCH_SIZE * MAX_BATCHES)
  const batches: { id: string; title: string; category: string }[][] = []
  for (let i = 0; i < toAnnotate.length; i += BATCH_SIZE) {
    batches.push(toAnnotate.slice(i, i + BATCH_SIZE).map(a => ({ id: a.id, title: a.title, category: a.category })))
  }

  const results = await Promise.allSettled(batches.map(b => fetchAnnotationBatch(b)))
  const allAnnotations: AnnotationEntry[] = []
  for (const result of results) {
    if (result.status === "fulfilled") allAnnotations.push(...result.value)
  }

  if (allAnnotations.length > 0) saveAnnotationCache(allAnnotations)
  return allAnnotations.length > 0 ? allAnnotations : null
}

// Cerebro extracted to components/cerebro.tsx

// ─── Page ─────────────────────────────────────────────────────────────────────


function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

export default function Page() {
  const { skin, isDay, toggleMode, setSkin, mounted } = useTheme()
  const isMobile = useMobile()
  const [articles,       setArticles]       = useState<Article[]>([])
  const [isLive,         setIsLive]         = useState(false)
  const [feedHealth,     setFeedHealth]     = useState<FeedHealth | null>(null)
  const [feedLoading,    setFeedLoading]    = useState(true)
  const [fetchedAt,      setFetchedAt]      = useState<string | null>(null)
  const [viewMode,       setViewModeRaw]    = useState<ViewMode>("signal")
  const [cerebroCollapsed, setCerebroCollapsed] = useState(false)
  const [leftRailCollapsed, setLeftRailCollapsed] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [hotkeysOpen, setHotkeysOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const cerebroSidebarRef = useRef<HTMLDivElement>(null)
  const cerebroFocusRef = useRef<HTMLDivElement>(null)
  const [cerebroMounted, setCerebroMounted] = useState(false)
  useEffect(() => { setCerebroMounted(true) }, [])
  const [activeLayers,   setActiveLayers]   = useState<Set<string>>(new Set())
  const [sortBy,         setSortBy]         = useState<"urgency" | "layer">("layer")
  const [mobileTab,      setMobileTab]      = useState<"signal" | "audio" | "synthesis" | "gallery" | "cerebro" | "config">("signal")
  const [excludedSources, setExcludedSources] = useState<Set<string>>(new Set())
  const [mobileDcosIdx, setMobileDcosIdx] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [feedImageMode, setFeedImageMode] = useState<"off" | "source">("off")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [pinnedArticles, setPinnedArticles] = useState<Article[]>([])

  // ── URL ↔ State sync ───────────────────────────────────────────────────────
  const VALID_VIEWS = ["signal", "audio", "synthesis", "dispatch", "config", "pulse"] as const
  const isInitialized = useRef(false)

  // Wrap setViewMode to also push URL
  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeRaw(mode)
    const path = mode === "signal" ? "/" : `/${mode}`
    if (typeof window !== "undefined" && window.location.pathname !== path) {
      window.history.pushState({ view: mode }, "", path)
    }
  }, [])

  // Read initial view from URL on mount
  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true
    const path = window.location.pathname.replace(/^\//, "") || "signal"
    if ((VALID_VIEWS as readonly string[]).includes(path)) {
      setViewModeRaw(path as ViewMode)
    } else if (path === "gallery") {
      setGalleryOpen(true)
    } else if (path === "focus") {
      setFocusMode(true)
    }
  }, [])

  // Handle browser back/forward
  useEffect(() => {
    const handler = () => {
      const path = window.location.pathname.replace(/^\//, "") || "signal"
      if ((VALID_VIEWS as readonly string[]).includes(path)) {
        setViewModeRaw(path as ViewMode)
        setFocusMode(false)
        setGalleryOpen(false)
      } else if (path === "gallery") {
        setGalleryOpen(true)
      } else if (path === "focus") {
        setFocusMode(true)
      } else {
        setViewModeRaw("signal")
        setFocusMode(false)
        setGalleryOpen(false)
      }
    }
    window.addEventListener("popstate", handler)
    return () => window.removeEventListener("popstate", handler)
  }, [])

  // Gallery URL sync
  const setGalleryOpenWithUrl = useCallback((open: boolean) => {
    setGalleryOpen(open)
    if (open) {
      window.history.pushState({ overlay: "gallery" }, "", "/gallery")
    } else if (window.location.pathname === "/gallery") {
      window.history.back()
    }
  }, [])

  // Focus mode URL sync
  const setFocusModeWithUrl = useCallback((on: boolean) => {
    setFocusMode(on)
    if (on) {
      window.history.pushState({ overlay: "focus" }, "", "/focus")
    } else if (window.location.pathname === "/focus") {
      window.history.back()
    }
  }, [])

  // Global keyboard shortcuts
  useEffect(() => {
    // All 9 left-rail buttons in visual order (top row → bottom row)
    const allTabs = ["signal", "audio", "synthesis", "gallery", "config", "pulse", "shortcuts", "export", "dispatch"] as const
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const isTyping = tag === "INPUT" || tag === "TEXTAREA"

      // ? — toggle hotkeys (always works)
      if (e.key === "?" && !isTyping) {
        e.preventDefault()
        setHotkeysOpen(v => !v)
        return
      }

      // Don't intercept other keys when typing
      if (isTyping) return

      // Arrow keys — cycle through all 9 tabs in a loop
      const currentTab = galleryOpen ? "gallery" : hotkeysOpen ? "shortcuts" : exportOpen ? "export" : viewMode
      const currentIdx = allTabs.indexOf(currentTab as typeof allTabs[number])
      if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && currentIdx !== -1) {
        e.preventDefault()
        const delta = e.key === "ArrowRight" ? 1 : -1
        const nextIdx = (currentIdx + delta + allTabs.length) % allTabs.length
        const next = allTabs[nextIdx]
        // Close any open overlays without triggering history.back()
        if (galleryOpen) { setGalleryOpen(false) }
        if (hotkeysOpen) setHotkeysOpen(false)
        if (exportOpen) setExportOpen(false)
        // Navigate to the target
        if (next === "gallery") setGalleryOpenWithUrl(true)
        else if (next === "shortcuts") setHotkeysOpen(true)
        else if (next === "export") setExportOpen(true)
        else setViewMode(next as ViewMode)
      }

      // Number keys — direct access to all 9 tabs
      else if (e.key === "1") { if (galleryOpen) setGalleryOpenWithUrl(false); if (hotkeysOpen) setHotkeysOpen(false); if (exportOpen) setExportOpen(false); setViewMode("signal") }
      else if (e.key === "2") { if (galleryOpen) setGalleryOpenWithUrl(false); if (hotkeysOpen) setHotkeysOpen(false); if (exportOpen) setExportOpen(false); setViewMode("audio") }
      else if (e.key === "3") { if (galleryOpen) setGalleryOpenWithUrl(false); if (hotkeysOpen) setHotkeysOpen(false); if (exportOpen) setExportOpen(false); setViewMode("synthesis") }
      else if (e.key === "4") { if (hotkeysOpen) setHotkeysOpen(false); if (exportOpen) setExportOpen(false); setGalleryOpenWithUrl(true) }
      else if (e.key === "5") { if (galleryOpen) setGalleryOpenWithUrl(false); if (hotkeysOpen) setHotkeysOpen(false); if (exportOpen) setExportOpen(false); setViewMode("config") }
      else if (e.key === "6") { if (galleryOpen) setGalleryOpenWithUrl(false); if (hotkeysOpen) setHotkeysOpen(false); if (exportOpen) setExportOpen(false); setViewMode("pulse") }
      else if (e.key === "7") { if (galleryOpen) setGalleryOpenWithUrl(false); if (exportOpen) setExportOpen(false); setHotkeysOpen(true) }
      else if (e.key === "8") { if (galleryOpen) setGalleryOpenWithUrl(false); if (hotkeysOpen) setHotkeysOpen(false); setExportOpen(true) }
      else if (e.key === "9") { if (galleryOpen) setGalleryOpenWithUrl(false); if (hotkeysOpen) setHotkeysOpen(false); if (exportOpen) setExportOpen(false); setViewMode("dispatch") }

      // F — focus mode
      else if (e.key === "f" || e.key === "F") setFocusModeWithUrl(!focusMode)

      // G — gallery
      else if (e.key === "g" || e.key === "G") setGalleryOpenWithUrl(true)

      // C or / — focus Cerebro input
      else if (e.key === "c" || e.key === "C" || e.key === "/") {
        e.preventDefault()
        const input = document.querySelector('[aria-label="Cerebro strategic advisor"] textarea') as HTMLTextAreaElement
        if (input) input.focus()
      }

      // Escape — close overlays
      else if (e.key === "Escape") {
        if (hotkeysOpen) setHotkeysOpen(false)
        else if (galleryOpen) setGalleryOpenWithUrl(false)
        else if (focusMode) setFocusModeWithUrl(false)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [viewMode, hotkeysOpen, galleryOpen, exportOpen, focusMode, setGalleryOpenWithUrl, setFocusModeWithUrl])

  const handleToggleSource = useCallback((source: string) => {
    setExcludedSources(prev => {
      const next = new Set(prev)
      if (next.has(source)) next.delete(source)
      else next.add(source)
      try { localStorage.setItem("dispatch-excluded-sources", JSON.stringify([...next])) } catch {}
      return next
    })
  }, [])

  // Restore persisted state on mount
  useEffect(() => {
    try {
      const savedLayers = localStorage.getItem("dispatch-active-layers")
      if (savedLayers) {
        const parsed = JSON.parse(savedLayers)
        if (Array.isArray(parsed)) setActiveLayers(new Set(parsed))
      }

      // sortBy always starts on "urgency" (Triage) — no persistence

      // View mode now synced via URL — localStorage fallback only when on root path
      if (window.location.pathname === "/") {
        const savedView = localStorage.getItem("dispatch-view-mode")
        if (savedView === "signal" || savedView === "audio" || savedView === "synthesis" || savedView === "dispatch" || savedView === "config" || savedView === "pulse") setViewModeRaw(savedView)
      }

      const savedTab = localStorage.getItem("dispatch-mobile-tab")
      if (savedTab === "signal" || savedTab === "audio" || savedTab === "synthesis" || savedTab === "gallery" || savedTab === "cerebro" || savedTab === "config") setMobileTab(savedTab as typeof mobileTab)

      const savedExcluded = localStorage.getItem("dispatch-excluded-sources")
      if (savedExcluded) setExcludedSources(new Set(JSON.parse(savedExcluded)))

      const savedPinned = localStorage.getItem("dispatch-pinned-articles")
      if (savedPinned) {
        const parsed = JSON.parse(savedPinned)
        if (Array.isArray(parsed)) setPinnedArticles(parsed)
      }
    } catch { /* localStorage unavailable — use defaults */ }
  }, [])

  // Persist active layers and sort
  useEffect(() => {
    try { localStorage.setItem("dispatch-active-layers", JSON.stringify([...activeLayers])) } catch {}
  }, [activeLayers])
  // sortBy not persisted — always land on Triage

  // Persist view mode
  useEffect(() => {
    try { localStorage.setItem("dispatch-view-mode", viewMode) } catch {}
  }, [viewMode])

  // Persist mobile tab
  useEffect(() => {
    try { localStorage.setItem("dispatch-mobile-tab", mobileTab) } catch {}
  }, [mobileTab])

  // Persist pinned articles
  useEffect(() => {
    try { localStorage.setItem("dispatch-pinned-articles", JSON.stringify(pinnedArticles)) } catch {}
  }, [pinnedArticles])

  const handlePinArticle = useCallback((article: Article) => {
    setPinnedArticles(prev => {
      if (prev.some(a => a.id === article.id)) return prev.filter(a => a.id !== article.id)
      return [article, ...prev].slice(0, 7)
    })
  }, [])

  const handleUnpinArticle = useCallback((articleId: string) => {
    setPinnedArticles(prev => prev.filter(a => a.id !== articleId))
  }, [])

  const [cerebroPrompt,  setCerebroPrompt]  = useState<{ text: string; id: number } | null>(null)
  const { signals, briefLoading, briefError } = useChiefOfStaff(articles)

  const handleDeliberate = useCallback((signal: Signal) => {
    const text = `I want to deliberate on this signal from the brief:\n\n"${signal.headline}"\n\n${signal.body}\n\nWalk me through the strategic implications. What should I be thinking about, and what questions should I be exploring?`
    setCerebroPrompt({ text, id: Date.now() })
    setMobileTab("cerebro")
  }, [])

  const handleSynthesisDeliberate = useCallback((text: string) => {
    setCerebroPrompt({ text, id: Date.now() })
    setMobileTab("cerebro")
  }, [])

  // Signal card hover state — desktop only
  const [signal, setSignal] = useState<{ article: Article; x: number; y: number } | null>(null)
  const handleSignalEnter = useCallback((article: Article, x: number, y: number) => { setSignal({ article, x, y }) }, [])
  const handleSignalMove  = useCallback((x: number, y: number) => { setSignal(s => s ? { ...s, x, y } : s) }, [])
  const handleSignalLeave = useCallback(() => { setSignal(null) }, [])

  // Resizable column widths
  const [leftWidth,  setLeftWidth]  = useState(300)
  const [rightWidth, setRightWidth] = useState(320)
  const dragRef = useRef<{ side: "left"|"right"; startX: number; startW: number } | null>(null)

  const startResize = useCallback((side: "left"|"right", e: React.MouseEvent) => {
    e.preventDefault()
    dragRef.current = {
      side,
      startX: e.clientX,
      startW: side === "left" ? leftWidth : rightWidth,
    }
    document.body.style.cursor    = "col-resize"
    document.body.style.userSelect = "none"

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const delta = ev.clientX - dragRef.current.startX
      if (dragRef.current.side === "left") {
        setLeftWidth(clamp(dragRef.current.startW + delta, 160, 380))
      } else {
        setRightWidth(clamp(dragRef.current.startW - delta, 220, 520))
      }
    }
    const onUp = () => {
      dragRef.current = null
      document.body.style.cursor    = ""
      document.body.style.userSelect = ""
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup",   onUp)
    }
    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup",   onUp)
  }, [leftWidth, rightWidth])

  useEffect(() => {
    fetch("/api/news")
      .then(r => r.json())
      .then(data => {
        const fresh: Article[] = data.articles || []
        setIsLive(data.isLive || false)
        if (data.fetchedAt) setFetchedAt(data.fetchedAt)
        if (data.feedHealth) setFeedHealth(data.feedHealth)

        // Merge any cached annotations immediately before render
        const cached = loadAnnotationCache()
        setArticles(cached ? mergeAnnotations(fresh, cached) : fresh)
        setFeedLoading(false)

        // Fetch fresh annotations (uses localStorage cache, 2hr TTL)
        fetchAnnotations(fresh).then(annotations => {
          if (annotations) setArticles(mergeAnnotations(fresh, annotations))
        })
      })
      .catch(() => setFeedLoading(false))
  }, [])

  const sourceFiltered = excludedSources.size > 0
    ? articles.filter(a => !excludedSources.has(a.source))
    : articles
  const layerFiltered =
    activeLayers.size === 0 ? sourceFiltered : sourceFiltered.filter(a => activeLayers.has(a.tag))
  // Triage: filter to urgency 6+ only, sorted by urgency descending
  // Explore: show everything, original layer interleave order
  const TRIAGE_THRESHOLD = 6
  // Urgency gate applied before layer selection — used for chip counts
  const triagePool = sortBy === "urgency"
    ? sourceFiltered.filter(a => (a.signalScores?.urgency ?? 0) >= TRIAGE_THRESHOLD)
    : sourceFiltered
  const triageFiltered = sortBy === "urgency"
    ? layerFiltered.filter(a => (a.signalScores?.urgency ?? 0) >= TRIAGE_THRESHOLD)
    : layerFiltered
  const filtered = [...triageFiltered].sort((a, b) => {
    if (sortBy === "urgency") {
      const ua = a.signalScores?.urgency ?? 0
      const ub = b.signalScores?.urgency ?? 0
      if (ub !== ua) return ub - ua
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
    // layer sort: original order from API
    return 0
  })

  const feedContent = (
    <main
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {!isMobile && <ChiefOfStaffBand signals={signals} briefLoading={briefLoading} briefError={briefError} onDeliberate={handleDeliberate} defaultExpanded={sortBy === "urgency"} />}
      {/* Layer filters — pills on desktop, dropdown on mobile */}
      <div style={{ flexShrink: 0, padding: "12px 16px 0" }}>
        {isMobile ? (
          /* ── Mobile: dropdown select + Off/Source toggle ── */
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setMobileFilterOpen(v => !v); setMobileMenuOpen(false) }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 8, border: "1px solid var(--border)",
                  background: "transparent", cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <span style={{ ...TYPE.sm, color: "var(--accent-secondary)", fontWeight: 500 }}>
                  {activeLayers.size === 0 ? "All" : [...activeLayers].map(l => CATEGORY_CONFIG.find(c => c.id === l)?.label || l).join(", ")}
                </span>
                <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.6, fontVariantNumeric: "tabular-nums" }}>
                  {triagePool.length}
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
                    onClick={() => { setActiveLayers(new Set()); setMobileFilterOpen(false) }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                      padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer",
                      ...TYPE.sm, color: activeLayers.size === 0 ? "var(--accent-secondary)" : "var(--text-secondary)", fontWeight: activeLayers.size === 0 ? 600 : 400,
                    }}
                  >
                    <span>All</span>
                    <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>{triagePool.length}</span>
                  </button>
                  {CATEGORY_CONFIG.filter(cat => cat.id !== "all").map(cat => {
                    const n = triagePool.filter(a => a.tag === cat.id).length
                    if (n === 0 && !feedLoading) return null
                    const isActive = activeLayers.has(cat.id)
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveLayers(prev => {
                            const next = new Set(prev)
                            if (next.has(cat.id)) next.delete(cat.id)
                            else next.add(cat.id)
                            return next
                          })
                          setMobileFilterOpen(false)
                        }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                          padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer",
                          ...TYPE.sm, color: isActive ? "var(--accent-secondary)" : "var(--text-secondary)", fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        <span>{cat.label}</span>
                        <span style={{ ...TYPE.xs, color: "var(--text-tertiary)", opacity: 0.5, fontVariantNumeric: "tabular-nums" }}>{n}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            {/* Triage / Explore toggle — mobile */}
            <div role="group" aria-label="Sort mode" style={{
              marginLeft: "auto",
              display: "flex", gap: 2,
              background: "var(--bg-elevated)", borderRadius: 8, padding: 3,
            }}>
              {(["urgency", "layer"] as const).map(mode => {
                const isActive = sortBy === mode
                return (
                  <button
                    key={mode}
                    className="toggle-btn"
                    aria-pressed={isActive}
                    onClick={() => setSortBy(mode)}
                    style={{
                      padding: "4px 12px", border: "none", borderRadius: 6, cursor: "pointer",
                      background: isActive ? "var(--bg-surface)" : "transparent",
                      ...TYPE.xs, fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                      letterSpacing: "0.01em",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {mode === "urgency" ? "Triage" : "Explore"}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* ── Desktop: pills ── */
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
            <button
              onClick={() => setActiveLayers(new Set())}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "4px 12px", borderRadius: 8, border: "none",
                background: activeLayers.size === 0 ? "var(--accent-primary)" : "transparent",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (activeLayers.size > 0) e.currentTarget.style.background = "var(--bg-elevated)" }}
              onMouseLeave={e => { if (activeLayers.size > 0) e.currentTarget.style.background = "transparent" }}
            >
              <span style={{ ...TYPE.sm, color: activeLayers.size === 0 ? "var(--accent-secondary)" : "var(--text-tertiary)", fontWeight: activeLayers.size === 0 ? 600 : 400 }}>
                All
              </span>
              <span style={{ ...TYPE.xs, fontVariantNumeric: "tabular-nums", color: activeLayers.size === 0 ? "var(--accent-muted)" : "var(--text-tertiary)", opacity: 0.5 }}>
                {triagePool.length}
              </span>
            </button>
            {CATEGORY_CONFIG.filter(cat => cat.id !== "all").map(cat => {
              const n = cat.id === "all" ? triagePool.length : triagePool.filter(a => a.tag === cat.id).length
              if (n === 0 && !feedLoading) return null
              const isActive = activeLayers.has(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveLayers(prev => {
                    const next = new Set(prev)
                    if (next.has(cat.id)) next.delete(cat.id)
                    else next.add(cat.id)
                    return next
                  })}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "4px 12px", borderRadius: 8, border: "none",
                    background: isActive ? "var(--accent-primary)" : "transparent",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-elevated)" }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? "var(--accent-primary)" : "transparent" }}
                >
                  <span style={{ ...TYPE.sm, color: isActive ? "var(--accent-secondary)" : "var(--text-tertiary)", fontWeight: isActive ? 600 : 400 }}>
                    {cat.label}
                  </span>
                  <span style={{ ...TYPE.xs, fontVariantNumeric: "tabular-nums", color: isActive ? "var(--accent-muted)" : "var(--text-tertiary)", opacity: 0.5 }}>
                    {n}
                  </span>
                </button>
              )
            })}
            {/* Image toggle — Off / Source */}
            <div role="group" aria-label="Article image display" style={{
              marginLeft: "auto",
              display: "flex",
              gap: 2,
              background: "var(--bg-elevated)",
              borderRadius: 8,
              padding: 3,
            }}>
              {([
                { id: "off" as const, label: "Off" },
                { id: "source" as const, label: "Source" },
              ]).map(mode => {
                const isActive = feedImageMode === mode.id
                return (
                  <button
                    key={mode.id}
                    className="toggle-btn"
                    aria-pressed={isActive}
                    onClick={() => setFeedImageMode(mode.id)}
                    style={{
                      padding: "4px 12px", border: "none",
                      borderRadius: 6, cursor: "pointer",
                      background: isActive ? "var(--bg-surface)" : "transparent",
                      ...TYPE.xs,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-secondary)" } }}
                    onMouseLeave={e => { e.currentTarget.style.background = isActive ? "var(--bg-surface)" : "transparent"; e.currentTarget.style.color = isActive ? "var(--text-primary)" : "var(--text-tertiary)" }}
                  >
                    {mode.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <div id="main-feed" role="feed" aria-label="Intelligence feed" tabIndex={-1} style={{ flex: 1, overflowY: "auto", padding: "8px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {feedLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="loading-pulse"
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  background: "var(--bg-surface)",
                }}
              >
                <div style={{ height: 10, width: `${60 + (i % 3) * 15}%`, background: "var(--border)", borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 13, width: `${70 + (i % 4) * 8}%`, background: "var(--bg-elevated)", borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, fontSize: 13, color: "var(--text-tertiary)" }}>
            No articles
          </div>
        ) : (
          filtered.map((a, i) => (
            <FeedCard
              key={a.id}
              article={a}
              index={i}
              imageMode={feedImageMode}
              onSignalEnter={handleSignalEnter}
              onSignalMove={handleSignalMove}
              onSignalLeave={handleSignalLeave}
              isPinned={pinnedArticles.some(p => p.id === a.id)}
              onTogglePin={handlePinArticle}
            />
          ))
        )}
      </div>
    </main>
  )

  // Prevent hydration mismatch — don't render until client-side theme/layout is resolved
  if (!mounted) {
    return <div style={{ height: "100vh", background: "var(--bg-primary)" }} />
  }

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden", background: "var(--bg-primary)", position: "fixed", inset: 0 }}>
        {/* ── Mobile Header ── */}
        <div style={{
          flexShrink: 0, height: 48, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "0 16px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--live)" }} />
            <span style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--accent-muted)", textTransform: "uppercase", fontWeight: 500 }}>Dispatch</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Skin dots — large touch targets */}
            {(["mineral", "slate", "forest"] as Skin[]).map(s => {
              const isActive = skin === s
              const color = s === "mineral" ? "#B8966A" : s === "slate" ? "#4A7A9B" : "#5C8A6E"
              return (
                <button
                  key={s}
                  onClick={() => setSkin(s)}
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: "none", cursor: "pointer",
                    background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                  }}
                >
                  <span style={{
                    width: isActive ? 10 : 6, height: isActive ? 10 : 6, borderRadius: "50%",
                    background: color,
                    outline: isActive ? `1.5px solid ${color}` : "none",
                    outlineOffset: isActive ? 2 : 0,
                    opacity: isActive ? 1 : 0.35,
                    transition: "all 0.2s", display: "block",
                  }} />
                </button>
              )
            })}
            {/* Day/night toggle */}
            <button
              onClick={toggleMode}
              style={{ width: 36, height: 36, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "var(--text-tertiary)", transition: "color 0.15s" }}
            >
              {isDay ? <SunMedium size={18} strokeWidth={1.5} /> : <MoonStar size={18} strokeWidth={1.5} />}
            </button>
            {/* Overflow menu */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => { setMobileMenuOpen(v => !v); setMobileFilterOpen(false) }}
                style={{ width: 36, height: 36, borderRadius: 8, border: "none", background: mobileMenuOpen ? "var(--bg-elevated)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, color: "var(--text-tertiary)", transition: "all 0.15s" }}
              >
                <Menu size={18} strokeWidth={1.5} />
              </button>
              {mobileMenuOpen && (
                <div style={{
                  position: "absolute", top: 34, right: 0, width: 200, zIndex: 100,
                  background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 12,
                  padding: "8px 0", animation: "status-fade 0.15s ease both",
                }}>
                  {/* Off / Source image toggle */}
                  <div style={{ padding: "8px 12px" }}>
                    <div style={{ ...TYPE.xs, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Images</div>
                    <div style={{ display: "flex", background: "var(--bg-elevated)", borderRadius: 6, padding: 2 }}>
                      {([
                        { id: "off" as const, label: "Off" },
                        { id: "source" as const, label: "Source" },
                      ]).map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => { setFeedImageMode(mode.id); setMobileMenuOpen(false) }}
                          style={{
                            flex: 1, padding: "6px 0", borderRadius: 5, border: "none",
                            background: feedImageMode === mode.id ? "var(--bg-surface)" : "transparent",
                            ...TYPE.xs, fontWeight: feedImageMode === mode.id ? 600 : 400,
                            color: feedImageMode === mode.id ? "var(--text-primary)" : "var(--text-tertiary)",
                            textTransform: "uppercase", letterSpacing: "0.04em",
                            cursor: "pointer", transition: "all 0.15s",
                          }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
                  {/* Config + Pulse links */}
                  <button
                    onClick={() => { setMobileTab("config" as typeof mobileTab); setMobileMenuOpen(false) }}
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", ...TYPE.sm, color: "var(--text-secondary)", textAlign: "left" }}
                  >
                    <Settings size={14} strokeWidth={1.5} /> Configuration
                  </button>
                  <button
                    onClick={() => { setMobileTab("signal"); setMobileMenuOpen(false); /* Pulse not a mobile tab — navigate via config */ }}
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 16px", background: "transparent", border: "none", cursor: "pointer", ...TYPE.sm, color: "var(--text-secondary)", textAlign: "left" }}
                  >
                    <Activity size={14} strokeWidth={1.5} /> Source Pulse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── DCOS swipeable carousel — Signal + Sound tabs, hidden in triage ── */}
        {(mobileTab === "signal" || mobileTab === "audio") && sortBy !== "urgency" && signals.filter(s => s.body).length > 0 && (() => {
          const dcosSignals = signals.filter(s => s.body)
          return (
            <div style={{ flexShrink: 0, borderBottom: "1px solid var(--border)" }}>
              <div
                className="dcos-carousel"
                style={{
                  display: "flex", overflowX: "auto", overflowY: "hidden",
                  WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory",
                  msOverflowStyle: "none", scrollbarWidth: "none",
                } as React.CSSProperties}
                onScroll={e => {
                  const el = e.currentTarget
                  const idx = Math.round(el.scrollLeft / el.clientWidth)
                  if (idx !== mobileDcosIdx && idx >= 0 && idx < dcosSignals.length) setMobileDcosIdx(idx)
                }}
              >
                {dcosSignals.map((sig, i) => (
                  <button
                    key={i}
                    onClick={() => handleDeliberate(sig)}
                    style={{
                      flex: "0 0 100%", scrollSnapAlign: "start",
                      display: "block", width: "100%", background: "transparent", border: "none",
                      cursor: "pointer", textAlign: "left", padding: "14px 20px",
                    }}
                  >
                    <div style={{ ...TYPE.xs, color: "var(--accent-secondary)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em", marginBottom: 6 }}>
                      {sig.label}
                    </div>
                    <div style={{ ...TYPE.body, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                      {sig.body.replace(/\[\d+\]/g, "")}
                    </div>
                  </button>
                ))}
              </div>
              {dcosSignals.length > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "0 20px 14px" }}>
                  {dcosSignals.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMobileDcosIdx(i)
                        const carousel = document.querySelector('.dcos-carousel') as HTMLElement
                        if (carousel) carousel.scrollTo({ left: i * carousel.clientWidth, behavior: "smooth" })
                      }}
                      style={{
                        width: mobileDcosIdx === i ? 16 : 6, height: 6, borderRadius: 3, border: "none", padding: 0,
                        background: mobileDcosIdx === i ? "var(--accent-secondary)" : "var(--border)",
                        cursor: "pointer", transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Mobile: show active tab panel with transition */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div key={mobileTab} className="mobile-tab-content" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {mobileTab === "signal" && feedContent}
            {mobileTab === "synthesis" && <SynthesisView articles={articles} onDeliberate={handleSynthesisDeliberate} sortBy={sortBy} />}
            {mobileTab === "audio"     && <AudioView onDeliberate={handleSynthesisDeliberate} excludedSources={excludedSources} sortBy={sortBy} onSortChange={setSortBy} pinnedArticleIds={new Set(pinnedArticles.map(a => a.id))} onPinArticle={handlePinArticle} />}
            {mobileTab === "gallery"   && <GalleryOverlay onClose={() => setMobileTab("signal")} excludedSources={excludedSources} articles={articles} onDeliberate={handleSynthesisDeliberate} />}
            {mobileTab === "cerebro"   && <div style={{ flex: 1, overflow: "hidden" }}><Cerebro articles={articles} pendingPrompt={cerebroPrompt} /></div>}
            {mobileTab === "config"    && <ConfigView excludedSources={excludedSources} onToggleSource={handleToggleSource} />}
          </div>
        </div>

        {/* Mobile bottom tab bar with sliding indicator */}
        {(() => {
          const tabs = [
            { id: "signal" as const,    Icon: Radio,      label: "Signal"    },
            { id: "audio" as const,     Icon: AudioLines, label: "Sound"     },
            { id: "synthesis" as const, Icon: Blend,      label: "Synthesis" },
            { id: "gallery" as const,   Icon: Aperture,   label: "Surface"   },
            { id: "cerebro" as const,   Icon: Brain,      label: "Cerebro"   },
          ]
          const activeIdx = tabs.findIndex(t => t.id === mobileTab)
          return (
            <div
              style={{
                flexShrink: 0,
                height: 72,
                display: "flex",
                alignItems: "stretch",
                borderTop: "1px solid var(--border)",
                background: "var(--bg-surface)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Sliding blob indicator */}
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: `calc(${activeIdx * (100 / tabs.length)}% + 4px)`,
                  width: `calc(${100 / tabs.length}% - 8px)`,
                  height: "calc(100% - 8px)",
                  background: "var(--bg-elevated)",
                  borderRadius: 14,
                  transition: "left 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  zIndex: 0,
                }}
              />
              {tabs.map(tab => {
                const isActive = mobileTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMobileTab(tab.id)}
                    aria-label={tab.label}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      minHeight: 72,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <tab.Icon
                      size={20}
                      strokeWidth={1.5}
                      style={{
                        color: isActive ? "var(--accent-secondary)" : "var(--text-tertiary)",
                        transition: "color 0.3s ease",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                        color: isActive ? "var(--accent-secondary)" : "var(--text-tertiary)",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })()}
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* Signal ticker — full width, pinned top (desktop only) */}
      {!isMobile && <Ticker isDay={isDay} onToggle={toggleMode} skin={skin} onSkinChange={setSkin} />}

      {/* Focus Mode — DCOS strip + full-width Cerebro */}
      {focusMode && !isMobile && (
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "focus-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}>
          {/* Compact DCOS strip */}
          <div style={{
            flexShrink: 0, borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "stretch", gap: 0,
            minHeight: 52,
          }}>
            {/* Exit focus mode button */}
            <button
              onClick={() => setFocusModeWithUrl(false)}
              title="Exit focus mode (Esc)"
              style={{
                flexShrink: 0, width: 48,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-surface)", border: "none", borderRight: "1px solid var(--border)",
                cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
            >
              <Minimize2 size={16} strokeWidth={1.5} style={{ color: "var(--accent-secondary)" }} />
            </button>
            {/* DCOS cards as compact clickable strips */}
            {signals.filter(s => s.body).length > 0 ? signals.filter(s => s.body).map((signal, i) => (
              <button
                key={i}
                onClick={() => handleDeliberate(signal)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", gap: 2,
                  padding: "10px 16px", background: "transparent",
                  border: "none", borderRight: i < signals.filter(s => s.body).length - 1 ? "1px solid var(--border)" : "none",
                  cursor: "pointer", textAlign: "left", transition: "background 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
              >
                <span style={{ ...TYPE.xs, color: "var(--accent-secondary)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.04em" }}>
                  {signal.layer || signal.label}
                </span>
                <span style={{ ...TYPE.sm, color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {signal.headline}
                </span>
              </button>
            )) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 16px" }}>
                <span className="loading-pulse" style={{ ...TYPE.sm, fontFamily: MONO, color: "var(--accent-muted)" }}>
                  Loading signals...
                </span>
              </div>
            )}
          </div>
          {/* Cerebro portal target — focus mode */}
          <div ref={cerebroFocusRef} style={{ flex: 1, overflow: "hidden" }} />
        </div>
      )}

      {/* Three-column workspace — hidden in focus mode */}
      <div style={{
        flex: 1, display: focusMode ? "none" : "flex", overflow: "hidden",
        animation: !focusMode ? "focus-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both" : undefined,
      }}>
        <div
          style={{
            width: leftRailCollapsed ? 42 : leftWidth,
            flexShrink: 0,
            transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            overflow: "hidden",
            position: "relative",
            height: "100%",
          }}
        >
          {leftRailCollapsed ? (
            <button
              onClick={() => setLeftRailCollapsed(false)}
              title="Expand panel"
              style={{
                width: 42, height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-primary)",
                border: "none", borderRight: "1px solid var(--border)",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-primary)" }}
            >
              <span style={{ writingMode: "vertical-rl", ...TYPE.sm, color: "var(--accent-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                Dispatch
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setLeftRailCollapsed(true)}
                title="Collapse panel"
                style={{
                  position: "absolute", top: 8, right: 8, zIndex: 2,
                  width: 28, height: 28,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", borderRadius: 6,
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
              >
                <ChevronLeft size={14} strokeWidth={1.5} style={{ color: "var(--text-tertiary)" }} />
              </button>
              <LeftRail
                articles={articles}
                activeLayers={activeLayers}
                onToggleLayer={(layer: string) => setActiveLayers(prev => {
                  const next = new Set(prev)
                  if (next.has(layer)) next.delete(layer)
                  else next.add(layer)
                  return next
                })}
                sortBy={sortBy}
                onSortChange={setSortBy}
                isLive={isLive}
                feedLoading={feedLoading}
                width={leftRailCollapsed ? 42 : leftWidth}
                viewMode={viewMode}
                onViewChange={setViewMode}
                excludedSources={excludedSources}
                onToggleSource={handleToggleSource}
                onGalleryOpen={() => setGalleryOpenWithUrl(true)}
                onHotkeysOpen={() => setHotkeysOpen(true)}
                onExportOpen={() => setExportOpen(true)}
                feedHealth={feedHealth}
                dailyBrief={signals.length > 0 && signals[0].headline && signals[0].headline !== "—" ? signals[0].headline : undefined}
                pinnedArticles={pinnedArticles}
                onUnpinArticle={handleUnpinArticle}
              />
            </>
          )}
        </div>
        <Divider onMouseDown={e => startResize("left", e)} />
        {viewMode === "config"
          ? <ConfigView excludedSources={excludedSources} onToggleSource={handleToggleSource} />
          : viewMode === "pulse"
          ? <SourcePulseView articles={articles} feedHealth={feedHealth} fetchedAt={fetchedAt} />
          : viewMode === "dispatch"
          ? <DispatchView onDeliberate={handleSynthesisDeliberate} />
          : viewMode === "synthesis"
          ? <SynthesisView articles={articles} onDeliberate={handleSynthesisDeliberate} sortBy={sortBy} />
          : viewMode === "audio"
          ? <AudioView onDeliberate={handleSynthesisDeliberate} excludedSources={excludedSources} sortBy={sortBy} onSortChange={setSortBy} pinnedArticleIds={new Set(pinnedArticles.map(a => a.id))} onPinArticle={handlePinArticle} />
          : feedContent}
        <Divider onMouseDown={e => startResize("right", e)} />
        <div
          style={{
            width: cerebroCollapsed ? 42 : rightWidth,
            flexShrink: 0,
            transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "relative",
            overflow: "hidden",
            marginLeft: -1,
          }}
        >
          {cerebroCollapsed ? (
            <button
              onClick={() => setCerebroCollapsed(false)}
              title="Expand Cerebro"
              style={{
                width: 42, height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-surface)",
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)" }}
            >
              <span style={{ writingMode: "vertical-rl", ...TYPE.sm, color: "var(--accent-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>
                Cerebro
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setCerebroCollapsed(true)}
                title="Collapse Cerebro"
                style={{
                  position: "absolute", top: 8, right: 8, zIndex: 2,
                  width: 28, height: 28,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", borderRadius: 6,
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
              >
                <ChevronRight size={14} strokeWidth={1.5} style={{ color: "var(--text-tertiary)" }} />
              </button>
              <div ref={cerebroSidebarRef} style={{ height: "100%" }} />
            </>
          )}
        </div>
      </div>

      {/* Signal card — intelligence briefing on hover */}
      <SignalCard
        x={signal?.x ?? 0}
        y={signal?.y ?? 0}
        article={signal?.article ?? null}
      />

      {/* Gallery overlay */}
      {galleryOpen && <GalleryOverlay onClose={() => setGalleryOpenWithUrl(false)} excludedSources={excludedSources} isDay={isDay} onToggleMode={toggleMode} skin={skin} onSkinChange={setSkin} articles={articles} onDeliberate={handleSynthesisDeliberate} />}

      {/* Hotkeys overlay */}
      {hotkeysOpen && <HotkeysOverlay onClose={() => setHotkeysOpen(false)} />}

      {/* Export panel */}
      {exportOpen && <ExportPanel onClose={() => setExportOpen(false)} signals={signals} articles={articles} />}

      {/* Single Cerebro instance — portaled between sidebar and focus mode */}
      {cerebroMounted && (() => {
        const target = focusMode && !isMobile ? cerebroFocusRef.current : cerebroSidebarRef.current
        if (!target) return null
        return createPortal(
          <Cerebro
            articles={articles}
            pendingPrompt={cerebroPrompt}
            onFocusMode={() => setFocusModeWithUrl(true)}
            maxWidth={focusMode ? 960 : undefined}
          />,
          target
        )
      })()}
    </div>
  )
}
