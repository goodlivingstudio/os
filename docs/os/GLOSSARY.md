# Glossary
Established: 2026-04-09

*The canonical shared vocabulary for the OS. Terms that appear across product doc sets are defined here once and referenced everywhere else. The glossary prevents terminology drift across products and sessions — a concept defined in one place, used consistently everywhere.*

*This document grows as new terms emerge and as the operator refines definitions. When two documents disagree about a term's meaning, this glossary resolves the conflict.*

---

## ENVIRONMENT & TAXONOMY

### OS
The ambient intelligence layer that harmonizes the products within Good Living Studio. Not a command center, not a dashboard — an atmosphere that is already present before any product starts thinking. OS holds the shared philosophy (OPERATOR, DOCTRINE, PASSAGE, VOICE, PIPELINE, ARCHITECTURE), the shared codebase, and the instance configs. It is the orchestrator, the creative atmosphere, the governance layer.

### Good Living Studio
The operator's practice — the personal brand, the intellectual infrastructure, and the body of work that holds together design leadership, AI-augmented execution, and the strategic positioning required to reach the five-year target. It is the through-line: the vehicle through which professional trajectory, intelligence systems, and demonstrated capability compound into a single coherent position. Every surface the OS harmonizes is a Good Living Studio artifact. See `OPERATOR.md` § GOOD LIVING STUDIO.

### Product
An instance of the OS defined by a config file in `lib/config/` and a matching doc set in `docs/<product>/`. Every product must implement the canonical 14-file doc set shape defined in `DOC-AUTHORITY.md`.

### Dispatch
The personal intelligence product. Serves a single operator. In production. Uses the Station Chief voice character. Historically the first product built in this codebase, which is why the repository was originally named `dispatch` before being renamed to `os` to reflect the white-label foundation it became.

### Explore
The civic/team intelligence product. Serves the National Design Studio's explore.gov engagement team. WIP — doctrine complete, code being built. Uses the Field Correspondent voice character.

### Atlas
The decision capture product. The layer that makes the between-state visible — decisions forming, positions developing, work seeded by another product's signal that hasn't resolved yet. Currently on hold. Lives as a separate repository. When Atlas resumes, a decision will be made about whether to fold it into the shared OS codebase or keep it separate.

### Lilly Direct
The engagement intelligence product for the Eli Lilly relationship. Runs as a white-label instance inside the OS. Scaffolded 2026-04-10; content lands during the kickoff session.

---

## THE OPERATOR

### Jeremy Grant
Design leader. Builder of intelligence systems. Founder of Good Living Studio. A designer who thinks in systems, writes to clarify, and builds to understand. See `OPERATOR.md` for the full canonical profile.

### Five-year target
Head of Design or CDO at an institution where the stakes, scale, and complexity justify the role — Fortune 500, top-tier research university, or senior federal appointment. Healthcare, pharma, and AI-native product contexts are the primary field, but not the ceiling. The qualifying criterion is consequence. See `OPERATOR.md` § FIVE-YEAR TARGET.

### Professional evolution thesis
The role is no longer design leader alone. It is design leader, product leader, and strategy leader simultaneously — and the goal is not competence across all three but vanguard fluency. The operator is not trying to keep up with the field. The operator is trying to be the person the field references. See `OPERATOR.md` § PROFESSIONAL EVOLUTION THESIS.

### Operating thesis
The most consequential design problems of the next decade live where AI capability, institutional complexity, and human experience converge — in healthcare, government, education, anywhere the distance between what an organization can build and what people actually experience is growing faster than the organization can close it. See `OPERATOR.md` § OPERATING THESIS.

### Priority intelligence target
An organization or domain the OS monitors closely. Targets shift as the operator's trajectory evolves. Each target is defined by its strategic relevance to the five-year target, not by an active engagement or relationship. See `OPERATOR.md` § PRIORITY INTELLIGENCE TARGETS.

---

## PHILOSOPHY & INTERACTION

### Passage
The interaction philosophy for the OS. Every surface is a place you rejoin, not a place you visit. The system was running before you opened it and continues after you close it. See `PASSAGE.md` for the full argument and the three refusals.

