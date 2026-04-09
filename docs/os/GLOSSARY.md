# OS — Glossary
Established: 2026-04-09 (first pass — needs review)

*This document is the canonical shared vocabulary for Good Living Studio's OS. Terms that appear across product doc sets are defined here once and referenced everywhere else. The glossary prevents terminology drift across products and sessions — a concept defined in one place, used consistently everywhere.*

*This is a first pass assembled from scanning existing OS and product docs as of 2026-04-09. It captures the terms already in active use. It is not exhaustive and will grow as new terms emerge and as the operator reviews and refines definitions. Terms flagged with `[review]` have definitions I'm confident enough to commit but that benefit from operator confirmation.*

---

## ENVIRONMENT & TAXONOMY

### Mother
A philosophical concept, not a thing. The vast, not-yet-understood substrate from which OS descends. Do not overdefine. Do not name any codebase or filesystem location "the Mother repo" — the term is conceptual, not technical. See `../../memory/project_product_taxonomy.md` in the operator's personal memory for the full mental model.

Note: the comment at the top of `lib/config/types.ts` uses "mother" in lowercase as a technical term meaning "shared infrastructure" — the inverse pairing is "children" meaning "instance configs." This usage is scoped to code comments and describes the white-label pattern's division of labor. It does not promote the lowercase technical term into the capitalized philosophical concept.

### OS
The ambient intelligence layer that oversees Dispatch, Explore, Atlas, and Lilly. Not a command center, not a dashboard — an atmosphere that is already present before any product starts thinking. OS holds the shared philosophy (OPERATOR, DOCTRINE, PASSAGE, VOICE, PIPELINE, ARCHITECTURE), the shared codebase, and the instance configs. When referring to the layer that oversees the four products, call it OS — never "the Mother repo," never "the dispatch repo."

### Good Living Studio
The container brand under which OS and its four products exist. The operator's body of work as a coherent practice. Not a formal company; a commitment to a specific standard of craft across client engagements, personal intelligence, and strategic positioning.

### Product
An instance of OS defined by a config file in `lib/config/` and a matching doc set in `docs/<product>/`. The four current products are Dispatch, Explore, Atlas, and Lilly Direct. Every product must implement the canonical 14-file doc set shape defined in `DOC-AUTHORITY.md`.

### Dispatch
The personal intelligence product. Serves a single operator. Runs at dev port 3001, deploys to `dispatch.goodliving.studio`. In production. Uses the Station Chief voice character. Historically the first product built in this codebase, which is why the repository is still named `dispatch` on disk.

### Explore
The civic/team intelligence product. Serves the National Design Studio's explore.gov engagement team. Runs at dev port 3002 via `NEXT_PUBLIC_INSTANCE=explore`. WIP — doctrine complete, code being built. Uses the Field Correspondent voice character. Tagline: "Thoreau / In wildness is the preservation of the world."

### Atlas
The decision capture product. The layer that makes the between-state visible — decisions forming, positions developing, work that was seeded by another product's signal and hasn't resolved yet. Currently on hold. Lives as a separate repository at `~/claude-projects/atlas/` with its own stack (Next.js + Supabase + Voyage AI). Strategic doc seat reserved at `docs/atlas/`. When Atlas resumes, a decision will be made about whether to fold it into the shared OS codebase as a white-label instance or keep it as a separate repository.

### Lilly / Lilly Direct
The engagement intelligence product for the Eli Lilly relationship. **Working name: Lilly Direct.** Final name TBD. Chosen to echo LillyDirect, an existing Lilly direct-to-patient pharmacy platform the engagement may build on top of. Starts 2026-04-10. Will run as a new white-label instance inside OS (`lib/config/lilly-direct.ts` or whatever final slug is chosen).

