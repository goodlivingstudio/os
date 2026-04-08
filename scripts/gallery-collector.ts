#!/usr/bin/env npx tsx
// ─── Gallery Collector — API-based Image Collection Agent ─────────────────────
// Uses Unsplash and Flickr APIs to collect hundreds of images per query,
// then pushes to Are.na. No browser needed — pure HTTP.
//
// Config-driven: reads targets and channel slug from instance config.
//
// Usage:
//   npx tsx scripts/gallery-collector.ts --instance=explore        # explore curated
//   npx tsx scripts/gallery-collector.ts --instance=explore --ugc  # explore UGC channel
//   npx tsx scripts/gallery-collector.ts --dry-run                 # preview without pushing
//   npx tsx scripts/gallery-collector.ts --instance=explore --dry-run
//
// Requires:
//   ARENA_ACCESS_TOKEN env var for Are.na API writes
//   UNSPLASH_ACCESS_KEY env var for Unsplash API (optional — skipped if missing)
//   FLICKR_API_KEY env var for Flickr API (optional — skipped if missing)

// ─── Instance Config ───────────────────────────────────────────────────────

// Parse args early — before any imports that depend on env
const args = process.argv.slice(2)
const instanceArg = args.find(a => a.startsWith("--instance="))?.split("=")[1] || "dispatch"
process.env.NEXT_PUBLIC_INSTANCE = instanceArg

// Direct config import — reads the right instance based on env var
import dispatchConfig from "../lib/config/dispatch.js"
import exploreConfig from "../lib/config/explore.js"
import type { InstanceConfig } from "../lib/config/types.js"

const CONFIGS: Record<string, InstanceConfig> = { dispatch: dispatchConfig, explore: exploreConfig }
const config = CONFIGS[instanceArg] || dispatchConfig

const useUgc = args.includes("--ugc")
const scraperConfig = useUgc ? config.ugcScraper : config.galleryScraper

if (!scraperConfig) {
  console.error(`Instance "${instanceArg}" has no ${useUgc ? "ugcScraper" : "galleryScraper"} config.`)
  process.exit(1)
}

const { arenaChannelSlug } = scraperConfig

// ─── Settings ──────────────────────────────────────────────────────────────

const ARENA_API = "https://api.are.na/v2"
const RATE_LIMIT_MS = 1000 // 1 request per second

// ─── Search Query Definitions Per Instance ─────────────────────────────────

interface CollectorQueries {
  unsplash: string[]
  flickrTags: string[]
}

const EXPLORE_CURATED_QUERIES: CollectorQueries = {
  unsplash: [
    "yosemite valley", "grand canyon sunrise", "yellowstone geyser",
    "glacier national park", "olympic rainforest", "sequoia giant trees",
    "joshua tree desert", "crater lake blue", "mount rainier wildflowers",
    "bryce canyon hoodoos", "arches national park", "death valley dunes",
    "redwood forest light", "grand teton mountains", "acadia coastline",
    "smoky mountains fog", "denali wilderness", "zion narrows",
    "badlands formations", "canyonlands vista", "rocky mountain alpine",
    "white sands dunes", "everglades wetland", "shenandoah autumn",
    "big sur coastline", "hawaii volcanoes lava",
  ],
  flickrTags: [
    "nationalpark", "americanlandscape", "wilderness", "publiclands",
  ],
}

const EXPLORE_UGC_QUERIES: CollectorQueries = {
  unsplash: [
    "camping tent nature", "hiking trail sunrise", "campfire friends outdoors",
    "family national park", "backpacking wilderness trail", "fishing river mountain",
    "kayaking lake morning", "rock climbing outdoor", "wildlife photography america",
    "stargazing milky way camp", "kids nature exploration", "bison yellowstone wild",
  ],
  flickrTags: [
    "camping", "hiking", "findyourpark", "optoutside", "trailrunning", "backpacking",
  ],
}

function getQueries(instance: string, ugc: boolean): CollectorQueries {
  if (instance === "explore") {
    return ugc ? EXPLORE_UGC_QUERIES : EXPLORE_CURATED_QUERIES
  }
  // Default empty — add new instance queries here
  return { unsplash: [], flickrTags: [] }
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface CollectedImage {
  url: string
  alt: string
  source: string   // "unsplash" | "flickr"
  query: string    // the search query that found it
}

// ─── Rate Limiter ──────────────────────────────────────────────────────────

let lastRequestTime = 0

async function rateLimited<T>(fn: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise(r => setTimeout(r, RATE_LIMIT_MS - elapsed))
  }
  lastRequestTime = Date.now()
  return fn()
}

// ─── Unsplash API ──────────────────────────────────────────────────────────

const UNSPLASH_MAX_PAGES = 5
const UNSPLASH_PER_PAGE = 30

interface UnsplashPhoto {
  urls: { regular: string; small: string }
  alt_description: string | null
  description: string | null
  user: { name: string }
}

interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashPhoto[]
}

