# EXPLORE — Roadmap
Established: 2026-04-07

*Canonical for what to build next. Three phases tied to the engagement's operational horizon. Active bugs tracked separately from build priorities. Completed work archived at bottom.*

---

## ACTIVE BUGS
*Fix before adding new features.*

1. **No system exists yet** — All current documents are doctrine. No `lib/prompts.ts`, no API routes, no feed infrastructure. The build hasn't started. The roadmap below is the sequence to get from zero to operational.

*(Add real bugs here as the build begins.)*

---

## PHASE 1 — DOCTRINE COMPLETE, BUILD BEGINS
*Target: operational before the EEOB onsite debrief. Core intelligence pipeline running.*

### Priority 1 — Prompt Architecture → Code
**What:** Transcribe PROMPTS.md into `lib/prompts.ts`. All six named exports (ENGAGEMENT, NDS_CONTEXT, FIVE_LAYERS, SOURCE_MODES, VOICE, EXPLORE_PREAMBLE). All six surface prompt strings. Assembly pattern as documented.

**Why first:** Nothing runs without this. Every other build item depends on the prompts being in code.

**Acceptance:** `import { EXPLORE_PREAMBLE } from '@/lib/prompts'` resolves without error. Spot-check ENGAGEMENT block matches MANDATE.md.

---

### Priority 2 — Feed Infrastructure
**What:** RSS ingestion pipeline for Signal sources. Start with the highest-urgency category: NDS Intelligence (8 sources) and Federal Digital Services (8 sources). Wire to annotation endpoint.

**Why second:** The system has no intelligence without a feed. Start with the 16 sources most likely to generate watch-file-relevant signal. Expand to full source list in Phase 2.

**Acceptance:** 16 sources ingesting. Articles arriving at annotation endpoint. No deduplication required yet.

---

### Priority 3 — Annotation Engine
**What:** `/api/annotate` using the Annotation surface prompt from PROMPTS.md. Haiku model. Server-side during ISR. Returns structured JSON per article (synopsis, relevance hook, signal type, primary layer, watch item flag, five scores + urgency).

**Why third:** The annotation layer is what makes the feed intelligence instead of news. Every downstream surface depends on scored, annotated articles.

**Acceptance:** Articles returning valid JSON annotation objects. Watch item field populating correctly when NDS-relevant content arrives. Scores plausible on manual review.

---

### Priority 4 — DCOS Brief Surface
**What:** `/api/brief` using the DCOS surface prompt. Haiku model. Returns exactly 3 JSON signal cards. Watch item flagging active.

**Why fourth:** The DCOS is the team's daily entry point. It's the highest-frequency touchpoint and the surface that validates whether the annotation engine is working.

**Acceptance:** 3 cards generating from annotated feed. Cards representing different layers. Watch item cards surfacing when relevant signal arrives.

---

### Priority 5 — Cerebro (Field Intelligence)
**What:** `/api/cerebro` using the Cerebro surface prompt. Sonnet model with web search + Upstash KV conversation memory (30-day persistence). Push Forward producing 3 specific provocations per response.

**Why fifth:** Cerebro is the deliberation layer — the high-value surface that justifies the whole system. Gets the Sonnet budget.

**Acceptance:** Responses leading with intelligence, not orientation. Confidence tiers appearing on positional claims. Weakest claim closing every substantive response. Web search triggering on recency-dependent claims. Push Forward producing 3 specific, non-generic directions.

---

## PHASE 2 — FULL FEED + SYNTHESIS
*Target: full intelligence pipeline operational before July 4 sprint peak (~May 15).*

### Priority 6 — Full Feed Expansion
**What:** Expand RSS ingestion to full SOURCES.md inventory. All Signal, Formation, and Positioning sources. Podcast feed handling (separate pipeline — audio titles/descriptions only, not transcripts). Gallery sources.

**Notes:** Implement source deduplication. High-volume events generate redundant articles across sources — deduplicate by URL and title similarity before annotation pass.

---

### Priority 7 — Synthesis Surface
**What:** `/api/synthesis` using the Synthesis surface prompt. Sonnet model. 7-day Redis article history for trend detection. Five sections: Main Briefing, Convergence Patterns (2–4), Watch File Update, Blind Spot, Cerebro Provocation.

**Notes:** The Watch File Update section requires the system to have read the active watch items from WATCHFILE.md — consider whether this is loaded as context or hardcoded into the prompt as a stable list. Given how the watch file will grow, prefer loading dynamically.

---

### Priority 8 — Mission Brief Surface
**What:** `/api/mission` using the Mission Brief surface prompt. Sonnet model. Returns structured JSON: This Week's Signal (3 items), Watch File Status (6 items), Open Decisions (2–3), Blind Spot. Weekly cadence — cache result in KV, regenerate weekly or on demand.

---

### Priority 9 — Watch File Integration
**What:** The watch file is currently a static document. Make it dynamic: watch item status surfaced in Synthesis and Mission Brief automatically. Consider a lightweight UI for the team to log new entries and update severity ratings without editing markdown.

**Notes:** The annotation engine's `watch_item` field already flags articles that develop watch items. Wire this to a feed that shows recent articles per watch item.