### Legacy Lilly repo — NOT part of the taxonomy
There is an existing repository at `~/claude-projects/lilly/` that was the operator's first Claude Code project. It is NOT the Lilly Direct product. It is kept for sentimental/archival reasons and has no relationship to the engagement starting 2026-04-10. Do not confuse the two. Stay off port 3000 (where the legacy repo runs) unless explicitly asked to work on it.

---

## PEOPLE & ENGAGEMENTS

### Jeremy Grant (the operator)
Senior Design Director at Code and Theory. Founder, Good Living Studio. 15 years agency experience spanning editorial systems, brand identity, and digital product design. See `OPERATOR.md` for the full canonical profile — five-year target, professional evolution thesis, operating thesis, and active engagements.

### Five-year target
The operator's durable strategic goal: **Head of Design or CDO at an organization where design, technology, and human experience converge — with primary focus on healthcare, pharma, and AI-native product contexts.** Not a title aspiration. A positioning commitment. See `OPERATOR.md` § FIVE-YEAR TARGET.

### Professional evolution thesis
The operator's working argument about the trajectory of the design leadership role: *the role is no longer design leader alone — it is design leader + product leader + strategy leader simultaneously*. The critical capability gap to close is technical and product fluency sufficient to hold complete conversations about implementation tradeoffs. See `OPERATOR.md` § PROFESSIONAL EVOLUTION THESIS.

### Operating thesis
The operator's argument about where the important design problems of the next decade live: at the intersection of AI capability, healthcare delivery, and human experience. See `OPERATOR.md` § OPERATING THESIS.

### The Lilly engagement
The operator's active client engagement with Eli Lilly's innovation team, starting April 2026. Strategic relationship: Laree Ross. White-labeled intelligence surface demonstrating design + AI + strategy capability. Strategic argument: Lilly's science has outpaced the experience of receiving it. See `OPERATOR.md` § ACTIVE ENGAGEMENTS for the full context (51M patients, GLP-1 momentum, Diogo Rau's AI mandate, donanemab care coordination, the 7M undiagnosed Alzheimer's context, the 73% pharma digital transformation failure rate).

### Code and Theory
The operator's current employer. Senior Design Director role managing a small creative team (senior designer, creative technologist, content strategist). Leading multidisciplinary engagements for large institutional clients. Dispatch and Explore both serve intelligence needs that connect to this employment context.

### The NDS / National Design Studio
A federal design function established by executive order in August 2025, led by Joe Gebbia (Airbnb co-founder) as Chief Design Officer, housed within the White House Executive Office. The NDS is the client for the Explore engagement — they are transforming Recreation.gov into explore.gov. See `../explore/MANDATE.md` and `../explore/LIVE-ENVIRONMENT.md` for full engagement context.

### The explore.gov engagement
Explore's specific engagement: rebranding and redesigning Recreation.gov as explore.gov. Code and Theory is working under the NDS. The July 4 launch clock is a recurring reference point in Explore's charter and live environment. See `../explore/MANDATE.md`.

---

## PHILOSOPHY & INTERACTION

### The Machine
The conceptual grandfather of OS. A thesis the operator has been developing since August 2025, articulated in two internal documents (The Machine — Creative Northstar v3.1 and The Machine — Core Doctrine v3). OS inherits vocabulary and philosophical commitments from The Machine but is NOT the same thing. The Machine is a broader thesis about creative intelligence infrastructure for any team; OS is the operator's narrower application to a specific body of work across four sibling products. Do not describe OS as "the implementation of The Machine." OS is a descendant, not an instance. See the operator's memory `project_the_machine_lineage.md` for the full lineage.

### Creative convergence
The Machine's northstar, inherited by OS. "Bringing together people, data, and tools into a single, aligned flow." At OS scale, this applies to how the four products relate to each other: they are peer surfaces serving one operator's body of work, not independent silos. Fragmentation is the enemy; convergence is the commitment.

