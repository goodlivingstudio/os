# Document Authority
Established: 2026-04-09

*This document resolves ownership across the OS — both the shared OS-level documents and the product-level doc sets they govern. When two documents describe the same concern, one is canonical and the other derives from it. If they conflict, the canonical document wins.*

---

## THE HIERARCHY

```
docs/os/                          ← The atmosphere: philosophy, operator, vocabulary, discipline
  ├── OPERATOR.md                 ← Who the system serves
  ├── DOCTRINE.md                 ← What we believe about design
  ├── PASSAGE.md                  ← How surfaces relate to time
  ├── VOICE.md                    ← Universal analytical voice disciplines + the Wise Counselor
  ├── PIPELINE.md                 ← The shared Ingest→Annotate→Score→Brief→Synthesize→Act pattern
  ├── ARCHITECTURE.md             ← The shared codebase — white-labeling, boot sequence, infra
  ├── GLOSSARY.md                 ← Canonical shared vocabulary
  └── DOC-AUTHORITY.md            ← This document

docs/dispatch/                    ← Dispatch product (in production)
docs/explore/                     ← Explore product (WIP)
docs/atlas/                       ← Atlas product (on hold)
docs/lilly-direct/                ← Lilly Direct product
```

---

## THE CANONICAL PRODUCT DOC SET

