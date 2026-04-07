"use client"

import { useState } from "react"
import { SunMedium, MoonStar } from "lucide-react"
import type { Skin } from "@/lib/types"
import { TYPE } from "@/lib/styles"
import config from "@/lib/config"

// ─── Config-driven data ─────────────────────────────────────────────────────

const SKIN_DOT: Record<string, string> = Object.fromEntries(config.skins.map(s => [s.id, s.dot]))
const SKIN_LABEL: Record<string, string> = Object.fromEntries(config.skins.map(s => [s.id, s.label]))
const CAT_STYLE_DAY = config.categoryStyleDay
const HEADLINES = config.headlines
const CAT_STYLE = config.categoryStyleNight

export function Ticker({
  isDay = false,
  onToggle,
  skin = "mineral",
  onSkinChange,
}: {
  isDay?: boolean
  onToggle?: () => void
  skin?: Skin
  onSkinChange?: (s: Skin) => void
}) {
  const [paused, setPaused] = useState(false)
  const catStyle = isDay ? CAT_STYLE_DAY : CAT_STYLE

  return (
    <div
      className="ticker-bar"
      style={{
        flexShrink: 0,
        height: 52,
        display: "flex",
        alignItems: "center",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Scrolling track */}
      <div
        style={{ flex: 1, overflow: "hidden", position: "relative", cursor: "default" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 32, zIndex: 1,
            background: "linear-gradient(to right, var(--bg-surface), transparent)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 32, zIndex: 1,
            background: "linear-gradient(to left, var(--bg-surface), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Scrolling content — duplicated for seamless loop */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            willChange: "transform",
            animationName: "ticker-scroll",
            animationDuration: `${Math.max(10, Math.round(HEADLINES.length * 0.45))}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {[...HEADLINES, ...HEADLINES].map((h, i) => {
            const style = catStyle[h.cat] || catStyle.AI
            return (
              <a
                key={i}
                href={h.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ticker-item"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                  marginRight: 36,
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    ...TYPE.xs,
                    textTransform: "uppercase",
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: style.bg,
                    color: style.color,
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {h.cat}
                </span>
                <span
                  className="ticker-text"
                  style={{
                    fontSize: 12.5,
                  }}
                >
                  {h.text}
                </span>
              </a>
            )
          })}
        </div>
      </div>

      {/* Skin picker */}
      {onSkinChange && (
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 8px",
            borderLeft: "1px solid var(--border)",
            height: 52,
          }}
        >
          {config.skins.map(({ id: s }) => (
            <button
              key={s}
              onClick={() => onSkinChange(s)}
              title={SKIN_LABEL[s]}
              aria-label={`${SKIN_LABEL[s]} skin${skin === s ? " (active)" : ""}`}
              aria-pressed={skin === s}
              style={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
                borderRadius: 8,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-elevated)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent" }}
            >
              <span
                style={{
                  display: "block",
                  width:  skin === s ? 8 : 5,
                  height: skin === s ? 8 : 5,
                  borderRadius: "50%",
                  background: SKIN_DOT[s],
                  opacity: skin === s ? 1 : 0.35,
                  outline: skin === s ? `1.5px solid ${SKIN_DOT[s]}` : "none",
                  outlineOffset: 2,
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Day / night toggle */}
      {onToggle && (
        <div style={{
          flexShrink: 0,
          width: 42,
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid var(--border)",
        }}>
          <button
            onClick={onToggle}
            title={isDay ? "Switch to night mode" : "Switch to day mode"}
            aria-label={isDay ? "Switch to night mode" : "Switch to day mode"}
            aria-pressed={isDay}
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              color: "var(--text-tertiary)",
              transition: "all 0.15s",
              padding: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "var(--bg-elevated)" }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent" }}
          >
            {isDay ? <MoonStar size={16} strokeWidth={1.5} /> : <SunMedium size={16} strokeWidth={1.5} />}
          </button>
        </div>
      )}

      <style>{`
        .ticker-text { color: var(--text-tertiary); transition: color 0.15s; }
        .ticker-item:hover .ticker-text { color: var(--text-primary); }
      `}</style>
    </div>
  )
}
