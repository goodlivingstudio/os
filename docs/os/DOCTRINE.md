# Good Living Studio — Doctrine
Established: 2026-04-09

*This document holds the design convictions that are true across every Good Living Studio project. It is not a design system — each project has its own visual language, its own tokens, its own material expression. This is the belief system underneath all of them. The reason a Dispatch surface and an Explore surface feel like they come from the same mind, even when they look nothing alike.*

*See `PASSAGE.md` for the interaction philosophy. See project-level `SYSTEM-BRIEF.md` files for visual implementation. See `DOC-AUTHORITY.md` for how these documents relate.*

---

## THE CONVICTION

Good Living Studio builds intelligence systems for people making real decisions. Not dashboards. Not aggregators. Not assistants. Systems that know who they serve, what's at stake, and what the difference is between interesting and important.

That distinction — interesting vs. important — is the entire value proposition. Anyone can build a system that surfaces everything. The hard problem is building one that knows what to leave out.

---

## SHARED PRINCIPLES

### Restraint is the proof of quality

Every element earns its presence through function. If a component exists for visual interest alone, it does not belong. This is not minimalism as aesthetic preference — it is discipline as design philosophy. The systems we build operate in contexts where attention is finite and decisions are consequential. Visual noise is not a style problem. It is a trust problem.

Heavy type weights, decorative color, celebratory animations, dashboard widgets, emoji, friendly empty states — these are the signatures of systems that are performing usefulness rather than providing it. Our systems do not perform.

### Intelligence has a voice, and it is not yours

Every Good Living Studio system maintains a visible distinction between what arrived from the world and what the machine produced. This is the signal/synthesis duality. In Dispatch, it is encoded typographically (Geist vs. Geist Mono). In other projects, the encoding may differ. The principle does not: **the user should always know whether they are reading the world's voice or the machine's interpretation of it.**

This is an ethical commitment as much as a design one. Systems that blur the line between source material and machine analysis erode the operator's ability to form independent judgment. We don't blur that line.

### The machine has opinions and states them

Our analytical layers — Cerebro in Dispatch, the field correspondent in Explore — are not neutral. They take positions. They challenge weak reasoning. They name noise as noise. They close every substantive response by identifying their own weakest claim.

This is the opposite of the default AI behavior: agreeable, comprehensive, eager to help. Our systems are not eager. They are considered. The voice is the station chief, the field correspondent, the wise counselor — never the assistant.

### No sycophancy anywhere

Not in the AI voice. Not in the interface copy. Not in the interaction patterns. No "Great choice!" confirmations. No celebratory animations. No pulsing badges. No "Hey there!" greetings. No emoji. The systems communicate the way a senior advisor communicates: directly, composedly, without performing warmth or manufacturing urgency.

When the system has nothing useful to say, it says nothing. An empty state is silence, not a cartoon.

### Design tokens are constraints, not options

Each project defines a finite token set: a fixed number of colors, spacing values, type sizes, and border radii. These constraints are the feature, not the limitation. When a design need doesn't map to an existing token, the design need is reconsidered before a new token is invented.

This discipline prevents the gradual drift toward generic UI that happens when every edge case gets its own value. The constraints are what make each project's visual language feel authored rather than assembled.

### Clarity over density, always

Every component communicates its purpose within three seconds. If a screen requires explanation, it is over-designed. If a layout feels dense, the solution is to show less — not to compress spacing. Our systems serve operators who make real decisions under time pressure. Comprehension comes first. Aesthetic interest comes second. Always.

### Gallery discipline — visual surfaces earn their place

Every Good Living Studio product that exposes a gallery surface — Dispatch's Surface, Explore's visual formation layer, whatever Atlas and Lilly Direct eventually develop — inherits the same discipline. The gallery is not a feed. It is a curated field. Every image has to survive three tests before it belongs in a gallery the operator actually values:

