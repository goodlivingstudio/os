"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Minimize2, Maximize2 } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface ZenBlock {
  id: string
  imageUrl: string
  title: string
  source?: string
  sourceUrl?: string
}

// ─── Zen View ────────────────────────────────────────────────────────────────
// Ambient creative nourishment. One image at a time. Meditative, not informational.

export function ZenView() {
  const [blocks, setBlocks] = useState<ZenBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [immersive, setImmersive] = useState(false)

  useEffect(() => {
    fetch("/api/zen")
      .then(r => r.json())
      .then(data => {
        setBlocks(data.blocks || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Auto-advance every 20 seconds
  useEffect(() => {
    if (blocks.length <= 1) return
    const t = setInterval(() => advance(1), 20000)
    return () => clearInterval(t)
  }, [blocks.length, index]) // eslint-disable-line react-hooks/exhaustive-deps

  const advance = useCallback((dir: number) => {
    if (blocks.length === 0) return
    setTransitioning(true)
    setTimeout(() => {
      setIndex(i => {
        const next = i + dir
        if (next < 0) return blocks.length - 1
        if (next >= blocks.length) return 0
        return next
      })
      setTimeout(() => setTransitioning(false), 50)
    }, 400)
  }, [blocks.length])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") advance(1)
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") advance(-1)
      if (e.key === "Escape" && immersive) setImmersive(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [advance, immersive])

  const current = blocks[index]

  // ─── Empty state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div className="loading-pulse" style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
          Loading visual stream...
        </div>
      </main>
    )
  }

  if (blocks.length === 0) {
    return (
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div style={{ textAlign: "center", maxWidth: 360, padding: "0 20px" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 10 }}>
            Zen
          </div>
          <div style={{ fontSize: 13, color: "var(--text-tertiary)", lineHeight: 1.6 }}>
            Ambient creative nourishment. Add images to your Are.na channel to populate this view.
          </div>
          <a
            href="https://www.are.na/jeremy-grant/dispatch-zen"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block", marginTop: 16, fontSize: 12,
              color: "var(--accent-secondary)", textDecoration: "none",
            }}
          >
            Open Are.na channel →
          </a>
        </div>
      </main>
    )
  }

  // ─── Full view ────────────────────────────────────────────────────────
  return (
    <main
      style={{
        flex: 1, display: "flex", flexDirection: "column",
        background: "#000", position: "relative", overflow: "hidden",
      }}
    >
      {/* Image — full bleed, centered */}
      <div
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: immersive ? 0 : 24,
          transition: "padding 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {current && (
          <img
            key={current.id}
            src={current.imageUrl}
            alt={current.title || ""}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: immersive ? 0 : 8,
              opacity: transitioning ? 0 : 1,
              transition: "opacity 0.4s ease, border-radius 0.4s ease",
              userSelect: "none",
            }}
          />
        )}
      </div>

      {/* Controls overlay — bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          opacity: immersive ? 0 : 1,
          transition: "opacity 0.3s",
        }}
        onMouseEnter={e => { if (immersive) e.currentTarget.style.opacity = "1" }}
        onMouseLeave={e => { if (immersive) e.currentTarget.style.opacity = "0" }}
      >
        {/* Credit */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {current?.title && (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}>
              {current.title}
            </div>
          )}
          {current?.source && (
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              {current.source}
            </div>
          )}
        </div>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginRight: 8, fontVariantNumeric: "tabular-nums" }}>
            {index + 1} / {blocks.length}
          </span>
          <button
            onClick={() => advance(-1)}
            aria-label="Previous"
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 6, border: "none", background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)", cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => advance(1)}
            aria-label="Next"
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 6, border: "none", background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)", cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
          >
            <ChevronRight size={16} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setImmersive(v => !v)}
            aria-label={immersive ? "Exit immersive" : "Enter immersive"}
            style={{
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 6, border: "none", background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)", cursor: "pointer", transition: "background 0.15s",
              marginLeft: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
          >
            {immersive ? <Minimize2 size={14} strokeWidth={1.5} /> : <Maximize2 size={14} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </main>
  )
}
