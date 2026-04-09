# OS — The Intelligence Pipeline
Established: 2026-04-09 (stub)

*This document is canonical for the shared intelligence pipeline pattern that every OS product implements. It describes the six-stage structural logic — Ingest → Annotate → Score → Brief → Synthesize → Act — and what each stage means, how each product varies its implementation, and where the pipeline lives in the shared codebase. Product-level ARCHITECTURE.md files describe the product-specific implementation details; this document describes the pattern they all inherit.*

*See `DOCTRINE.md` § "What connects the projects" where the pipeline is named as "the organizing metaphor" for every Good Living Studio product. See `ARCHITECTURE.md` for how the pipeline maps to specific API routes and code locations in the shared codebase.*

---

## STATUS

**Stub.** Content to be written. This file exists so OS's doc set includes a canonical description of the shared pipeline pattern. Currently the pattern is mentioned in DOCTRINE.md and implemented in each product's code, but has no dedicated definitional home.

---

## WHAT THIS DOCUMENT WILL OWN

When written, PIPELINE.md will describe each of the six stages in full:

### Stage 1 — Ingest
What it does: pulls raw signal into the system from configured sources (RSS feeds, podcast feeds, image sources, manual submissions). Where it lives in code. How each product varies what it ingests (Dispatch's ~27 sources vs Explore's ~75+ sources). Error handling, source failure behavior, cadence.

### Stage 2 — Annotate
What it does: applies AI-driven classification to each ingested item — the five annotation layers (Opportunity, Position, Discipline, Landscape, Culture) plus urgency. How the annotation prompts are assembled from product-specific context. How the annotation model (Claude Haiku) is chosen. Cost and latency considerations.

### Stage 3 — Score
What it does: converts annotation output into ranked signal. How urgency becomes the primary sort axis. How multi-layer signals are elevated over single-layer ones. How scoring is explicitly tied to the live environment (see product-level LIVE-ENVIRONMENT.md files). How the watchfile (product-level WATCHFILE.md) feeds score boosts.

### Stage 4 — Brief
What it does: produces the daily intelligence surface — Dispatch's DCOS brief, Explore's equivalent. Three urgency-sorted signal cards on page load in Dispatch; TBD for Explore. Each card is a deliberation trigger, not a headline. The brief surface is not a news feed; it is a question addressed to the operator.

### Stage 5 — Synthesize
What it does: surfaces patterns across the annotated corpus — what's converging, what's missing, what's building week-over-week. This is not a summary. It is interpretation. Synthesis operates on the full 7-day Redis article history, not just the current day.

### Stage 6 — Act
What it does: translates intelligence into action. For Dispatch, this is the weekly content pipeline (4–5 pitches) and Cerebro's three-direction push-forward. For Explore, this is TBD. For Atlas, it will be the decision-capture layer (Passage's sediment). For Lilly Direct, it will be engagement deliverables. Act is where intelligence stops being observation and becomes work.

---

## WHY THIS DOCUMENT EXISTS

The pipeline is named in DOCTRINE as "the organizing metaphor" for every Good Living Studio product. Without its own canonical definition, the pipeline becomes an invocation rather than a structural pattern. This file gives the pattern dignity: each stage has meaning, each stage has a canonical implementation, each stage has a place where product-specific variation is allowed and named.

It also serves as a spec for new products. When Lilly Direct kicks off Friday, the question "what does this product's pipeline look like" should be answerable by reading this file and describing Lilly's variation at each stage. Same for Atlas when it resumes.

---

## THE PIPELINE AND PASSAGE

Passage and the Pipeline are not in tension. The pipeline describes the structural movement of signal through an OS product. Passage describes the interaction philosophy the product carries while that movement happens. The pipeline is always running — that is what makes Passage true. The operator rejoins a pipeline that was already in motion. The pipeline doesn't start when the operator opens the product; it was already at stage 5 when the operator arrived.

---

## QUESTIONS TO ANSWER BEFORE WRITING

1. Are all six stages truly universal, or are some products missing a stage? (Atlas is probably weaker on Ingest and stronger on Act. Does that mean a stage is skipped, or implemented differently?)
2. Where in the shared codebase does each stage live, and where does each stage fork for product-specific behavior?
3. How does the pipeline handle manual injection (operator pins, manually-added watch items, ad-hoc queries)? Is that a seventh stage, a side-channel, or part of Ingest?
4. What's the cadence contract — how often does each stage run, for each product, and is that contract visible to the operator?

---

*Update this document when: a new stage is added (seventh stage?); a stage is redefined; a product implements a stage in a way that changes the pattern for everyone; the pipeline's relationship to Passage or DOCTRINE needs refinement.*