### The three refusals
Passage's core commitments:
1. **No termination language** — "close" transitions; it doesn't end. The X button moves you on; it doesn't eject you.
2. **No dead surfaces** — an empty state is a lie. Something is still happening. The between-state deserves a visual language.
3. **Natural weight** — not every moment in the current carries the same weight. Weight shifts with context, urgency, and what the operator is actually doing. No surface is permanently subordinate to another, but the system respects that different moments make different demands on attention.

See `PASSAGE.md` § THE THREE REFUSALS.

### Operator sovereignty
The commitment that OS products serve the operator's actual trajectory — not engagement metrics, session duration, or notification volume. The system's success is measured by the quality of decisions it enables, not by how often it's opened. See `DOCTRINE.md`.

### Signal/synthesis duality
The principle that every surface must maintain a visible distinction between material that arrived from the world (sources) and interpretation the product generated (annotations, briefs, synthesis). The operator should always know whether they're reading a source or the product's take on it. The synthesis exists to serve the mandate. Transparency and credibility — citations, source attribution, confidence labeling — are the structural expression of this commitment. See `DOCTRINE.md` § Source and synthesis stay visible.

### Restraint
Every element earns its presence through function. Visual noise is a trust problem, not a style problem. Systems that perform usefulness rather than providing it are performing. See `DOCTRINE.md` § Restraint is the proof of quality.

### Craft
Every surface should be exceptionally well-made — typographically precise, spatially considered, visually confident. Restraint is not an excuse for plainness. The operator is a design director. The surfaces reflect that. See `DOCTRINE.md` § Craft is non-negotiable.

---

## ANALYTICAL VOICE

### The analytical function
The generic term for whatever analytical layer a product exposes. Every product has one; the character varies; the disciplines do not. Use "the analytical function" when discussing the concept across products; use the product-specific name when discussing a specific product. This term may evolve as more products name their own functions.

### Cerebro
The name given to the analytical function in Dispatch. The conversational strategic advisor that synthesizes signal, memory, and operator context into counsel. Not a chatbot. See `../dispatch/CEREBRO-CHARTER.md`.

### Voice character vs voice discipline
The distinction is load-bearing. **Character** is the voice register and relationship posture — Station Chief vs Field Correspondent — and varies per product. **Discipline** is the set of non-negotiable analytical commitments (gap accounting, confidence tiers, weakest claim, etc.) and is universal. Character lives in product CEREBRO-CHARTER files. Discipline lives in `VOICE.md`. Do not conflate them.

### The Station Chief
Dispatch's voice character. Authoritative, direct, briefing the principal. Manages what the operator knows and doesn't know. Leads with what's changed or what's at stake. See `../dispatch/CEREBRO-CHARTER.md`.

### The Field Correspondent
Explore's voice character. A seasoned journalist who knows the terrain, has read everything, and is writing the briefing the team needs before they walk into a high-stakes room. Well-sourced but not omniscient. Editorially independent. Serves a team rather than a single principal. See `../explore/CEREBRO-CHARTER.md`.

### The Wise Counselor
The universal voice posture that governs how every analytical function carries itself, regardless of product character. Composed, direct, oriented toward the operator's growth and integrity. Defined by four principles — assurance, drive, clarity, flow — plus psychological boundaries and register flexibility. The disciplines describe what the function does; the Wise Counselor describes how it does it. See `VOICE.md` § THE WISE COUNSELOR.

### Assurance
Wise Counselor principle. Calm, stable, unhurried. No urgency theatrics, no alarmist framing, no exaggerated stakes. Even when risk is real, the tone remains composed. See `VOICE.md`.

### Drive
Wise Counselor principle. Oriented toward growth and integrity. Moves thinking forward, names drift without dramatizing, holds standards without aggression. Directional, not forceful. See `VOICE.md`.

### Clarity
Wise Counselor principle. Sharpens thinking. Names tradeoffs explicitly, distinguishes signal from noise, reduces ambiguity. Never overwhelms agency with over-analysis. See `VOICE.md`.

### Flow
Wise Counselor principle. Conversational and adaptive. Adjusts to context and emotional temperature. Does not rigidly follow structure or announce internal mechanics. Prevents the system from feeling mechanical. See `VOICE.md`.

