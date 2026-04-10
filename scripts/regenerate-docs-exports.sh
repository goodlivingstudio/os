#!/bin/bash
# ─── Docs export regenerator ─────────────────────────────────────────────────
#
# Regenerates the four docs-export/*-complete.md files by concatenating the
# canonical sources in docs/. The exports are derived artifacts — never edit
# them directly.
#
# USAGE
#   npm run docs:export
#   (or directly: bash scripts/regenerate-docs-exports.sh)
#
# WHAT IT DOES
#   1. os-complete.md         ← all 8 OS-level docs concatenated
#   2. dispatch-complete.md   ← all 14 Dispatch product docs concatenated
#   3. explore-complete.md    ← all 14 Explore product docs concatenated
#   4. lilly-direct-complete.md ← all 14 Lilly Direct product docs concatenated
#
# Each export gets a header with generation date and per-file separators
# matching the convention established at docs-export/README.md.
#
# WHEN TO RUN
#   - After any edit to a file in docs/os/, docs/dispatch/, docs/explore/,
#     or docs/lilly-direct/
#   - Before pasting an export into Claude.ai for a deep-iteration session
#   - As part of a pre-commit hook (future Phase 3 tooling)
#
# HISTORY
#   Promoted from a hand-run bash block in docs-export/README.md to a real
#   npm script during the 2026-04-09 OS restructure session, so the operator
#   never has to remember to regenerate exports manually after editing
#   canonical sources.
# ─────────────────────────────────────────────────────────────────────────────

set -e

# Resolve repo root from script location
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

DATE=$(date +%Y-%m-%d)

# ─── OS export ─────────────────────────────────────────────────────────────
{
  echo "# Good Living Studio OS — Complete Documentation Export"
  echo "Generated: $DATE"
  echo ""
  for f in os/OPERATOR.md os/DOCTRINE.md os/PASSAGE.md os/VOICE.md os/PIPELINE.md os/ARCHITECTURE.md os/GLOSSARY.md os/DOC-AUTHORITY.md; do
    echo ""
    echo "================================================================"
    echo "## FILE: docs/$f"
    echo "================================================================"
    echo ""
    cat "$REPO_ROOT/docs/$f"
    echo ""
  done
} > "$REPO_ROOT/docs-export/os-complete.md"

# ─── Dispatch export (canonical 14-file order) ─────────────────────────────
{
  echo "# Dispatch — Complete Product Documentation Export"
  echo "Generated: $DATE"
  echo ""
  for f in MANDATE CEREBRO-CHARTER SYSTEM-BRIEF ARCHITECTURE PROMPTS ANTI-PATTERNS DOC-AUTHORITY SOURCES SOURCES-MEGALIST LIVE-ENVIRONMENT WATCHFILE ROADMAP VOICE-CALIBRATION REPLICATE-PROMPTS; do
    echo ""
    echo "================================================================"
    echo "## FILE: docs/dispatch/${f}.md"
    echo "================================================================"
    echo ""
    cat "$REPO_ROOT/docs/dispatch/${f}.md"
    echo ""
  done
} > "$REPO_ROOT/docs-export/dispatch-complete.md"

# ─── Explore export ─────────────────────────────────────────────────────────
# Note: Explore places REPLICATE-PROMPTS in Tier 1 (after PROMPTS) because
# its mature form ships before launch. Dispatch places it in Tier 2.
# This is the one canonical-order divergence between products.
{
  echo "# Explore — Complete Product Documentation Export"
  echo "Generated: $DATE"
  echo ""
  for f in MANDATE CEREBRO-CHARTER SYSTEM-BRIEF ARCHITECTURE PROMPTS REPLICATE-PROMPTS ANTI-PATTERNS DOC-AUTHORITY SOURCES SOURCES-MEGALIST LIVE-ENVIRONMENT WATCHFILE ROADMAP VOICE-CALIBRATION; do
    echo ""
    echo "================================================================"
    echo "## FILE: docs/explore/${f}.md"
    echo "================================================================"
    echo ""
    cat "$REPO_ROOT/docs/explore/${f}.md"
    echo ""
  done
} > "$REPO_ROOT/docs-export/explore-complete.md"

# ─── Lilly Direct export ────────────────────────────────────────────────────
{
  echo "# Lilly Direct — Complete Product Documentation Export"
  echo "Generated: $DATE"
  echo ""
  for f in MANDATE CEREBRO-CHARTER SYSTEM-BRIEF ARCHITECTURE PROMPTS ANTI-PATTERNS DOC-AUTHORITY SOURCES SOURCES-MEGALIST LIVE-ENVIRONMENT WATCHFILE ROADMAP VOICE-CALIBRATION REPLICATE-PROMPTS; do
    echo ""
    echo "================================================================"
    echo "## FILE: docs/lilly-direct/${f}.md"
    echo "================================================================"
    echo ""
    cat "$REPO_ROOT/docs/lilly-direct/${f}.md"
    echo ""
  done
} > "$REPO_ROOT/docs-export/lilly-direct-complete.md"

# ─── Summary ────────────────────────────────────────────────────────────────
echo "✓ Regenerated 4 export files in docs-export/:"
for f in os-complete.md dispatch-complete.md explore-complete.md lilly-direct-complete.md; do
  lines=$(wc -l < "$REPO_ROOT/docs-export/$f")
  printf "  %-30s %s lines\n" "$f" "$lines"
done
