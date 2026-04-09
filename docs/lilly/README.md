# Lilly

**Role:** Engagement intelligence surface for the Eli Lilly relationship. A white-labeled intelligence surface demonstrating design + AI + strategy capability — the bridge between agency credibility and product-organization authority.

**Status:** Starting 2026-04-10 (Friday).

**Working product name:** Lilly Direct. Final name TBD. Chosen to echo an existing Lilly initiative ("LillyDirect" — direct-to-patient pharmacy platform) that the engagement may build on top of.

**Engagement context:** See `../os/OPERATOR.md` § Active Engagements for the full Lilly intelligence context — 51M patients, GLP-1 momentum, Diogo Rau's AI mandate, the donanemab care coordination challenge, the strategic argument that Lilly's science has outpaced the experience of receiving it.

**Architecture:** Lilly will run as a new white-label instance of the shared OS codebase (`lib/config/lilly-direct.ts` or similar, TBD) alongside `dispatch.ts` and `explore.ts`. The doc set will live here at `docs/lilly/` alongside the Dispatch and Explore doc sets.

**Doc set to be established this week:**
- MANDATE.md — purpose, intelligence model, behavioral charter
- SYSTEM-BRIEF.md — visual language, tokens, interaction patterns (should implement `../os/PASSAGE.md`)
- PROMPTS.md — system prompts for the Lilly-specific intelligence layer
- ARCHITECTURE.md — infrastructure, deployment, data flow
- ROADMAP.md — near-term execution plan
- SOURCES.md — feed sources calibrated to the Lilly engagement
- DOC-AUTHORITY.md — project-level authority map

**Note on the legacy `lilly/` repo:** There is an existing repository at `~/claude-projects/lilly/` that was the operator's first Claude Code project. It is NOT the Lilly Direct product. That repo is kept for archival reasons only and has no relationship to this doc set or to the engagement starting Friday.
