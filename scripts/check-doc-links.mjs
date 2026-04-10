#!/usr/bin/env node
// ─── Markdown cross-reference link checker ─────────────────────────────────
//
// Verifies that every relative markdown link (`OPERATOR.md`, `../os/VOICE.md`,
// etc.) in docs/**/*.md actually resolves to a real file. Catches the kind of
// drift that happens when files get renamed, moved, or referenced from prose
// without an explicit path.
//
// USAGE
//   npm run docs:check
//
// EXIT CODES
//   0 — all cross-refs resolve
//   1 — at least one broken cross-ref found (CI-friendly)
//
// WHAT IT CHECKS
//   - Recursively walks `docs/` and finds every `.md` file
//   - Extracts every reference matching the canonical doc-name shape
//     (uppercase letters, optional hyphens, .md extension), including
//     relative-path forms like `../os/OPERATOR.md`
//   - Resolves each reference relative to the file it appears in
//   - Reports any references that don't resolve to a file on disk
//
// CONVENTION ASSUMPTIONS
//   - Doc filenames are SHOUT-CASE with hyphens (MANDATE.md, CEREBRO-CHARTER.md)
//   - The .md suffix means "this is a real file path that should resolve"
//   - When OS-level docs reference a canonical product doc set name
//     conceptually (not as a path), they use the bare name without .md
//     (e.g., "MANDATE" not "MANDATE.md") so the checker doesn't flag them
//
// HISTORY
//   Promoted from a one-shot Python prototype that caught 68+ broken refs
//   during the 2026-04-09 OS restructure session. Adopted as an npm script
//   so future doc edits get automated cross-ref validation.
// ─────────────────────────────────────────────────────────────────────────────

import fs from "node:fs"
import path from "node:path"

const DOCS_ROOT = "docs"

// Match path-like .md references — same regex as the Python prototype.
// Captures the full relative path, not just the filename.
const REF_PATTERN = /(?<![a-zA-Z0-9_/])((?:\.\.\/)?(?:[a-zA-Z0-9_-]+\/)*[A-Z][A-Z0-9_-]*(?:-[A-Z]+)*\.md)(?![a-zA-Z0-9_])/g

function findMdFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findMdFiles(full))
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(full)
    }
  }
  return results
}

function checkLinks() {
  if (!fs.existsSync(DOCS_ROOT)) {
    console.error(`❌ docs/ directory not found. Run from repo root.`)
    process.exit(1)
  }

  const mdFiles = findMdFiles(DOCS_ROOT).sort()
  const broken = []
  let checked = 0

  for (const src of mdFiles) {
    const srcDir = path.dirname(src)
    const content = fs.readFileSync(src, "utf8")

    const refs = new Set()
    for (const match of content.matchAll(REF_PATTERN)) {
      refs.add(match[1])
    }

    for (const ref of [...refs].sort()) {
      checked++
      const target = path.resolve(srcDir, ref)
      if (!fs.existsSync(target)) {
        broken.push({ src, ref, target })
      }
    }
  }

  console.log(`Checked: ${checked} markdown cross-refs across ${mdFiles.length} files`)

  if (broken.length === 0) {
    console.log(`✓ All cross-refs resolve. Zero broken links.`)
    process.exit(0)
  }

  console.error(`❌ Broken: ${broken.length}\n`)
  for (const { src, ref, target } of broken) {
    console.error(`  ${src}`)
    console.error(`    → ${ref}`)
    console.error(`    (resolved: ${target})`)
  }
  console.error(`\nFix the references above, or — if a bare reference is meant`)
  console.error(`as a CONCEPT name rather than a file path — drop the .md suffix.`)
  process.exit(1)
}

checkLinks()
