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

**Dispatch operator section needs slimming.** Currently restates full operator context. Should be replaced with a reference to `docs/os/OPERATOR.md` plus Dispatch-specific context only.

**Explore operator section needs slimming.** Same pattern — reference OS-level, keep engagement-specific context.

**Atlas doc set does not exist.** On hold. Placeholder directory reserved at `docs/atlas/`.

**Lilly doc set does not exist.** Starting Friday 2026-04-10. Placeholder directory reserved at `docs/lilly/`. Working product name: Lilly Direct. Final name TBD.

**Passage is new and unsettled.** No project-level SYSTEM-BRIEF has implemented it yet. The first implementation will test whether the philosophy holds in practice.

**Repository root is historically named `dispatch/`.** This is the OS repository. The rename-to-`os` operation is planned as a separate, dedicated session.

---

*Update this document when: a new project is added to the OS; a new OS-level document is created; an authority conflict is discovered across projects; or when the inheritance model needs revision based on real usage.*
