#!/bin/bash
# Audio image regeneration — runs weekly via crontab
PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:$PATH"
cd /Users/jeremygrant/claude-projects/dispatch

# Load env vars for Replicate and KV
source .env.local 2>/dev/null

REPLICATE_API_TOKEN=${REPLICATE_API_TOKEN} \
KV_REST_API_URL=${KV_REST_API_URL} \
KV_REST_API_TOKEN=${KV_REST_API_TOKEN} \
npx tsx scripts/gen-audio-images.ts --force >> /tmp/dispatch-audio-images.log 2>&1
