# DISPATCH — Document Authority Map
Established: 2026-04-06

*This document resolves ownership across the Dispatch doc set. When two documents describe the same concern, one is canonical and the other derives from it. If they conflict, the canonical document wins.*

---

## OS-LEVEL INHERITANCE

Dispatch is one of four sibling products living under OS — the ambient intelligence layer that holds the Good Living Studio philosophy, operator context, and shared authority. Dispatch inherits from eight OS-level documents at `../os/` (linked below):

- **[OPERATOR](../os/OPERATOR.md)** — Canonical for operator identity (Jeremy Grant), five-year target, professional evolution thesis, operating thesis, and priority intelligence targets (Eli Lilly is one of them). Dispatch's `MANDATE.md` references it rather than restating the full operator profile.
- **[DOCTRINE](../os/DOCTRINE.md)** — Canonical for shared design convictions (restraint as proof of quality, craft is non-negotiable, source and synthesis stay visible, visual surfaces earn their place, analytical voice in service of the mandate, design systems are governance, clarity over density). Dispatch's `SYSTEM-BRIEF.md` and `ANTI-PATTERNS.md` implement these convictions in Dispatch-specific form.
- **[PASSAGE](../os/PASSAGE.md)** — Canonical for interaction philosophy (every surface is a place you rejoin; no termination language; no dead surfaces; no hierarchy of realness). Dispatch's `SYSTEM-BRIEF.md` § *Interaction philosophy: Passage* translates the philosophy into specific Dispatch interaction patterns.
- **[VOICE](../os/VOICE.md)** — Canonical for universal analytical voice disciplines (gap accounting, confidence tiers, amplification check, weakest claim, lead with substance, no sycophancy, flag noise, name absence, editorial independence, tight paragraphs, density) plus the Wise Counselor posture. Dispatch's `CEREBRO-CHARTER.md` expresses these disciplines through the Station Chief character.
- **[PIPELINE](../os/PIPELINE.md)** — Canonical for the six-stage intelligence pipeline (Ingest → Annotate → Score → Brief → Synthesize → Act). Dispatch's `ARCHITECTURE.md` describes how Dispatch implements each stage and its weekly cadence for Stage 6.
- **[ARCHITECTURE](../os/ARCHITECTURE.md)** (OS-level) — Canonical for the shared codebase, white-label pattern, and the new-product spinup checklist. Dispatch's `ARCHITECTURE.md` describes product-specific decisions sitting on top of this shared foundation.
- **[GLOSSARY](../os/GLOSSARY.md)** — Canonical for shared vocabulary. Dispatch uses the same terms (operator, annotation layer, station chief, theme, Passage, etc.) with the same meanings.
- **[DOC-AUTHORITY](../os/DOC-AUTHORITY.md)** (OS-level) — Resolves authority conflicts that cross product boundaries or involve OS-level documents.

**Rule:** When Dispatch docs conflict with OS-level docs, the OS-level document wins on principle and intent. Dispatch docs win on project-specific implementation. See `../os/DOC-AUTHORITY.md` for the full inheritance model.

---

## THE RULE

Every piece of system knowledge has exactly one canonical home. Other documents may reference or summarize that knowledge, but they must explicitly mark it as derived: *"See [CANONICAL DOC] for the authoritative version."*

When updating derived content, update the canonical source first, then propagate. Never update a derived reference without checking the source.

---

## AUTHORITY MAP

### MANDATE.md — *The Why*
**Owns:** The station chief model. Three intelligence modes (Intelligence / Formation / Positioning). Five annotation layers. Synthesis purpose. Generative brief cluster purpose. Dispatch-specific operator context (what Dispatch needs to know beyond the shared operator profile).

**Derives from:** `../os/OPERATOR.md` for operator identity, five-year target, professional evolution thesis, operating thesis, and priority intelligence targets (Eli Lilly is one of them). Dispatch-specific operator context — including the operator's current employer, the active Lilly engagement framing, and Dispatch-specific intelligence priorities — lives in this MANDATE.md, not in the upstream OS file.

**Rule:** If you need to know *what Dispatch is and why it exists*, MANDATE is the answer. For *who the operator is*, see `../os/OPERATOR.md`. For *how the analytical function reasons and what disciplines it carries*, see `CEREBRO-CHARTER.md`. Everything in PROMPTS.md's context blocks derives from MANDATE (for Dispatch-specific content), from CEREBRO-CHARTER (for voice and discipline), and from `../os/OPERATOR.md` (for shared operator context).

### CEREBRO-CHARTER.md — *The Voice*
**Owns:** Behavioral contract for Cerebro, Dispatch's analytical function. The Station Chief model. The behavioral directive (station chief vs counselor, synthesis first, challenge weak reasoning, no preamble, no bullet points, push forward, flag noise). The analytical discipline (gap accounting, confidence tiers, amplification check, weakest claim). What Cerebro knows.

**Derives from:** `../os/VOICE.md` for the universal analytical voice disciplines shared across all OS products. The station chief character is Dispatch-specific; the underlying disciplines are OS-wide.