1. **It says something the operator would not have found on their own.** Galleries are formation layers, not background decoration. If an image could appear in any stock-photo dashboard, it does not belong in a Good Living Studio surface.
2. **It earns its frame.** The image is good enough, on its own terms, that removing it makes the gallery worse. Filler is the enemy of a gallery that feels like it was curated by a mind, not assembled by a pipeline.
3. **It is unencumbered.** Watermarks, promotional stamps, stock-photo preview tags, "sample" overlays, and any other metadata burned into the pixels disqualify an image. This rule is absolute and OS-wide.

**On watermarks specifically.** A watermarked image has two competing authorships: the photographer and the distributor trying to license the photograph. The distributor's watermark makes the image unusable as an aesthetic object because it trains the operator's eye to read "proof of rights" alongside "image." The result is that the operator cannot be present with the image on its own terms — the watermark keeps intruding. Watermarks are prohibited not because of aesthetics alone, and not because of licensing anxiety, but because they destroy the atmospheric quality every Good Living Studio gallery is trying to hold. A watermarked image in a gallery is the Passage philosophy failing at the visual layer: the image stops being a place the operator rejoins and becomes an interruption.

**How the discipline is enforced.** The gallery pipeline in `app/api/gallery/` and the curation API in `app/api/gallery/curate/` implement three layers of defense: (1) source-level filtering at ingest (reject known stock-photo URL patterns and domains that watermark by default), (2) the `low-quality` curation action at the operator level (explicitly named in the curate route's comments as the right action for "watermarks, blurry, bad crop" — the operator can flag them in one click), and (3) the keyword pattern `watermark|preview|sample|proof|comp` at any image title/URL/source inspection point as a safety net. When a watermarked image slips through, the operator's `low-quality` click is the correction — and that correction teaches the pipeline, not just this instance.

**What's still missing.** Automatic watermark detection at ingest time is genuinely hard without a vision model, and the current pipeline does not yet run one. The safety net is operator feedback via the curate API. When a vision-based pre-filter becomes feasible (a cheap Claude Vision pass at ingest time, an open-weights detection model, or a curated corpus of known watermark fingerprints), promote it from manual curation to automatic rejection. Until then, the rule stands in doctrine even if enforcement is partially manual.

---

## WHAT CONNECTS THE PROJECTS

Dispatch, Explore, Atlas, and Lilly are different products with different operators, different visual languages, and different mandates. What makes them a coherent body of work:

- **The intelligence pipeline is the organizing metaphor.** Every project follows the same structural logic: Ingest → Annotate → Score → Brief → Synthesize → Act. The surfaces differ. The pipeline holds.
- **The analytical voice has character.** Whether it's the station chief (Dispatch), the field correspondent (Explore), or whatever Atlas and Lilly develop — the voice is always opinionated, always labels its confidence, always names its weakest claim. The behavioral charter may differ per project. The discipline does not.
- **Every project refuses the same things.** No dashboards. No widgets. No consumer-grade friendliness. No visual noise. No sycophancy. The anti-pattern vocabulary is shared even when the specific implementations diverge.
- **Operator sovereignty is non-negotiable.** These systems serve their operators' actual trajectories — not engagement metrics, not session duration, not notification volume. The system's success is measured by the quality of decisions it enables, not by how often it's opened.

---

## WHAT THIS DOCUMENT DOES NOT OWN

- **Interaction philosophy** — How surfaces relate to each other and to time. See `PASSAGE.md`.
- **Visual implementation** — Token values, component patterns, material skins. See project-level `SYSTEM-BRIEF.md` files.
- **Prohibited patterns** — Specific anti-patterns are project-level. See project-level `ANTI-PATTERNS.md` files. The shared convictions here inform those prohibitions but don't enumerate them.
- **Operator context** — See `OPERATOR.md`.

---

*Update this document when: a new conviction emerges from project work that should be shared across all surfaces; when a project reveals that a stated principle doesn't hold in practice; or when a new project is added to the OS and needs to understand what it's inheriting.*