Every product maintains the same 14-file doc set shape, rigorously bespoke to the product. No product should have a file another product lacks (unless the file genuinely doesn't apply — and that exception must be justified here, not assumed). No product should invent files that don't belong to the canonical shape without first proposing the addition here and getting it promoted to canonical.

**The 14 files** (filenames are the same in every product directory; refer to them by bare name when speaking generically):

*Tier 1 — Strategic (define intent, exist from day one):*

| # | Doc | Owns |
|---|---|---|
| 1 | **MANDATE** | What this product is, why it exists, who it serves, its intelligence model |
| 2 | **CEREBRO-CHARTER** | Behavioral contract for the analytical function — the product's voice character |
| 3 | **SYSTEM-BRIEF** | Visual language, design tokens, themes, interaction patterns (implements `../os/PASSAGE.md`) |
| 4 | **ARCHITECTURE** | Tech stack, routes, data flow, infrastructure (sits on top of `../os/ARCHITECTURE.md`) |
| 5 | **PROMPTS** | Copyable prompt text for `lib/prompts.ts` |
| 6 | **ANTI-PATTERNS** | Product-specific prohibitions (visual, behavioral, voice) |
| 7 | **DOC-AUTHORITY** | Project-level authority map |

*Tier 2 — Operational (develop over time, track state):*

| # | Doc | Owns |
|---|---|---|
| 8 | **SOURCES** | Canonical feed inventory, mode assignments, rationale |
| 9 | **SOURCES-MEGALIST** | Discovery/expansion layer for source growth |
| 10 | **LIVE-ENVIRONMENT** | The changing context this product operates inside |
| 11 | **WATCHFILE** | Active watch items being tracked, with severity and escalation |
| 12 | **ROADMAP** | Active work, priorities, completed archive |
| 13 | **VOICE-CALIBRATION** | Ongoing voice observation log, drift detection |
| 14 | **REPLICATE-PROMPTS** | Image generation prompts for gallery/visual surfaces |

**Rule for new products:** every new product must establish all 14 files from day one. Stubs are acceptable; missing files are not. The shape is what makes products comparable, transferable, and durable across sessions.

**Rule for drift:** if a product has been shipped without a Tier 1 file, it is considered in drift. Drift is tracked in § OPEN ITEMS below and resolved at the next opportunity.

**Rule for additions:** a new file type may be proposed by any product. If it becomes canonical (should exist in every product), add it here and update every product doc set. If it stays product-specific, it doesn't belong in this list.

---

## THE INHERITANCE RULE

OS-level documents are canonical for shared concerns. Product-level documents inherit from them and are canonical for product-specific decisions.

**What this means in practice:** when a product MANDATE describes the operator, it should reference `../os/OPERATOR.md` rather than restate operator context in full. When a product SYSTEM-BRIEF makes interaction design decisions, those decisions should be consistent with `../os/PASSAGE.md` — and if they diverge, the divergence should be named and justified.

**What this does not mean:** OS-level documents do not dictate product-level implementation. `../os/DOCTRINE.md` says restraint is the proof of quality. A product's SYSTEM-BRIEF decides what restraint looks like in its specific visual language. The principle cascades. The implementation does not.

---

## OS-LEVEL AUTHORITY MAP

### OPERATOR — *Who this serves*
**Owns:** Jeremy Grant's identity, Good Living Studio as the operator's practice, the five-year target (Head of Design or CDO at a consequential institution), the professional evolution thesis (vanguard fluency across design, product, and strategy), the operating thesis (AI capability + institutional complexity + human experience), and strategic domains (healthcare/pharma, design leadership at consequence, AI-native product contexts).

**Rule:** Canonical for all operator context across all products. Product-level mandates reference this document for operator identity. When operator context changes, update here first, then propagate.

**Derivation chain:** `../os/OPERATOR.md` → product MANDATE (operator sections) → product PROMPTS (operator blocks) → `lib/prompts.ts`

---

### DOCTRINE — *What we believe*
**Owns:** Shared design convictions. Restraint as proof of quality. Craft as non-negotiable. Source and synthesis staying visible. Visual surfaces earning their place. Analytical voice in service of the mandate. Design systems as governance. Clarity over density. What connects the products. Operator sovereignty.

**Rule:** Canonical for design philosophy across all products. Product-level SYSTEM-BRIEF and ANTI-PATTERNS files implement these convictions in product-specific form. If a product-level design decision contradicts DOCTRINE, the contradiction should be named and justified — DOCTRINE wins by default.

---

### PASSAGE — *How surfaces relate to time*
**Owns:** The interaction philosophy. The vending machine critique. The three refusals (no termination language, no dead surfaces, natural weight). The experience of return, movement between surfaces, and what it feels like when the philosophy is working.

**Rule:** Canonical for interaction philosophy across all products. Product-level SYSTEM-BRIEF files translate Passage into specific interaction patterns, transitions, microcopy, and component behavior. PASSAGE wins on intent. Product SYSTEM-BRIEF wins on execution.

---

### VOICE — *The universal analytical disciplines*
**Owns:** The ten analytical voice disciplines every product's analytical function must carry (lead with substance, no sycophancy, confidence tiers, gap accounting, amplification check, weakest claim, flag noise, name absence, editorial discipline, say less mean more). The Wise Counselor framework (assurance, drive, clarity, flow, psychological boundaries, register flexibility). Communication standards. The divergence protocol for when a product needs to skip a discipline. Failure examples.

**Rule:** Canonical for the disciplines and the Wise Counselor posture; does NOT own voice character. Product-level CEREBRO-CHARTER files define character. Character is product-specific; discipline and the Wise Counselor are OS-wide. If a product wants to skip a discipline, the divergence must be named and justified per the protocol in `../os/VOICE.md`.

**Derivation chain:** `../os/VOICE.md` → product CEREBRO-CHARTER → product PROMPTS VOICE block → `lib/prompts.ts`

---

### PIPELINE — *The shared intelligence pipeline*
**Owns:** The six-stage pipeline pattern (Ingest → Annotate → Score → Brief → Synthesize → Act) that every product implements. What each stage means, how products vary their implementations, how the pipeline relates to Passage, and the cascading failure model.

**Rule:** Canonical for the pattern. Product-level ARCHITECTURE files describe how each product implements the stages specifically and at what cadence. PIPELINE wins on pattern; product ARCHITECTURE wins on implementation detail.

---

### ARCHITECTURE — *The shared codebase*
**Owns:** The shared infrastructure every product inherits: the engine (stack, white-label pattern, boot sequence), the pipeline-to-infrastructure mapping, the global vs local hardcoding rules, promotion guidance, the spinup checklist, deployment topology, and the feature flag pattern. The citadel of governance.

**Rule:** Canonical for the shared layer. Each product's own ARCHITECTURE describes product-specific architectural decisions on top of this foundation. When a pattern is promoted from one product into the shared layer, this document is updated.

**Derivation chain:** `../os/ARCHITECTURE.md` → product ARCHITECTURE → product-specific routes and config

---

### GLOSSARY — *The shared vocabulary*
**Owns:** Canonical definitions for terms that appear across multiple product doc sets. Operator terms, pipeline terms, voice and character terms (including the Wise Counselor), philosophy terms, doctrine terms, architecture terms.

**Rule:** When a term appears in multiple product docs, it is defined here. Product docs inherit the meaning rather than redefining. When two docs disagree about a term's meaning, GLOSSARY resolves the conflict.

---

### DOC-AUTHORITY — *This document*
**Owns:** The inheritance model. OS-level authority map. Cross-project conflict resolution. The relationship between OS-level and project-level documents.

**Rule:** When authority is ambiguous across the OS, this document resolves it.

---

## PROJECT-LEVEL AUTHORITY

Each project maintains its own doc authority map. Those maps are canonical for project-internal conflicts. This document is canonical for conflicts that cross project boundaries or involve OS-level documents.

### Dispatch — [`../dispatch/DOC-AUTHORITY.md`](../dispatch/DOC-AUTHORITY.md)
Project-level authority map governs all 14 canonical files. Status: complete (all 14 files exist; some operational tier files are stubs filling over time).

### Explore — [`../explore/DOC-AUTHORITY.md`](../explore/DOC-AUTHORITY.md)
Project-level authority map governs all 14 canonical files. Status: complete (all 14 files exist; strategic tier stubs for SYSTEM-BRIEF, ARCHITECTURE, ANTI-PATTERNS, VOICE-CALIBRATION fill as the code is built).

### Atlas — [`../atlas/`](../atlas/) *(on hold)*
Doc set to be established when Atlas development resumes. Must follow the 14-file canonical shape from day one.

### Lilly Direct — [`../lilly-direct/DOC-AUTHORITY.md`](../lilly-direct/DOC-AUTHORITY.md)
Project-level authority map governs all 14 canonical files. Status: scaffolded. All 14 files exist as structural stubs. Content lands during the engagement.

---

## CROSS-PROJECT CONFLICT RESOLUTION

If a project MANDATE and `../os/OPERATOR.md` say different things about the operator → OPERATOR wins.

If a project SYSTEM-BRIEF and `../os/DOCTRINE.md` conflict on a design conviction → DOCTRINE wins on principle; project SYSTEM-BRIEF wins on implementation detail.

If a project SYSTEM-BRIEF and `../os/PASSAGE.md` conflict on interaction philosophy → PASSAGE wins on intent; project SYSTEM-BRIEF wins on execution. Name the divergence.

If a project's analytical function diverges from `../os/VOICE.md` disciplines → the divergence protocol in VOICE applies. The product's CEREBRO-CHARTER names and justifies the divergence.

If two project-level documents claim the same territory → the project's own DOC-AUTHORITY resolves it.

If a concern spans two projects → OS-level documents govern the shared interface. Project-level documents govern their respective sides.

---

## DOCUMENT RELATIONSHIPS

```
OPERATOR ─────────────────────────────────────────────────────┐
  │                                                            │
  └──► product MANDATE (operator sections)                    │
         │                                                     │
         └──► product PROMPTS (operator blocks)               │
                │                                              │
                └──► lib/prompts.ts                           │
                                                               │
DOCTRINE ─────────────────────────────────────────────────────►│
  │                                                            │
  ├──► product SYSTEM-BRIEF (design implementation)           │
  └──► product ANTI-PATTERNS (prohibitions)                   │
                                                               │
PASSAGE ──────────────────────────────────────────────────────►│
  │                                                            │
  └──► product SYSTEM-BRIEF (interaction implementation)      │
                                                               │
VOICE ────────────────────────────────────────────────────────►│
  │                                                            │
  └──► product CEREBRO-CHARTER (character + disciplines)      │
         │                                                     │
         └──► product PROMPTS (voice blocks)                  │
                │                                              │
                └──► lib/prompts.ts                           │
                                                               │
PIPELINE ─────────────────────────────────────────────────────►│
  │                                                            │
  └──► product ARCHITECTURE (stage implementation)            │
                                                               │
ARCHITECTURE ─────────────────────────────────────────────────►│
  │                                                            │
  └──► product ARCHITECTURE (product-specific decisions)      │
                                                               │
GLOSSARY ─────────────────────────────────────────────────────►│
  │                                                            │
  └──► (conflict resolution across all product docs)          │
                                                               │
DOC-AUTHORITY (this file) ────────────────────────────────────►│
  │                                                            │
  └──► product DOC-AUTHORITY (project-level resolution)       │
                                                               ▼
                                                        All product docs
```

---

## OPEN ITEMS

Active items requiring resolution. This section tracks only unresolved state — not history. When an item is resolved, remove it.

- **Explore operator section needs slimming.** Should reference OS-level operator context and keep engagement-specific context only. Pick up when Explore's doc set is next revised.
- **Atlas doc set does not exist.** On hold. Placeholder directory reserved at `docs/atlas/`. Must establish all 14 files when development resumes.
- **Design system documentation gap.** No single living reference for shared UI components, tokens, and patterns outside the code. Separate workstream. See `ARCHITECTURE.md` § KNOWN DRIFT AND OPPORTUNITIES.

---

*Update this document when: a new product is added to the OS; a new OS-level document is created; an authority conflict is discovered across projects; an OS-level file's scope changes materially; the inheritance model needs revision based on real usage; or an open item is resolved or discovered.*
