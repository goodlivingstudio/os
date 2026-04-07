#!/usr/bin/env npx tsx
// ─── Gallery Scraper — Visual Intelligence Agent ────────────────────────────
// Visits a list of sites, extracts quality images, optionally runs
// Claude Vision taste filter, pushes to Are.na.
//
// Config-driven: reads targets and channel slug from instance config.
//
// Usage:
//   npx tsx scripts/gallery-scraper.ts                              # dispatch gallery (default)
//   npx tsx scripts/gallery-scraper.ts --instance=explore           # explore gallery
//   npx tsx scripts/gallery-scraper.ts --instance=explore --ugc     # explore UGC channel
//   npx tsx scripts/gallery-scraper.ts --dry-run                    # preview without pushing
//   npx tsx scripts/gallery-scraper.ts --site=unsplash              # scrape one site
//   npx tsx scripts/gallery-scraper.ts --taste                      # enable Claude Vision filter
//   npx tsx scripts/gallery-scraper.ts --instance=explore --ugc --taste
//
// Requires:
//   ARENA_ACCESS_TOKEN env var for Are.na API writes
//   ANTHROPIC_API_KEY env var for taste filtering (optional)

import { chromium } from "playwright"

// ─── Instance Config ───────────────────────────────────────────────────────

// Parse args early — before any imports that depend on env
const args = process.argv.slice(2)
const instanceArg = args.find(a => a.startsWith("--instance="))?.split("=")[1] || "dispatch"
process.env.NEXT_PUBLIC_INSTANCE = instanceArg

// Direct config import — reads the right instance based on env var
import dispatchConfig from "../lib/config/dispatch.js"
import exploreConfig from "../lib/config/explore.js"
import type { InstanceConfig, ScrapeTarget } from "../lib/config/types.js"

const CONFIGS: Record<string, InstanceConfig> = { dispatch: dispatchConfig, explore: exploreConfig }
const config = CONFIGS[instanceArg] || dispatchConfig

const useUgc = args.includes("--ugc")
const scraperConfig = useUgc ? config.ugcScraper : config.galleryScraper

if (!scraperConfig) {
  console.error(`Instance "${instanceArg}" has no ${useUgc ? "ugcScraper" : "galleryScraper"} config.`)
  process.exit(1)
}

const { arenaChannelSlug, targets: TARGETS, tastePrompt } = scraperConfig

// ─── Settings ──────────────────────────────────────────────────────────────

const ARENA_API = "https://api.are.na/v2"
const MAX_IMAGES_PER_SITE = 8
const SCROLL_PAUSE = 1500
const MAX_SCROLLS = 5

// ─── Image Extraction ───────────────────────────────────────────────────────

interface ExtractedImage {
  url: string
  width: number
  height: number
  alt: string
}