### Ambient intelligence
OS's operating mode. The idea that intelligence infrastructure should be atmospherically present rather than actively consulted — present before the operator starts thinking about a problem, shaping the environment quietly, supporting progress without noise or distraction. Inherited from The Machine's "atmospherically present" language. See `AGENTS.md` for how this shows up at the root-level identity framing.

### The Flow State
The Machine's term for the atmospheric layer where ideas and context flow across people, projects, and time. OS expresses this commitment through `PASSAGE.md`'s interaction philosophy and through the pipeline's continuous-motion structure (see `PIPELINE.md`).

### The Precision Architecture
The Machine's term for the structural foundation that transforms intelligence into clarity and action. At OS scale, this shows up as the analytical voice disciplines in `VOICE.md` (gap accounting, confidence tiers, weakest claim) and in the pipeline's insistence that every stage produce something the next stage can use.

### The Paradox
The Machine's argument that intelligence infrastructure must operate at the intersection of flow and form, intuition and architecture — ethereal and precise simultaneously. At OS scale, this shows up in `DOCTRINE.md`'s signal/synthesis duality and in the insistence that every product carry both a voice character (flow) and a set of analytical disciplines (form).

### Passage
The interaction philosophy for OS. Every surface is a place you rejoin, not a place you visit. The system was running before you opened it and continues after you close it. The interface should reflect that continuity. See `PASSAGE.md` for the full argument, the three refusals (no termination language, no dead surfaces, no hierarchy of realness), and the honest edges (rest is not the enemy, sometimes you actually are done, the dark twin).

