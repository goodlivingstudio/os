# OS — The Intelligence Pipeline
Established: 2026-04-09

*This document is canonical for the shared intelligence pipeline pattern that every Good Living Studio product implements. It describes the six-stage structural logic — **Ingest → Annotate → Score → Brief → Synthesize → Act** — what each stage means, how each product varies its implementation, where each stage lives in the shared codebase, and how the pipeline relates to Passage.*

*See `DOCTRINE.md` § "What connects the projects" where the pipeline is named as "the organizing metaphor." See `ARCHITECTURE.md` for how the pipeline maps to specific API routes and code locations. See each product's `MANDATE.md` for how the product scopes and calibrates its own pipeline implementation. See `PASSAGE.md` for the interaction philosophy the pipeline must support.*

---

## THE ARGUMENT

Most intelligence systems collapse into two failure modes. The first is the news aggregator: an infinite stream of material arriving untagged, ranked by recency, with no notion of what matters. The operator scrolls, extracts what they can, and leaves burdened rather than informed. The second is the dashboard: a set of widgets that report on state without producing interpretation. The operator sees numbers and still doesn't know what to do.

The intelligence pipeline is the OS's answer to both failure modes. It is the structural commitment that **raw signal must pass through annotation, scoring, briefing, synthesis, and actionable translation before it reaches the operator as counsel**. No stage is skippable. No stage is automatic. Each stage produces a specific thing the next stage requires. When the operator opens any OS product, they are looking at the output of stage 4 or 5 — not stage 1. The pipeline has been running without them.

This is the structural guarantee behind the Passage philosophy. Passage says *every surface is a place you rejoin, not a place you visit*. The pipeline is what makes that true: the current was moving before you opened it, and the current is moving now because the pipeline is running on every product simultaneously, regardless of whether any operator is watching. The pipeline is the river. Passage is what the river's interaction pattern becomes when the operator arrives.

---

## THE SIX STAGES

### Stage 1 — Ingest

**What it does.** Pulls raw signal into the system from configured sources. RSS feeds, podcast feeds, gallery scrapes, manual submissions.

**Where it lives in shared code.** `app/api/news/` pulls RSS. `app/api/podcasts/` pulls podcast feeds. `app/api/gallery/` drives gallery fetch and curation. `lib/feeds.ts`, `lib/podcasts.ts`, `lib/gallery.ts` are the adapters that read `config.feeds`, `config.podcasts`, and `config.gallerySources` from the active instance.

**Product variation.** Each product defines its own source list in `lib/config/<product>.ts`. Dispatch runs a tighter curated feed calibrated to personal intelligence (pharma, healthcare AI, design leadership, AI capability, culture). Explore runs a broader federal and civic intelligence feed. Lilly Direct will run a narrower engagement-specific feed. Atlas (when it resumes) may not have a pull-based Ingest stage at all — it may run exclusively on manual submissions and handoffs from the other products. The Ingest contract does not require pull-based sources; it requires *some* pathway from world to system.

**Characterizing discipline.** Source curation is not additive. Sources earn their place. The pipeline's signal quality is bounded by the quality of Stage 1 — you cannot annotate your way out of a bad source mix. Each product's `SOURCES.md` is the canonical inventory, and `SOURCES-MEGALIST.md` is the discovery/staging layer where candidate sources get evaluated before promotion.

**Failure mode.** Ingesting everything. The aggregator trap. A pipeline that ingests 500 sources produces noise faster than it can annotate, and the operator ends up either ignoring the feed or drowning in it. Restraint at Stage 1 is upstream of every other stage's quality.

### Stage 2 — Annotate

**What it does.** Applies AI-driven classification to each ingested item. Extracts metadata (source, publication time, title, body). Applies product-specific context. Routes to an annotation LLM call.

**Where it lives in shared code.** `app/api/annotate/` handles the annotation runtime. It reads `config.layers` for the active instance and constructs the annotation prompt using `scoreJsonExample(cfg)` and `scoreJsonRange(cfg)` from `lib/config/index.ts` so the LLM knows what shape the response should take.