async function scrapeImages(url: string, name: string): Promise<ExtractedImage[]> {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  })

  try {
    console.log(`  Visiting ${url}...`)
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })
    await page.waitForTimeout(3000)

    // Scroll to trigger lazy loading
    for (let i = 0; i < MAX_SCROLLS; i++) {
      await page.evaluate("window.scrollBy(0, window.innerHeight)")
      await page.waitForTimeout(SCROLL_PAUSE)
    }

    // Extract images
    const images: ExtractedImage[] = await page.evaluate(() => {
      const results: { url: string; width: number; height: number; alt: string }[] = []
      const seen = new Set<string>()

      document.querySelectorAll("img").forEach(img => {
        const src = img.src || img.dataset.src || ""
        if (!src || !src.startsWith("http") || seen.has(src)) return
        seen.add(src)

        const rect = img.getBoundingClientRect()
        const w = Math.max(img.naturalWidth || 0, img.width || 0, rect.width || 0)
        const h = Math.max(img.naturalHeight || 0, img.height || 0, rect.height || 0)

        if (w < 200 || h < 150) return
        if (w * h < 60000) return

        const urlLow = src.toLowerCase()
        const bad = ["favicon", "logo", "icon", "avatar", "sprite", "pixel",
          "tracking", "1x1", "placeholder", "blank", "spacer",
          "badge", "client", "partner", "sponsor"]
        if (bad.some(b => urlLow.includes(b))) return

        if (w > 0 && h > 0) {
          const ratio = w / h
          if (ratio > 5 || ratio < 0.15) return
        }

        results.push({ url: src, width: Math.round(w), height: Math.round(h), alt: img.alt || "" })
      })

      results.sort((a, b) => (b.width * b.height) - (a.width * a.height))
      return results
    })

    // Also check for background images
    const bgImages: ExtractedImage[] = await page.evaluate(() => {
      const results: { url: string; width: number; height: number; alt: string }[] = []
      document.querySelectorAll("div, section, figure, a").forEach(el => {
        const style = window.getComputedStyle(el)
        const bg = style.backgroundImage
        const rect = el.getBoundingClientRect()
        if (bg && bg !== "none" && rect.width >= 300) {
          const match = bg.match(/url\(["']?([^"')]+)["']?\)/)
          if (match && match[1] && match[1].startsWith("http")) {
            results.push({
              url: match[1],
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              alt: "",
            })
          }
        }
      })
      return results
    })

    const all = [...images, ...bgImages]

    // Deduplicate by normalized URL
    const urlSeen = new Set<string>()
    const unique = all.filter(img => {
      try {
        const u = new URL(img.url)
        u.search = ""
        const key = u.origin + u.pathname.replace(/-\d+x\d+/, "").replace(/@\d+x/, "")
        if (urlSeen.has(key)) return false
        urlSeen.add(key)
        return true
      } catch { return false }
    })

    if (unique.length === 0) {
      const videoCount = await page.evaluate(() => document.querySelectorAll("video").length)
      if (videoCount > 0) {
        console.log(`  No images — site uses ${videoCount} video elements (manual curation via Are.na recommended)`)
      }
    }

    console.log(`  Found ${unique.length} images from ${name}`)
    return unique.slice(0, MAX_IMAGES_PER_SITE)
  } catch (err) {
    console.error(`  Error scraping ${name}: ${err instanceof Error ? err.message : String(err)}`)
    return []
  } finally {
    await browser.close()
  }
}

// ─── Claude Vision Taste Filter (optional) ──────────────────────────────────

async function filterByTaste(images: ExtractedImage[], siteName: string): Promise<ExtractedImage[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || images.length === 0) return images

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: `${tastePrompt}

I have ${images.length} candidate images from ${siteName}. Based on the URLs and alt text below, rate each 1-5 using the criteria above.

${images.map((img, i) => `${i + 1}. alt="${img.alt}" url=${img.url.slice(0, 100)} (${img.width}x${img.height})`).join("\n")}

Return only a JSON array of indices (1-based) that scored 4 or 5. Example: [1, 3, 5]
Return only the JSON array, nothing else.`,
            },
          ],
        }],
      }),
    })

    if (!response.ok) return images

    const data = await response.json()
    const text = data.content?.[0]?.text || ""
    const match = text.match(/\[[\d,\s]*\]/)
    if (!match) return images

    const approved: number[] = JSON.parse(match[0])
    const filtered = approved
      .filter(i => i >= 1 && i <= images.length)
      .map(i => images[i - 1])

    console.log(`  Taste filter: ${filtered.length}/${images.length} approved`)
    return filtered.length > 0 ? filtered : images.slice(0, 3)
  } catch {
    return images
  }
}

// ─── Are.na Dedup ───────────────────────────────────────────────────────────