---

### Priority 10 — Gallery Surface
**What:** `/api/gallery` using the Gallery surface prompt as a filter/curation instruction. Image sources from SOURCES.md gallery section. Full-screen masonry overlay with lightbox. Diversity mandate enforced at curation layer.

**Notes:** NPS Historical Collection and FSA-OWI are public domain archives — verify direct RSS or API access. Are.na channel requires API key.

---

## PHASE 3 — QUALITY, STEWARDSHIP & POST-LAUNCH
*Target: launch-ready by July 4. Post-launch stewardship infrastructure.*

### Priority 11 — Voice Calibration
**What:** Build VOICE-CALIBRATION.md. Run 10–15 real Cerebro sessions. Log results against the watch-for checklist: Does Cerebro lead with substance? Does it challenge? Are confidence tiers appearing? Is the Burgum-Gebbia Frame Check running? Is gap accounting structural or occasional? Are weakest claims named or skipped?

**Notes:** The ranger model and the four analytical discipline directives (Civic Design Test, Burgum-Gebbia Frame Check, Equity Lens, 90-Day / Stewardship Split) are new in this system. Calibrate these specifically. Tune PROMPTS.md VOICE block based on observed drift.

---

### Priority 12 — SYSTEM-BRIEF + ANTI-PATTERNS
**What:** Define the visual language for the team-facing Explore interface. Typography, color, spacing, and component tokens. The Explore interface is a team tool, not a personal intelligence OS — different register than personal Dispatch. Anti-patterns specific to the civic team context.

**Notes:** Do not copy personal Dispatch SYSTEM-BRIEF or ANTI-PATTERNS wholesale. The Explore interface serves a team, not a single operator. The visual language should communicate shared intelligence, not personal briefing. Evaluate each Dispatch anti-pattern for applicability before adopting.

---

### Priority 13 — Architecture Documentation
**What:** Build ARCHITECTURE.md. Document the tech stack, API routes, data flow, and surface inventory once the build is stable. This document is a map of what was built, not a specification for what to build — write it after the system is running, not before.

---

### Priority 14 — Post-July 4 PROMPTS Update
**What:** The Mission Brief surface prompt is calibrated for the 90-day launch sprint. After July 4, the urgency framing gives way to stewardship horizon framing. Update the Mission Brief prompt to shift from "what decisions are live this week" to "what patterns are emerging in platform performance and how should the platform evolve."

**Notes:** This update should be planned before July 4, not written in response to it. Draft the post-launch Mission Brief prompt in June.

---

### Priority 15 — Stewardship Intelligence Layer
**What:** After launch, the intelligence problem shifts. The system needs to track how the platform is actually performing — usage patterns, equity metrics, accessibility compliance in the wild, press coverage, user feedback signals. This may require new source categories and a new annotation layer dimension.

**Notes:** Consider whether "Platform Performance" becomes a sixth annotation layer post-launch, or whether it's tracked separately. This is a future architecture decision, not a current one.

---

## FUTURE EXPLORATION

**Tribal consultation intelligence:** Section 106 of the National Historic Preservation Act requires federal consultation with tribal nations on projects affecting historic properties. As explore.gov covers land that overlaps with tribal territories, specific intelligence tracking of consultation requirements, tribal objections, and co-management agreements may become necessary.

**Real-time conditions layer:** The gap between what the platform shows as open/available and what is actually accessible is a live risk (WATCH-03). A real-time or near-real-time conditions data integration — wildfire, flood, staffing-based closures — would address this directly. Out of scope for July 4 but a post-launch priority.

**Accessibility monitoring integration:** Wire an automated WCAG audit into the build pipeline so the team knows when platform changes introduce accessibility regressions before they ship. Consider Equalize Digital's tooling specifically given their prior NDS audit work.

**Multi-language support:** Public lands serve a multilingual public. Hispanic/Latino outdoor recreation communities are the fastest-growing demographic — Spanish-language support is a post-launch equity priority.

---

## ARCHIVE — COMPLETED (April 7, 2026)

### Doctrine Layer (complete)
- MANDATE.md — engagement context, three intelligence modes, five annotation layers, ranger station model
- SOURCES.md — consolidated source inventory v2, 75+ sources, three modes, gallery sources
- LIVE-ENVIRONMENT.md — political context, NDS credibility problem, Burgum-Gebbia tension, equity imperative, July 4 deadline analysis
- CEREBRO-CHARTER.md — ranger model, behavioral directives, analytical protocols, what the function will not do
- WATCHFILE.md — six active watch items with severity ratings, log format, escalation protocol
- PROMPTS.md — full prompt architecture, six context blocks, six surface prompts, TypeScript assembly pattern
- DOC-AUTHORITY.md — canonical ownership map, conflict resolution rules, known drift

### Research Layer (complete)
- NDS institutional research pass — Gebbia background, NDS founding, prior work criticism, team size and composition
- Burgum/Interior Department political context — extraction agenda, Burgum-Gebbia tension, DOGE reorganization
- NDS credibility research — accessibility audit failures, billboard design critique, technical quality documentation
- Team briefing document — NDS-Engagement-Brief.docx prepared for PM and XD lead
