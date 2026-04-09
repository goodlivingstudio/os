# Good Living Studio — Document Authority Map
Established: 2026-04-09

*This document resolves ownership across the entire Good Living Studio OS — both the shared OS-level documents and the project-level doc sets they govern. When two documents describe the same concern, one is canonical and the other derives from it. If they conflict, the canonical document wins.*

---

## THE HIERARCHY

```
docs/os/                          ← Shared atmosphere: philosophy, operator, vocabulary, discipline
  ├── OPERATOR.md                 ← Who the system serves
  ├── DOCTRINE.md                 ← What we believe about design
  ├── PASSAGE.md                  ← How surfaces relate to time
  ├── VOICE.md                    ← Universal analytical voice disciplines
  ├── PIPELINE.md                 ← The shared Ingest→Annotate→Score→Brief→Synthesize→Act pattern
  ├── ARCHITECTURE.md             ← The shared codebase — white-labeling, boot sequence, infra
  ├── GLOSSARY.md                 ← Canonical shared vocabulary
  └── DOC-AUTHORITY.md            ← This document

docs/dispatch/                    ← Dispatch product (in production)
docs/explore/                     ← Explore product (WIP, doctrine complete)
docs/atlas/                       ← Atlas product (on hold)
docs/lilly/                       ← Lilly product (starts 2026-04-10, working name Lilly Direct)
```

*Note on location: OS and its four product doc sets currently live inside a single repository. The on-disk root of that repository is historically named `dispatch/` — an artifact of the first product that lived there. Conceptually, that repository is the OS. The name-on-disk is scheduled for cleanup in a future dedicated operation.*

---

## THE CANONICAL PRODUCT DOC SET

