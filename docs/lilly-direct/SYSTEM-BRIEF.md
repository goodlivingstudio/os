# LILLY DIRECT — Design System Generative Brief (scaffold)
Established: 2026-04-10 (scaffold — content lands at kickoff)

*This document is the primary context file for any AI agent generating UI components, pages, or patterns for Lilly Direct. When written, it will describe the visual language, token architecture, material skins, component patterns, and interaction philosophy for Lilly Direct — all calibrated to the Eli Lilly engagement context and implementing the OS-level interaction philosophy defined at `../os/PASSAGE.md`.*

*Read MANDATE.md and CEREBRO-CHARTER.md before this document. The visual language must support the voice character and the engagement purpose.*

*OS-level design convictions (restraint as proof of quality, signal/synthesis duality, no sycophancy, token constraints, clarity over density, gallery discipline) live at `../os/DOCTRINE.md` and apply without exception. This document describes the product-specific EXPRESSION of those convictions.*

---

## STATUS

**Scaffold.** Content lands at kickoff. Dispatch's `SYSTEM-BRIEF.md` and Explore's `SYSTEM-BRIEF.md` are the two existing templates — Dispatch's is mature, Explore's is itself a scaffold.

The scaffold placeholder in `lib/config/lilly-direct.ts` uses a single "clinical" skin with a vermillion dot matching Dispatch's ink color. This is a deliberate placeholder — Lilly Direct's real material language needs its own argument and probably its own color system. The placeholder exists so the instance boots, not because vermillion is correct for this engagement.

---

## WHAT THIS DOCUMENT WILL OWN

When written at kickoff, SYSTEM-BRIEF.md will contain the same sections Dispatch's SYSTEM-BRIEF does, rigorously calibrated to Lilly Direct:

- **§ 1 — What Lilly Direct Is** (visual boundaries, the "not a dashboard" framing, what it refuses to look like)
- **§ 2 — Design Philosophy** including an Interaction Philosophy: Passage subsection translating `../os/PASSAGE.md` into Lilly Direct-specific commitments. The passage philosophy must hold even inside a client engagement context — the engagement does not pause when Jeremy closes the product
- **§ 3 — Core Design Principles** (the product-specific expression of OS doctrine)
- **§ 4 — Token Architecture** (color, typography, spacing, radius — probably narrower than Dispatch's multi-skin system, probably more institutional than Explore's regional skins, TBD)
- **§ 5 — Material Skins** (the argument for one vs many skins. Dispatch has one ("ink"). Explore has five (regional biomes). Lilly Direct may want one clinical-appropriate skin, or a small set of skins that reflect engagement phases (pre-kickoff / active / post-deliverable), or skins per therapeutic area. Decide at kickoff.)
- **§ 6 — Component Patterns**
- **§ 7 — Lilly Direct's Character in the Interface** (how the voice character shows up visually)
- **§ 8 — What This System Is Not** (the anti-aesthetics)
- **§ 9 — Agent Instructions** (for AI generating Lilly Direct UI)

---

## KEY QUESTIONS BEFORE WRITING

Lilly Direct's visual language has implications Dispatch and Explore don't share, because the engagement is a client-facing intelligence surface that may be shared with Lilly stakeholders at some point:

1. **Does this product ever get shown to Lilly?** If yes, the visual language needs to feel appropriate in a pharma innovation-team context. Not "corporate pharma" — Jeremy's brand matters — but legible inside that context. If no, it's Jeremy's personal engagement tool and can look however serves him best.
2. **What does "clinical without feeling clinical" mean?** The engagement is about healthcare, but Dispatch's anti-dashboard / anti-widget discipline must hold. The material language needs to feel considered without feeling corporate-pharma.
3. **How does Lilly Direct relate visually to Dispatch?** They share the same operator. Jeremy opens both. Should they feel like siblings with different accents, or like distinct instruments? The white-label architecture supports either answer.
4. **What's the restraint argument here?** Dispatch's restraint is grounded in the Wise Counselor voice — nothing that would feel out of place in a room where serious decisions are being made. Explore's restraint is grounded in civic legibility. What grounds Lilly Direct's restraint?
5. **Does Lilly Direct have a gallery surface?** The scaffold config leaves gallery sources empty because it's not yet decided. If yes, the gallery discipline from `../os/DOCTRINE.md § Visual surfaces earn their place` applies — and the gallery needs its own curatorial argument (is it visual references for pharma innovation? patient experience imagery? something else?).

---

## WHY THIS DOCUMENT EXISTS

Without a written SYSTEM-BRIEF, any AI agent asked to generate UI for Lilly Direct will default to generic patterns. The brief is the context that makes agent-generated UI feel authored rather than assembled. Dispatch's brief took multiple iterations to reach its current state. Lilly Direct has the opportunity to write the brief before substantial UI exists, which means the code can inherit from the doctrine rather than being retrofitted to it.

---

*Update this document when: a new material skin is added; a token value changes; a component pattern is promoted or retired; an interaction decision diverges from `../os/PASSAGE.md` (in which case the divergence must be named and justified); or when a real agent-generated UI run produces something that feels wrong and reveals a gap in the brief.*
