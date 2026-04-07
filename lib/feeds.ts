// ─── News Feed Definitions ──────────────────────────────────────────────────
// Feed list is now config-driven. This file re-exports from the active instance.

import config from "@/lib/config"
export type { FeedDef } from "@/lib/config/types"

export const FEEDS = config.feeds
