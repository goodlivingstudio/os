# EXPLORE — Design System Generative Brief
Established: 2026-04-09 (stub)

*This document is the primary context file for any AI agent generating UI components, pages, or patterns for Explore. When written, it will describe Explore's visual language, token architecture, component patterns, and interaction philosophy — all calibrated to the civic/team intelligence context Explore serves (the National Design Studio's explore.gov engagement).*

*See `MANDATE.md` for what Explore is and who it serves. See `LIVE-ENVIRONMENT.md` for the political and engagement context that shapes visual decisions. See `CEREBRO-CHARTER.md` for the ranger voice that the visual language must support. See `../os/DOCTRINE.md` for the shared design convictions and `../os/PASSAGE.md` for the interaction philosophy Explore must implement.*

---

## STATUS

**Stub.** Content to be written. This file exists so Explore's doc set matches the canonical 14-file product doc set shape defined at `../os/DOC-AUTHORITY.md`.

Dispatch has a mature SYSTEM-BRIEF at `../dispatch/SYSTEM-BRIEF.md` — use it as the structural template. Explore's version should be calibrated to Explore's specific context, not a copy of Dispatch's.

---

## WHAT THIS DOCUMENT WILL OWN

When written, SYSTEM-BRIEF.md will contain:

- **§ 1 — What Explore Is** (visual boundaries, what it is not)
- **§ 2 — Design Philosophy** (Explore's equivalent of Dispatch's Signal/Synthesis duality, probably framed around civic legibility and ranger station intelligence)
- **§ 2.1 — Interaction philosophy: Passage** (translating `../os/PASSAGE.md` into Explore-specific commitments — the gallery that was curated before you opened it, the ranger station that was already tracking the terrain)
- **§ 3 — Core Design Principles**
- **§ 4 — Token Architecture** (color, typography, spacing, radius — calibrated to Explore's federal / civic context, probably more restrained and institutional than Dispatch)
- **§ 5 — Component Patterns**
- **§ 6 — Explore's Character in the Interface** (the ranger made visible in visual terms)
- **§ 7 — What This System Is Not** (civic context anti-patterns)
- **§ 8 — Agent Instructions** (for AI generating Explore UI)

---

## KEY QUESTIONS BEFORE WRITING

Explore's visual language has implications Dispatch's doesn't, because Explore serves a team working on a federal platform with a political context:

1. **Should Explore feel institutional?** Or explicitly anti-institutional in the way government websites usually feel? The federal design context argues for a quiet, earned authority rather than either corporate polish or hacky indie.
2. **How does Explore's gallery differ from Dispatch's?** Explore's tagline is "In wildness is the preservation of the world" — the gallery is a visual formation layer, not a decorative feature.
3. **What's Explore's material frame?** Dispatch has mineral / slate / forest / ink / sumi / dispatch paper themes. Explore's current config names "Thoreau" as the branding and "forest theme default" — what are the other themes, if any?
4. **How much of Dispatch's SYSTEM-BRIEF § 2 Design Philosophy applies to Explore?** The Signal/Synthesis duality is shared via `../os/DOCTRINE.md`. What's the Explore-specific equivalent?
5. **What does "restraint" mean in a civic context?** The federal design tradition (Plain Language Act, 21st Century IDEA, NotebookLM-era federal sites) has its own discipline. Explore's restraint should be legible inside that tradition.

---

## WHY THIS DOCUMENT EXISTS

Explore's code is being built. Before UI work starts in earnest, the design intent should be written down so agents generating UI have a canonical context file. Dispatch's SYSTEM-BRIEF.md was written after a few iterations of the product existed, which is backwards — it should exist ahead of the code so the code inherits from it. Explore has the chance to do it in the right order.

---

*Update this document when: a new theme is added; a token value changes; a component pattern is promoted or retired; an interaction decision diverges from `../os/PASSAGE.md` (in which case the divergence must be named and justified).*
