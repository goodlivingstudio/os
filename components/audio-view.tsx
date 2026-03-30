"use client"

import { useState, useEffect } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Episode {
  id: string
  title: string
  showName: string
  url: string
  publishedAt: string
  summary: string
  duration: string
  artworkUrl: string
  category: string
  tag: string
  layer: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 36e5)
  if (h < 1) return "< 1h"
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return `${Math.floor(d / 7)}w`
}

// ─── Episode Card ────────────────────────────────────────────────────────────

function EpisodeCard({ episode }: { episode: Episode }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={episode.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          gap: 14,
          padding: 16,
          background: "var(--bg-surface)",
          borderRadius: 12,
          cursor: "pointer",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "scale(1.015)" : "scale(1)",
        }}
      >
        {/* Artwork */}
        {episode.artworkUrl ? (
          <img
            src={episode.artworkUrl}
            alt={episode.showName}
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              objectFit: "cover",
              flexShrink: 0,
              background: "var(--bg-elevated)",
            }}
          />
        ) : (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 8,
              background: "var(--bg-elevated)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "var(--text-tertiary)",
            }}
          >
            ◉
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Eyebrow: show name · duration · time */}
          <div
            style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              letterSpacing: "0.01em",
              marginBottom: 5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {episode.showName}
            {episode.duration && (
              <>
                <span style={{ margin: "0 5px", opacity: 0.4 }}>·</span>
                {episode.duration}
              </>
            )}
            <span style={{ margin: "0 5px", opacity: 0.4 }}>·</span>
            {timeAgo(episode.publishedAt)}
          </div>

          {/* Episode title */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 550,
              color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
              lineHeight: 1.4,
              letterSpacing: "-0.02em",
              transition: "color 0.15s",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}
          >
            {episode.title}
          </div>
        </div>
      </div>
    </a>
  )
}

// ─── Audio View ──────────────────────────────────────────────────────────────

export function AudioView() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCount, setShowCount] = useState(0)

  useEffect(() => {
    fetch("/api/podcasts")
      .then(r => r.json())
      .then(data => {
        setEpisodes(data.episodes || [])
        setShowCount(data.showCount || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: "var(--bg-primary)" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-tertiary)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 600,
          }}
        >
          Audio Intelligence
        </div>
        {!loading && (
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>
            {episodes.length} episodes from {showCount} shows
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="loading-pulse"
              style={{
                display: "flex", gap: 14, padding: 16,
                background: "var(--bg-surface)", borderRadius: 12,
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 8, background: "var(--bg-elevated)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 10, width: "60%", background: "var(--bg-elevated)", borderRadius: 2, marginBottom: 8 }} />
                <div style={{ height: 14, width: "90%", background: "var(--bg-elevated)", borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      ) : episodes.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, fontSize: 13, color: "var(--text-tertiary)" }}>
          No episodes loaded. Check podcast feed configuration.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {episodes.map(ep => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      )}
    </main>
  )
}
