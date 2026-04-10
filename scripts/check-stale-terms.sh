#!/bin/bash
# ─── Stale term sweep ────────────────────────────────────────────────────────
#
# Greps the codebase for terminology that should no longer appear after
# the 2026-04-09 OS restructure. If any of these patterns show up in
# committed code or docs, something has drifted.
#
# USAGE
#   npm run docs:terms
#   (or directly: bash scripts/check-stale-terms.sh)
#
# EXIT CODES
#   0 — clean (no stale terms found)
#   1 — at least one stale term hit
#
# WHAT IT CHECKS
#   - "Active Engagements" (renamed to "PRIORITY INTELLIGENCE TARGETS" in
#     the new OPERATOR.md; old refs are broken anchors)
#   - "Gallery discipline" (renamed to "Visual surfaces earn their place"
#     as a DOCTRINE principle)
#   - "HISTORICAL NAMING ARTIFACT" (section deleted after the dispatch → os
#     repo rename completed)
#   - "goodlivingstudio/dispatch" (old repo URL — now goodlivingstudio/os)
#   - "material skin" (renamed to "theme" per the canonical GLOSSARY entry)
#   - "defaultSkin" (renamed to "defaultTheme" in InstanceConfig contract)
#   - "docs/lilly/" (renamed to "docs/lilly-direct/" to match canonical name)
#   - "lilly-complete.md" (renamed to "lilly-direct-complete.md")
#   - The intentional "Mother repo" disambiguation rule in AGENTS.md is
#     allowed because it tells people NOT to use that name.
#
# WHEN TO RUN
#   - Before any commit that touches docs/, lib/, app/, components/, or scripts/
#   - As part of CI (future)
#   - After any major refactor to verify the rename didn't leave stragglers
#
# HISTORY
#   Built during the 2026-04-09 deep audit session that swept all of these
#   terms to zero. Captures the discipline as a runnable command so the
#   discipline doesn't regress.
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

# Patterns to sweep
PATTERNS=(
  "Active Engagements"
  "active engagement context"
  "Gallery discipline"
  "HISTORICAL NAMING"
  "goodlivingstudio/dispatch"
  "material skin"
  "material-skin"
  "defaultSkin"
  "instanceConfig\.skins"
  "config\.skins"
  "docs/lilly/"
  "lilly-complete\.md"
  "Good Living Studio —"
)

# Common include globs
INCLUDES=(
  --include="*.md"
  --include="*.ts"
  --include="*.tsx"
  --include="*.json"
  --include="*.yml"
  --include="*.yaml"
  --include="*.sh"
  --include="*.mjs"
)

# Common exclude globs
# - node_modules + .next + .git: build artifacts and dependencies
# - docs-export: derived artifacts (regenerated from canonical sources)
# - PHASE-PLAN.md: gitignored session-local working doc, may legitimately
#   reference stale terms in historical context
# - check-stale-terms.sh: this script itself defines the patterns it greps for,
#   so it would always match itself
EXCLUDES=(
  --exclude-dir=node_modules
  --exclude-dir=.next
  --exclude-dir=.git
  --exclude-dir=docs-export
  --exclude=PHASE-PLAN.md
  --exclude=check-stale-terms.sh
)

total_hits=0
echo "Scanning for stale terms across docs/, lib/, app/, components/, scripts/, .github/, AGENTS.md, README.md, package.json..."
echo

for term in "${PATTERNS[@]}"; do
  hits=$(grep -rnE "$term" "${INCLUDES[@]}" "${EXCLUDES[@]}" docs/ lib/ app/ components/ scripts/ .github/ AGENTS.md README.md CLAUDE.md package.json 2>/dev/null | wc -l | tr -d ' ')
  if [ "$hits" -gt 0 ]; then
    # Special-case: the "Mother repo" disambiguation in AGENTS.md is intentional
    if [ "$term" = "Mother repo" ]; then
      total_intentional=$(grep -rnE "$term" AGENTS.md 2>/dev/null | grep -c "Do not call\|that name is gone\|is wrong" || echo "0")
      if [ "$hits" -eq "$total_intentional" ]; then
        printf "✓ %-32s %s hits (all intentional disambiguation)\n" "$term" "$hits"
        continue
      fi
    fi
    printf "❌ %-32s %s hits\n" "$term" "$hits"
    grep -rnE "$term" "${INCLUDES[@]}" "${EXCLUDES[@]}" docs/ lib/ app/ components/ scripts/ .github/ AGENTS.md README.md CLAUDE.md package.json 2>/dev/null | sed 's/^/    /'
    total_hits=$((total_hits + hits))
  else
    printf "✓ %-32s 0 hits\n" "$term"
  fi
done

echo
if [ "$total_hits" -gt 0 ]; then
  echo "❌ Found $total_hits stale term hits. Fix or justify before committing."
  exit 1
fi

echo "✓ All stale terms swept clean. Zero hits across $((${#PATTERNS[@]})) patterns."
exit 0
