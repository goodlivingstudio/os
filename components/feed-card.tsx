"use client"

import { useState, useRef, memo } from "react"
import { Bookmark } from "lucide-react"
import type { Article } from "@/lib/types"
import { timeAgo, LAYER_COLOR } from "@/lib/types"
import { TYPE, labelStyle, bodyStyle, metaStyle } from "@/lib/styles"

// ─── Signal Card — hover intelligence briefing ──────────────────────────────

export function SignalCard({ x, y, article }: { x: number; y: number; article: Article | null }) {
  if (!article) return null

  const left        = Math.min(x + 18, (typeof window !== "undefined" ? window.innerWidth : 1200) - 276)
  const top         = Math.max(8, y - 44)
  const lens        = article.signalLens || ""
  const accentColor = LAYER_COLOR[lens] || "var(--border)"

  return (
    <div style={{
      position: "fixed",
      left,
      top,
      width: 260,
      pointerEvents: "none",
      zIndex: 1000,
      background: "var(--bg-elevated)",
      borderRadius: 8,
      border: "1px solid var(--border)",
      overflow: "hidden",
      boxShadow: "var(--shadow-tooltip)",
    }}>
      {/* Synopsis — Cerebro: what this article is about */}
      {article.synopsis && (
        <div style={{ padding: "12px 14px", paddingBottom: article.relevance ? 8 : 12 }}>
          <div style={{
            ...labelStyle,
            marginBottom: 6,
          }}>
            Synopsis
          </div>
          <div style={{
            ...bodyStyle,
          }}>
            {article.synopsis}
          </div>
        </div>
      )}

      {/* Relevance — Cerebro: why it matters */}
      {article.relevance && (
        <div style={{
          padding: "12px 14px",
          borderTop: article.synopsis ? "1px solid var(--border)" : "none",
        }}>
          <div style={{
            ...labelStyle,
            marginBottom: 6,
          }}>
            Relevance
          </div>
          <div style={{
            ...TYPE.body,
            color: "var(--text-primary)",
          }}>
            {article.relevance}
          </div>
        </div>
      )}

    </div>
  )
}

// ─── Feed Card ──────────────────────────────────────────────────────────────

export type SignalCallbacks = {
  onSignalEnter: (article: Article, x: number, y: number) => void
  onSignalMove:  (x: number, y: number) => void
  onSignalLeave: () => void
}

export const FeedCard = memo(function FeedCard({ article, index, onSignalEnter, onSignalMove, onSignalLeave, imageMode = "off", isPinned, onTogglePin }: { article: Article; index?: number; imageMode?: "off" | "source"; isPinned?: boolean; onTogglePin?: (article: Article) => void } & SignalCallbacks) {
  const isExternal   = article.url !== "#"
  const hasSignal    = !!(article.synopsis || article.relevance)
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const signalActiveRef = useRef(false)

  const isLeftHalf = (clientX: number) => {
    if (!cardRef.current) return true
    const rect = cardRef.current.getBoundingClientRect()
    return clientX < rect.left + rect.width * 0.5
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    setHovered(true)
    if (hasSignal && isLeftHalf(e.clientX)) {
      signalActiveRef.current = true
      onSignalEnter(article, e.clientX, e.clientY)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hasSignal) return
    if (isLeftHalf(e.clientX)) {
      if (!signalActiveRef.current) {
        signalActiveRef.current = true
        onSignalEnter(article, e.clientX, e.clientY)
      } else {
        onSignalMove(e.clientX, e.clientY)
      }
    } else {
      if (signalActiveRef.current) {
        signalActiveRef.current = false
        onSignalLeave()
      }
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    signalActiveRef.current = false
    onSignalLeave()
  }

  const content = (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "flex",
        padding: "20px",
        borderRadius: 12,
        background: hovered ? "var(--bg-elevated)" : "var(--bg-surface)",
        cursor: isExternal ? "pointer" : "default",
        transition: "background 0.15s",
        animation: index !== undefined ? `signal-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(index * 50, 500)}ms both` : undefined,
        gap: imageMode === "source" && article.imageUrl ? 16 : 0,
        position: "relative",
      }}
    >
      {/* Source image — shown only when imageMode is "source" */}
      {imageMode === "source" && article.imageUrl && (
        <img
          src={article.imageUrl}
          alt=""
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = "none" }}
          style={{
            width: 96, height: 64,
            objectFit: "cover", flexShrink: 0, background: "var(--bg-elevated)",
          }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Eyebrow */}
        <div
          style={{
            ...metaStyle,
            marginBottom: 8,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "opacity 0.3s ease",
          }}
        >
          {article.source}
          <span style={{ opacity: 0.4 }}>&middot;</span>
          {article.category}
          <span style={{ opacity: 0.4 }}>&middot;</span>
          {timeAgo(article.publishedAt)}
        </div>

        {/* Headline */}
        <div
          style={{
            ...TYPE.heading,
            fontSize: "var(--type-reading)",
            color: hovered ? "var(--text-primary)" : "var(--text-secondary)",
            marginBottom: article.summary ? 8 : 0,
          }}
        >
          {article.title}
        </div>

        {/* Summary */}
        {article.summary && (
          <div
            style={{
              ...TYPE.body,
              color: "var(--text-tertiary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              transition: "opacity 0.3s ease",
            }}
          >
            {article.summary}
          </div>
        )}
      </div>
      {onTogglePin && (
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); onTogglePin(article) }}
          title={isPinned ? "Unpin" : "Pin for later"}
          aria-label={isPinned ? "Unpin" : "Pin for later"}
          style={{
            position: "absolute", top: 12, right: 12,
            width: 24, height: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", borderRadius: 4,
            cursor: "pointer", padding: 0,
            opacity: isPinned ? 1 : hovered ? 0.6 : 0,
            color: isPinned ? "var(--accent-secondary)" : "var(--text-tertiary)",
            transition: "opacity 0.15s, color 0.15s",
          }}
        >
          <Bookmark size={14} strokeWidth={0} fill="currentColor" />
        </button>
      )}
    </div>
  )

  if (isExternal) {
    return (
      <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
        {content}
      </a>
    )
  }
  return content
})