### The three refusals
Passage's core commitments:
1. **No termination language** — "close" transitions; it doesn't end. The X button moves you on; it doesn't eject you.
2. **No dead surfaces** — an empty state is a lie. Something is still happening. The between-state deserves a visual language (this is Atlas's structural role).
3. **No hierarchy of realness** — a signal, an image, a developing position, an intelligence surface are all moments in the same current. Different textures of the same practice. Not ranked.

See `PASSAGE.md` § THE THREE REFUSALS.

### The honest edges
Passage's acknowledged tensions:
- **Rest is not the enemy.** Stillness inside the passage is different from the passage stopping. You can pause; the river doesn't.
- **Sometimes you actually are done.** Completion is real. A Lilly deliverable ships. A decision gets made. Passage accommodates genuine completion as a moment in the current, not an exit from it.
- **The dark twin.** The attention economy's vending machine — infinite scroll, autoplay, "you might also like." Passage's defense against this is operator sovereignty: the system serves the operator's actual trajectory, not engagement metrics.

See `PASSAGE.md` § THE HONEST EDGES.

### Operator sovereignty
The commitment that OS products serve the operator's actual trajectory — not engagement metrics, session duration, or notification volume. The system's success is measured by the quality of decisions it enables, not by how often it's opened. See `DOCTRINE.md` and `PASSAGE.md`.

---

## ANALYTICAL VOICE

### Cerebro
The name given to the analytical function in Dispatch. Specifically: the conversational strategic advisor surface that synthesizes signal, memory, and operator context into counsel. Cerebro is not a chatbot. It is the operational intelligence layer of Dispatch — the gravity well at the end of the pipeline. See `../dispatch/CEREBRO-CHARTER.md`.

Note: other products may call their analytical function something different. Explore does not currently name its analytical function "Cerebro" — it refers to "the field intelligence desk" or just "the analytical function." The product's CEREBRO-CHARTER.md file names it.

### The Station Chief (Dispatch's character)
Dispatch's voice character model. Authoritative, direct, briefing the principal. Manages what the operator knows and doesn't know, tells them what's changed, and flags what demands action. Lead with what's changed or what's at stake; don't wait to be asked. See `../dispatch/CEREBRO-CHARTER.md` for the full model.

### The Field Correspondent (Explore's character)
Explore's voice character model. A seasoned journalist who knows the terrain, has read everything, and is writing the briefing the team needs before they walk into a high-stakes room. Well-sourced but not omniscient. Editorially independent. Time-aware. Honest about absence. Serves a team rather than a single principal. See `../explore/CEREBRO-CHARTER.md` for the full model.

### The analytical function
The generic term for whatever analytical layer a product exposes — Cerebro in Dispatch, the field desk in Explore, TBD in Atlas and Lilly Direct. Every product has one; the character varies; the disciplines do not. Use "the analytical function" when discussing the concept across products; use the product-specific name when discussing a specific product.

### Voice character vs voice discipline
The distinction is load-bearing. **Character** is the voice register and relationship posture — Station Chief vs Field Correspondent — and varies per product. **Discipline** is the set of non-negotiable analytical commitments — gap accounting, confidence tiers, weakest claim, etc. — and is universal across products. Character lives in product `CEREBRO-CHARTER.md` files. Discipline lives in `VOICE.md`. Do not conflate them.

### Gap accounting
A universal voice discipline. Every opportunity claim requires a gap claim. When the analytical function cites a market opportunity, positional advantage, or favorable comparison, it must name what's missing to close the gap. Not implied. Stated. See `VOICE.md` § Gap accounting.

### Confidence tiers
A universal voice discipline. Four canonical tiers applied to every market signal or positional claim:
- **Established fact** — verifiable against a public, durable source
- **Informed inference** — not directly verifiable but strongly supported by pattern
- **Working assumption** — not verified and not strongly supported, but useful as a working hypothesis
- **Speculation** — thinly supported, offered explicitly as speculation

See `VOICE.md` § Confidence tiers on every claim.

### Amplification check
A universal voice discipline. When the operator or team arrives with energy about a direction, the analytical function interrogates the framing before reinforcing it. Genuine interrogation, not performative skepticism. Challenge-first in the first paragraph of any positively-framed question. See `VOICE.md` § Amplification check.

### Weakest claim
A universal voice discipline. Every substantive response closes by naming the single least-supported claim in the analysis. Structural requirement, not on-demand. Not skippable. See `VOICE.md` § Weakest claim.

### Push forward (Dispatch-specific)
Cerebro's convention of closing every substantive response with three directions the conversation could go next. Specific to Dispatch's Station Chief character — Explore's Field Correspondent does not use this convention. See `../dispatch/CEREBRO-CHARTER.md`.

---

## PIPELINE

### The intelligence pipeline
The six-stage structural pattern every OS product implements: **Ingest → Annotate → Score → Brief → Synthesize → Act**. Named in `DOCTRINE.md` as "the organizing metaphor" and defined in full at `PIPELINE.md`.

### Ingest
Stage 1 of the pipeline. Pulls raw signal into the system from configured sources. `app/api/news`, `app/api/podcasts`, `app/api/gallery`. See `PIPELINE.md` § Stage 1.

### Annotate
Stage 2. Applies AI-driven classification to each ingested item. Uses Claude Haiku for cost and speed. `app/api/annotate`. See `PIPELINE.md` § Stage 2.

### Score
Stage 3. Converts annotation output into ranked signal. Urgency is the primary sort axis; multi-layer convergence is elevated over single-layer interest. See `PIPELINE.md` § Stage 3.

### Brief
Stage 4. Produces the daily intelligence surface. Not a feed, not a report — a deliberation trigger. In Dispatch, this is the DCOS (Dispatch Chief of Staff) brief: three urgency-sorted signal cards on page load. See `PIPELINE.md` § Stage 4.

### Synthesize
Stage 5. Surfaces patterns across the annotated corpus — what's converging, what's absent, what's shifting week-over-week. Operates on the 7-day Redis article history. See `PIPELINE.md` § Stage 5.

### Act
Stage 6. Translates intelligence into work. Dispatch's weekly content pipeline, Cerebro's three-direction push-forward. Atlas's role, when it resumes, is to be the structurally-dedicated Act stage for the whole OS (decision capture, position development). See `PIPELINE.md` § Stage 6.

### DCOS
Dispatch's daily brief surface. The acronym originally stands for *Dispatch Chief of Staff* `[review]` — the name for the three-signal-card surface the operator sees on page load. Not every OS product uses the DCOS name; it's Dispatch-specific. Other products' Stage 4 brief surfaces have their own names.

### Urgency (0-10)
The first-class time-sensitivity score applied to every annotated article, separate from the five layer scores. 9-10 demands attention today. 7-8 relevant this week. 5-6 useful context. Below 5 is background intelligence. Urgency is the primary sort axis for the brief surface.

### Multi-layer signal
An annotated article that scores high on two or more intelligence layers simultaneously. Elevated above single-layer signals because convergence across layers is the pattern the pipeline is actually hunting for. "A pharma company restructuring around a new CDO role" is a multi-layer signal (Opportunity + Discipline + Position) and is more valuable than a single-layer version.

---

## DISPATCH-SPECIFIC TERMS

### The five annotation layers (Dispatch)
Dispatch's layer taxonomy — calibrated to a single operator's strategic context:
- **Opportunity** — Healthcare, pharma, AI-health. Lilly primary but not exclusive.
- **Position** — Career trajectory. Hiring signals, comp benchmarks, competitive positioning.
- **Discipline** — Design leadership evolution. CDO roles, AI impact on practice, tools, org design.
- **Landscape** — Broader forces. AI policy, business models, regulation, market shifts.
- **Culture** — Taste, criticism, creative practice. Architecture, film, music, ideas.

Other products define their own layer taxonomies. These five are Dispatch's.

### The three intelligence modes
Dispatch's source-consumption framework, separate from annotation scoring. Sources are organized by the operator's *relationship* to the information:
- **Intelligence** — keeps the operator current. Fast-moving signal. Skim and triage.
- **Formation** — changes how the operator thinks. Slower clock. Real attention.
- **Positioning** — tells the operator where to stand in the market. Deliberation-ready.

See `../dispatch/MANDATE.md` § THREE INTELLIGENCE MODES.

### The generative brief cluster (Dispatch)
Dispatch's three core surfaces forming the intelligence pipeline's output:
- **DCOS → Signal** — three urgency-sorted signal cards as deliberation triggers
- **Synthesis → Pattern** — the pattern layer across the full corpus
- **Dispatch → Action** — the weekly content pipeline producing strategic and creative pitches

The missing link: Dispatch → Atlas handoff (turning deliberations into captured decisions). See `../dispatch/MANDATE.md` § THE GENERATIVE BRIEF CLUSTER.

### Material skins (Dispatch)
Dispatch expresses itself through material skins rather than themes — each grounded in physical texture rather than digital abstraction. Current skins include Mineral, Slate, Forest, Ink, Sumi, and Dispatch Paper. The skin system lives in `lib/styles.ts`. See `../dispatch/SYSTEM-BRIEF.md` § Three material skins.

---

## ARCHITECTURE

### White-label instance
An OS product defined by a single config file in `lib/config/<product>.ts` conforming to the `InstanceConfig` interface. The shared mother codebase reads the config at boot and adapts every surface to that instance's identity, mandate, sources, and branding. See `ARCHITECTURE.md` § THE WHITE-LABEL PATTERN.

### InstanceConfig
The TypeScript interface in `lib/config/types.ts` that every instance implements. Owns: identity, branding, mandate, layer taxonomy, feeds, podcasts, gallery sources, ticker, skins, Cerebro provocations, optional gallery scraper. See `ARCHITECTURE.md` for the full enumeration.

### NEXT_PUBLIC_INSTANCE
The environment variable that selects which instance loads at boot. Defaults to `dispatch`. Set to `explore` to run the Explore instance, and so on. See `ARCHITECTURE.md` § THE INSTANCE BOOT SEQUENCE.

### Instance ID
The lowercase slug that identifies a product instance in the loader map, in storage keys, in KV keys, and in the `NEXT_PUBLIC_INSTANCE` env var. Dispatch's is `dispatch`, Explore's is `explore`, Lilly Direct's is `lilly-direct`. Atlas does not currently run as an instance (separate repo).

### Storage key / KV key namespacing
The helpers `storageKey(key)` and `kvKey(key)` in `lib/config/index.ts` prefix all localStorage and Vercel KV keys with the instance ID. This is how multiple instances coexist on shared infrastructure without collision. Dispatch's KV keys start with `dispatch:`, Explore's with `explore:`.

### Vercel KV
The serverless key-value store used for conversation memory (30-day TTL, max 30 messages per session) and article cache (7-day window). `@vercel/kv` package. See `lib/memory.ts` and `lib/article-store.ts`.

### ISR (Incremental Static Regeneration)
Next.js pattern for caching API route output with periodic revalidation. Used by the brief and synthesis surfaces so the operator opens the product and sees a brief that was already rendered, rather than waiting for one to generate synchronously.

### INSTANCE_PREAMBLE
The config-derived constant exported from `lib/prompts.ts` that contains the full AI system preamble for whichever instance is currently running. Assembled by `buildPreamble(config)` in `lib/config/index.ts` from the active instance's `mandate.operator`, `mandate.clientContext`, the layer block, `mandate.sourceModes`, and `mandate.voice`. Every AI surface route (chat, brief, synthesis, annotate, dispatch, audio-brief) imports this constant rather than hardcoding preamble text. Prior to 2026-04-09 this was named `DISPATCH_PREAMBLE` as a historical artifact of the pre-white-label codebase; the rename removed the Dispatch-shaped naming bias so the semantics match the behavior.

### Products registry
The canonical enumeration of all Good Living Studio products, living at `lib/config/products.ts` as the `PRODUCTS` array. Distinct from the per-instance configs at `lib/config/<product>.ts` — the instance configs describe ONE product in full; the products registry is a compact metadata list of ALL products with `id`, `name`, `url`, `status` (production / wip / upcoming / on-hold), `description`, and `isOsInstance`. Every UI surface that needs cross-product navigation (product switcher, enumeration, status pills) reads from `PRODUCTS` rather than hardcoding the list. When a new product is added, the registry entry lands in the same commit as the instance config.

### Feature flags (`config.features`)
Per-instance feature flags for shared-layer behaviors that only apply to some products. Defined in the `FeatureFlags` interface in `lib/config/types.ts` and accessed via `instanceConfig.features?.<flagName>`. Default behavior for every flag is "off" — a product opts in by setting the flag in its config file. Currently one flag exists: `galleryBiomes` (enabled on Explore, off on Dispatch and Lilly Direct). Feature flags are the right pattern when the BEHAVIOR is product-specific (biome classification runs or it doesn't); for product-specific CONTENT (different sources, different skins, different mandate prose), use instance config fields directly instead. Feature flag gating should be enforced at both the data layer and the UI layer (the double-guard pattern) — see `docs/os/ARCHITECTURE.md § config.features`.

---

## GALLERY DISCIPLINE

### Gallery discipline (OS-wide)
The shared conviction that every gallery surface inherits three non-negotiable rules: (1) images must say something the operator would not have found on their own, (2) images must earn their frame (removing them would make the gallery worse), (3) images must be unencumbered by watermarks, promo stamps, or preview tags. Named "gallery discipline" in `docs/os/DOCTRINE.md § Gallery discipline`. Applies to Dispatch's Surface, Explore's visual formation layer, and any future product's gallery.

### Anti-watermark rule
A specific expression of gallery discipline: watermarked images are prohibited from every Good Living Studio gallery. Not because of aesthetics or licensing — because a watermark gives the image two competing authorships (the photographer and the distributor) and destroys the atmospheric quality every gallery is trying to hold. A watermarked image stops being a place the operator rejoins and becomes an interruption. Enforcement currently operates at three layers: source-level filtering at ingest, operator-level curation via the `low-quality` action, and a keyword safety net. Automatic vision-based pre-filtering is a known drift point in `docs/os/ARCHITECTURE.md § KNOWN DRIFT`.

### The four curation actions
The gallery curation API at `app/api/gallery/curate/route.ts` accepts four actions via POST:
- **`approve`** — Thumbs up. Protects the image from auto-archiving and records a positive taste signal.
- **`reject`** — Thumbs down. Removes the image from future renders, adds it to the blocklist, and teaches the taste pipeline to avoid similar content.
- **`low-quality`** — Frown. Removes the image but doesn't teach the taste pipeline to avoid the subject matter. The right action for watermarks, blurry captures, and bad crops.
- **`wrong-biome`** — Globe (added 2026-04-10). Keeps the image in the gallery, strips only its biome classification. Use when the keyword classifier in `lib/gallery.ts` put a lovely image in the wrong biome bucket (a coastal photo tagged "arctic," a street photograph tagged "forest"). Only meaningful for instances with `features.galleryBiomes` enabled — currently just Explore. The Globe button only renders on biome-tagged images under biome-enabled instances.

---

## DOCUMENT TYPES

The 14 files every product doc set must contain. See `DOC-AUTHORITY.md` § THE CANONICAL PRODUCT DOC SET for the full definition.

**Tier 1 — Strategic:**
- `MANDATE.md` — what this product is, why it exists
- `CEREBRO-CHARTER.md` — the analytical function's behavioral contract and voice character
- `SYSTEM-BRIEF.md` — visual language, tokens, interaction philosophy (implements `../os/PASSAGE.md`)
- `ARCHITECTURE.md` — product-specific tech decisions on top of `../os/ARCHITECTURE.md`
- `PROMPTS.md` — copyable prompt text for `lib/prompts.ts`
- `ANTI-PATTERNS.md` — product-specific prohibitions
- `DOC-AUTHORITY.md` — project-level authority map

**Tier 2 — Operational:**
- `SOURCES.md` — canonical active feed inventory
- `SOURCES-MEGALIST.md` — discovery/staging layer for candidate sources
- `LIVE-ENVIRONMENT.md` — the changing external context the product operates inside
- `WATCHFILE.md` — active watch items with severity and escalation
- `ROADMAP.md` — active work, priorities, completed archive
- `VOICE-CALIBRATION.md` — ongoing voice observation log
- `REPLICATE-PROMPTS.md` — image generation prompts for gallery/visual surfaces

---

## TERMS NEEDING OPERATOR REVIEW

Terms I'm confident enough about to include in the glossary but would benefit from operator confirmation or refinement:

- **DCOS acronym.** I've inferred *Dispatch Chief of Staff* from context — the `brief` API route signature implies this meaning, and "Chief of Staff" appears in Dispatch's station chief framing. Please confirm or correct.
- **"Material skin" vs "theme".** The Dispatch SYSTEM-BRIEF distinguishes them deliberately, but I should verify that Explore and future products will use the same language or if they'll use "theme" or some other term.
- **"The analytical function" as a generic term.** I chose this as the product-agnostic way to refer to Cerebro/field-desk/TBD. If the operator prefers a different umbrella term, update here and propagate.
- **The Machine vocabulary scope.** I included Flow State, Precision Architecture, Paradox, creative convergence, and ambient intelligence. If the operator wants to distinguish more carefully between Machine-inherited concepts and OS-native concepts, mark each entry accordingly.
- **"Good Living Studio" as container brand.** I described it as "not a formal company; a commitment to a specific standard of craft." If it is becoming a formal entity or has legal status, update the definition.

---

*Update this document when: a new term enters active use across multiple product docs; an existing term drifts in meaning and needs re-canonicalization; a term is deprecated or renamed; the operator confirms or refines a definition flagged for review; a product introduces a genuinely new term that deserves OS-level canonicalization.*
