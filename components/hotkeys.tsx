"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { TYPE, MONO, labelStyle } from "@/lib/styles"

const SHORTCUTS = [
  { section: "Navigation", items: [
    { keys: ["←", "→"], desc: "Cycle views (Signal / Audio / Synthesis)" },
    { keys: ["1"], desc: "Signal" },
    { keys: ["2"], desc: "Sound" },
    { keys: ["3"], desc: "Synthesis" },
    { keys: ["4"], desc: "Surface" },
    { keys: ["F"], desc: "Focus mode (Cerebro full-width)" },
    { keys: ["G"], desc: "Surface" },
    { keys: ["C", "/"], desc: "Focus Cerebro input" },
  ]},
  { section: "Surface", items: [
    { keys: ["←", "→"], desc: "Previous / next image" },
    { keys: ["Esc"], desc: "Close lightbox or surface" },
  ]},
  { section: "General", items: [
    { keys: ["?"], desc: "Toggle this panel" },
    { keys: ["Esc"], desc: "Close overlays / exit focus mode" },
  ]},
]

export function HotkeysOverlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "?") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "status-fade 0.15s ease both",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: "32px 36px",
          width: 480,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <span style={{ ...labelStyle }}>
            Keyboard Shortcuts
          </span>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", transition: "all 0.15s", borderRadius: 6, padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-elevated)" }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-tertiary)"; e.currentTarget.style.background = "transparent" }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Sections */}
        {SHORTCUTS.map((section, si) => (
          <div key={section.section} style={{ marginBottom: si < SHORTCUTS.length - 1 ? 24 : 0 }}>
            <div style={{ ...TYPE.sm, color: "var(--accent-secondary)", textTransform: "uppercase", fontWeight: 500, marginBottom: 10 }}>
              {section.section}
            </div>
            {section.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ ...TYPE.body, color: "var(--text-secondary)" }}>{item.desc}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {item.keys.map(k => (
                    <kbd key={k} style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: 28, height: 24, padding: "0 8px",
                      borderRadius: 5,
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      fontFamily: MONO, ...TYPE.xs,
                      color: "var(--text-primary)",
                      transition: "all 0.15s", cursor: "default",
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--border)"; e.currentTarget.style.borderColor = "var(--text-tertiary)" }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.borderColor = "var(--border)" }}
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
