# Good Living Studio — Document Authority Map
Established: 2026-04-09

*This document resolves ownership across the entire Good Living Studio OS — both the shared OS-level documents and the project-level doc sets they govern. When two documents describe the same concern, one is canonical and the other derives from it. If they conflict, the canonical document wins.*

---

## THE HIERARCHY

```
docs/os/                          ← Shared philosophy, operator, authority
  ├── OPERATOR.md                 ← Who the system serves
  ├── DOCTRINE.md                 ← What we believe about design
  ├── PASSAGE.md                  ← How surfaces relate to time
  └── DOC-AUTHORITY.md            ← This document

docs/dispatch/                    ← Dispatch product
docs/explore/                     ← Explore product
docs/atlas/                       ← Atlas product (on hold)
docs/lilly/                       ← Lilly product (starting Friday)
```

*Note on location: OS and its four product doc sets currently live inside a single repository. The on-disk root of that repository is historically named `dispatch/` — an artifact of the first product that lived there. Conceptually, that repository is the OS. The name-on-disk is scheduled for cleanup in a future dedicated operation.*

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

### DOC-AUTHORITY.md — *This Document*
**Owns:** The inheritance model. OS-level authority map. Cross-project conflict resolution. The relationship between OS-level and project-level documents.

**Rule:** When authority is ambiguous across the OS, this document resolves it.

---

## PROJECT-LEVEL AUTHORITY

Each project maintains its own doc authority map. Those maps are canonical for project-internal conflicts. This document is canonical for conflicts that cross project boundaries or involve OS-level documents.

### Dispatch — `docs/dispatch/DOC-AUTHORITY.md`
Project-level authority map governs: MANDATE, PROMPTS, ARCHITECTURE, SYSTEM-BRIEF, ANTI-PATTERNS, SOURCES, ROADMAP, VOICE-CALIBRATION.

### Explore — `docs/explore/DOC-AUTHORITY.md`
Project-level authority map governs: MANDATE, PROMPTS, REPLICATE-PROMPTS, CEREBRO-CHARTER, LIVE-ENVIRONMENT, SOURCES, SOURCES-MEGALIST, WATCHFILE, ROADMAP.

### Atlas — `docs/atlas/` *(on hold)*
Doc set to be established when Atlas development resumes.

### Lilly — `docs/lilly/` *(starting Friday)*
Doc set to be established this week. Working product name: Lilly Direct. Final name TBD.

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
