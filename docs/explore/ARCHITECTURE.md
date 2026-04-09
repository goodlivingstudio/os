# EXPLORE — Architecture
Established: 2026-04-09 (stub)

*This document is canonical for how Explore is built — tech stack, API routes, data flow, navigation, AI surface specifications, and infrastructure. It describes the intended architecture ahead of the full build and will be updated as implementation reveals what actually ships.*

*Explore runs as a white-label instance of the shared OS codebase. See `../os/ARCHITECTURE.md` for the shared infrastructure (lib/config/ white-labeling, boot sequence, shared API routes). This document describes Explore-specific architectural decisions that sit on top of that shared foundation.*

*See `MANDATE.md` for what Explore is. See `SYSTEM-BRIEF.md` for the visual and interaction intent the architecture must support. See `CEREBRO-CHARTER.md` for the analytical function the architecture serves.*

---

## STATUS

**Stub.** Content to be written. Explore's code is being built out — this file exists as a structural placeholder and will fill with real content as implementation progresses.

Dispatch has a mature ARCHITECTURE at `../dispatch/ARCHITECTURE.md` — use it as the structural template.

---

## WHAT THIS DOCUMENT WILL OWN

When written, ARCHITECTURE.md will contain:

- **Shared foundation.** What Explore inherits from the shared OS codebase (Next.js 16 App Router, Anthropic Claude via `@anthropic-ai/sdk`, Vercel KV, the `lib/config/` white-label pattern, shared API routes for news / annotate / brief / chat).
- **Explore-specific instance config.** How `lib/config/explore.ts` differs from `lib/config/dispatch.ts` — source mix, skin defaults, gallery biome filters, tagline, branding. This section references the canonical config without duplicating it.
- **Surface inventory.** The specific surfaces Explore exposes (Signal feed, Gallery, Cerebro chat, Synthesis, any Explore-specific surfaces like the field desk view).
- **Data flow.** How RSS ingestion, annotation, scoring, and caching behave for Explore specifically. Where Explore diverges from the shared pipeline (e.g., gallery curation layer, diversity mandate enforcement).
- **AI surface specifications.** Which Claude model each surface uses, context windowing, output format, and how the field correspondent voice (see CEREBRO-CHARTER.md) is enforced at the prompt level.
- **Deployment.** Where Explore deploys (explore.goodliving.studio), what Vercel project, what environment variables it needs beyond the shared ones.
- **Known divergences from Dispatch.** Anywhere Explore has chosen a different architectural pattern from Dispatch's default, with the rationale for the divergence.

---

## WHY THIS DOCUMENT EXISTS

Without an Explore-specific architecture doc, any new session reading Explore's code will have to reconstruct the architectural intent from the source. That reconstruction is expensive, error-prone, and drifts over time. This doc prevents that by stating the intent ahead of — and alongside — the code.

It also serves as the counterpart to Dispatch's ARCHITECTURE.md in the canonical product doc set, which means a future product (Lilly, Atlas) can study both to understand the range of variations the shared OS codebase supports.

---

## QUESTIONS TO ANSWER BEFORE WRITING

1. What surfaces does Explore expose that Dispatch doesn't, and what surfaces does Dispatch expose that Explore doesn't?
2. How does Explore's gallery differ architecturally from Dispatch's (if Dispatch has one)? Is it a separate API route, a different caching strategy, a different model?
3. What's Explore's infrastructure story for the federal engagement context — does it need anything Dispatch doesn't (audit logging, stricter data handling, etc.)?
4. Where does Explore currently diverge from the shared OS codebase in ways that should either be pulled back into shared code or explicitly documented as intentional forks?

---

*Update this document when: a new API route is added; a shared route is forked for Explore-specific behavior; a deployment target changes; a new AI surface is added; infrastructure is upgraded; or when a reviewer reading the code disagrees with what this doc says.*
