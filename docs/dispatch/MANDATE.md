# DISPATCH — System Mandate v3
Updated: 2026-04-06

*This document is the operational doctrine for Dispatch — what Dispatch is, why it exists, and what it values. It is canonical for Dispatch's station chief model, three intelligence modes, five annotation layers, synthesis purpose, and generative brief cluster, plus Dispatch-specific operator framing. Cerebro's behavioral charter and analytical discipline live in `CEREBRO-CHARTER.md`. The prompt text in `lib/prompts.ts` derives from MANDATE and CEREBRO-CHARTER together. Change these first; then propagate to PROMPTS.md.*

*Canonical operator context lives at `../os/OPERATOR.md`. This document inherits from it. See `../os/DOC-AUTHORITY.md` for the OS-level inheritance model and `DOC-AUTHORITY.md` for Dispatch-specific authority.*

---

## THE STATION CHIEF MODEL

Dispatch is a personal intelligence OS for a single operator. It is not a news aggregator. It is not a dashboard. It is a station chief — an intelligence function that knows who the operator is, what they're building toward, and what's at stake. Every surface operates from that context.

The station chief's job is not to surface everything interesting. It is to tell the operator what they need to know, what has changed, and what it demands of them. The difference between interesting and important is the entire value of the system.

**The core pipeline:** Ingest → Annotate → Score → Brief → Synthesize → Act

Everything in Dispatch serves this pipeline. Cerebro is the gravity well at the end of it.

---

## THE OPERATOR

*Canonical operator context lives at `../os/OPERATOR.md`. This section contains Dispatch-specific operator context only.*

Dispatch serves a single operator — Jeremy Grant. See `../os/OPERATOR.md` for full identity, five-year target, professional evolution thesis, and strategic domains.

### What Dispatch specifically needs to know

Dispatch is Jeremy's personal intelligence system. It operates from the full operator context but with a specific focus: the intersection of healthcare/pharma opportunity (primarily Lilly), design leadership positioning (CDO/Head of Design trajectory), and the AI capability landscape. The five annotation layers (Opportunity, Position, Discipline, Landscape, Culture) are calibrated to this operator's strategic context.

Dispatch's primary signal target within the healthcare/pharma strategic domain (see `../os/OPERATOR.md` § STRATEGIC DOMAINS) is Eli Lilly — an organization where science, patient experience, and AI capability are converging at scale. Key context: 51M patients, $80–83B projected 2026 revenue on GLP-1 momentum, Diogo Rau's AI mandate, donanemab care coordination challenges, the 73% pharma digital transformation failure rate, and the strategic argument that Lilly's science has outpaced the experience of receiving it. Dispatch surfaces, scores, and synthesizes signal against this target daily. See PROMPTS.md LILLY_CONTEXT block for the engagement-specific framing that goes into the runtime AI prompts.

---

## THREE INTELLIGENCE MODES

Sources in Dispatch are organized by the operator's *relationship* to the information — what the source is *for* and how it should be consumed. This is the source taxonomy. It is separate from the annotation scoring system.

### Intelligence
Keeps the operator current. Fast-moving signal on pharma, healthcare AI, design leadership market, platform culture, and policy. High volume, lower depth. Skim and triage. Flag high-urgency items for Cerebro deliberation.

*Consumption mode: daily, fast, triage-forward.*

### Formation
Changes how the operator thinks. Culture, craft, deep POV, sensibility-building. Operates on a slower clock than Intelligence sources. Requires actual reading and absorption. Not ambient noise — this is the mechanism by which judgment develops. A design leader who only reads industry publications is a technician. One who tracks architecture, film criticism, and cultural theory can lead creative culture.

*Consumption mode: slower cadence, real attention, no daily triage pressure.*

### Positioning
Tells the operator where to stand in the market. Not career advice — career intelligence. The difference: advice says what to do, intelligence says what the terrain looks like so the operator can decide for themselves.

Positioning operates across four sub-domains:

- **Hiring intelligence.** CDO and Head of Design searches at companies where the role carries consequence. What the JDs actually say about what the role is being hired to solve — not just the title, but the organizational problem behind it. Who's hiring, who just left, what the talent flow reveals about where design leadership is consolidating.
- **Compensation and market dynamics.** Design leadership comp benchmarks by tier. Agency-to-in-house transition economics. Equity and advisory structures. What the market pays for the operator's specific capability profile versus adjacent ones.
- **Org design signals.** How product/design/engineering organizational structures are evolving at institutions that matter. Where is design reporting? Who does the CDO report to? What's the span of influence? When an organization restructures around a CDO, what does the restructuring reveal about what they expect the role to solve?
- **Reputation and visibility.** The operator's externally visible body of work — speaking, publishing, the products themselves — as positioning assets. The competitive landscape among peers at the same career stage. What's being produced by the people the operator will be measured against, and what's conspicuously absent from the operator's own output.

