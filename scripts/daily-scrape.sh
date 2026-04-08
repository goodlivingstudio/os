#!/bin/bash
# ─── Daily Gallery Scraper ───────────────────────────────────────────────────
# Runs both Dispatch and Explore scrapers, logs results, sends macOS notification.
# Scheduled via launchd at 9 AM daily.

set -e

# Setup
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/.scraper-log.txt"
DATE=$(date '+%Y-%m-%d %H:%M')
PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

# Load env vars
set -a
source "$PROJECT_DIR/.env.local"
set +a

cd "$PROJECT_DIR"

echo "=== Daily Scrape — $DATE ===" >> "$LOG_FILE"

# ── Dispatch (66 targets) ──
echo "Starting Dispatch scraper..." >> "$LOG_FILE"
DISPATCH_RESULT=$(npx tsx scripts/gallery-scraper.ts --instance=dispatch 2>&1 | tail -5)
DISPATCH_PUSHED=$(echo "$DISPATCH_RESULT" | grep "Images pushed:" | awk '{print $NF}')
DISPATCH_PUSHED=${DISPATCH_PUSHED:-0}
echo "Dispatch: $DISPATCH_PUSHED images pushed" >> "$LOG_FILE"

# ── Explore curated (80+ targets) ──
echo "Starting Explore scraper..." >> "$LOG_FILE"
EXPLORE_RESULT=$(npx tsx scripts/gallery-scraper.ts --instance=explore 2>&1 | tail -5)
EXPLORE_PUSHED=$(echo "$EXPLORE_RESULT" | grep "Images pushed:" | awk '{print $NF}')
EXPLORE_PUSHED=${EXPLORE_PUSHED:-0}
echo "Explore: $EXPLORE_PUSHED images pushed" >> "$LOG_FILE"

# ── Explore UGC ──
echo "Starting Explore UGC scraper..." >> "$LOG_FILE"
UGC_RESULT=$(npx tsx scripts/gallery-scraper.ts --instance=explore --ugc 2>&1 | tail -5)
UGC_PUSHED=$(echo "$UGC_RESULT" | grep "Images pushed:" | awk '{print $NF}')
UGC_PUSHED=${UGC_PUSHED:-0}
echo "Explore UGC: $UGC_PUSHED images pushed" >> "$LOG_FILE"

TOTAL=$((DISPATCH_PUSHED + EXPLORE_PUSHED + UGC_PUSHED))
echo "Total: $TOTAL new images" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

# ── macOS notification ──
osascript -e "display notification \"Dispatch: ${DISPATCH_PUSHED} · Explore: ${EXPLORE_PUSHED} · UGC: ${UGC_PUSHED} — ${TOTAL} total new images\" with title \"Gallery Scraper Complete\" subtitle \"Daily scrape finished at $(date '+%H:%M')\""