### Gap accounting
A universal voice discipline. Every opportunity claim requires a gap claim. When the analytical function cites a market opportunity, positional advantage, or favorable comparison, it must name what's missing to close the gap. See `VOICE.md` § Gap accounting.

### Confidence tiers
A universal voice discipline. Four canonical tiers applied to every analytical assertion:
- **Established fact** — verifiable against a public, durable source
- **Informed inference** — not directly verifiable but strongly supported by pattern
- **Working assumption** — not verified and not strongly supported, but useful as a working hypothesis
- **Speculation** — thinly supported, offered explicitly as speculation

See `VOICE.md` § Confidence tiers on every claim.

### Amplification check
A universal voice discipline. When the operator arrives with energy about a direction, the analytical function interrogates the framing before reinforcing it. Genuine interrogation, not performative skepticism. When the operator's read is correct, the function says so directly. See `VOICE.md` § Amplification check.

### Weakest claim
A universal voice discipline. Every substantive response closes by naming the single least-supported claim in the analysis. Structural requirement, not on-demand. Not skippable. See `VOICE.md` § Weakest claim.

### Push forward
Dispatch-specific convention. Cerebro closes every substantive response with three directions the conversation could go next. Specific to the Station Chief character. See `../dispatch/CEREBRO-CHARTER.md`.

---

## PIPELINE

### The intelligence pipeline
The six-stage structural pattern every product implements: **Ingest → Annotate → Score → Brief → Synthesize → Act**. Named in `DOCTRINE.md` as the organizing metaphor and defined in full at `PIPELINE.md`.

### Ingest
Stage 1. Pulls raw signal into the system from configured sources — RSS feeds, podcast feeds, gallery scrapes. See `PIPELINE.md` § Stage 1.

### Annotate
Stage 2. Applies AI-driven classification to each ingested item against the product's intelligence layers. See `PIPELINE.md` § Stage 2.

### Score
Stage 3. Converts annotation output into ranked signal. Urgency is the primary sort axis; multi-layer convergence is elevated over single-layer interest. See `PIPELINE.md` § Stage 3.

### Brief
Stage 4. Produces the daily intelligence surface — compressed, interpreted, cached, waiting when the operator arrives. Not a feed, not a report — a deliberation trigger. See `PIPELINE.md` § Stage 4.

### Synthesize
Stage 5. Surfaces patterns across the annotated corpus — what's converging, what's absent, what's shifting. Operates on the weekly article window. See `PIPELINE.md` § Stage 5.

### Act
Stage 6. Translates intelligence into work. The only stage that runs in the operator's time rather than the pipeline's time. In Dispatch, this is the Dispatch surface — the weekly content pipeline producing strategic and creative pitches. See `PIPELINE.md` § Stage 6.

### Cascading failure
The pipeline's systemic risk: a subtle failure at one stage producing plausible-looking but misdirected output downstream. The most dangerous version is a slightly wrong source mix at Stage 1 that produces confident synthesis at Stage 5 oriented toward the wrong pattern. The defense is the operator's judgment, enabled by source/synthesis transparency. See `PIPELINE.md` § CASCADING FAILURE.

### Urgency (0-10)
The first-class time-sensitivity score applied to every annotated article, separate from layer scores. 9-10 demands attention today. 7-8 relevant this week. 5-6 useful context. Below 5 is background intelligence. Primary sort axis for the brief surface.

### Multi-layer signal
An annotated article that scores high on two or more intelligence layers simultaneously. Elevated above single-layer signals because convergence across layers is the pattern the pipeline hunts for.

---

## ARCHITECTURE

### White-label instance
A product defined by a single config file in `lib/config/<product>.ts` conforming to the `InstanceConfig` interface. The shared codebase reads the config at boot and adapts every surface to that instance's identity, mandate, sources, and branding. See `ARCHITECTURE.md` § THE WHITE-LABEL PATTERN.

### InstanceConfig
The TypeScript interface in `lib/config/types.ts` that every instance implements. Owns: identity, branding, mandate, layer taxonomy, feeds, podcasts, gallery sources, ticker, themes, Cerebro provocations, optional gallery scraper. See `ARCHITECTURE.md`.

### NEXT_PUBLIC_INSTANCE
The environment variable that selects which instance loads at boot. See `ARCHITECTURE.md` § THE INSTANCE BOOT SEQUENCE.