**Rule:** If you need to know *how Cerebro reasons and what disciplines it carries in every response*, CEREBRO-CHARTER is the answer. Cross-reference with `../explore/CEREBRO-CHARTER.md` — the two are structural siblings (Station Chief vs Field Correspondent) under the same OS-level voice discipline. The VOICE block in PROMPTS.md is derived from this document.

### PROMPTS.md — *The Words*
**Owns:** All copyable prompt text for `lib/prompts.ts`. Context blocks (OPERATOR, LILLY_CONTEXT, FIVE_LAYERS, SOURCE_MODES, VOICE). Surface prompts (DCOS, Cerebro, Annotation, Synthesis, Dispatch). Prompt assembly pattern. Prompt maintenance schedule.

**Rule:** PROMPTS.md is the *implementation* of MANDATE. Content in the OPERATOR block, LILLY_CONTEXT block, and FIVE_LAYERS block is derived from MANDATE. The VOICE block and surface prompts are canonical here — they exist nowhere else in copyable form. Change MANDATE first, then propagate to PROMPTS.

**Derivation chain:** MANDATE → PROMPTS.md context blocks → `lib/prompts.ts`

### ARCHITECTURE.md — *The How*
**Owns:** Tech stack and infrastructure. API routes and models. Data flow (ISR, annotation pipeline, Redis persistence). Navigation structure. Design system summary (typography, color, cards — summary only). AI surface specifications (capabilities, triggers, output format). Six-surface inventory.

**Rule:** If you need to know *how the system is built and what each surface does technically*, ARCHITECTURE is the answer. The operator context and Lilly context that appear in ARCHITECTURE are summaries derived from MANDATE — do not update them independently.

**Derived content in ARCHITECTURE:** Operator block, Lilly context, five-layer definitions, generative brief cluster description. All derived from MANDATE.

### SYSTEM-BRIEF.md — *The Look*
**Owns:** Design philosophy. Signal/Synthesis duality. Theme definitions (the visual expression of Dispatch — color, material, texture). Token architecture (color, typography, spacing, radius). Component patterns and hierarchy. Agent instructions for UI generation. The "what Dispatch is not" boundaries.

**Rule:** If you need to know *how the interface should look and feel*, SYSTEM-BRIEF is the answer. The design system summary in ARCHITECTURE.md is a compressed reference derived from SYSTEM-BRIEF. Voice and behavioral directives referenced in SYSTEM-BRIEF (confidence tiers, Wise Counselor voice) must stay aligned with the VOICE block in PROMPTS.md.

### ANTI-PATTERNS.md — *The Stop List*
**Owns:** Prohibited UI patterns, visual treatments, component behaviors, and design decisions. Every entry is a pattern that has been proposed or implemented and rejected.

**Rule:** SYSTEM-BRIEF says what to build. ANTI-PATTERNS says what to never build. Both are required reading before any UI work. When a new anti-pattern reveals a gap in SYSTEM-BRIEF's positive guidance, add the corresponding positive instruction to SYSTEM-BRIEF — but the prohibition stays here.

### SOURCES.md — *The Feed*
**Owns:** Complete source inventory. Mode assignments per source. Rationale per source. Gap analysis for underrepresented categories. Source maintenance protocol.

**Rule:** Canonical for what's in the feed and why. The source lists in ARCHITECTURE.md are summaries derived from SOURCES.md.

### ROADMAP.md — *The Work*
**Owns:** Active bugs. Prioritized work items. Completed work archive.

**Rule:** Canonical for what to build next. References other docs for context but doesn't duplicate their content.

### DOC-AUTHORITY.md — *This Document*
**Owns:** Canonical ownership map. Conflict resolution rules. Known drift tracking.

**Rule:** When two documents claim the same territory or contradict each other, this document resolves the conflict.

### VOICE-CALIBRATION.md — *The Feedback*
**Owns:** Current voice directive summary (derived from PROMPTS.md VOICE block). Watch-for checklist. Calibration log entries.

**Rule:** This is an observation instrument, not a directive document. The directives live in PROMPTS.md. This doc tracks whether they're working.

---

## CONFLICT RESOLUTION

If MANDATE and ARCHITECTURE say different things about the operator → MANDATE wins.
If PROMPTS and MANDATE say different things about Cerebro's behavior → PROMPTS wins (it's the implementation; update MANDATE to match).
If SYSTEM-BRIEF and PROMPTS say different things about machine voice → PROMPTS wins for AI behavior; SYSTEM-BRIEF wins for visual expression.
If SYSTEM-BRIEF and ANTI-PATTERNS conflict → ANTI-PATTERNS wins (prohibitions override positive guidance).
If SOURCES and ARCHITECTURE list different feeds → SOURCES wins.

---

## KNOWN DRIFT (as of 2026-04-09)

All items resolved at the OS revision and product-doc reframe completed 2026-04-09. No active drift.

---

## MAINTENANCE

**When to update this map:** When a new document is added to the doc set. When an authority conflict is discovered. When a document's scope changes.

**Quarterly check:** Read the first paragraph of every document. Does each one still accurately describe what it owns? If two documents have started to claim the same territory, resolve immediately.