async function searchUnsplash(query: string, accessKey: string): Promise<CollectedImage[]> {
  const images: CollectedImage[] = []
  const maxPages = UNSPLASH_MAX_PAGES

  for (let page = 1; page <= maxPages; page++) {
    try {
      const data = await rateLimited(async () => {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${UNSPLASH_PER_PAGE}&page=${page}`
        const res = await fetch(url, {
          headers: { "Authorization": `Client-ID ${accessKey}` },
          signal: AbortSignal.timeout(15000),
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Unsplash ${res.status}: ${text.slice(0, 100)}`)
        }
        return res.json() as Promise<UnsplashSearchResponse>
      })

      if (!data.results || data.results.length === 0) break

      for (const photo of data.results) {
        const imageUrl = photo.urls.regular
        if (!imageUrl) continue
        images.push({
          url: imageUrl,
          alt: photo.alt_description || photo.description || `${query} — photo by ${photo.user.name}`,
          source: "unsplash",
          query,
        })
      }

      if (page >= data.total_pages) break
    } catch (err) {
      console.error(`    Unsplash page ${page} error for "${query}": ${err instanceof Error ? err.message : String(err)}`)
      break
    }
  }

  return images
}

// ─── Flickr API ────────────────────────────────────────────────────────────

const FLICKR_MAX_PAGES = 3
const FLICKR_PER_PAGE = 100

interface FlickrPhoto {
  id: string
  title: string
  url_l?: string
  url_o?: string
  description?: { _content: string }
}

interface FlickrSearchResponse {
  photos: {
    page: number
    pages: number
    photo: FlickrPhoto[]
  }
  stat: string
}