Every product under OS maintains the same 14-file doc set shape, rigorously bespoke to the product. No product should have a file another product lacks (unless the file genuinely doesn't apply — and that exception must be justified here, not assumed). No product should invent files that don't belong to the canonical shape without first proposing the addition here and getting it promoted to canonical.

**The 14 files:**

*Tier 1 — Strategic (define intent, exist from day one):*

| # | File | Owns |
|---|---|---|
| 1 | `MANDATE.md` | What this product is, why it exists, who it serves, its intelligence model |
| 2 | `CEREBRO-CHARTER.md` | Behavioral contract for the analytical function — the product's voice character (Station Chief / Field Correspondent / TBD) |
| 3 | `SYSTEM-BRIEF.md` | Visual language, design tokens, material skins, interaction patterns (implements `../os/PASSAGE.md`) |
| 4 | `ARCHITECTURE.md` | Tech stack, routes, data flow, infrastructure, surface inventory (sits on top of `../os/ARCHITECTURE.md`) |
| 5 | `PROMPTS.md` | Copyable prompt text for `lib/prompts.ts` |
| 6 | `ANTI-PATTERNS.md` | Product-specific prohibitions (visual, behavioral, voice) |
| 7 | `DOC-AUTHORITY.md` | Project-level authority map |

*Tier 2 — Operational (develop over time, track state):*

| # | File | Owns |
|---|---|---|
| 8 | `SOURCES.md` | Canonical feed inventory, mode assignments, rationale |
| 9 | `SOURCES-MEGALIST.md` | Discovery/expansion layer for source growth |
| 10 | `LIVE-ENVIRONMENT.md` | The changing context this product operates inside (political, market, cultural, engagement) |
| 11 | `WATCHFILE.md` | Active watch items being tracked, with severity and escalation |
| 12 | `ROADMAP.md` | Active work, priorities, completed archive |
| 13 | `VOICE-CALIBRATION.md` | Ongoing voice observation log, drift detection |
| 14 | `REPLICATE-PROMPTS.md` | Image generation prompts for gallery/visual surfaces |

**Rule for new products:** Lilly Direct (starting 2026-04-10) and Atlas (when it resumes) must establish all 14 files from day one. Stubs are acceptable; missing files are not. The shape is what makes the four products comparable, transferable, and durable across sessions.

**Rule for drift:** If a product has been shipped without a Tier 1 file, it is considered in drift. Drift is tracked in § KNOWN STATE below and resolved at the next opportunity.

**Rule for additions:** A new file type may be proposed by any product. If it becomes canonical (should exist in every product), add it here and update every product doc set to include it. If it stays product-specific, it doesn't belong in this list.

---

## THE INHERITANCE RULE

OS-level documents are canonical for shared concerns. Project-level documents inherit from them and are canonical for project-specific decisions.

**What this means in practice:** When a project-level MANDATE.md describes the operator, it should reference `docs/os/OPERATOR.md` rather than restate the operator context in full. When a project-level SYSTEM-BRIEF.md makes interaction design decisions, those decisions should be consistent with `PASSAGE.md` — and if they diverge, the divergence should be named and justified.

**What this does not mean:** OS-level documents do not dictate project-level implementation. `DOCTRINE.md` says "restraint is the proof of quality." Dispatch's `SYSTEM-BRIEF.md` decides what restraint looks like in Mineral skin at 13px Geist. Explore's `SYSTEM-BRIEF.md` makes its own decisions. The principle cascades. The implementation does not.

---

## OS-LEVEL AUTHORITY MAP

### OPERATOR.md — *Who This Serves*
**Owns:** Jeremy Grant's identity, five-year target, professional evolution thesis, operating thesis, active engagements (Lilly context, Code and Theory context).

**Rule:** Canonical for all operator context across all projects. Project-level mandates reference this document for operator identity. When operator context changes, update here first, then propagate to project-level mandates and prompts.

**Derivation chain:** OPERATOR.md → project MANDATE.md operator sections → project PROMPTS.md operator blocks → `lib/prompts.ts`

---

### DOCTRINE.md — *What We Believe*
**Owns:** Shared design convictions. Restraint as proof of quality. Signal/synthesis duality. The machine has opinions. No sycophancy. Token constraints. Clarity over density. What connects the projects. Operator sovereignty.

**Rule:** Canonical for design philosophy that holds across all projects. Project-level SYSTEM-BRIEF.md and ANTI-PATTERNS.md implement these convictions in project-specific form. If a project-level design decision contradicts DOCTRINE, the contradiction should be named and justified — DOCTRINE wins by default.

---

### PASSAGE.md — *How Surfaces Relate to Time*
**Owns:** The interaction philosophy. The vending machine critique. The three refusals (no termination language, no dead surfaces, no hierarchy of realness). The honest edges (rest, completion, the dark twin). What Passage means for each product.

**Rule:** Canonical for interaction philosophy across all projects. Project-level SYSTEM-BRIEF.md files translate Passage into specific interaction patterns, transitions, microcopy, and component behavior. PASSAGE.md wins on intent. Project SYSTEM-BRIEF.md wins on execution.

---

### VOICE.md — *The Universal Analytical Disciplines*
**Owns:** The analytical voice disciplines every OS product's analytical function must carry. Gap accounting. Confidence tiers. Amplification check. Weakest claim. No sycophancy. Lead with substance. Flag noise explicitly. Name absence.

**Rule:** Canonical for the disciplines; does NOT own voice character. Product-level CEREBRO-CHARTER.md files define character (Station Chief, Field Correspondent, TBD for Atlas and Lilly). Character is product-specific; discipline is OS-wide. If a product wants to skip a discipline, the divergence must be named and justified in that product's CEREBRO-CHARTER.

**Derivation chain:** VOICE.md → product CEREBRO-CHARTER.md → product PROMPTS.md VOICE block → `lib/prompts.ts`

---

### PIPELINE.md — *The Shared Intelligence Pipeline*
**Owns:** The six-stage pipeline pattern (Ingest → Annotate → Score → Brief → Synthesize → Act) that every OS product implements. What each stage means, where it lives in the shared codebase, how products vary their implementations, and how the pipeline relates to Passage.

**Rule:** Canonical for the pattern. Product-level ARCHITECTURE.md files describe how each product implements the stages specifically. PIPELINE wins on pattern; product ARCHITECTURE wins on implementation detail.

---

### ARCHITECTURE.md — *The Shared Codebase*
**Owns:** The shared infrastructure every product inherits when it runs as an instance: Next.js stack, white-label pattern (`lib/config/`), shared API routes, shared components, boot sequence, deployment topology, how a new product instance is added. The historical naming artifact (`dispatch/` on disk, OS conceptually) is documented here.

**Rule:** Canonical for the shared layer. Each product's own ARCHITECTURE.md describes product-specific architectural decisions sitting on top of this shared foundation. When a pattern is promoted from one product into the shared layer, this document is updated.

---

### GLOSSARY.md — *The Shared Vocabulary*
**Owns:** Canonical definitions for terms that appear across multiple product doc sets. Operator terms, pipeline terms, voice and character terms, philosophy terms, doctrine terms, architecture terms, lineage terms.

**Rule:** When a term appears in multiple product docs, it is defined here. Product docs inherit the meaning from here rather than redefining. When two docs disagree about a term's meaning, GLOSSARY resolves the conflict.

---

### DOC-AUTHORITY.md — *This Document*
**Owns:** The inheritance model. OS-level authority map. Cross-project conflict resolution. The relationship between OS-level and project-level documents.

**Rule:** When authority is ambiguous across the OS, this document resolves it.

---

## PROJECT-LEVEL AUTHORITY

Each project maintains its own doc authority map. Those maps are canonical for project-internal conflicts. This document is canonical for conflicts that cross project boundaries or involve OS-level documents.

### Dispatch — `docs/dispatch/DOC-AUTHORITY.md`
Project-level authority map governs all 14 canonical files for Dispatch. Status: complete (all 14 files exist; operational tier files are currently stubs for LIVE-ENVIRONMENT, WATCHFILE, SOURCES-MEGALIST, REPLICATE-PROMPTS and will fill with content over time).

### Explore — `docs/explore/DOC-AUTHORITY.md`
Project-level authority map governs all 14 canonical files for Explore. Status: complete (all 14 files exist; strategic tier files are currently stubs for SYSTEM-BRIEF, ARCHITECTURE, ANTI-PATTERNS, VOICE-CALIBRATION and will fill with content as Explore's code is built).

### Atlas — `docs/atlas/` *(on hold)*
Doc set to be established when Atlas development resumes. Must follow the 14-file canonical shape from day one.

### Lilly — `docs/lilly/` *(starts 2026-04-10)*
Doc set to be established this week. Working product name: Lilly Direct. Final name TBD. Must follow the 14-file canonical shape from day one.

---

## CROSS-PROJECT CONFLICT RESOLUTION

If a project MANDATE and OPERATOR.md say different things about the operator → OPERATOR.md wins.

If a project SYSTEM-BRIEF and DOCTRINE.md conflict on a design conviction → DOCTRINE.md wins on principle; project SYSTEM-BRIEF wins on implementation detail.

If a project SYSTEM-BRIEF and PASSAGE.md conflict on interaction philosophy → PASSAGE.md wins on intent; project SYSTEM-BRIEF wins on execution. Name the divergence.

If two project-level documents claim the same territory → the project's own DOC-AUTHORITY.md resolves it.

If a concern spans two projects (e.g., how Dispatch hands off to Atlas) → OS-level documents govern the shared interface. Project-level documents govern their respective sides.

---

## DOCUMENT RELATIONSHIPS

```
OPERATOR.md ──────────────────────────────────────────────────┐
  │                                                            │
  └──► project MANDATE.md (operator sections)                 │
         │                                                     │
         └──► project PROMPTS.md (operator blocks)            │
                │                                              │
                └──► lib/prompts.ts                           │
                                                               │
DOCTRINE.md ──────────────────────────────────────────────────►│
  │                                                            │
  ├──► project SYSTEM-BRIEF.md (design implementation)        │
  └──► project ANTI-PATTERNS.md (prohibitions)                │
                                                               │
PASSAGE.md ───────────────────────────────────────────────────►│
  │                                                            │
  └──► project SYSTEM-BRIEF.md (interaction implementation)   │
                                                               │
DOC-AUTHORITY.md (this file) ─────────────────────────────────►│
  │                                                            │
  └──► project DOC-AUTHORITY.md (project-level resolution)    │
                                                               ▼
                                                        All project docs
```

---

## KNOWN STATE (as of 2026-04-09)

**Dispatch operator section slimmed.** `docs/dispatch/MANDATE.md` now references `docs/os/OPERATOR.md` for canonical operator context and keeps only Dispatch-specific framing (the personal intelligence focus, the five annotation layers calibrated to this operator, the Lilly engagement as Dispatch's primary intel target). Completed in the os-doc-reorg pass.

**Dispatch SYSTEM-BRIEF implements Passage.** `docs/dispatch/SYSTEM-BRIEF.md` added a new § "Interaction philosophy: Passage" inside § 2 Design Philosophy, translating the OS-level philosophy into specific Dispatch commitments (no termination language, DCOS briefs rather than greets, persistent Cerebro, always-populated signal view). Completed in the os-doc-reorg pass. This is the first project-level implementation of Passage and will inform whether the philosophy holds in practice.

**Dispatch PROMPTS.md and ARCHITECTURE.md retain derived operator summaries.** This is intentional. `docs/dispatch/PROMPTS.md`'s `OPERATOR` and `LILLY_CONTEXT` blocks are copyable TypeScript constants for `lib/prompts.ts` — they must stay in place for runtime. `docs/dispatch/ARCHITECTURE.md`'s operator and Lilly summaries are retained as reference convenience. The authority headers in both files were updated post-reorg to reflect that operator-specific summaries now derive from `docs/os/OPERATOR.md`, not from MANDATE.md.

**Explore operator section needs slimming.** Same pattern as Dispatch — should reference OS-level operator context and keep engagement-specific context only. Still pending; will be picked up when Explore's doc set is next revised.

**Atlas doc set does not exist.** On hold. Placeholder directory reserved at `docs/atlas/`.

**Lilly doc set does not exist.** Starting Friday 2026-04-10. Placeholder directory reserved at `docs/lilly/`. Working product name: Lilly Direct. Final name TBD.

**Passage is young and still settling.** Dispatch's SYSTEM-BRIEF.md is the first implementation. Revisit the philosophy after Dispatch has run under it for a few weeks; add honest edges to `docs/os/PASSAGE.md` if any emerge.

**Repository root is historically named `dispatch/`.** This is the OS repository. The rename-to-`os` operation is planned as a separate, dedicated session.

---

*Update this document when: a new project is added to the OS; a new OS-level document is created; an authority conflict is discovered across projects; or when the inheritance model needs revision based on real usage.*