**Model choice.** Annotation uses Claude Haiku — fast, cheap, and well-suited to structured classification tasks. The reasoning surfaces (Cerebro, synthesis, briefs) use Sonnet. Haiku at the annotation layer is what makes running a broad source mix affordable.

**Product variation.** The layer taxonomy is product-specific. Dispatch uses Opportunity / Position / Discipline / Landscape / Culture — calibrated to a single operator's strategic trajectory. Explore uses a different set calibrated to civic design intelligence. Lilly Direct will define its own. The annotation prompt assembly in `lib/prompts.ts` reads from `config.layers` so the same annotation code adapts to each product's taxonomy without modification.

**Characterizing discipline.** Annotation is interpretation, not classification. "This article scores 8 on Opportunity and 3 on Discipline" is a reading. The reading is only as good as the mandate and operator context the annotation LLM has access to. This is why `config.mandate` is injected into the annotation prompt — the model needs to know what it's scoring against.

**Failure mode.** Annotating in a vacuum. An annotation model that doesn't know what the product is for will pattern-match generic relevance signals ("healthcare! pharma! high score!") and produce annotations that feel plausible but don't reflect the product's actual strategic frame.

### Stage 3 — Score

**What it does.** Converts annotation output into ranked signal. Computes urgency across the layer values. Elevates multi-layer signals (items scoring high on two or more layers simultaneously) above single-layer signals. Applies watchfile boosts (see product `WATCHFILE.md`) — items related to active watch items get a score bump. Applies live-environment weighting (see product `LIVE-ENVIRONMENT.md`) — items aligned with current market dynamics score higher than items that are technically interesting but disconnected from the terrain.

**Where it lives in shared code.** Scoring logic is distributed across `app/api/annotate/` (the primary per-article scoring call) and downstream consumers in the brief and synthesis surfaces that sort on the scored output. Urgency is a first-class field on every annotated article.

**Product variation.** The weighting of layers against each other is product-specific. Dispatch elevates Opportunity and Position signals during active engagement windows. Explore elevates Policy and Equity signals during the pre-launch period. The weighting can shift over time as the operator's or team's priorities evolve — scoring is not static.

**Characterizing discipline.** Urgency is first-class. The default sort is urgency-descending, not recency-descending. The difference is load-bearing: an aggregator sorts by recency and the most urgent item might be at position 47; an intelligence system sorts by urgency and the operator sees the thing that demands attention first, regardless of when it dropped into the feed.

**Failure mode.** Flat scoring. A scoring pass that treats every layer equally and ignores urgency produces a ranked list that looks like a weighted news feed. Scoring earns its name only when the rank order is genuinely different from what recency would produce — and only when multi-layer convergence is elevated above single-layer interest.

### Stage 4 — Brief

**What it does.** Produces the daily intelligence surface. Three urgency-sorted signal cards on page load in Dispatch (the DCOS brief). The team's equivalent landing surface in Explore. Every card is a deliberation trigger, not a headline. The question the card asks is: *does this matter to you, and if so, how?*

**Where it lives in shared code.** `app/api/brief/` generates the daily brief from the scored feed. `app/api/audio-brief/` renders the brief output as audio. The brief output is cached in Vercel KV (with instance-prefixed keys) so the operator opening the product sees a brief that was already prepared, not one that renders synchronously when they arrive.

**Product variation.** The brief's form varies. Dispatch's DCOS is three cards. Explore's equivalent may be a different number or a different shape — the product decides what surfacing pattern serves its audience. Lilly Direct's brief will be shaped by the engagement's deliverable rhythm. Atlas (when it resumes) may brief on decisions-in-motion rather than on incoming signal. The universal requirement is that Stage 4 produces a compressed, interpreted surface — not a feed.

**Characterizing discipline.** The brief does not greet. It briefs. When the operator opens the product, the brief is already there — scored, interpreted, waiting. No orientation preamble. No "here's what's new today." The brief assumes the operator is already in the current and is now looking at it. This is the Passage philosophy expressed at the surface layer.

