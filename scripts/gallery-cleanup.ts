#!/usr/bin/env npx tsx
// ─── Gallery Cleanup — Re-evaluate existing Are.na images ───────────────────
// Pulls all images from an Are.na channel, runs them through the vision
// filter, and removes any that don't pass.
//
// Usage:
//   npx tsx scripts/gallery-cleanup.ts --instance=explore           # clean curated channel
//   npx tsx scripts/gallery-cleanup.ts --instance=explore --ugc     # clean UGC channel
//   npx tsx scripts/gallery-cleanup.ts --instance=explore --dry-run # preview what would be removed
//
// Requires:
//   ARENA_ACCESS_TOKEN env var
//   ANTHROPIC_API_KEY env var

const args = process.argv.slice(2)
const instanceArg = args.find(a => a.startsWith("--instance="))?.split("=")[1] || "dispatch"
process.env.NEXT_PUBLIC_INSTANCE = instanceArg

import dispatchConfig from "../lib/config/dispatch.js"
import exploreConfig from "../lib/config/explore.js"
import type { InstanceConfig } from "../lib/config/types.js"
import { visionFilter } from "./lib/vision-filter.js"

const CONFIGS: Record<string, InstanceConfig> = { dispatch: dispatchConfig, explore: exploreConfig }
const config = CONFIGS[instanceArg] || dispatchConfig

const useUgc = args.includes("--ugc")
const dryRun = args.includes("--dry-run")
const scraperConfig = useUgc ? config.ugcScraper : config.galleryScraper

if (!scraperConfig) {
  console.error(`Instance "${instanceArg}" has no ${useUgc ? "ugcScraper" : "galleryScraper"} config.`)
  process.exit(1)
}

const { arenaChannelSlug, tastePrompt } = scraperConfig
const ARENA_API = "https://api.are.na/v2"
const token = process.env.ARENA_ACCESS_TOKEN
const apiKey = process.env.ANTHROPIC_API_KEY

if (!token) { console.error("ARENA_ACCESS_TOKEN required."); process.exit(1) }
if (!apiKey) { console.error("ANTHROPIC_API_KEY required for vision evaluation."); process.exit(1) }

interface ArenaBlock {
  id: number
  title?: string
  image?: {
    display?: { url?: string }
    original?: { url?: string }
  }
  source?: { url?: string }
}

// ─── Load all blocks from channel ───────────────────────────────────────────

async function loadAllBlocks(): Promise<ArenaBlock[]> {
  const blocks: ArenaBlock[] = []
  let page = 1
  while (true) {
    const res = await fetch(`${ARENA_API}/channels/${arenaChannelSlug}/contents?per=100&page=${page}`, {
      headers: { "Authorization": `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      console.error(`Failed to load channel page ${page}: ${res.status}`)
      break
    }
    const data = await res.json()
    const contents = data.contents || []
    if (contents.length === 0) break
    blocks.push(...contents)
    if (contents.length < 100) break
    page++
  }
  return blocks
}

// ─── Delete a block from Are.na ─────────────────────────────────────────────

async function deleteBlock(blockId: number): Promise<boolean> {
  try {
    const res = await fetch(`${ARENA_API}/channels/${arenaChannelSlug}/blocks/${blockId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🧹 Gallery Cleanup — ${config.branding.name} (${instanceArg}${useUgc ? " · UGC" : ""})`)
  console.log(`   Channel: ${arenaChannelSlug}`)
  if (dryRun) console.log("   Mode: DRY RUN — nothing will be deleted")

  // Load all blocks
  console.log("\n── Loading channel contents ──")
  const blocks = await loadAllBlocks()
  console.log(`  ${blocks.length} blocks in channel`)

  // Filter to image blocks only
  const imageBlocks = blocks.filter(b => {
    const url = b.image?.display?.url || b.image?.original?.url
    return url && url.startsWith("http")
  })
  console.log(`  ${imageBlocks.length} image blocks to evaluate`)

  if (imageBlocks.length === 0) {
    console.log("  Nothing to clean up.")
    return
  }

  // Run vision filter on all images
  console.log("\n── Vision evaluation ──")
  const candidates = imageBlocks.map(b => ({
    url: (b.image?.display?.url || b.image?.original?.url)!,
    alt: b.title || undefined,
    blockId: b.id,
  }))

  const approved = await visionFilter(
    candidates,
    tastePrompt,
    "Channel Cleanup",
    4, // min score to keep
  )

  const approvedUrls = new Set(approved.map(a => a.url))
  const toRemove = candidates.filter(c => !approvedUrls.has(c.url))

  console.log(`\n── Results ──`)
  console.log(`  Keep: ${approved.length}`)
  console.log(`  Remove: ${toRemove.length}`)

  if (toRemove.length === 0) {
    console.log("  Channel is clean. Nothing to remove.")
    return
  }

  // Show what would be removed
  console.log("\n── Removing ──")
  let removed = 0
  for (const item of toRemove) {
    const block = imageBlocks.find(b => (b.image?.display?.url || b.image?.original?.url) === item.url)
    const title = block?.title || item.url.slice(0, 60)

    if (dryRun) {
      console.log(`  [would remove] ${title}`)
    } else {
      const ok = await deleteBlock((item as typeof item & { blockId: number }).blockId)
      if (ok) {
        console.log(`  ✗ Removed: ${title}`)
        removed++
      } else {
        console.log(`  ⚠ Failed to remove: ${title}`)
      }
      // Rate limit
      await new Promise(r => setTimeout(r, 200))
    }
  }

  console.log(`\n── Summary ──`)
  console.log(`  Total in channel: ${imageBlocks.length}`)
  console.log(`  Approved by vision: ${approved.length}`)
  if (dryRun) {
    console.log(`  Would remove: ${toRemove.length}`)
  } else {
    console.log(`  Removed: ${removed}`)
    console.log(`  Remaining: ${imageBlocks.length - removed}`)
  }
  console.log("")
}

main().catch(err => {
  console.error("Fatal:", err)
  process.exit(1)
})