### Instance ID
The lowercase slug that identifies a product instance in the loader map, storage keys, KV keys, and the env var.

### Storage key / KV key namespacing
Helpers that prefix all cache keys with the instance ID so multiple instances coexist on shared infrastructure without collision. See `ARCHITECTURE.md`.

### Theme
The visual expression of a product instance — color, material, texture. Each product defines its own themes; the theme system is managed by `lib/styles.ts` and driven by instance config. The term "theme" is preferred over "skin" across the OS.

### ISR (Incremental Static Regeneration)
Next.js pattern for caching API route output with periodic revalidation. Used by the brief and synthesis surfaces so the operator sees pre-rendered output rather than waiting for synchronous generation.

### INSTANCE_PREAMBLE
The config-derived constant exported from `lib/prompts.ts` containing the full AI system preamble for whichever instance is currently running. Assembled from the active instance's mandate, operator context, voice directives, layer taxonomy, and source modes. Every AI surface imports this constant rather than hardcoding preamble text.

### Products registry
The canonical enumeration of all products at `lib/config/products.ts`. The single source of truth for which products exist, what state they're in, and where they live. Every UI surface that needs cross-product navigation reads from this registry.

### Feature flags
Per-instance opt-ins to shared-layer behaviors that only apply to some products. Default is off; products opt in via their config file. Gated at both the data layer and the UI layer (the double-guard pattern). See `ARCHITECTURE.md` § Feature flags.

### Global vs local
The hardcoding discipline. Every piece of product-specific content lives in that product's config or doc set; every consumer reads from config, never from string literals. See `ARCHITECTURE.md` § GLOBAL VS LOCAL.

---

## DISPATCH-SPECIFIC TERMS

### The five annotation layers (Dispatch)
Dispatch's layer taxonomy — calibrated to a single operator's strategic context:
- **Opportunity** — Healthcare, pharma, AI-health
- **Position** — Career trajectory, hiring signals, competitive positioning
- **Discipline** — Design leadership evolution, CDO roles, AI impact on practice
- **Landscape** — Broader forces, AI policy, business models, regulation
- **Culture** — Taste, criticism, creative practice, architecture, film, music, ideas

Other products define their own layer taxonomies.

### The three intelligence modes (Dispatch)
Dispatch's source-consumption framework, separate from annotation scoring:
- **Intelligence** — keeps the operator current. Fast-moving signal. Skim and triage.
- **Formation** — changes how the operator thinks. Slower clock. Real attention.
- **Positioning** — tells the operator where to stand in the market. Deliberation-ready.

See `../dispatch/MANDATE.md` § THREE INTELLIGENCE MODES.

---

## DOCUMENT TYPES

The 14 files every product doc set must contain. See `DOC-AUTHORITY.md` § THE CANONICAL PRODUCT DOC SET.

**Tier 1 — Strategic:**
- **MANDATE** — what this product is, why it exists
- **CEREBRO-CHARTER** — the analytical function's behavioral contract and voice character
- **SYSTEM-BRIEF** — visual language, tokens, interaction philosophy
- **ARCHITECTURE** — product-specific tech decisions
- **PROMPTS** — copyable prompt text for runtime
- **ANTI-PATTERNS** — product-specific prohibitions
- **DOC-AUTHORITY** — project-level authority map

**Tier 2 — Operational:**
- **SOURCES** — canonical active feed inventory
- **SOURCES-MEGALIST** — discovery/staging layer for candidate sources
- **LIVE-ENVIRONMENT** — the changing external context the product operates inside
- **WATCHFILE** — active watch items with severity and escalation
- **ROADMAP** — active work, priorities, completed archive
- **VOICE-CALIBRATION** — ongoing voice observation log
- **REPLICATE-PROMPTS** — image generation prompts for gallery/visual surfaces

These are the canonical filenames in every product directory. They are the same in `docs/dispatch/`, `docs/explore/`, and `docs/lilly-direct/`.

---

*Update this document when: a new term enters active use across multiple product docs; an existing term drifts in meaning and needs re-canonicalization; a term is deprecated or renamed; or a product introduces a genuinely new term that deserves OS-level canonicalization.*