**Failure mode.** Making the brief a headline list. A brief that reads like five news headlines is not a brief; it's a summary. The brief earns its name when every card contains both *what* and *what it demands* — and when the operator can skip the ones that don't demand anything.

### Stage 5 — Synthesize

**What it does.** Surfaces patterns across the annotated corpus. Not what happened today, but what's converging this week. What's conspicuously absent. What's shifting. What the operator (or team) should be asking but isn't. This stage operates on the full 7-day Redis article history (see `lib/article-store.ts`), not just the current day's ingest.

**Where it lives in shared code.** `app/api/synthesis/` generates the synthesis layer. `app/api/synthesis-purge/` clears its cache when the operator wants to regenerate. Like the brief, synthesis output is cached in Vercel KV so it's ready when the operator opens the product.

**Product variation.** What gets synthesized varies by product. Dispatch synthesizes across its five annotation layers for a single operator's strategic positioning. Explore synthesizes across platform intelligence, policy signals, cultural signal, and NDS intelligence for a design team. Lilly Direct will synthesize against engagement deliverables. Atlas will synthesize decisions-in-motion into developed positions.

**Characterizing discipline.** Synthesis is interpretation, not summary. "Here are the top 10 articles this week" is not synthesis. "The converging pattern is X, which matters because Y, and the weakest claim in that reading is Z" is synthesis. The discipline is mandatory at Stage 5 because this is where the pipeline either produces value or reveals itself as a glorified aggregator. All ten universal voice disciplines from `VOICE.md` apply here most strictly — gap accounting, confidence tiers, amplification check, weakest claim, name absence.

**Failure mode.** Summarizing instead of synthesizing. The LLM is trained to summarize; you have to prompt it explicitly out of that default. The synthesis prompt must demand pattern detection, absence naming, and confidence labeling — not a digest of the week's articles.

### Stage 6 — Act

**What it does.** Translates intelligence into work. This is where the pipeline stops being observation and becomes output. Act is what the operator actually does with the synthesized intelligence — the thing that justifies every upstream stage.

**Where it lives in shared code.** Dispatch's Act surface is `app/api/dispatch/` — the weekly content brief generation that produces 4-5 actionable content pitches (strategic positioning pieces for LinkedIn/Medium/Substack and creative expression pieces for visual surfaces). Cerebro's three-direction push-forward (`app/api/chat/`) is also an Act surface — every Cerebro response closes with three specific next moves. Explore's Act surface is TBD — likely platform design recommendations, evaluation protocols, or specific decisions the team needs to make. Atlas's Act surface, when it resumes, is the decision-capture layer itself: Atlas is structurally about the Act stage of the other products' pipelines. Lilly Direct's Act surface will be engagement deliverables.

**Product variation.** Act is the most product-specific stage, because the actionable translation depends entirely on what the product is for. A personal intelligence system translates signal into career moves and content; a civic design team translates signal into design decisions and equity protocols; an engagement intelligence surface translates signal into client deliverables and meeting prep.

**Characterizing discipline.** The Act stage must produce something that is either work the operator (or team) does next, or a decision they make next. "Here's what this means" is not Act — that's still Stage 5 Synthesis. "Here's what you should do with this" is Act. The distinction is easy to blur and worth enforcing: a pipeline that stops at Stage 5 is incomplete and will eventually feel like observation without consequence, which is the quickest way for an intelligence system to lose operator trust.

**Failure mode.** Act-stage bloat. The mirror-image failure of stopping at Stage 5: producing actionable recommendations for every signal, regardless of whether any specific action is warranted. Not every signal demands action. "This is worth watching but nothing is yet called for" is a valid Act output and often the right one. Over-producing actions is how an intelligence system starts to feel like a taskmaster.

---

## THE PIPELINE AND PASSAGE

Passage and the Pipeline are not in tension. The pipeline describes the structural movement of signal through an OS product. Passage describes the interaction philosophy the product carries while that movement is happening. Both exist simultaneously, and each requires the other to hold.

