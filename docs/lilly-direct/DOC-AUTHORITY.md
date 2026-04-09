# LILLY DIRECT — Document Authority Map (scaffold)
Established: 2026-04-10

*This document resolves ownership across the Lilly Direct doc set. When two documents describe the same concern, one is canonical and the other derives from it. If they conflict, the canonical document wins.*

---

## OS-LEVEL INHERITANCE

Lilly Direct is one of four sibling products living under OS — the ambient intelligence layer that holds the Good Living Studio philosophy, operator context, and shared authority. Lilly Direct inherits from eight OS-level documents at `../os/`:

- **OPERATOR.md** — Canonical for operator identity (Jeremy Grant), five-year target, professional evolution thesis, and priority intelligence targets (Eli Lilly is one of them). Lilly Direct's MANDATE.md references it rather than restating the operator profile.
- **DOCTRINE.md** — Canonical for shared design convictions (restraint as proof of quality, craft is non-negotiable, source and synthesis stay visible, visual surfaces earn their place, analytical voice in service of the mandate, design systems are governance, clarity over density). Lilly Direct's SYSTEM-BRIEF.md and ANTI-PATTERNS.md implement these convictions in Lilly Direct-specific form.
- **PASSAGE.md** — Canonical for interaction philosophy. Lilly Direct's SYSTEM-BRIEF.md § Interaction philosophy translates Passage into specific Lilly Direct commitments.
- **VOICE.md** — Canonical for universal analytical voice disciplines (gap accounting, confidence tiers, amplification check, weakest claim, lead with substance, no sycophancy, flag noise, name absence, editorial independence, tight paragraphs, density). Lilly Direct's CEREBRO-CHARTER.md expresses these through a product-specific character.
- **PIPELINE.md** — Canonical for the six-stage intelligence pipeline (Ingest → Annotate → Score → Brief → Synthesize → Act). Lilly Direct's ARCHITECTURE.md describes how this product implements each stage.
- **ARCHITECTURE.md** (OS-level) — Canonical for the shared codebase, white-label pattern, and 15-step new-product spinup checklist. Lilly Direct's ARCHITECTURE.md describes product-specific decisions sitting on top of this foundation.
- **GLOSSARY.md** — Canonical for shared vocabulary. Lilly Direct uses the same terms (operator, annotation layer, station chief/field correspondent, Passage, etc.) with the same meanings.
- **DOC-AUTHORITY.md** (OS-level) — Resolves authority conflicts that cross product boundaries or involve OS-level documents.

**Rule:** When Lilly Direct docs conflict with OS-level docs, the OS-level document wins on principle and intent. Lilly Direct docs win on project-specific implementation. See `../os/DOC-AUTHORITY.md` for the full inheritance model.

---

## STATUS

**Scaffold.** All 14 canonical Lilly Direct doc files exist as structural stubs. Content lands at kickoff and over the engagement's life. This file is canonical for Lilly Direct authority conflicts from the moment it exists — use it to resolve any ambiguity about which Lilly Direct doc owns which concern.

---

## THE RULE

Every piece of Lilly Direct system knowledge has exactly one canonical home. Other documents may reference or summarize that knowledge, but they must explicitly mark it as derived: *"See [CANONICAL DOC] for the authoritative version."*

When updating derived content, update the canonical source first, then propagate. Never update a derived reference without checking the source.

---

## AUTHORITY MAP

### MANDATE.md — *The Why*
**Owns:** What Lilly Direct is. Why it exists. The engagement framing. The Lilly Direct model (whatever voice model and structural logic this product uses). Three-ish intelligence modes if any. Layer taxonomy. Synthesis purpose. Generative brief cluster. The engagement-specific operator framing.

**Derives from:** `../os/OPERATOR.md` for operator identity, five-year target, professional evolution thesis, and the Lilly engagement baseline context.

**Rule:** If you need to know what Lilly Direct is and why it exists, MANDATE is the answer. For who the operator is at the OS-wide level, see `../os/OPERATOR.md`. For how the analytical function reasons, see `CEREBRO-CHARTER.md`.

### CEREBRO-CHARTER.md — *The Voice*
**Owns:** The behavioral contract for Lilly Direct's analytical function. Voice character (name and description). Register and delivery. Behavioral directives. What the function will not do. What the function knows. Analytical protocols specific to this engagement. Synthesis directives. Push-forward convention (or whatever replaces it).

