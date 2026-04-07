# EXPLORE — Document Authority Map
Established: 2026-04-07

*This document resolves ownership across the Explore doc set. When two documents describe the same concern, one is canonical and the other derives from it. If they conflict, the canonical document wins. Read this before editing any Explore document.*

---

## THE RULE

Every piece of system knowledge has exactly one canonical home. Other documents may reference or summarize that knowledge, but they must explicitly mark it as derived. When updating derived content, update the canonical source first, then propagate. Never update a derived reference without checking the source.

---

## AUTHORITY MAP

### MANDATE.md — *The Why*
**Owns:** Operator context (the engagement, the team, the NDS institutional relationship). The five-year target. Operating thesis. Three intelligence modes (Signal / Formation / Positioning). Five annotation layer definitions (Platform / Policy / Culture / Industry / Craft). Station chief model and its restatement as Field Desk model. Synthesis purpose. Mission Brief cluster purpose.

**Rule:** If you need to know *who this system serves and why it exists*, MANDATE is the answer. Everything in PROMPTS.md's ENGAGEMENT and NDS_CONTEXT blocks derives from MANDATE. Change MANDATE first; then propagate to PROMPTS.

**Derivation chain:** MANDATE → PROMPTS.md context blocks → `lib/prompts.ts`

---

### PROMPTS.md — *The Words*
**Owns:** All copyable prompt text for `lib/prompts.ts`. Context blocks (ENGAGEMENT, NDS_CONTEXT, FIVE_LAYERS, SOURCE_MODES, VOICE). Surface prompts (DCOS, Cerebro, Annotation, Synthesis, Mission Brief, Gallery). Prompt assembly pattern. Surface inventory table. Prompt maintenance schedule.

**Rule:** PROMPTS.md is the *implementation* of MANDATE and CEREBRO-CHARTER. The ENGAGEMENT block and NDS_CONTEXT block derive from MANDATE and LIVE-ENVIRONMENT respectively. The VOICE block derives from CEREBRO-CHARTER. The surface prompts are canonical here — they exist in copyable form nowhere else. Change source documents first, then propagate to PROMPTS.

**Derivation chain:** MANDATE → ENGAGEMENT block; LIVE-ENVIRONMENT → NDS_CONTEXT block; CEREBRO-CHARTER → VOICE block; all → `lib/prompts.ts`

---

### LIVE-ENVIRONMENT.md — *The Current Conditions*
**Owns:** Political and institutional context. The founding brief (Burgum/Gebbia origin story). The July 4 deadline and its implications. The two framings in tension (extraction vs. experiential). The NDS credibility problem. The DOGE variable and NPS operational capacity. The cross-partisan opportunity. The equity imperative. What this means for Cerebro's analytical function.

**Rule:** MANDATE is permanent doctrine. LIVE-ENVIRONMENT is the current conditions report — it changes when the political or institutional landscape shifts materially. The NDS_CONTEXT block in PROMPTS.md derives from this document. When LIVE-ENVIRONMENT is updated, propagate relevant changes to PROMPTS.md NDS_CONTEXT.

**Derivation chain:** LIVE-ENVIRONMENT → PROMPTS.md NDS_CONTEXT block

---

### CEREBRO-CHARTER.md — *The Behavioral Contract*
**Owns:** The field correspondent model. Behavioral directives (brief the work, hold the tension, July 4 clock, equity lens, challenge positive framing, gap accounting, weakest claim, flag noise). The Civic Design Test. The Burgum-Gebbia Frame Check. The Accessibility Audit Standard. The 90-Day / Stewardship Split. What the analytical function will not do. Push Forward format. Synthesis directives.

**Rule:** CEREBRO-CHARTER is the *behavioral specification* for the analytical function. The VOICE block in PROMPTS.md is the copyable implementation of this document. Change CEREBRO-CHARTER first; then propagate to PROMPTS.md VOICE block and relevant surface prompts.

**Derivation chain:** CEREBRO-CHARTER → PROMPTS.md VOICE block → `lib/prompts.ts`

---

### SOURCES.md — *The Feed*
**Owns:** Complete source inventory. Mode assignments per source. Rationale per source. Gallery sources. Sources flagged for audit. Source maintenance protocol.

**Rule:** Canonical for what's in the feed and why. The source references in ARCHITECTURE.md (when built) are summaries derived from SOURCES.md. The SOURCE_MODES block in PROMPTS.md describes the mode taxonomy — not the specific source list. SOURCES.md owns the list.

---

### WATCHFILE.md — *The Risk Register*
**Owns:** Active watch items with severity ratings, escalation triggers, and operational implications. Log format for new entries. Resolved items archive.

**Rule:** WATCHFILE is a living document — the only document in the set designed to be updated continuously during active engagement. It derives context from LIVE-ENVIRONMENT but owns the specific tracked items and their current status. When a watch item resolves or becomes permanent background context, migrate it to LIVE-ENVIRONMENT as structural context and close it here.

**Derivation chain:** LIVE-ENVIRONMENT provides context → WATCHFILE tracks specific items → PROMPTS.md Annotation and Synthesis surfaces reference watch items by name

---

### ARCHITECTURE.md — *The How* *(not yet built)*
**Owns:** Tech stack and infrastructure. API routes and models. Data flow (ISR, annotation pipeline, Redis persistence). Navigation structure. Design system summary (summary only — not canonical). AI surface specifications. Six-surface inventory.

