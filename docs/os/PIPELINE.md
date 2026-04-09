# Pipeline
Established: 2026-04-09

*The shared intelligence pipeline pattern that every product within the OS implements. Six stages — **Ingest → Annotate → Score → Brief → Synthesize → Act** — describing the structural logic that turns raw signal into actionable counsel. This document owns the pattern. Product-level `ARCHITECTURE.md` files own the implementation details, code paths, and cadences.*

*See `DOCTRINE.md` where the pipeline is named as the organizing metaphor. See `ARCHITECTURE.md` for how the pipeline maps to shared infrastructure. See `PASSAGE.md` for the interaction philosophy the pipeline must support.*

---

## THE ARGUMENT

Most intelligence systems collapse into two failure modes. The first is the aggregator: an infinite stream of material arriving untagged, ranked by recency, with no notion of what matters. The operator scrolls, extracts what they can, and leaves burdened rather than informed. The second is the dashboard: a set of widgets that report on state without producing interpretation. The operator sees numbers and still doesn't know what to do.

The intelligence pipeline is the OS's answer to both. It is the structural commitment that raw signal must pass through annotation, scoring, briefing, synthesis, and actionable translation before it reaches the operator as counsel. No stage is skippable. Each stage produces a specific thing the next stage requires. When the operator opens any surface, they are looking at the output of Stage 4 or 5 — not Stage 1. The pipeline has been running without them.

This is the structural guarantee behind the Passage philosophy. Passage says every surface is a place you rejoin, not a place you visit. The pipeline is what makes that true: the current was moving before you opened it, and the current is moving now because the pipeline is running regardless of whether anyone is watching. The pipeline is the river. Passage is what the river's interaction pattern becomes when the operator arrives.

---

## THE SIX STAGES

### Stage 1 — Ingest

**What it does.** Pulls raw signal into the system from configured sources — RSS feeds, podcast feeds, gallery scrapes, manual submissions. Each product defines its own source list calibrated to its mandate.

**Characterizing discipline.** Source curation is not additive. Sources earn their place. The pipeline's signal quality is bounded by the quality of Stage 1 — you cannot annotate your way out of a bad source mix. Each product's `SOURCES.md` is the canonical inventory, and `SOURCES-MEGALIST.md` is the discovery layer where candidates get evaluated before promotion.

**Failure mode.** Ingesting everything. The aggregator trap. A pipeline that ingests hundreds of sources produces noise faster than it can annotate, and the operator ends up either ignoring the feed or drowning in it. Restraint at Stage 1 is upstream of every other stage's quality.

### Stage 2 — Annotate

**What it does.** Applies AI-driven classification to each ingested item. Extracts metadata. Applies product-specific context. Routes to an annotation model that scores the item against the product's intelligence layers.

**Characterizing discipline.** Annotation is interpretation, not classification. A score of 8 on one layer and 3 on another is a reading — a judgment about what this signal means for this product's mandate. The reading is only as good as the mandate and operator context the annotation model has access to.

**Failure mode.** Annotating in a vacuum. A model that doesn't know what the product is for will pattern-match generic relevance signals and produce annotations that feel plausible but don't reflect the product's actual strategic frame.

### Stage 3 — Score

**What it does.** Converts annotation output into ranked signal. Computes urgency across layer values. Elevates multi-layer signals (items scoring high on two or more layers simultaneously) above single-layer signals. Applies watchfile boosts and live-environment weighting so items aligned with current dynamics surface higher than items that are technically interesting but disconnected from the terrain.

**Characterizing discipline.** Urgency is first-class. The default sort is urgency-descending, not recency-descending. The difference is load-bearing: an aggregator sorts by recency and the most urgent item might be buried; an intelligence system sorts by urgency and the operator sees the thing that demands attention first, regardless of when it arrived.

**Failure mode.** Flat scoring. A scoring pass that treats every layer equally and ignores urgency produces a ranked list that looks like a weighted news feed. Scoring earns its name only when the rank order is genuinely different from what recency would produce.

### Stage 4 — Brief

**What it does.** Produces the daily intelligence surface — compressed, interpreted, waiting when the operator arrives. Every card is a deliberation trigger, not a headline. The question the card asks is: does this matter, and if so, how?

**Characterizing discipline.** The brief does not greet. It briefs. When the operator opens the product, the brief is already there — scored, interpreted, cached. No orientation preamble. No "here's what's new today." The brief assumes the operator is already in the current and is now looking at it. This is the Passage philosophy expressed at the surface layer.

**Failure mode.** Making the brief a headline list. A brief that reads like five news headlines is not a brief; it's a summary. The brief earns its name when every card contains both what happened and what it demands — and when the operator can skip the ones that don't demand anything.

### Stage 5 — Synthesize

