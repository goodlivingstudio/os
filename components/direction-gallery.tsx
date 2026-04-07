"use client"

import { useState } from "react"
import { TYPE } from "@/lib/styles"
import type { CuratedImage } from "@/lib/gallery"

// ─── Direction Gallery ─────────────────────────────────────────────────────
// Composite image layout for a single color direction.
// Hero (58% width) + 2 stacked small images, plus thumbnail strip below.
//
// +-------------------+----------+
// |                   |  small-1 |
// |   HERO IMAGE      +----------+
// |   (~58% width)    |  small-2 |
// +-------------------+----------+
// | thumb-1  | thumb-2  | thumb-3 |
// +----------+----------+---------+

interface DirectionGalleryProps {
  images: CuratedImage[]
  onImageClick?: (image: CuratedImage) => void
}

function GalleryImage({ image, style, onError, onClick }: {
  image: CuratedImage
  style: React.CSSProperties
  onError: () => void
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative", overflow: "hidden",
        cursor: onClick ? "zoom-in" : "default",
        ...style,
      }}
    >
      <img
        src={image.url}
        alt={image.title || ""}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={onError}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", display: "block",
        }}
      />
      {/* Source attribution */}
      <span style={{
        position: "absolute", bottom: 6, left: 8,
        ...TYPE.xs, letterSpacing: "0.03em",
        color: "rgba(255,255,255,0.7)",
        textShadow: "0 1px 3px rgba(0,0,0,0.5)",
        pointerEvents: "none",
      }}>
        {image.source}
      </span>
    </div>
  )
}

export function DirectionGallery({ images, onImageClick }: DirectionGalleryProps) {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())

  if (!images?.length) return null

  const visible = images.filter(img => !hiddenIds.has(img.id))
  if (visible.length === 0) return null

  const hideImage = (id: string) => {
    setHiddenIds(prev => new Set(prev).add(id))
  }

  const hero = visible[0]
  const smalls = visible.slice(1, 3)
  const thumbs = visible.slice(3, 6)
  const gap = 6
  const heroWidthPct = 58

  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {/* Top row: hero + small stack */}
      <div style={{ display: "flex", gap, height: 160 }}>
        {/* Hero */}
        <GalleryImage
          image={hero}
          style={{
            flex: `0 0 ${heroWidthPct}%`,
            borderRadius: 6,
            height: "100%",
          }}
          onError={() => hideImage(hero.id)}
          onClick={onImageClick ? () => onImageClick(hero) : undefined}
        />
        {/* Stacked small images */}
        {smalls.length > 0 && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", gap,
            minWidth: 0,
          }}>
            {smalls.map(img => (
              <GalleryImage
                key={img.id}
                image={img}
                style={{
                  flex: 1, borderRadius: 4,
                  minHeight: 0,
                }}
                onError={() => hideImage(img.id)}
                onClick={onImageClick ? () => onImageClick(img) : undefined}
              />
            ))}
          </div>
        )}
      </div>
      {/* Thumbnail strip */}
      {thumbs.length > 0 && (
        <div style={{ display: "flex", gap, height: 72 }}>
          {thumbs.map(img => (
            <GalleryImage
              key={img.id}
              image={img}
              style={{
                flex: 1, borderRadius: 4,
                minWidth: 0,
              }}
              onError={() => hideImage(img.id)}
              onClick={onImageClick ? () => onImageClick(img) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
