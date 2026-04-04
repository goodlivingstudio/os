#!/bin/bash
# Gallery scraper — runs daily via crontab with Claude Vision taste filter
PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:$PATH"
cd /Users/jeremygrant/claude-projects/dispatch

# Load env vars for both Are.na and Anthropic (taste filter)
source .env.local 2>/dev/null

ARENA_ACCESS_TOKEN=${ARENA_ACCESS_TOKEN} \
ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY} \
npx tsx scripts/gallery-scraper.ts --taste >> /tmp/dispatch-scraper.log 2>&1