async function loadExistingUrls(): Promise<Set<string>> {
  const token = process.env.ARENA_ACCESS_TOKEN
  if (!token) return new Set()
  try {
    const urls = new Set<string>()
    let page = 1
    while (true) {
      const res = await fetch(`${ARENA_API}/channels/${arenaChannelSlug}/contents?per=100&page=${page}`, {
        headers: { "Authorization": `Bearer ${token}` },
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) break
      const data = await res.json()
      const blocks = data.contents || []
      if (blocks.length === 0) break
      for (const block of blocks) {
        if (block.image?.display?.url) urls.add(block.image.display.url)
        if (block.image?.original?.url) urls.add(block.image.original.url)
        if (block.source?.url) urls.add(block.source.url)
        if (block.title) urls.add(block.title)
      }
      if (blocks.length < 100) break
      page++
    }
    console.log(`  Loaded ${urls.size} existing URLs from Are.na for dedup\n`)
    return urls
  } catch {
    return new Set()
  }
}

// ─── Are.na Push ────────────────────────────────────────────────────────────

async function pushToArena(imageUrl: string, title: string, sourceUrl: string): Promise<boolean> {
  const token = process.env.ARENA_ACCESS_TOKEN
  if (!token) {
    console.log(`  [dry-run] Would push: ${title} — ${imageUrl.slice(0, 80)}`)
    return true
  }

  try {
    const res = await fetch(`${ARENA_API}/channels/${arenaChannelSlug}/blocks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        source: imageUrl,
        title: title,
        description: `Source: ${sourceUrl}`,
      }),
    })

    if (res.ok) {
      console.log(`  ✓ Pushed: ${title}`)
      return true
    } else {
      const error = await res.text()
      console.error(`  ✗ Failed to push ${title}: ${res.status} ${error.slice(0, 100)}`)
      return false
    }
  } catch (err) {
    console.error(`  ✗ Push error: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const dryRun = args.includes("--dry-run") || !process.env.ARENA_ACCESS_TOKEN
  const useTaste = args.includes("--taste") && !!process.env.ANTHROPIC_API_KEY
  const siteFilter = args.find(a => a.startsWith("--site="))?.split("=")[1]

  console.log(`\n🏔  Gallery Scraper — ${config.branding.name} (${instanceArg}${useUgc ? " · UGC" : ""})`)
  console.log(`   Channel: ${arenaChannelSlug}`)
  if (dryRun) {
    console.log("   Mode: DRY RUN — no images will be pushed to Are.na")
    console.log("   Set ARENA_ACCESS_TOKEN to enable pushing")
  }
  if (useTaste) {
    console.log("   Taste filter: ENABLED")
  }

  const targets = siteFilter
    ? TARGETS.filter((t: ScrapeTarget) => t.url.includes(siteFilter) || t.name.toLowerCase().includes(siteFilter.toLowerCase()))
    : TARGETS

  if (targets.length === 0) {
    console.log(`\nNo targets matching "${siteFilter}"`)
    process.exit(1)
  }

  console.log(`   Sites: ${targets.length}\n`)

  const existingUrls = dryRun ? new Set<string>() : await loadExistingUrls()

  let totalFound = 0
  let totalPushed = 0
  let totalSkipped = 0
  let totalFiltered = 0

  for (const target of targets) {
    console.log(`\n── ${target.name} (${target.category}) ──`)
    let images = await scrapeImages(target.url, target.name)
    totalFound += images.length

    if (images.length === 0) {
      console.log("  No images found")
      continue
    }

    if (useTaste && images.length > 0) {
      const before = images.length
      images = await filterByTaste(images, target.name)
      totalFiltered += before - images.length
    }

    for (const img of images) {
      const title = img.alt || `${target.name} — visual`

      if (existingUrls.has(img.url) || existingUrls.has(title)) {
        totalSkipped++
        continue
      }

      if (dryRun) {
        console.log(`  [preview] ${img.width}×${img.height} ${img.url.slice(0, 80)}`)
      } else {
        const ok = await pushToArena(img.url, title, target.url)
        if (ok) {
          totalPushed++
          existingUrls.add(img.url)
        }
        await new Promise(r => setTimeout(r, 100))
      }
    }
  }

  console.log(`\n── Summary (${config.branding.name}) ──`)
  console.log(`Sites visited: ${targets.length}`)
  console.log(`Images found: ${totalFound}`)
  console.log(`Skipped (already in Are.na): ${totalSkipped}`)
  if (useTaste) console.log(`Filtered by taste: ${totalFiltered}`)
  if (!dryRun) console.log(`Images pushed: ${totalPushed}`)
  console.log("")
}

main().catch(err => {
  console.error("Fatal:", err)
  process.exit(1)
})
