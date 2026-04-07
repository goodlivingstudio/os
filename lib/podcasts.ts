// ─── Podcast Feed Definitions ───────────────────────────────────────────────
// Podcast list is now config-driven.

import config from "@/lib/config"
export type { PodcastFeed } from "@/lib/config/types"

export const PODCAST_FEEDS = config.podcasts