**Derives from:** `../os/VOICE.md` for the universal analytical disciplines that apply to every product.

**Rule:** If you need to know how Lilly Direct's analytical function reasons and what disciplines it carries, CEREBRO-CHARTER is the answer. Cross-reference with `../dispatch/CEREBRO-CHARTER.md` (Station Chief) and `../explore/CEREBRO-CHARTER.md` (Field Correspondent) for the two existing character templates. The VOICE block in PROMPTS.md is derived from this document.

### PROMPTS.md — *The Words*
**Owns:** All copyable prompt text for `lib/config/lilly-direct.ts` mandate blocks. Context blocks (OPERATOR, CLIENT_CONTEXT, LAYERS, SOURCE_MODES, VOICE). Surface prompts (brief, Cerebro, annotation, synthesis, engagement output). Prompt assembly pattern. Maintenance schedule.

**Derives from:** MANDATE for content; CEREBRO-CHARTER for voice; LIVE-ENVIRONMENT for engagement context; `../os/OPERATOR.md` for operator baseline.

**Rule:** PROMPTS.md is the implementation of the doctrine. Change upstream first, then propagate to this file. The blocks in `lib/config/lilly-direct.ts` are a simplified copy of what lives here; PROMPTS.md is the canonical source for the prompt text itself.

### ARCHITECTURE.md — *The How*
**Owns:** Tech stack decisions specific to Lilly Direct on top of the shared OS foundation. Lilly Direct-specific routing, data flow, surface inventory. Deployment target. Known divergences from the shared OS pattern. Confidentiality and data-handling constraints specific to the engagement.

**Derives from:** `../os/ARCHITECTURE.md` for the shared foundation; MANDATE for the intent the architecture supports.

**Rule:** If you need to know how Lilly Direct is built and where it diverges from shared OS code, ARCHITECTURE is the answer. Infrastructure and patterns common to every product live at `../os/ARCHITECTURE.md`.

### SYSTEM-BRIEF.md — *The Look*
**Owns:** Design philosophy. Token architecture (color, typography, spacing, radius). Material skins. Component patterns. Agent instructions for UI generation. The "what Lilly Direct is not" visual boundaries. The § Interaction philosophy: Passage subsection implementing `../os/PASSAGE.md`.

**Derives from:** `../os/DOCTRINE.md` for shared design convictions; `../os/PASSAGE.md` for interaction philosophy; MANDATE for the purpose the visual language supports; CEREBRO-CHARTER for the voice character the visuals reinforce.

**Rule:** If you need to know how the interface should look and feel, SYSTEM-BRIEF is the answer. Voice and behavioral directives referenced here (confidence tiers, voice character) must stay aligned with CEREBRO-CHARTER.md and `../os/VOICE.md`.

### ANTI-PATTERNS.md — *The Stop List*
**Owns:** Prohibited UI patterns, visual treatments, component behaviors, voice moves, and design decisions specific to Lilly Direct. Each entry names a pattern that was proposed or implemented and rejected.