**What it does.** Surfaces patterns across the annotated corpus over a wider window than the daily brief. Not what happened today, but what's converging this week. What's conspicuously absent. What's shifting. What the operator should be asking but isn't.

**Characterizing discipline.** Synthesis is interpretation, not summary. "Here are the top articles this week" is not synthesis. "The converging pattern is X, which matters because Y, and the weakest claim in that reading is Z" is synthesis. All ten voice disciplines apply here most strictly.

**Failure mode.** Summarizing instead of synthesizing. The default AI behavior is to summarize; the synthesis prompt must demand pattern detection, absence naming, and confidence labeling — not a digest.

### Stage 6 — Act

**What it does.** Translates intelligence into work. This is where the pipeline stops being observation and becomes output — the thing that justifies every upstream stage. Act is the only stage that runs in the operator's time rather than the pipeline's time, and that difference is what makes it the stage that matters most. In Dispatch, the Act surface is Dispatch itself — the weekly content pipeline producing strategic and creative pitches.

**Characterizing discipline.** Act must produce something the operator either does next or decides next. "Here's what this means" is still Stage 5. "Here's what you should do with this" is Act. The distinction is easy to blur and worth enforcing: a pipeline that stops at Stage 5 is incomplete and will eventually feel like observation without consequence.

**Failure mode.** Act-stage bloat. The mirror-image failure of stopping at Stage 5: producing actionable recommendations for every signal, regardless of whether action is warranted. Not every signal demands action. "This is worth watching but nothing is yet called for" is a valid Act output and often the right one. Over-producing actions is how an intelligence system starts to feel like a taskmaster.

---

## CASCADING FAILURE

Each stage names its own failure mode. The pipeline's systemic risk is subtler: a failure at one stage that looks fine locally but produces misdirected output downstream.

The most dangerous version: a slightly wrong source mix at Stage 1 (too many sources from one perspective, a key source missing) produces plausible annotations at Stage 2, reasonable scores at Stage 3, a confident-looking brief at Stage 4, and a synthesis at Stage 5 that reads well but is oriented toward the wrong pattern. Every stage looked fine individually. The output is still wrong.

The defense is the operator's own judgment — and this is why source and synthesis must stay visible (see `DOCTRINE.md`). The operator who can see what sources fed the pipeline, what layers the annotation emphasized, and what confidence tier the synthesis carries can catch a cascade that the pipeline itself cannot detect. Transparency is not a design preference. It is a structural safeguard.

The operator's correction mechanisms matter here too. When a synthesis misses the point, when an annotation over-scores a weak signal, when a source stops earning its place — the operator needs a path to correct the pipeline, not just consume its output. Each product's specific correction surfaces (curation actions, source management, watchfile updates) are the feedback loop that keeps the pipeline honest over time.

---

## THE PIPELINE AND PASSAGE

Passage and the Pipeline are not in tension. The pipeline describes the structural movement of signal through the OS. Passage describes the interaction philosophy the operator carries while that movement is happening. Both exist simultaneously, and each requires the other to hold.

**The pipeline is why Passage is true.** "The current was moving before you arrived" is only a meaningful claim if something was actually moving. The pipeline is the something. It ingests, annotates, scores, briefs, synthesizes, and acts on a schedule that does not depend on whether any operator is watching.

**Passage is why the pipeline stays legible.** A pipeline with no Passage philosophy produces a report-style output that waits for a reader. The operator arrives, consumes the report, and leaves — the vending machine model. Passage transforms the pipeline's output into a surface the operator rejoins. The brief is not a report; it's a place where the current becomes visible. The synthesis is not a newsletter; it's a pattern that emerged from the corpus the pipeline holds.

---

## WHAT THIS DOCUMENT DOES NOT OWN

- **Implementation details.** Code paths, file locations, API routes, model choices, cadence intervals. See `ARCHITECTURE.md` for the shared layer and product-level `ARCHITECTURE.md` files for product-specific implementation.
- **The analytical voice.** See `VOICE.md` for the universal disciplines and product-level `CEREBRO-CHARTER.md` files for character.
- **The operator context the pipeline scores against.** See `OPERATOR.md` and product-level `MANDATE.md`.
- **The live environment each product's pipeline is pointed at.** See product-level `LIVE-ENVIRONMENT.md`.
- **The interaction philosophy that shapes how pipeline output is surfaced.** See `PASSAGE.md`.
- **Product-specific cadences.** How often each stage runs, cache intervals, refresh schedules. See product-level `ARCHITECTURE.md`.

---

*Update this document when: a new stage is identified as canonical; a stage is redefined because of real implementation experience; the pipeline's relationship to Passage needs refinement; or cascading failure teaches something the document doesn't yet account for.*