async function searchFlickr(tags: string, apiKey: string): Promise<CollectedImage[]> {
  const images: CollectedImage[] = []
  const maxPages = FLICKR_MAX_PAGES

  for (let page = 1; page <= maxPages; page++) {
    try {
      const data = await rateLimited(async () => {
        const params = new URLSearchParams({
          method: "flickr.photos.search",
          api_key: apiKey,
          tags,
          per_page: String(FLICKR_PER_PAGE),
          page: String(page),
          extras: "url_l,url_o,description",
          format: "json",
          nojsoncallback: "1",
          sort: "relevance",
          content_type: "1",       // photos only
          media: "photos",
          safe_search: "1",        // safe content
        })
        const url = `https://www.flickr.com/services/rest/?${params}`
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
        if (!res.ok) {
          throw new Error(`Flickr ${res.status}`)
        }
        return res.json() as Promise<FlickrSearchResponse>
      })

      if (data.stat !== "ok" || !data.photos?.photo?.length) break

      for (const photo of data.photos.photo) {
        // Prefer url_l (large 1024), fall back to url_o (original)
        const imageUrl = photo.url_l || photo.url_o
        if (!imageUrl) continue

        const alt = photo.title ||
          photo.description?._content?.slice(0, 100) ||
          `${tags} — Flickr`

        images.push({
          url: imageUrl,
          alt,
          source: "flickr",
          query: tags,
        })
      }

      if (page >= data.photos.pages) break
    } catch (err) {
      console.error(`    Flickr page ${page} error for "${tags}": ${err instanceof Error ? err.message : String(err)}`)
      break
    }
  }

  return images
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

// ─── Blocklist — skip images the user has rejected ──────────────────────────

async function loadBlocklist(): Promise<Set<string>> {
  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN
  if (!kvUrl || !kvToken) return new Set()
  try {
    const key = `${config.id}:gallery:blocklist`
    const res = await fetch(`${kvUrl}/smembers/${key}`, {
      headers: { "Authorization": `Bearer ${kvToken}` },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return new Set()
    const data = await res.json() as { result?: string[] }
    const urls = new Set(data.result || [])
    if (urls.size > 0) console.log(`  Loaded ${urls.size} blocked URLs from curation history`)
    return urls
  } catch {
    return new Set()
  }
}

// ─── Are.na Push ────────────────────────────────────────────────────────────

async function pushToArena(imageUrl: string, title: string, sourceApi: string): Promise<boolean> {
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
        description: `Collected via ${sourceApi} API`,
      }),
    })

    if (res.ok) {
      console.log(`  + Pushed: ${title.slice(0, 60)}`)
      return true
    } else {
      const error = await res.text()
      console.error(`  x Failed to push: ${res.status} ${error.slice(0, 100)}`)
      return false
    }
  } catch (err) {
    console.error(`  x Push error: ${err instanceof Error ? err.message : String(err)}`)
    return false
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const dryRun = args.includes("--dry-run") || !process.env.ARENA_ACCESS_TOKEN
  const queries = getQueries(instanceArg, useUgc)

  const hasUnsplash = !!process.env.UNSPLASH_ACCESS_KEY
  const hasFlickr = !!process.env.FLICKR_API_KEY

  console.log(`\nGallery Collector — ${config.branding.name} (${instanceArg}${useUgc ? " / UGC" : ""})`)
  console.log(`   Channel: ${arenaChannelSlug}`)
  if (dryRun) {
    console.log("   Mode: DRY RUN — no images will be pushed to Are.na")
    if (!process.env.ARENA_ACCESS_TOKEN) console.log("   Set ARENA_ACCESS_TOKEN to enable pushing")
  }
  console.log(`   Unsplash: ${hasUnsplash ? `READY (${queries.unsplash.length} queries)` : "SKIPPED (no UNSPLASH_ACCESS_KEY)"}`)
  console.log(`   Flickr:   ${hasFlickr ? `READY (${queries.flickrTags.length} tag sets)` : "SKIPPED (no FLICKR_API_KEY)"}`)

  if (!hasUnsplash && !hasFlickr) {
    console.error("\n   No API keys configured. Set UNSPLASH_ACCESS_KEY and/or FLICKR_API_KEY.")
    process.exit(1)
  }

  // Load existing Are.na content for dedup + blocklist
  const existingUrls = dryRun ? new Set<string>() : await loadExistingUrls()
  const blockedUrls = await loadBlocklist()

  // Collect all images
  const allImages: CollectedImage[] = []

  // ── Unsplash collection ──
  if (hasUnsplash && queries.unsplash.length > 0) {
    console.log(`\n── Unsplash (${queries.unsplash.length} queries, up to ${UNSPLASH_MAX_PAGES * UNSPLASH_PER_PAGE} images each) ──`)
    const accessKey = process.env.UNSPLASH_ACCESS_KEY!
    for (const query of queries.unsplash) {
      process.stdout.write(`  "${query}"...`)
      const images = await searchUnsplash(query, accessKey)
      console.log(` ${images.length} images`)
      allImages.push(...images)
    }
  }

  // ── Flickr collection ──
  if (hasFlickr && queries.flickrTags.length > 0) {
    console.log(`\n── Flickr (${queries.flickrTags.length} tag sets, up to ${FLICKR_MAX_PAGES * FLICKR_PER_PAGE} images each) ──`)
    const apiKey = process.env.FLICKR_API_KEY!
    for (const tags of queries.flickrTags) {
      process.stdout.write(`  [${tags}]...`)
      const images = await searchFlickr(tags, apiKey)
      console.log(` ${images.length} images`)
      allImages.push(...images)
    }
  }

  console.log(`\n── Dedup & Push ──`)
  console.log(`  Total collected: ${allImages.length}`)

  // Deduplicate by URL
  const seenUrls = new Set<string>()
  const unique: CollectedImage[] = []
  for (const img of allImages) {
    // Normalize URL for dedup — strip query params
    let normalizedUrl: string
    try {
      const u = new URL(img.url)
      u.search = ""
      normalizedUrl = u.toString()
    } catch {
      normalizedUrl = img.url
    }
    if (seenUrls.has(normalizedUrl)) continue
    seenUrls.add(normalizedUrl)
    unique.push(img)
  }

  console.log(`  After self-dedup: ${unique.length}`)

  // Filter against existing Are.na content + blocklist
  const newImages = unique.filter(img => {
    if (blockedUrls.has(img.url)) return false
    const title = img.alt || `${img.query} — ${img.source}`
    return !existingUrls.has(img.url) && !existingUrls.has(title)
  })
  console.log(`  New (not in Are.na): ${newImages.length}`)

  // Vision filter — evaluate actual images if ANTHROPIC_API_KEY is set
  let approved = newImages
  if (process.env.ANTHROPIC_API_KEY && scraperConfig?.tastePrompt && newImages.length > 0) {
    const { visionFilter } = await import("./lib/vision-filter.js")
    console.log(`\n── Vision Filter (${newImages.length} candidates) ──`)
    approved = await visionFilter(
      newImages.map(img => ({ url: img.url, alt: img.alt })),
      scraperConfig!.tastePrompt,
      "API Collection",
      4, // min score
    ) as typeof newImages
    // Map back to CollectedImage format
    const approvedUrls = new Set(approved.map(a => a.url))
    approved = newImages.filter(img => approvedUrls.has(img.url))
    console.log(`  Approved for push: ${approved.length}`)
  }

  let totalSkipped = newImages.length - approved.length
  let totalPushed = 0

  for (const img of approved) {
    const title = img.alt || `${img.query} — ${img.source}`

    if (dryRun) {
      // In dry-run just count and show a sample
      totalPushed++
      if (totalPushed <= 10) {
        console.log(`  [preview] ${img.source} | ${img.query} | ${img.url.slice(0, 70)}`)
      }
    } else {
      const ok = await pushToArena(img.url, title, img.source)
      if (ok) {
        totalPushed++
        existingUrls.add(img.url)
      }
      // Rate limit pushes
      await new Promise(r => setTimeout(r, 100))
    }
  }

  if (dryRun && totalPushed > 10) {
    console.log(`  ... and ${totalPushed - 10} more`)
  }

  console.log(`\n── Summary (${config.branding.name}${useUgc ? " / UGC" : ""}) ──`)
  console.log(`Total collected from APIs: ${allImages.length}`)
  console.log(`After self-dedup: ${unique.length}`)
  console.log(`Skipped (already in Are.na): ${totalSkipped}`)
  if (dryRun) {
    console.log(`Would push: ${totalPushed}`)
  } else {
    console.log(`Images pushed: ${totalPushed}`)
  }
  console.log("")
}

main().catch(err => {
  console.error("Fatal:", err)
  process.exit(1)
})