**Derives from:** `../os/DOCTRINE.md` for OS-wide refusals; SYSTEM-BRIEF.md (the positive guidance that this document's prohibitions reinforce).

**Rule:** SYSTEM-BRIEF says what to build. ANTI-PATTERNS says what to never build. Both are required reading before any UI work. When a new anti-pattern reveals a gap in SYSTEM-BRIEF's positive guidance, add the corresponding positive instruction to SYSTEM-BRIEF — but the prohibition stays here.

### SOURCES.md — *The Feed*
**Owns:** Complete Lilly Direct source inventory. Mode assignments per source. Rationale per source. Gap analysis.

**Rule:** Canonical for what's in the feed and why. The `feeds`, `podcasts`, and `gallerySources` arrays in `lib/config/lilly-direct.ts` are derived from SOURCES.md.

### SOURCES-MEGALIST.md — *The Discovery Layer*
**Owns:** Candidate sources under evaluation — the staging area where new sources get considered before promotion to the active SOURCES.md inventory.

**Rule:** Items move from this list to SOURCES.md only when they demonstrate they belong. This list is the memory of "things worth evaluating later."

### LIVE-ENVIRONMENT.md — *The Terrain*
**Owns:** The current state of the Lilly engagement environment. Stakeholder dynamics (Laree Ross relationship, innovation team context, broader Lilly leadership signals). Market dynamics (GLP-1 momentum, donanemab care coordination, LillyDirect performance, competitive pharma moves). Regulatory shifts. Active tensions and turning points Lilly Direct is scoring signal against.

**Rule:** This is the document that becomes stale fastest. Quarterly at minimum; near-daily updates to the "active tensions" section when major shifts occur. The CLIENT_CONTEXT block in PROMPTS.md derives from this file.

### WATCHFILE.md — *Active Watch Items*
**Owns:** Specific named items Lilly Direct is tracking in real time — people, deals, deadlines, decisions, dynamics. Each item has a severity rating, a reason it matters, triggers that would change its severity, and an escalation protocol.

**Rule:** Watchfile items feed directly into the brief surface. When a watchfile item changes severity, Cerebro should surface the change unprompted.

### ROADMAP.md — *The Work*
**Owns:** Active Lilly Direct work items. Prioritized backlog. Completed work archive.

**Rule:** Canonical for what to build next. References other docs for context but doesn't duplicate their content.

### VOICE-CALIBRATION.md — *The Feedback Log*
**Owns:** Observation log of voice drift in real Lilly Direct usage. Watch-for checklist. Calibration notes. Not a directive document — the directives live in CEREBRO-CHARTER.md and `../os/VOICE.md`.

**Rule:** This file fills over time with real usage entries. Read it before any change to CEREBRO-CHARTER or PROMPTS.md VOICE block.

### REPLICATE-PROMPTS.md — *The Image Prompts*
**Owns:** Image generation prompts for Lilly Direct's gallery or visual surfaces, if any exist. The aesthetic frame. Subject prompts by category. Style modifiers. Anti-prompts.

**Rule:** Only relevant if Lilly Direct develops a visual surface. If it doesn't, this document stays a scaffold indefinitely. See the scaffold placeholder for context.

---

## CONFLICT RESOLUTION

If MANDATE and CEREBRO-CHARTER say different things about the voice character → CEREBRO-CHARTER wins (it's the implementation; update MANDATE to match).

If SYSTEM-BRIEF and CEREBRO-CHARTER conflict on how voice shows up visually → SYSTEM-BRIEF wins for visual expression; CEREBRO-CHARTER wins for analytical behavior.

If SYSTEM-BRIEF and ANTI-PATTERNS conflict → ANTI-PATTERNS wins (prohibitions override positive guidance).

If SOURCES and ARCHITECTURE list different feeds → SOURCES wins.

If any Lilly Direct doc conflicts with an OS-level doc → OS-level wins on principle, Lilly Direct wins on project-specific implementation.

If a concern spans Lilly Direct and Dispatch (e.g., how Dispatch's content pipeline hands off to Lilly Direct for client-facing output) → OS-level documents govern the shared interface; each product governs its own side.

---

## KNOWN DRIFT (as of 2026-04-10)

**All 14 canonical files exist as scaffolds, not content.** This is expected — today is kickoff. Drift is defined as "canonical file missing" (not the case here) or "content contradicts another file" (not the case yet because content doesn't exist). As content lands at kickoff, track drift here.

**Voice character is undefined.** `CEREBRO-CHARTER.md` has placeholder content; the actual character (Station Chief, Field Correspondent, or new) gets chosen at kickoff. Until then, Lilly Direct inherits universal disciplines from `../os/VOICE.md` and uses placeholder text in the PROMPTS.md VOICE block.

**Layer taxonomy is placeholder.** The current five layers (Therapeutic / Regulatory / Digital / Organizational / Competitive) are my best guess from the Lilly engagement context in `../os/OPERATOR.md`. The real taxonomy gets defined at kickoff from MANDATE.md.

**Surface inventory is undefined.** `ARCHITECTURE.md` doesn't yet name which shared surfaces Lilly Direct exposes. Decision at kickoff.

**Deployment target is undefined.** The scaffold config uses `lilly.goodliving.studio` as a placeholder domain. The real domain depends on whether the product is publicly hosted, privately hosted, or client-hosted.

---

## MAINTENANCE

**When to update this map:** When a new document is added to the Lilly Direct doc set. When an authority conflict is discovered. When a document's scope changes materially. When drift accumulates and needs cleanup.

**Quarterly check:** Read the first paragraph of every Lilly Direct doc. Does each still accurately describe what it owns? If two documents have started to claim the same territory, resolve immediately.

---

*This is a Lilly Direct-specific authority map. For OS-wide authority and cross-product conflicts, see `../os/DOC-AUTHORITY.md`.*