**Rule:** If you need to know *how the system is built*, ARCHITECTURE is the answer. The operator context in ARCHITECTURE is a summary derived from MANDATE. The design system summary in ARCHITECTURE is derived from SYSTEM-BRIEF. Do not update these sections in ARCHITECTURE without updating the canonical source first.

---

### SYSTEM-BRIEF.md — *The Look* *(not yet built)*
**Owns:** Design philosophy for the Explore interface. Visual language decisions. Token architecture (color, typography, spacing, radius) for the team-facing tool. Component patterns. Agent instructions for UI generation. The "what Explore is not" boundaries adapted for a multi-operator team tool vs. a personal intelligence system.

**Rule:** If you need to know *how the interface should look and feel*, SYSTEM-BRIEF is the answer. The design system summary in ARCHITECTURE.md is a compressed reference derived from SYSTEM-BRIEF.

---

### ANTI-PATTERNS.md — *The Stop List* *(not yet built)*
**Owns:** Prohibited UI patterns, visual treatments, component behaviors, and design decisions specific to the Explore civic platform context. Each entry is a pattern proposed, implemented, or suggested and rejected.

**Rule:** SYSTEM-BRIEF says what to build. ANTI-PATTERNS says what to never build. Both are required reading before any UI work. Note: some anti-patterns from personal Dispatch apply here; some do not (Explore is a team tool with different register requirements). Do not copy personal Dispatch ANTI-PATTERNS wholesale — evaluate each for applicability to civic team context.

---

### ROADMAP.md — *The Work*
**Owns:** Active bugs. Prioritized work items organized by phase and priority. Completed work archive.

**Rule:** Canonical for what to build next. References other documents for context but does not duplicate their content.

---

### DOC-AUTHORITY.md — *This Document*
**Owns:** Canonical ownership map. Conflict resolution rules. Known drift tracking.

**Rule:** When two documents claim the same territory or contradict each other, this document resolves the conflict.

---

### VOICE-CALIBRATION.md — *The Feedback* *(not yet built)*
**Owns:** Current voice directive summary (derived from PROMPTS.md VOICE block). Watch-for checklist adapted for the field correspondent model. Calibration log entries from real usage sessions.

**Rule:** Observation instrument, not a directive document. Directives live in PROMPTS.md and CEREBRO-CHARTER. This document tracks whether they're working. Build after first 10–15 real Cerebro sessions.

---

## CONFLICT RESOLUTION

If MANDATE and LIVE-ENVIRONMENT say different things about the engagement → MANDATE wins for permanent doctrine; LIVE-ENVIRONMENT wins for current conditions.

If PROMPTS and CEREBRO-CHARTER say different things about Cerebro's behavior → PROMPTS wins (it is the implementation; update CEREBRO-CHARTER to match, then note the change).

If LIVE-ENVIRONMENT and WATCHFILE conflict on the severity of an institutional risk → WATCHFILE wins (it is the live instrument; update LIVE-ENVIRONMENT when a watch item resolves to permanent context).

If SYSTEM-BRIEF and ANTI-PATTERNS conflict → ANTI-PATTERNS wins (prohibitions override positive guidance).

If SOURCES and ARCHITECTURE list different feeds → SOURCES wins.

If MANDATE and PROMPTS describe the field desk model differently → PROMPTS wins for prompt text; MANDATE wins for doctrinal intent; resolve the gap by updating the clearer one to match.

---

## DOCUMENT RELATIONSHIPS

```
MANDATE ──────────────────────────────────────────────────────┐
  │                                                            │
  ├──► PROMPTS.md (ENGAGEMENT block)                          │
  │       │                                                    │
  │       └──► lib/prompts.ts                                 │
  │                                                            │
LIVE-ENVIRONMENT ────────────────────────────────────────────►│
  │                                                            │
  ├──► PROMPTS.md (NDS_CONTEXT block)                         │
  │                                                            │
  └──► WATCHFILE (provides context for tracked items)         │
                                                               │
CEREBRO-CHARTER ─────────────────────────────────────────────►│
  │                                                            │
  └──► PROMPTS.md (VOICE block)                              │
                                                               ▼
SOURCES ──────────────────────────────────────────────────► ARCHITECTURE
                                                               │
SYSTEM-BRIEF ────────────────────────────────────────────────►│
  │                                                            │
  └──► ANTI-PATTERNS (prohibitions derived from gaps)        │
                                                               ▼
ROADMAP (references all, owns none)                       lib/prompts.ts
```

---

## KNOWN DRIFT (as of 2026-04-07)

**SOURCES-UPDATE-V2 retired.** Content merged into SOURCES.md v2. SOURCES-UPDATE-V2.md should be deleted from the working directory.

**ARCHITECTURE.md not yet built.** References to "ARCHITECTURE" in this authority map are forward-looking. Until it exists, treat PROMPTS.md surface inventory table as the provisional architecture reference.

**SYSTEM-BRIEF.md not yet built.** No visual language decisions are documented. Until it exists, no UI work should begin on the Explore interface.

**ANTI-PATTERNS.md not yet built.** Personal Dispatch ANTI-PATTERNS.md exists but should not be copied wholesale — requires evaluation against Explore's civic team context before any items are adopted.

**VOICE-CALIBRATION.md not yet built.** Build after first 10–15 real Cerebro sessions when the field correspondent model has real usage data to calibrate against.

---

## MAINTENANCE

**When to update this map:** When a new document is added to the doc set. When an authority conflict is discovered. When a document's scope changes materially.

**Quarterly check:** Read the opening paragraph of every document. Does each still accurately describe what it owns? If two documents have started to claim the same territory, resolve immediately.