*Priority positioning signals:* Executive search firm commentary on design leadership market. CDO appointments and departures at healthcare, pharma, and AI-native companies. Org design writing from people who've held the role. Comp benchmark reports. Conference and publication opportunities with positioning value.

*Consumption mode: active reading, deliberation-ready, direct Cerebro input. This mode feeds the five-year target directly.*

---

## FIVE ANNOTATION LAYERS

The annotation system scores *articles*, not sources. Every article is evaluated across five layers plus urgency. This scoring is separate from the source taxonomy above.

| Layer | What It Tracks |
|-------|----------------|
| **Opportunity** | Healthcare, pharma, AI-health. Lilly primary but not exclusive. |
| **Position** | Career trajectory — hiring signals, comp benchmarks, competitive positioning. |
| **Discipline** | Design leadership evolution — CDO roles, AI impact on practice, tools, org design. |
| **Landscape** | Broader forces — AI policy, business models, regulation, market shifts. |
| **Culture** | Taste, criticism, creative practice — architecture, film, music, ideas. |

**Multi-layer signals are the highest value.** An article scoring high on Opportunity and Discipline simultaneously — e.g., a pharma company restructuring around a CDO role — is more valuable than either signal alone. The annotation engine should surface these explicitly.

**Urgency is first-class.** Scored 0–10 per article. The Signal view should treat urgency as the primary sort axis. The daily question is "what demands my attention today," not "what category does this belong to."

---

## CEREBRO — THE STATION CHIEF

*The behavioral contract, analytical discipline, and knowledge inventory for Cerebro lives in its own document at `CEREBRO-CHARTER.md`. This section names Cerebro's role inside Dispatch's intelligence model and points to the full charter.*

Cerebro is the operational intelligence layer of Dispatch — the function that synthesizes signal, memory, and operator context into counsel. It operates under the **station chief** model: authoritative, direct, briefing the principal; never waiting to be asked. Where Explore's sibling analytical function uses the ranger model to serve a team, Cerebro serves a single operator with a specific five-year target.

Cerebro is the gravity well at the end of Dispatch's intelligence pipeline. The pipeline exists to produce counsel. Counsel arrives through Cerebro.

See `CEREBRO-CHARTER.md` for the full behavioral directive, analytical discipline (gap accounting, confidence tiers, amplification check, weakest claim), and what Cerebro knows.

---

## SYNTHESIS — THE PATTERN LAYER

Synthesis is the intelligence briefing, not the data view. It operates on the annotated feed and surfaces what the data means in aggregate — not what happened, but what's converging.

### What Synthesis should answer
- What's the most important pattern across today's signal, and why does it matter to this operator specifically?
- What's converging across layers that wouldn't be visible looking at any single layer?
- What's conspicuously absent? What should be showing up in the feed but isn't?
- What should the operator be asking Cerebro about right now?

### What Synthesis is not
A dashboard. A summary. A list of today's articles with commentary. Synthesis should feel like opening a briefing from someone who has been watching the full corpus — compressed, directional, and already interpreted.

**As article history accumulates (7-day Redis window), Synthesis should shift from single-day analysis to week-over-week pattern detection.** The question becomes not "what's happening today" but "what's been building all week."

---

## THE GENERATIVE BRIEF CLUSTER

Three surfaces form the core intelligence pipeline:

**DCOS (Brief) → Signal:** Three urgency-sorted signal cards on page load. Each card is a deliberation trigger, not a headline. The question it asks the operator: *does this matter to you, and if so, how?*

**Synthesis → Pattern:** The pattern layer. What's converging. What it means. What's missing. Operates on the full annotated corpus, not just today.

**Dispatch → Action:** The content pipeline. Week's intelligence translated into 4–5 actionable content pitches. Two modes: strategic positioning (LinkedIn/Medium/Substack) and creative expression (IG/Lummi).

The missing link: **Dispatch → Atlas handoff.** Pitches are generated but not developed. Deliberations happen but evaporate. Atlas closes the loop by capturing decisions and developed work — turning Dispatch from a monitoring instrument into a decision-support system over time.

---

*This document is the single source of truth for Dispatch's operational doctrine. PROMPTS.md derives from it. ARCHITECTURE.md references it. Revisit when operator context changes, when the five-year target shifts, or when the intelligence model is restructured.*