**The pipeline is why Passage is true.** "The current was moving before you arrived" is only a meaningful claim if something was actually moving. The pipeline is the something. It ingests, annotates, scores, briefs, synthesizes, and acts on a schedule that does not depend on whether any operator is watching. When the operator opens the product, they see the output of a process that has been running for hours or days.

**Passage is why the pipeline stays legible.** A pipeline with no Passage philosophy produces a report-style output that waits for a reader. The operator arrives, consumes the report, and leaves — the vending machine model. Passage transforms the pipeline's output into a surface the operator *rejoins*. The brief is not a report; it's a place where the current becomes visible. The synthesis is not a newsletter; it's a pattern that emerged from the corpus the pipeline holds. Cerebro is not a chatbot session; it's a conversation that paused and resumed.

**The specific couplings:**
- **Stage 1 Ingest** runs continuously. The operator's absence does not pause it. The feed is always populating.
- **Stage 2 Annotate** runs on a cadence tied to feed refresh, not to operator activity.
- **Stage 3 Score** is reapplied whenever Stages 1-2 produce new state. Scores can drift between sessions as the operator's watchfile evolves or the live environment shifts.
- **Stage 4 Brief** is cached, pre-rendered, waiting. When the operator opens the product, the brief is already scored and ready. No spinner. No "generating..." state. Passage demands that the surface be populated when the operator arrives, not generated on demand.
- **Stage 5 Synthesize** is similarly cached. Synthesis operates on the weekly window and is regenerated on a schedule — the operator's open event can trigger a refresh, but the base case is that synthesis is ready.
- **Stage 6 Act** happens in the operator's time, not the pipeline's time. This is where the pipeline hands off to the operator. Everything upstream was asynchronous; Act is synchronous with human decision-making.

The interaction pattern this produces: the operator opens the product, sees intelligence that was already interpreted, and moves into Act. They do not wait for the pipeline; they rejoin it at the point where the pipeline hands off to them. When they close the product, the pipeline continues without them. This is Passage implemented structurally.

---

## CADENCE CONTRACT

Each product defines its own pipeline cadence. The cadence is visible to the operator through the product's surface (timestamps, "last updated" markers, synthesis week windows). The cadence is not a secret — part of the operator's trust in the pipeline comes from knowing when each stage last ran.

Current cadences (as of 2026-04-09; may drift as products evolve):

- **Dispatch.** Ingest on RSS feed refresh intervals (per-source, typically 30-60 minutes). Annotate on ingest. Score continuously. Brief cached on ISR revalidation. Synthesis regenerates on a daily cadence with weekly pattern detection. Cerebro conversations persist for 30 days in Vercel KV.
- **Explore.** Similar cadences to Dispatch; specific intervals TBD as Explore's build completes. The shared infrastructure supports the same cadence contract Dispatch uses — differences will be deliberate, not accidental.
- **Atlas.** TBD. May be triggered by Dispatch/Explore handoffs rather than scheduled.
- **Lilly Direct.** TBD. Engagement-specific; probably weekly synthesis tied to stakeholder meeting rhythms.

---

## WHAT THIS DOCUMENT DOES NOT OWN

- **Product-specific implementation details.** How each product implements each stage, what its specific prompts look like, what its scoring weights are. See product-level `ARCHITECTURE.md` and `PROMPTS.md`.
- **The analytical voice that runs across every stage.** See `VOICE.md` for the universal disciplines and product-level `CEREBRO-CHARTER.md` files for how each product's character expresses them.
- **The operator context the pipeline scores against.** See `OPERATOR.md` and product-level `MANDATE.md`.
- **The live environment each product's pipeline is pointed at.** See product-level `LIVE-ENVIRONMENT.md`.
- **The interaction philosophy that shapes how pipeline output is surfaced.** See `PASSAGE.md`.

---

*Update this document when: a new stage is identified as canonical (is there a seventh stage we haven't named?); a stage is redefined because of real implementation experience; a product implements a stage in a way that changes the pattern for everyone; the pipeline's relationship to Passage needs refinement; or a cadence contract changes materially.*
