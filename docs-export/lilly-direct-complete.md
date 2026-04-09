# Lilly Direct — Complete Product Documentation Export
Generated: 2026-04-09


================================================================
## FILE: docs/lilly-direct/MANDATE.md
================================================================

# LILLY DIRECT — System Mandate v0 (scaffold)
Established: 2026-04-10 (scaffold — content lands at kickoff)

*This document is the operational doctrine for Lilly Direct — what the product is, why it exists, who it serves, and what it values. It is canonical for Lilly Direct's engagement framing, intelligence modes, annotation layers, Cerebro behavioral character, and the generative brief cluster. The prompt text in `lib/prompts.ts` derives from this document via the config in `lib/config/lilly-direct.ts`. Change this first; then propagate to PROMPTS.md.*

*Canonical operator context lives at `../os/OPERATOR.md` — Jeremy Grant, Senior Design Director, five-year target, professional evolution thesis, and active engagements (Lilly is one of them). This document owns the Lilly-specific framing: what the engagement demands, how Lilly Direct scores signal against it, and what it produces.*

---

## STATUS

**Scaffold.** Content lands during the kickoff session 2026-04-10. Until then, this file is a structural placeholder matching the canonical 14-file product doc set shape defined at `../os/DOC-AUTHORITY.md`. Dispatch's `MANDATE.md` is the closest template — it serves a single operator and uses the Station Chief voice character. Explore's `MANDATE.md` is the alternative template — it serves a team and uses the Field Correspondent voice character. Lilly Direct's mandate will draw from one or both, or develop something new specific to the engagement.

---

## WHAT THIS DOCUMENT WILL OWN

When written at kickoff, MANDATE.md will contain:

- **§ THE LILLY DIRECT MODEL** — the one-paragraph statement of what this product is (compare: Dispatch's "station chief for a single operator," Explore's "field desk for a design team"). Whatever Lilly Direct calls its model, this section names it.
- **§ THE ENGAGEMENT** — what the Lilly innovation team engagement actually is, who the stakeholders are, what the strategic relationship with Laree Ross looks like, what Lilly Direct is being built to do for this engagement specifically.
- **§ THE OPERATOR'S POSITION** — Dispatch-style framing of what Jeremy brings, how the engagement fits his five-year target, and what Lilly Direct needs to help him deliver.
- **§ THE INTELLIGENCE MODEL** — how Lilly Direct consumes signal. Likely a modes framework (Dispatch uses Intelligence / Formation / Positioning; Explore uses its own) and a layer taxonomy (Dispatch's Opportunity/Position/Discipline/Landscape/Culture is calibrated to personal intelligence; Explore's is calibrated to civic intelligence; Lilly Direct will define its own — probably something like Therapeutic / Regulatory / Digital / Organizational / Competitive per the current scaffold placeholder).
- **§ CEREBRO CHARACTER** — the voice character Lilly Direct's analytical function uses. See `CEREBRO-CHARTER.md` for the full behavioral contract; this section names the character and says why.
- **§ SYNTHESIS PURPOSE** — what synthesis produces for this engagement. Weekly? Pre-meeting? Per-deliverable? TBD at kickoff.
- **§ THE GENERATIVE BRIEF CLUSTER** — how Lilly Direct's surfaces translate intelligence into deliverables for the engagement.
- **§ WHAT LILLY DIRECT IS NOT** — the boundaries. Not a Lilly internal tool. Not a clinical intelligence system. Not a general pharma aggregator. Probably some other negations specific to the engagement.

---

## WHY THIS DOCUMENT EXISTS

MANDATE.md is the single source of truth for what the product is. PROMPTS.md derives from it. ARCHITECTURE.md references it. Every future session opening the Lilly Direct codebase should be able to read this file and know what the product is for in under five minutes. The scaffold placeholder is a structural commitment that this file matters; the kickoff session gives it content.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **What is Lilly Direct one sentence?** Not the codebase tagline — the mandate-level description. "A _____ for _____ that produces _____." Fill in the blanks before writing anything else.
2. **Who is the operator's counterpart at Lilly?** Laree Ross is the strategic relationship, but is she the primary user of Lilly Direct's output, or does the output serve a broader Lilly innovation team audience?
3. **What does Lilly Direct produce that the engagement needs?** Weekly briefs? Meeting prep? Pre-deliverable synthesis? Long-form strategic memos? Some combination? This shapes the Act stage of the pipeline (§ PIPELINE.md in OS).
4. **What is the voice character?** Station Chief (inherited from Dispatch) feels wrong for a client engagement — too direct, too personal. Field Correspondent (inherited from Explore) might be closer — editorially independent, writing for a specific audience that has to act on the intelligence. Or Lilly Direct may need a new character entirely — "Innovation Desk" or "Engagement Analyst" or something else that reflects a client-service context without becoming consulting.
5. **What is the layer taxonomy?** The scaffold placeholder uses Therapeutic / Regulatory / Digital / Organizational / Competitive. Is that right, or does the engagement need different layers? The layers should be calibrated to the questions the engagement actually asks, not to generic pharma taxonomy.
6. **What's the competitive landscape Lilly Direct tracks?** Novo Nordisk is the obvious GLP-1 counterpart. Pfizer, Sanofi, BMS, Roche, Merck — which specifically belong in the active signal feed?
7. **What does "win" look like for this engagement?** The five-year target in `../os/OPERATOR.md` frames Jeremy's macro goal. What does Lilly Direct specifically have to do to contribute to that?
8. **How does Lilly Direct hand off to Atlas?** Atlas (when it resumes) is the decision-capture layer for the whole OS. Engagement decisions, developed positions, and deliverables that compound over time belong in Atlas. What's the handoff point?

---

*Update this document when: the engagement scope shifts materially; a new stakeholder enters; a deliverable rhythm changes; the voice character evolves based on real usage; or when the strategic argument Lilly Direct is making on the operator's behalf needs to be updated.*


================================================================
## FILE: docs/lilly-direct/CEREBRO-CHARTER.md
================================================================

# LILLY DIRECT — Cerebro Charter (scaffold)
Established: 2026-04-10 (scaffold — character lands at kickoff)

*This document defines the behavioral contract for Lilly Direct's analytical function — what character it carries, how it reasons, and what it refuses to do. It is canonical for Lilly Direct's voice character, analytical discipline expression, and what the function knows. PROMPTS.md derives from this document for the VOICE block.*

*Read MANDATE.md and LIVE-ENVIRONMENT.md before this document. This charter assumes full familiarity with both.*

*Universal analytical disciplines — gap accounting, confidence tiers, amplification check, weakest claim, lead with substance, no sycophancy, flag noise, name absence, editorial independence, tight paragraphs, density over comprehensiveness — live at `../os/VOICE.md` and apply to Lilly Direct without exception. This document describes the product-specific CHARACTER that expresses those disciplines.*

---

## STATUS

**Scaffold.** Voice character lands at kickoff. Until then, Lilly Direct inherits the universal disciplines from `../os/VOICE.md` and uses a placeholder voice block in `lib/config/lilly-direct.ts` that references this file.

**The two existing character templates:**
- `../dispatch/CEREBRO-CHARTER.md` — Station Chief model (authoritative, direct, briefing the principal, single-operator)
- `../explore/CEREBRO-CHARTER.md` — Field Correspondent model (editorially independent, serving a team, holding engagement tensions)

Lilly Direct's character will either draw from one of these, synthesize between them, or develop something new specific to client-engagement intelligence. Do not default to copying Dispatch's character just because Dispatch was written first — the engagement context is materially different.

---

## WHAT THIS DOCUMENT WILL OWN

When written at kickoff, CEREBRO-CHARTER.md will contain:

- **§ WHAT THIS FUNCTION IS** — one paragraph naming what Lilly Direct's analytical function is, who it serves, and what it refuses to be (parallel to Dispatch's "not a chatbot" and Explore's "not a consultant" framings).
- **§ THE CHARACTER** — the named model. Station Chief if single-principal. Field Correspondent if team-serving. Something new (Innovation Desk? Engagement Analyst? Strategic Correspondent?) if neither fits. Named in one word or two. Described in a paragraph.
- **§ REGISTER AND DELIVERY** — how the voice sounds. Tone register. Sentence structure. Prose vs bullets. How responses open and close. Specific examples of good vs bad moves.
- **§ BEHAVIORAL DIRECTIVES** — the numbered directives specific to this engagement. Example patterns: "brief the engagement, not the people," "hold the Lilly internal/external tension without collapsing it," "name regulatory risk explicitly," "flag competitive moves against specific Lilly positions."
- **§ WHAT THE FUNCTION WILL NOT DO** — the anti-patterns. Example: "does not produce clinical advice," "does not substitute for Lilly internal intelligence the team has access to that Lilly Direct doesn't," "does not take sides in internal Lilly debates the team is reporting on."
- **§ WHAT THE FUNCTION KNOWS** — the data inventory. Full mandate, live environment (docs/lilly-direct/LIVE-ENVIRONMENT.md), the annotated signal feed across Lilly Direct's layers, conversation history (30-day KV persistence), web search via Exa, and anything engagement-specific (Lilly newsroom live feed, competitive pharma trade press, internal team working questions).
- **§ ANALYTICAL PROTOCOLS** — any engagement-specific checks (parallel to Explore's "Civic Design Test," "Burgum-Gebbia Frame Check," "90-day / Stewardship Split"). Example candidates: "The LillyDirect Frame Check" (does this decision optimize for direct-to-patient clarity vs institutional risk aversion), "The GLP-1 Momentum Check" (is this signal about the core revenue engine or a peripheral concern), "The Therapeutic Area Spread Check" (are we over-indexing on GLP-1 at the expense of Alzheimer's, oncology, immunology).
- **§ SYNTHESIS DIRECTIVES** — what synthesis produces for this team specifically. Pre-meeting briefs? Weekly patterns? Per-therapeutic-area digests?
- **§ PUSH FORWARD** — Dispatch's convention of closing every response with three next-directions. Does Lilly Direct inherit this? Or does it use a different convention (questions to bring into the next Laree meeting, deliverables to draft, risks to track)?

---

## WHY THIS DOCUMENT EXISTS

An intelligence function that sounds wrong for its context is useless even if the analysis is correct. The Station Chief register would sound presumptuous in a client-engagement context where Jeremy is producing intelligence FOR Lilly rather than FOR himself. The Field Correspondent register is closer but still not quite right — a field correspondent reports without advocacy, and an engagement intelligence function is arguably advocating for the work's quality and coherence. This document defines the character that fits, and the universal voice disciplines are expressed through that character without distortion.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **Who is the voice addressing?** Jeremy alone (then it's closer to Dispatch's Station Chief)? The Lilly innovation team collectively (then it's closer to Explore's Field Correspondent)? Both in different contexts (then the character needs to handle both modes gracefully)?
2. **What's the relationship posture?** The Station Chief is inside the operator's intelligence service. The Field Correspondent is outside the team's decision-making. What is Lilly Direct — inside or outside Lilly? Inside or outside Jeremy's own practice?
3. **What specific moves does the character make that the existing two don't?** If the answer is "none," then one of the existing characters probably fits. If there's at least one move that neither Station Chief nor Field Correspondent makes correctly, that move defines what's new about Lilly Direct's character.
4. **What does the character refuse to do that's engagement-specific?** Every character's refusals define it as clearly as its positive moves. What does Lilly Direct refuse that Dispatch and Explore don't need to refuse?
5. **Does the character have a name?** Station Chief and Field Correspondent are both strong specific nouns. What's Lilly Direct's? If you can't name it in one or two words, the character probably isn't defined yet.

---

*Update this document when: the engagement's scope changes materially; a new behavioral pattern emerges in real usage that should be codified; a directive stops working and needs revision; or when real Lilly Direct responses reveal a gap between what the character should be and what it is.*


================================================================
## FILE: docs/lilly-direct/SYSTEM-BRIEF.md
================================================================

# LILLY DIRECT — Design System Generative Brief (scaffold)
Established: 2026-04-10 (scaffold — content lands at kickoff)

*This document is the primary context file for any AI agent generating UI components, pages, or patterns for Lilly Direct. When written, it will describe the visual language, token architecture, material skins, component patterns, and interaction philosophy for Lilly Direct — all calibrated to the Eli Lilly engagement context and implementing the OS-level interaction philosophy defined at `../os/PASSAGE.md`.*

*Read MANDATE.md and CEREBRO-CHARTER.md before this document. The visual language must support the voice character and the engagement purpose.*

*OS-level design convictions (restraint as proof of quality, craft is non-negotiable, source and synthesis stay visible, visual surfaces earn their place, analytical voice in service of the mandate, design systems are governance, clarity over density) live at `../os/DOCTRINE.md` and apply without exception. This document describes the product-specific EXPRESSION of those convictions.*

---

## STATUS

**Scaffold.** Content lands at kickoff. Dispatch's `SYSTEM-BRIEF.md` and Explore's `SYSTEM-BRIEF.md` are the two existing templates — Dispatch's is mature, Explore's is itself a scaffold.

The scaffold placeholder in `lib/config/lilly-direct.ts` uses a single "clinical" skin with a vermillion dot matching Dispatch's ink color. This is a deliberate placeholder — Lilly Direct's real material language needs its own argument and probably its own color system. The placeholder exists so the instance boots, not because vermillion is correct for this engagement.

---

## WHAT THIS DOCUMENT WILL OWN

When written at kickoff, SYSTEM-BRIEF.md will contain the same sections Dispatch's SYSTEM-BRIEF does, rigorously calibrated to Lilly Direct:

- **§ 1 — What Lilly Direct Is** (visual boundaries, the "not a dashboard" framing, what it refuses to look like)
- **§ 2 — Design Philosophy** including an Interaction Philosophy: Passage subsection translating `../os/PASSAGE.md` into Lilly Direct-specific commitments. The passage philosophy must hold even inside a client engagement context — the engagement does not pause when Jeremy closes the product
- **§ 3 — Core Design Principles** (the product-specific expression of OS doctrine)
- **§ 4 — Token Architecture** (color, typography, spacing, radius — probably narrower than Dispatch's multi-skin system, probably more institutional than Explore's regional skins, TBD)
- **§ 5 — Material Skins** (the argument for one vs many skins. Dispatch has one ("ink"). Explore has five (regional biomes). Lilly Direct may want one clinical-appropriate skin, or a small set of skins that reflect engagement phases (pre-kickoff / active / post-deliverable), or skins per therapeutic area. Decide at kickoff.)
- **§ 6 — Component Patterns**
- **§ 7 — Lilly Direct's Character in the Interface** (how the voice character shows up visually)
- **§ 8 — What This System Is Not** (the anti-aesthetics)
- **§ 9 — Agent Instructions** (for AI generating Lilly Direct UI)

---

## KEY QUESTIONS BEFORE WRITING

Lilly Direct's visual language has implications Dispatch and Explore don't share, because the engagement is a client-facing intelligence surface that may be shared with Lilly stakeholders at some point:

1. **Does this product ever get shown to Lilly?** If yes, the visual language needs to feel appropriate in a pharma innovation-team context. Not "corporate pharma" — Jeremy's brand matters — but legible inside that context. If no, it's Jeremy's personal engagement tool and can look however serves him best.
2. **What does "clinical without feeling clinical" mean?** The engagement is about healthcare, but Dispatch's anti-dashboard / anti-widget discipline must hold. The material language needs to feel considered without feeling corporate-pharma.
3. **How does Lilly Direct relate visually to Dispatch?** They share the same operator. Jeremy opens both. Should they feel like siblings with different accents, or like distinct instruments? The white-label architecture supports either answer.
4. **What's the restraint argument here?** Dispatch's restraint is grounded in the Wise Counselor voice — nothing that would feel out of place in a room where serious decisions are being made. Explore's restraint is grounded in civic legibility. What grounds Lilly Direct's restraint?
5. **Does Lilly Direct have a gallery surface?** The scaffold config leaves gallery sources empty because it's not yet decided. If yes, the gallery discipline from `../os/DOCTRINE.md § Visual surfaces earn their place` applies — and the gallery needs its own curatorial argument (is it visual references for pharma innovation? patient experience imagery? something else?).

---

## WHY THIS DOCUMENT EXISTS

Without a written SYSTEM-BRIEF, any AI agent asked to generate UI for Lilly Direct will default to generic patterns. The brief is the context that makes agent-generated UI feel authored rather than assembled. Dispatch's brief took multiple iterations to reach its current state. Lilly Direct has the opportunity to write the brief before substantial UI exists, which means the code can inherit from the doctrine rather than being retrofitted to it.

---

*Update this document when: a new material skin is added; a token value changes; a component pattern is promoted or retired; an interaction decision diverges from `../os/PASSAGE.md` (in which case the divergence must be named and justified); or when a real agent-generated UI run produces something that feels wrong and reveals a gap in the brief.*


================================================================
## FILE: docs/lilly-direct/ARCHITECTURE.md
================================================================

# LILLY DIRECT — Architecture (scaffold)
Established: 2026-04-10 (scaffold — content lands at kickoff)

*This document is canonical for how Lilly Direct is built — tech stack, API routes, data flow, surface inventory, AI surface specifications, and infrastructure. It describes Lilly Direct-specific architectural decisions sitting on top of the shared OS foundation at `../os/ARCHITECTURE.md`.*

*Read `../os/ARCHITECTURE.md` first to understand the white-label pattern, the instance loader, the shared API routes, and the boot sequence. This document only covers what's different or specific about Lilly Direct.*

---

## STATUS

**Scaffold.** Lilly Direct runs as instance `lilly-direct` from the shared OS codebase as of 2026-04-10. The instance boots cleanly on dev port 3003 via `npm run dev:lilly-direct` or `NEXT_PUBLIC_INSTANCE=lilly-direct next dev -p 3003`. Content is placeholder — the config file at `lib/config/lilly-direct.ts` satisfies the `InstanceConfig` interface with stub values so types resolve and the shared infrastructure adapts correctly. Real architectural decisions (beyond "it runs") happen at kickoff.

Dispatch's `ARCHITECTURE.md` is the closest template — it's mature and describes a single-operator intelligence system running on the shared OS. Explore's `ARCHITECTURE.md` is itself a scaffold.

---

## WHAT THIS DOCUMENT WILL OWN

When written, ARCHITECTURE.md will describe:

- **§ Shared foundation** — what Lilly Direct inherits unmodified from OS (Next.js 16, React 19, TypeScript, Anthropic Claude via `@anthropic-ai/sdk`, Vercel KV for conversation memory and article cache, the shared API routes for news/annotate/brief/chat/synthesis, the lib/config/ white-label pattern, instance ID prefixing on all storage keys).
- **§ Lilly Direct-specific instance config** — how `lib/config/lilly-direct.ts` differs from dispatch.ts and explore.ts. Mandate content, layer taxonomy, source list, branding, skins, any optional feature flags.
- **§ Surface inventory** — which of the shared surfaces Lilly Direct exposes (Signal feed? Cerebro chat? Synthesis? Gallery? Audio brief? Dispatch-style content pipeline?) and which it omits. Not every product needs every surface, and Lilly Direct's client-engagement context may argue for surfacing less than Dispatch does by default.
- **§ Engagement-specific data flow** — how signal flows through the pipeline for this product. Where does it diverge from the shared pattern? Any additional filters, annotation rules, or caching behaviors specific to pharma intelligence? Any additional KV keys or deployment-specific state?
- **§ AI surface specifications** — which Claude model each surface uses (inherited defaults unless a surface genuinely needs a different model), context window strategy, and how the voice character from `CEREBRO-CHARTER.md` gets enforced at the prompt assembly layer.
- **§ Deployment topology** — where Lilly Direct deploys. Vercel project naming. Domain (`lilly.goodliving.studio` per the placeholder config, or a client-owned domain, or nothing public-facing at all if it's a private tool). Environment variables beyond the shared set.
- **§ Known divergences from the shared OS** — any place Lilly Direct has forked shared behavior for engagement-specific needs. Flagged explicitly so the divergence can be revisited later (either promoted back into shared code if another product needs the same behavior, or kept as an intentional fork).
- **§ Confidentiality and data handling** — does the engagement impose any constraints on how Lilly Direct handles signal data? Client-sensitive intelligence, embargoed information, internal Lilly context — what's in scope and what's not? This section may not exist if the engagement doesn't impose constraints beyond normal operating practice.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **Which surfaces does Lilly Direct expose?** Dispatch has 6-8 surfaces (Signal, Audio, Synthesis, Surface/Gallery, Cerebro, Config, Dispatch/Content, sometimes Weekly). Lilly Direct probably doesn't need all of them. Which are load-bearing for the engagement?
2. **Does Lilly Direct deploy publicly?** If yes, to what domain? Client-owned, studio-owned, or behind-a-login? If no, is it a local-only tool, or a private Vercel project Jeremy accesses via an internal URL?
3. **Any confidentiality constraints on the intelligence?** If Jeremy is handling non-public Lilly context in the mandate or the source list, the architecture needs to treat that data carefully. Specifically: does Cerebro's web search (Exa) need to be restricted for this instance? Does the article cache need a shorter TTL? Does the KV session persistence need additional encryption?
4. **Does it use Vercel KV at all?** The shared default is yes. But if this product is a pre-meeting intelligence tool rather than a persistent conversation partner, maybe conversation persistence isn't needed — and simpler is better.
5. **What's the engagement's cadence?** Weekly pre-meeting briefs (synthesis runs on a weekly schedule)? Continuous (same as Dispatch's daily cadence)? Project-milestone-triggered? The cadence shapes whether the pipeline is background-continuous or operator-triggered.

---

## WHY THIS DOCUMENT EXISTS

The shared OS architecture handles the general case. Every product-specific architecture doc exists to name the product's specific decisions on top of that foundation. Without this document, a future session reading Lilly Direct's code would have to reconstruct the architectural intent from the source — expensive, error-prone, drifts over time. Writing this at kickoff (ahead of substantial product-specific code) means the code inherits from the doctrine rather than being retrofitted to it.

---

*Update this document when: a new API route is added or a shared route is forked for Lilly Direct-specific behavior; a deployment target changes; a new AI surface is added or retired; infrastructure is upgraded; confidentiality constraints change; or when a reviewer reading the code disagrees with what this doc says.*


================================================================
## FILE: docs/lilly-direct/PROMPTS.md
================================================================

# LILLY DIRECT — Prompt Architecture (scaffold)
Established: 2026-04-10 (scaffold — prompts land at kickoff)

*This document contains the copyable prompt text for Lilly Direct's surfaces, derived from MANDATE.md and CEREBRO-CHARTER.md. The assembled preamble flows into `lib/config/lilly-direct.ts` via the `mandate.operator`, `mandate.clientContext`, `mandate.voice`, and `mandate.sourceModes` blocks, and from there into `lib/prompts.ts` as part of `INSTANCE_PREAMBLE`.*

*Authority: PROMPTS.md is the canonical home for all copyable prompt text. The OPERATOR block derives from `../os/OPERATOR.md`. The CLIENT_CONTEXT block derives from LIVE-ENVIRONMENT.md. The LAYERS block derives from MANDATE.md. The VOICE block derives from CEREBRO-CHARTER.md. Surface prompts (brief, synthesis, chat, etc.) are canonical here — they exist nowhere else in copyable form. Change upstream docs first, then propagate to this file.*

---

## STATUS

**Scaffold.** No real prompts yet. The current `lib/config/lilly-direct.ts` has `[PLACEHOLDER]` strings in every mandate block that tell future sessions to look here and to the upstream docs. When this file gets written, update the config to reference canonical copy rather than inline placeholders.

Dispatch's `PROMPTS.md` is the mature template. Explore's `PROMPTS.md` is also substantial. Use both as reference patterns; Lilly Direct's prompts should inherit the universal disciplines (`../os/VOICE.md`) and express them through the character defined in `CEREBRO-CHARTER.md`.

---

## WHAT THIS DOCUMENT WILL OWN

When written, PROMPTS.md will contain:

### Context blocks (assembled into INSTANCE_PREAMBLE)

- **`OPERATOR`** — Who Jeremy is in the context of this engagement. Derives from `../os/OPERATOR.md` but with Lilly Direct-specific framing (the engagement as an active deliverable, not just an active relationship).
- **`CLIENT_CONTEXT`** — The Lilly engagement context: the innovation team, Laree Ross, the strategic argument ("Lilly's science has outpaced the experience of receiving it"), the specific intelligence questions the engagement is producing answers to. Derives from LIVE-ENVIRONMENT.md.
- **`THERAPEUTIC_LAYERS`** (or whatever Lilly Direct ends up calling its layers) — The layer taxonomy and what each layer scores. Derives from MANDATE.md § Layer taxonomy. Formatted so Claude knows what each layer measures and what a high score looks like for each.
- **`SOURCE_MODES`** — How Lilly Direct consumes different kinds of sources. Derives from MANDATE.md § Intelligence modes.
- **`VOICE`** — The behavioral contract for the analytical function. Derives from CEREBRO-CHARTER.md. This is the block that makes Lilly Direct sound like itself rather than like a generic assistant.

### Surface prompts

- **DCOS Brief / Daily or Pre-Meeting Brief** — the intelligence briefing surface. If Lilly Direct's cadence is weekly or pre-meeting rather than daily, the brief prompt reflects that.
- **Cerebro chat** — the conversational analytical function. Uses the full preamble + Cerebro-specific instructions for multi-turn engagement.
- **Annotation** — per-article relevance scoring against the layer taxonomy. Runs on Haiku for cost.
- **Synthesis** — pattern detection across the week's (or engagement phase's) annotated corpus.
- **Engagement output** — whatever Lilly Direct's Act stage produces. Probably engagement deliverables: meeting prep, stakeholder briefs, position memos. TBD at kickoff.

### Assembly pattern

- How the blocks combine into the final preamble
- The `buildPreamble(cfg)` helper in `lib/config/index.ts` is already set up for this — no new code needed, just new content

### Maintenance schedule

- When to update which blocks
- How propagation works: MANDATE → PROMPTS → `lib/config/lilly-direct.ts` → `lib/prompts.ts` (via `buildPreamble`)

---

## QUESTIONS TO ANSWER BEFORE WRITING PROMPTS

1. **Is there Lilly-internal context that should NOT go into the prompt?** Anything Jeremy has been told in confidence, any signal that's embargoed, any stakeholder name that shouldn't appear in an LLM call log. If yes, that content needs to live outside the prompt layer or be explicitly redacted before assembly.
2. **Does Cerebro need Lilly-specific knowledge beyond what the feed provides?** e.g., a background briefing on LillyDirect (the existing platform), Zepbound/Mounjaro commercial context, donanemab clinical profile — embedded in the CLIENT_CONTEXT block as operating-context background that doesn't change daily.
3. **What's the right scoring range for urgency?** Dispatch uses 0-10 with 9-10 meaning "demands attention today." Lilly Direct may want a different framing if the cadence is weekly rather than daily — 9-10 might mean "must be in the next brief" rather than "today."
4. **Does the brief prompt need a specific output format?** Dispatch produces "three urgency-sorted signal cards as deliberation triggers." Lilly Direct might produce a different shape — pre-meeting briefing memos, position-on-a-question summaries, week-over-week pattern writeups.

---

*Update this document when: a prompt change is needed; a surface is added or retired; the voice character evolves (which propagates through CEREBRO-CHARTER → VOICE block → assembled preamble); or when prompt output is drifting in a way that real calibration entries in VOICE-CALIBRATION.md are flagging.*


================================================================
## FILE: docs/lilly-direct/ANTI-PATTERNS.md
================================================================

# LILLY DIRECT — Anti-Patterns (scaffold)
Established: 2026-04-10 (scaffold — patterns land at kickoff)

*This document is the stop list for Lilly Direct. It enumerates specific UI patterns, visual treatments, component behaviors, voice moves, and design decisions that are prohibited. SYSTEM-BRIEF says what to build; this document says what to never build.*

*This document inherits from the OS-level convictions in `../os/DOCTRINE.md` and the universal voice disciplines in `../os/VOICE.md`. Those rules apply without exception. This file adds Lilly Direct-specific prohibitions calibrated to the Eli Lilly engagement context.*

*See `SYSTEM-BRIEF.md` for the positive design guidance. See `CEREBRO-CHARTER.md` for the voice character these prohibitions protect.*

---

## STATUS

**Scaffold.** Content lands at kickoff and grows over time as specific patterns get proposed and rejected. Dispatch's `../dispatch/ANTI-PATTERNS.md` is the mature template — use it as the structural pattern. Explore's `../explore/ANTI-PATTERNS.md` is also a scaffold.

---

## WHAT THIS DOCUMENT WILL OWN

When written, ANTI-PATTERNS.md will enumerate prohibited patterns organized by category. Each entry follows the same shape:

**Name of the anti-pattern.** A short sentence describing the pattern in one line.

**Why it's prohibited.** The specific harm the pattern does to Lilly Direct's purpose, voice, or the engagement relationship.

**What to do instead.** The positive alternative. If SYSTEM-BRIEF.md covers it, link there; if not, describe inline.

**Example if relevant.** Real instance from a proposal or implementation if one exists.

### Expected categories

- **Visual prohibitions.** Specific color, type, spacing, layout, and iconography decisions that are rejected. Probably includes all OS-wide prohibitions (no dashboards, no widgets, no celebratory animations, no pulsing badges, no emoji, no drop shadows for depth alone) plus engagement-specific ones.
- **Behavioral prohibitions.** Component behaviors that are rejected. Probably inherited: no auto-playing media, no infinite scroll, no interruption notifications, no recommendation carousels.
- **Voice and microcopy prohibitions.** Specific words, phrases, and tones Lilly Direct's interface must never use. Example engagement-specific candidates: no "powered by AI" language, no "insights" as a generic headline, no pharma marketing-speak, no corporate-innovation buzzwords.
- **Engagement-context prohibitions.** Patterns that might be acceptable in Dispatch or Explore but are wrong for Lilly Direct's client-facing context. Example: Dispatch's "challenge weak reasoning directly" works when Jeremy is the audience, but a client-visible surface needs to challenge framings without sounding hostile to the client.
- **Pharma-specific prohibitions.** Things the interface must never do that relate to the pharma context specifically. Example candidates: no dosing recommendations, no clinical advice language, no claims about drug efficacy, no therapeutic area comparisons that could read as biased against non-Lilly products in a way that undermines credibility, no implying endorsement of any Lilly product.
- **Confidentiality and data prohibitions.** If the engagement imposes data-handling constraints, those constraints become anti-patterns here. Example: "never include Lilly-internal stakeholder names in AI call logs," "never send embargoed trial data to Exa web search," etc.

---

## STRUCTURE EACH ENTRY FOLLOWS

```
### [Name of the pattern]
**Why prohibited:** [One paragraph on the specific harm.]
**What to do instead:** [The positive alternative, with a link to SYSTEM-BRIEF if relevant.]
**Example:** [A concrete instance, if one exists.]
```

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **What specific patterns have already been proposed for Lilly Direct that should be rejected?** If the answer is "none, we haven't started yet," then anti-patterns get added as they emerge from real design work.
2. **Which Dispatch anti-patterns apply wholesale to Lilly Direct?** Anything that applies to all three products (Dispatch, Explore, Lilly Direct) should probably be promoted to an OS-level anti-patterns file instead of duplicated here. That doesn't exist yet; if the pattern shows up, create it.
3. **What pharma-industry visual clichés must Lilly Direct refuse?** Stock-photo smiling patients, cyan gradient backgrounds, molecule-graphic decorations, "transforming lives" headlines, Big Pharma blue, anything that looks like a pharma marketing deck.
4. **What analytical voice moves would undermine the engagement relationship?** Dispatch's station chief says hard things to Jeremy directly. Lilly Direct needs to say hard things without making Lilly look like the problem — more "here's what the terrain demands" than "here's what Lilly is getting wrong."
5. **Does the engagement impose any explicit data-handling constraints that translate into interface-level rules?** e.g., "never display more than aggregate-level signal counts" or "never show raw source URLs to shared screens."

---

## WHY THIS DOCUMENT EXISTS

SYSTEM-BRIEF defines what to build. Without a corresponding stop list, the positive guidance gets interpreted permissively and drift accumulates. Anti-patterns are the forcing function that makes the positive guidance actually hold. Every anti-pattern entry also teaches future design work about what was tried and rejected, which prevents re-proposing patterns that already failed.

---

*Update this document when: a new anti-pattern is identified during design review; an AI-generated UI proposal is rejected; a voice move produces the wrong effect in real usage; or when the engagement context introduces a new constraint that translates into an interface prohibition.*


================================================================
## FILE: docs/lilly-direct/DOC-AUTHORITY.md
================================================================

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


================================================================
## FILE: docs/lilly-direct/SOURCES.md
================================================================

# LILLY DIRECT — Sources (scaffold)
Established: 2026-04-10 (scaffold — inventory lands at kickoff)

*This document is the canonical source inventory for Lilly Direct. Every source in the active feed exists here with a mode assignment, a layer assignment, a rationale, and a last-reviewed date. The `feeds`, `podcasts`, and `gallerySources` arrays in `lib/config/lilly-direct.ts` derive from this file.*

*See SOURCES-MEGALIST.md for the discovery/staging layer — candidate sources under evaluation before they earn a place in the active feed.*

---

## STATUS

**Scaffold.** The scaffold placeholder in `lib/config/lilly-direct.ts` has five minimum-viable feeds so the API returns something on first boot:

- Lilly Newsroom RSS (Therapeutic layer)
- STAT News (Therapeutic)
- Endpoints News (Regulatory)
- BioPharma Dive (Competitive)
- Fierce Healthcare (Digital)

These are five of the most reliable pharma intelligence sources, chosen because they produce usable signal from day one without requiring curation decisions. They are NOT the final source list — they are the bootstrap.

---

## WHAT THIS DOCUMENT WILL OWN

When written at kickoff, SOURCES.md will contain the complete active feed inventory. Each source entry:

```
### [Source Name]
- **URL:** [feed URL]
- **Mode:** [Intelligence / Formation / Positioning — or whatever Lilly Direct's modes are]
- **Layer:** [Therapeutic / Regulatory / Digital / Organizational / Competitive — or whatever Lilly Direct's layers are]
- **Rationale:** [One sentence on why this source belongs in the active feed for THIS engagement]
- **Last reviewed:** [YYYY-MM-DD]
```

Organized by category. Expected categories (may shift at kickoff):

- **Lilly-first sources.** Lilly Newsroom, Lilly SEC filings, Lilly investor calls transcribed, any public Lilly executive communications. Probably the smallest category but the highest signal.
- **Pharma trade press.** STAT News, Endpoints, BioPharma Dive, Fierce Pharma, Pharmaceutical Technology, PMLiVE.
- **Regulatory signal.** FDA announcements, EMA decisions, reimbursement policy (CMS, NICE, etc.), international approvals.
- **Competitive pharma.** Novo Nordisk (primary GLP-1 competitor), Pfizer, Sanofi, BMS, Roche, Merck, AbbVie.
- **Therapeutic area deep sources.** GLP-1 / metabolic, Alzheimer's / neurology, oncology, immunology. Probably one or two sources per active area.
- **Digital health and AI-pharma.** Where the intersection of Lilly Direct's mandate lives. MobiHealthNews, Rock Health commentary, specific AI-in-pharma analysts.
- **Healthcare policy and business.** HBR healthcare pieces, McKinsey Pharma & Life Sciences, Deloitte Pharma perspectives.
- **Longer-form analysis.** For Formation-mode consumption (or Lilly Direct's equivalent of Formation). In-depth healthcare systems thinking, clinical leadership commentary.

### Gap analysis section

After the inventory, a gap analysis: which annotation layers are under-represented in the current source mix? What's missing that would materially improve Lilly Direct's intelligence quality? This section feeds the SOURCES-MEGALIST.md discovery process.

### Source maintenance protocol

How often the source list gets reviewed. What triggers adding or removing a source. Who decides. (Probably Jeremy, always — but documented so the rule is explicit.)

---

## WHY THIS DOCUMENT EXISTS

The feed is the foundation of every downstream intelligence product. Bad sources → bad annotation → bad brief → bad counsel. Good sources → everything else has a chance. This document exists so every source earns its place via a stated rationale, and so the source list stays a curated object rather than drifting into an aggregator.

The distinction between SOURCES.md (active, earned-its-place) and SOURCES-MEGALIST.md (candidates, under evaluation) is load-bearing. Without that distinction, every interesting-seeming feed ends up in the active list and the list loses its coherence.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **What sources does Jeremy already use to track Lilly?** The answer is a starting point for the active inventory.
2. **What sources does the innovation team at Lilly use internally?** If accessible, those are high-signal because they tell you what signal the team is already attending to.
3. **Which competitive pharma companies matter most for this engagement?** Not all pharma companies are equally relevant to Lilly Direct. Probably Novo Nordisk (GLP-1), Pfizer (general scale), and two or three others TBD.
4. **Are there academic or clinical journals that belong in the active feed?** NEJM, JAMA, Lancet, specific therapeutic area journals. Usually too slow for Intelligence mode but may fit Formation mode.
5. **Does Lilly Direct need any non-pharma sources?** Dispatch inherits culture, design, and AI sources because Jeremy's operator profile demands them. Lilly Direct may be narrower — strictly pharma intelligence — or may need to retain some cross-cutting signal (AI-in-enterprise for the Rau mandate context, healthcare delivery for the patient experience argument, etc.).

---

*Update this document when: a source is added to the active feed (with rationale); a source is retired from the active feed (with reason); a source's mode or layer assignment changes; or during the quarterly source review.*


================================================================
## FILE: docs/lilly-direct/SOURCES-MEGALIST.md
================================================================

# LILLY DIRECT — Sources Mega List (scaffold)
Established: 2026-04-10 (scaffold — candidates land at kickoff and grow over time)

*This document is the discovery and expansion layer for Lilly Direct's source inventory. It tracks candidate sources — things that have been evaluated, surfaced, or proposed but not yet added to the active feed. Cross-reference with SOURCES.md before adding any item here to the active inventory, to avoid duplication.*

*See SOURCES.md for the canonical active feed. See LIVE-ENVIRONMENT.md for the terrain sources are expected to illuminate — the mega list exists to close gaps identified there.*

---

## STATUS

**Scaffold.** Empty at kickoff. Fills over time as Jeremy encounters interesting pharma intelligence sources that don't yet have a home. Dispatch's SOURCES-MEGALIST.md and Explore's SOURCES-MEGALIST.md are the mature templates (Explore's is especially substantial because Explore's source pool is broader).

---

## WHAT THIS DOCUMENT WILL OWN

When populated, SOURCES-MEGALIST.md contains candidate sources organized by type and annotation layer. Each entry:

```
### [Source Name]
- **URL:** [feed URL if known]
- **Proposed layer:** [which Lilly Direct layer this source would primarily serve]
- **Why consider:** [one sentence on what signal this source provides]
- **Evaluation status:** [not yet evaluated / tested / passed / failed]
- **Date added to mega list:** [YYYY-MM-DD]
```

### Expected categories

- **News & RSS candidates.** Pharma, healthcare, clinical, regulatory sources evaluated for the active feed but not yet activated. May include trial results databases, company investor communications, specific analyst blogs.
- **Podcast candidates.** Pharma industry podcasts, clinical leadership interviews, AI-in-healthcare discussions.
- **Substack and social-first candidates.** Individual analysts and commentators whose analysis quality justifies including them alongside institutional sources. These are the pharma-world equivalent of Dispatch's vanguard-thinker sources.
- **Clinical and academic sources.** Journals, preprint servers, clinical trial registries. Usually too slow for Intelligence mode but may fit Formation mode.
- **Internal Lilly sources.** If the engagement permits access to Lilly-internal intelligence feeds (permitted stakeholder communications, public investor materials, earnings call transcripts), they go here for evaluation.
- **Competitive pharma deep sources.** Beyond the primary competitors in the active feed — second-tier competitors, emerging biotechs with relevant pipelines, specific competitor-analyst commentators.
- **Gap-driven discovery.** Items added because LIVE-ENVIRONMENT.md or WATCHFILE.md identified a terrain area Lilly Direct is scoring against without a reliable source.

### Promotion protocol

Items move from the mega list to SOURCES.md only when they demonstrate they belong. Usually via:
1. A trial run in the active feed to see if the signal quality is real
2. A manual evaluation against the scoring rubric
3. A specific gap the current active feed cannot fill that this source can

### Retirement

Items that fail evaluation get marked "failed" here (kept as a record so they're not re-proposed) or removed entirely if they're never worth revisiting.

---

## WHY THIS DOCUMENT EXISTS

The active SOURCES.md is opinionated and earned. The mega list is the staging area where candidates get evaluated without committing to the active feed. This separation prevents two failure modes:

1. **Loss of candidates.** Without a mega list, promising sources get noted in a stray conversation and then lost.
2. **Source bloat in SOURCES.md.** Without a staging layer, every interesting-seeming source ends up in the active feed, which dilutes the scoring quality and drifts Lilly Direct back toward being an aggregator.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **What candidate sources are already in mind that should be captured now?** Anything Jeremy has mentally flagged as "I should track that" but hasn't acted on — capture here.
2. **Are there Lilly-internal sources the engagement may unlock access to?** Quarterly earnings materials, investor presentations, specific public stakeholder feeds that are currently only known to insiders. Capture here as "contingent on engagement access."
3. **Which therapeutic areas are currently under-represented in the scaffold placeholder's five feeds?** The placeholders are broad pharma — nothing specifically on Alzheimer's, nothing on oncology, nothing on immunology. These gaps belong here pending kickoff decisions about which areas Lilly Direct actively tracks.
4. **Is there a published list of sources Lilly's own innovation team uses?** If so, that's a high-signal starting point for the mega list (they've already done the evaluation work).

---

*Update this document when: a new candidate source is identified; a source is evaluated (pass or fail); a gap in the active feed reveals a discovery need; or before the next source review.*


================================================================
## FILE: docs/lilly-direct/LIVE-ENVIRONMENT.md
================================================================

# LILLY DIRECT — Live Environment (scaffold)
Established: 2026-04-10 (scaffold — content lands at kickoff)

*This document describes the current state of the Eli Lilly engagement environment — the changing terrain Lilly Direct's intelligence is scoring signal against. It is distinct from MANDATE.md (which describes what Lilly Direct is) and from SOURCES.md (which describes where signal comes from). The live environment is the terrain itself — what the signal is scored against.*

*See `../os/OPERATOR.md` § PRIORITY INTELLIGENCE TARGETS § Eli Lilly for the baseline Lilly engagement context (51M patients, GLP-1 momentum, Diogo Rau's AI mandate, donanemab care coordination, LillyDirect platform, the 73% pharma digital transformation failure rate, and the strategic argument that Lilly's science has outpaced the experience of receiving it). This file extends that baseline with engagement-specific, time-sensitive context that changes faster than OS-level operator context.*

---

## STATUS

**Scaffold.** Content lands at kickoff and updates near-continuously during active engagement periods. This is the document that becomes stale fastest in the Lilly Direct doc set. Expected update cadence: quarterly at minimum for stable sections, near-daily for the "active tensions" section during active engagement phases.

Explore's LIVE-ENVIRONMENT.md is the mature template — it's rich with specific stakeholder dynamics, active tensions, and time-bounded deadlines. Dispatch doesn't have a LIVE-ENVIRONMENT.md filled in yet (it's one of the stub files from last night). Use Explore's as the structural pattern.

---

## WHAT THIS DOCUMENT WILL OWN

When written at kickoff, LIVE-ENVIRONMENT.md will contain:

- **§ THE ENGAGEMENT RELATIONSHIP** — Laree Ross as the strategic counterpart. How the engagement was initiated. What it's called inside Lilly (if anything). Stakeholder dynamics within Lilly's innovation team. Access and communication rhythm.

- **§ THE LILLY CONTEXT (current)** — Time-sensitive pharma context that complements the OS-level baseline: GLP-1 commercial momentum specifically this quarter, donanemab real-world adoption pressure, LillyDirect performance data, current competitive pressure from Novo Nordisk (and their responses), any active board-level strategic decisions that are publicly known.

- **§ DIOGO RAU AND THE AI MANDATE** — Rau's "every employee engages with AI daily" mandate is cited in OPERATOR.md as the operating-context argument that makes Lilly Direct's timing feel inevitable. What's the current state of that mandate? Is it accelerating, stalling, being resisted? What public signals are visible?

- **§ THE $1B NVIDIA PARTNERSHIP** — Active operational context. Where is that partnership producing visible output? Where is it struggling? What does progress look like in the next 3-6 months?

- **§ COMPETITIVE LANDSCAPE (time-sensitive)** — Novo Nordisk's moves (Wegovy supply, new trial data, strategic pivots). Pfizer's GLP-1 pipeline (oral GLP-1 development). Any other competitor move that reshapes Lilly Direct's scoring.

- **§ REGULATORY CONTEXT** — Current FDA posture on pharma AI tools. Current reimbursement environment for GLP-1s, donanemab, other Lilly products. Any active policy debates that affect Lilly's operating environment.

- **§ ACTIVE TENSIONS** — The things that are currently unresolved and where resolution will materially change what Lilly Direct should prioritize. Example candidates: the donanemab care coordination infrastructure gap (resolving this way or that way shifts what kind of intelligence the engagement needs), the GLP-1 supply situation (resolving this way or that way shifts what the competitive landscape looks like), the Lilly innovation team's internal mandate scope (resolving one way or another shifts what Jeremy is being asked to deliver against).

- **§ ENGAGEMENT-SPECIFIC DEADLINES** — If there are deliverable dates, decision milestones, or stakeholder meetings on the near horizon, they live here. Explore has its "July 4 clock" equivalent. Lilly Direct may or may not have an equivalent forcing function.

- **§ WHAT'S CONSPICUOUSLY ABSENT** — Following the "name absence" discipline from `../os/VOICE.md`: what should be present in the Lilly environment that isn't? Reading the absences is often more important than reading the presences.

---

## WHY THIS DOCUMENT EXISTS

The layer taxonomy in MANDATE.md is HOW signal is scored. The live environment is WHAT signal is scored against. Without this document, scoring rules exist in the abstract; with it, the scoring is explicitly anchored to the real-world terrain the engagement is navigating. This makes otherwise-implicit context visible to Cerebro, to the annotation pipeline, and to any future session opening Lilly Direct's doc set.

This is also the document that tells Cerebro what to bring up unprompted. When an active tension resolves or a deadline approaches, Cerebro should surface the change without waiting to be asked. Without LIVE-ENVIRONMENT.md, Cerebro has no reference point for "what changed" detection beyond individual article signals.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **What exactly has Laree Ross described about the engagement scope?** The OS-level OPERATOR.md describes the engagement as "permalance, strategic relationship to Laree Ross" — but not what the engagement is actually asked to produce. That specificity belongs here.
2. **What's the cadence?** Weekly meetings? Monthly? Event-driven? That shapes the brief-generation rhythm and the synthesis pattern detection window.
3. **Who else at Lilly is in the room?** Laree is the primary relationship, but a broader innovation team audience may mean the intelligence has to be legible to more than one reader. That shapes both the voice character and the surface outputs.
4. **What has Jeremy already committed to deliver?** Any proposed deliverables, shared decks, working hypotheses shared with Lilly — those become part of the live environment because Lilly Direct's intelligence is now producing signal relevant to commitments that have been made.
5. **Is there a hard deadline in view?** A product launch, a board presentation, a specific meeting, a regulatory milestone — any of these create Lilly Direct's version of Explore's July 4 clock.
6. **What's the sensitivity envelope?** Are there things Jeremy knows from the engagement that cannot appear in an LLM call log or in a shared surface? Mark those explicitly so the AI layer can be structured to keep them out of prompts.

---

## UPDATE DISCIPLINE

Unlike MANDATE.md (stable doctrine) or SYSTEM-BRIEF.md (stable design decisions), LIVE-ENVIRONMENT.md is expected to drift. The rule is:

- **Read before every synthesis generation.** If the synthesis surface is running weekly, this file should be reviewed weekly and updated if the terrain has shifted.
- **Read before any major engagement communication.** Before a Laree meeting, before a Lilly stakeholder presentation — confirm the live environment notes still match reality.
- **Update the "active tensions" section whenever a tension resolves.** Track resolutions explicitly so the history of what-changed-when is legible.
- **Archive stale sections rather than deleting.** Moving resolved tensions to an "archive" section at the bottom of the file preserves the record of how the engagement evolved.

---

*Update this document when: the engagement scope changes; a stakeholder relationship shifts; an active tension resolves; a new competitor move reshapes the competitive landscape; a deadline approaches, moves, or passes; a confidentiality constraint is added or relaxed; or at least weekly during active engagement periods.*


================================================================
## FILE: docs/lilly-direct/WATCHFILE.md
================================================================

# LILLY DIRECT — Watchfile (scaffold)
Established: 2026-04-10 (scaffold — items land at kickoff)

*This document tracks active watch items — specific people, initiatives, deals, deadlines, decisions, or dynamics that Lilly Direct is monitoring in real time. Each item has a severity rating, a reason it matters, triggers that would change its severity, and an escalation protocol. It is distinct from LIVE-ENVIRONMENT.md (which describes the broader terrain) in that WATCHFILE is granular, named, and event-driven.*

*See LIVE-ENVIRONMENT.md for the broader context watch items sit inside. See CEREBRO-CHARTER.md for how the analytical function should surface watchfile items in conversation — these are the items Cerebro is authorized to bring up unprompted.*

---

## STATUS

**Scaffold.** Empty at kickoff. Items are added as specific trackable things emerge from the engagement. Explore's WATCHFILE.md is the mature template — it's structured around six active watch items with severity ratings, log format, and escalation protocols.

---

## WHAT THIS DOCUMENT WILL OWN

When populated, WATCHFILE.md contains a live, enumerated list of active watch items. Each item follows this structure:

```
### [Item Name]

**Severity:** [High / Medium / Low — or 1-5]
**Category:** [Engagement / Therapeutic / Regulatory / Competitive / Organizational]
**Why:** [One paragraph on the specific consequence if this item resolves in a given direction.]
**Triggers:** [What events would change the severity or close the item.]
**Last reviewed:** [YYYY-MM-DD]
**Related layers:** [Which of Lilly Direct's annotation layers this item lives in.]
**Notes:** [Ongoing observations as the item evolves.]
```

### Expected categories at kickoff

- **Engagement watch items.** The Lilly Direct engagement itself — milestones, contract dynamics, stakeholder changes, decision points that affect the work. Probably the highest-severity category during the first few weeks of active engagement.

- **Therapeutic area watch items.** Clinical trial outcomes, approval decisions, reimbursement events, patient population data points. Example: "Donanemab monthly infusion infrastructure — when and whether Lilly publicly addresses the care coordination gap. Severity: High. Triggers: any Lilly statement on care coordination, any real-world study publishing care coordination outcomes, any competitor launching a similar product."

- **Competitive watch items.** Specific named competitor moves. Novo Nordisk trial readouts. Pfizer oral GLP-1 development milestones. Other pharma CDO hires or internal restructures that signal strategic direction.

- **Organizational watch items.** Lilly internal signals — Rau's AI mandate progression, NVIDIA partnership visible outputs, hiring in the innovation team, any executive commentary that frames the strategic environment.

- **Regulatory watch items.** FDA actions, EMA decisions, specific policy debates affecting Lilly products.

- **Infrastructure watch items.** Things in the Lilly Direct stack itself that could force adaptation — Anthropic model changes, Vercel platform shifts, Next.js breaking changes. Low severity mostly but worth tracking.

---

## HOW THE WATCHFILE IS USED

1. **Cerebro reads WATCHFILE at session start.** The watchfile items become part of the Cerebro context. This lets Cerebro bring up watchfile changes unprompted ("The Novo Nordisk data you were watching landed this morning. Here's what it means for the Lilly competitive position.")

2. **The brief surface elevates watchfile-related signals.** When an annotated article is related to an active watch item, its score gets boosted. A low-urgency article that's actually about a high-severity watch item should rise above a high-urgency article that's unrelated to any watch item. The scoring implementation of this lives in the shared pipeline; the watchfile itself is the data.

3. **Escalation rules.** When a watch item changes severity (e.g., from Medium to High because new information landed), Cerebro should flag the change in the next session. When an item closes (resolves one way or another), Cerebro should note the resolution and what it means.

4. **Weekly review.** At least weekly, Jeremy reviews the watchfile: which items are still relevant, which have changed severity, which have closed, which new items need to be added.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **What are the three to five watch items that should be active from day one?** The scaffold is empty but there are probably obvious candidates based on the engagement context in OS OPERATOR.md.
2. **What specific Lilly deliverable dates or milestones should be watch items?** If there's a first major engagement meeting, a first deliverable, a specific decision point — those become High-severity items immediately.
3. **Which competitor moves are most consequential to track?** Every pharma competitor has things happening constantly; the watchfile should capture only the moves that would materially change what Lilly Direct prioritizes.
4. **Who are the specific named people whose public moves should auto-elevate signal?** Rau, Dave Ricks, specific R&D leaders, specific innovation team leaders — if there are 5-10 specific names whose public statements or moves should automatically become high-signal, list them here.
5. **Is there a hard "watchfile stays current" cadence?** Weekly review is the default. Daily review during active engagement phases. Explicit so the rule is followed.

---

## WHY THIS DOCUMENT EXISTS

The layer taxonomy in MANDATE.md tells Lilly Direct what kinds of signals to score. The live environment tells Lilly Direct the terrain it's scoring against. The watchfile is the instrument that translates the abstract live environment into concrete, checkable state.

Without a watchfile, Cerebro drifts into reactive mode — only answering what Jeremy asks. With a watchfile, Cerebro operates proactively: "here's what changed on the things you're watching," which is the station-chief/field-correspondent discipline made concrete.

---

*Update this document when: a new watch item is added; an existing item's severity changes; an item closes or resolves; at least weekly during active engagement periods; or whenever Cerebro brings up a watchfile-related observation that reveals the underlying item needs refinement.*


================================================================
## FILE: docs/lilly-direct/ROADMAP.md
================================================================

# LILLY DIRECT — Roadmap (scaffold)
Established: 2026-04-10

*This document tracks active work, priorities, and completed work for Lilly Direct. It is the canonical answer to "what should I build next?"*

---

## STATUS

**Scaffold → active.** As of 2026-04-10, Lilly Direct exists as a runnable scaffold with placeholder content. The roadmap below reflects the immediate post-scaffold work, prioritized for the kickoff session and the first week of active engagement.

---

## PHASE 0 — SCAFFOLD (complete)

**Done as of 2026-04-10:**

- ✅ `lib/config/lilly-direct.ts` created with valid placeholder `InstanceConfig`
- ✅ Instance registered in `lib/config/index.ts` CONFIGS map
- ✅ Entry added to `lib/config/products.ts` with status `"wip"`
- ✅ `dev:lilly-direct` and `build:lilly-direct` npm scripts added
- ✅ All 14 canonical doc files created as structural stubs at `docs/lilly-direct/`
- ✅ Instance boots on dev port 3003 and renders
- ✅ Root docs updated with Lilly Direct references

---

## PHASE 1 — KICKOFF (2026-04-10)

**Target: complete during the first engagement session.**

### Priority 1 — Voice character decision
**What:** Decide whether Lilly Direct uses Station Chief (Dispatch), Field Correspondent (Explore), or a new character. Fill in CEREBRO-CHARTER.md with the chosen model.
**Why first:** Nothing else can be written coherently until the voice is decided. MANDATE.md, PROMPTS.md, SYSTEM-BRIEF.md all depend on knowing what the analytical function sounds like.
**Acceptance:** CEREBRO-CHARTER.md has real content in § THE CHARACTER, § REGISTER AND DELIVERY, and § BEHAVIORAL DIRECTIVES. Placeholder text gone.

### Priority 2 — Layer taxonomy definition
**What:** Decide the five-ish annotation layers Lilly Direct scores against. The scaffold placeholder uses Therapeutic / Regulatory / Digital / Organizational / Competitive — may be right, may not be. Fill in MANDATE.md § Layer taxonomy with final layers and definitions.
**Why second:** The layer taxonomy drives annotation, scoring, and feed organization. It's the most engagement-specific part of the config.
**Acceptance:** MANDATE.md has real layer definitions. `lib/config/lilly-direct.ts` updated with matching layer ids, labels, descriptions, and colors.

### Priority 3 — Mandate content
**What:** Write MANDATE.md in full: THE LILLY DIRECT MODEL, THE ENGAGEMENT, THE OPERATOR'S POSITION, THE INTELLIGENCE MODEL, SYNTHESIS PURPOSE, GENERATIVE BRIEF CLUSTER, WHAT LILLY DIRECT IS NOT. Derive operator context from `../os/OPERATOR.md` rather than restating.
**Why third:** Mandate is the source of truth that PROMPTS.md and every downstream surface derives from.
**Acceptance:** MANDATE.md has no `[PLACEHOLDER]` strings. `lib/config/lilly-direct.ts` mandate blocks updated to match.

### Priority 4 — Source inventory
**What:** Populate SOURCES.md with the real feed list. Update `lib/config/lilly-direct.ts` `feeds` array to match. Start with ~10-15 sources, expand from SOURCES-MEGALIST.md as candidates earn their place.
**Why fourth:** The feed is the foundation of every downstream surface. Bad sources → bad intelligence.
**Acceptance:** SOURCES.md lists each active source with mode, layer, rationale, and last-reviewed date. Config matches.

### Priority 5 — Initial watchfile
**What:** Populate WATCHFILE.md with the three to five watch items that should be active from day one — probably engagement-relationship items, a donanemab care coordination item, and a GLP-1 competitive item at minimum.
**Why fifth:** Without a watchfile, Cerebro drifts into reactive mode. The initial watchfile makes Lilly Direct proactive from day one.
**Acceptance:** At least 3 active watch items with severity, triggers, and reasons.

### Priority 6 — Live environment
**What:** Populate LIVE-ENVIRONMENT.md with the current state of the engagement terrain. Laree Ross relationship specifics, current pharma context, active tensions.
**Why sixth:** Anchors the scoring rules to real-world state. Gets updated near-continuously thereafter.
**Acceptance:** LIVE-ENVIRONMENT.md has no placeholder sections. Dated and reviewable.

### Priority 7 — Deploy to Vercel
**What:** Create the Vercel project. Connect to the repo. Set `NEXT_PUBLIC_INSTANCE=lilly-direct`. Set secrets. Assign a domain. First deploy.
**Why seventh:** Until it's deployed, the engagement has no live surface to use. After the first six priorities are done, deployment is straightforward.
**Acceptance:** Live URL. Feed populates. Cerebro responds with Lilly Direct's voice. `lib/config/products.ts` updated with real URL and status `"production"` (or `"wip"` until content stabilizes).

---

## PHASE 2 — EARLY ENGAGEMENT (first week after kickoff)

### Content fill-in
- Complete SYSTEM-BRIEF.md with real visual language decisions
- Complete ARCHITECTURE.md with real surface inventory and deployment notes
- Complete ANTI-PATTERNS.md with the first few product-specific prohibitions
- Complete PROMPTS.md with all surface prompts in copyable form

### Watchfile growth
- Add items as they emerge from the engagement
- Retire items that have resolved
- Track escalations

### Source tuning
- Remove sources that aren't producing usable signal
- Promote candidates from SOURCES-MEGALIST.md
- Identify gaps that the current active feed can't fill

### Voice calibration
- Start VOICE-CALIBRATION.md log with real usage observations
- Note any drift between what the character is supposed to be and what it actually sounds like

---

## PHASE 3 — ONGOING

### Weekly
- Review LIVE-ENVIRONMENT.md and update active tensions
- Review WATCHFILE.md and update severity ratings
- Write any calibration entries in VOICE-CALIBRATION.md

### Monthly
- Review source performance and rotate as needed
- Audit MANDATE.md for drift against how the engagement is actually evolving
- Update ROADMAP.md with next-month priorities

### Quarterly
- Full doc set review for drift
- Check DOC-AUTHORITY.md known-drift section
- Consider promoting any Lilly Direct-specific pattern back into shared OS code if it's general

---

## OPEN QUESTIONS FOR KICKOFF

1. Does Lilly Direct need its own domain, or does it live under `lilly.goodliving.studio` (studio-owned), `dispatch.goodliving.studio/lilly` (nested), or a client-owned domain?
2. Is there anything in the engagement that requires confidentiality handling beyond normal operating practice?
3. What's the first engagement deliverable Lilly Direct is supposed to support? That deliverable should become the first WATCHFILE item and should shape the Act-stage surface inventory in ARCHITECTURE.md.
4. Does Lilly Direct need a visual surface (gallery) at all? If not, delete the gallery-related scaffold files? (Current answer: keep them scaffolded; activating or deleting is a future decision.)

---

*Update this document when: a priority lands (mark it done); a new priority emerges; a phase completes; an open question gets answered and shapes future work.*


================================================================
## FILE: docs/lilly-direct/VOICE-CALIBRATION.md
================================================================

# LILLY DIRECT — Voice Calibration (scaffold)
Established: 2026-04-10

*This document is an observation instrument, not a directive document. The directives for Lilly Direct's analytical voice live in `CEREBRO-CHARTER.md` (the product-specific character) and `../os/VOICE.md` (the universal OS-wide disciplines). This document tracks whether those directives are actually working in practice — drift detection, calibration notes, and a log of real usage sessions.*

*See CEREBRO-CHARTER.md for what the voice is supposed to be. See PROMPTS.md VOICE block for the actual implementation text. See `../os/VOICE.md` for the universal disciplines every analytical function inherits.*

---

## STATUS

**Scaffold.** Empty until Lilly Direct has real usage. This file grows entry-by-entry as Jeremy observes voice drift in real sessions and as prompts get tuned to correct the drift.

Dispatch and Explore both have VOICE-CALIBRATION.md files that are also mostly empty right now — the scaffold shape exists but entries accumulate slowly. That's correct. Voice calibration is a lagging indicator; you can't populate it until you have real responses to observe.

---

## WHAT THIS DOCUMENT WILL CONTAIN

As Lilly Direct accumulates real usage, this document will grow to contain:

### Current voice directive summary
A compressed restatement of what Lilly Direct's voice is supposed to sound like, drawn from CEREBRO-CHARTER.md. Updated when the charter updates.

### Watch-for checklist
Specific failure modes to watch for in Lilly Direct responses. Example candidates (will be refined at kickoff):
- Sycophancy creeping in despite the no-sycophancy discipline
- Station-chief authoritativeness leaking over from Dispatch if Lilly Direct uses a different character
- Pharma marketing-speak creeping in from the source material
- Hedging excessively on regulatory topics out of caution
- Providing clinical interpretation when the character explicitly rejects clinical interpretation
- Over-contextualizing with OS-level operator context instead of engagement-specific context
- Losing editorial independence when the engagement's own framing would be easier to adopt
- Producing "insights" generically rather than engagement-specific intelligence

### Calibration log entries
Dated observations from real sessions. Each entry:

```
### [YYYY-MM-DD] — [One-line summary of drift]

**Surface:** [Signal / Synthesis / Cerebro chat / Brief / etc.]
**Query or trigger:** [What was asked or what generated the output.]
**Excerpt:** [The specific response text that revealed the drift.]
**Why this is drift:** [What discipline or character commitment was violated.]
**Fix applied:** [What changed in PROMPTS.md, CEREBRO-CHARTER.md, or upstream doc.]
**Verification:** [How the fix was confirmed to work.]
```

---

## HOW THIS DOCUMENT IS USED

1. **Read before any change to PROMPTS.md VOICE block or CEREBRO-CHARTER.md.** The log tells you what past fixes introduced, what trade-offs were made, and which drifts keep recurring.

2. **Update after any voice-related fix.** If a drift was observed and a fix applied, log it here so the pattern is visible.

3. **Read when onboarding a new session to Lilly Direct.** A future session reading the product doc set should read VOICE-CALIBRATION.md alongside CEREBRO-CHARTER.md to understand not just what the voice is supposed to be, but what failure modes to actively watch for.

4. **Pattern detection.** When the log accumulates multiple entries about the same drift and prompt-level fixes keep failing, the charter itself probably needs a new directive — not another tweak to the VOICE block. The log is the leading indicator.

---

## WHY THIS DOCUMENT EXISTS

Voice is the hardest thing to get right in an analytical function and the easiest thing to drift on. A small prompt change can introduce a subtle shift that accumulates across hundreds of responses before anyone notices. A new model version can change register in ways that invisibly violate the character's commitments. A new source that writes in a particular tone can train the model toward that tone through annotation output.

Without a calibration log, voice drift is detectable only through "this feels off" moments that are hard to act on. With a log, drift becomes observable, trackable, and correctable.

This document is specifically an observation instrument — it captures what's happening, not what should happen. The directives live elsewhere. Keeping the two separate prevents the common failure mode of a calibration log silently becoming a second set of directives that contradicts the first.

---

*Update this document when: a voice drift is observed in real usage; a fix is applied; a pattern of drift reveals a charter-level gap; during periodic voice audits (quarterly at minimum); or when onboarding a future session to Lilly Direct and realizing the calibration log should have noted something that wasn't written down.*


================================================================
## FILE: docs/lilly-direct/REPLICATE-PROMPTS.md
================================================================

# LILLY DIRECT — Replicate Prompts (scaffold)
Established: 2026-04-10 (scaffold — may never activate)

*This document is reserved for image generation prompts for Lilly Direct's gallery or visual surfaces, if any exist. It is named for the Replicate platform convention but is not platform-specific — the prompts here should work across Replicate, Midjourney, Ideogram, or any equivalent image model with minor syntax adjustments.*

*See SYSTEM-BRIEF.md for the visual language that image prompts would need to respect. See `../os/DOCTRINE.md § Visual surfaces earn their place` for the OS-wide gallery discipline that applies to any visual surface.*

---

## STATUS

**Scaffold — possibly never activated.** Lilly Direct may or may not have a visual gallery surface. The scaffold config in `lib/config/lilly-direct.ts` leaves `gallerySources` as an empty array with a comment explaining the decision is deferred to kickoff. This file exists so the canonical 14-file shape is complete, but it may stay a scaffold indefinitely if Lilly Direct decides it doesn't need a visual surface.

**Decision point at kickoff:** does Lilly Direct have a visual gallery? Three options:

1. **No gallery.** Lilly Direct is text-and-data intelligence only. Delete the gallery-related scaffold files or leave them as permanent placeholders. This REPLICATE-PROMPTS.md file stays unchanged forever.

2. **Curated gallery, no generation.** Lilly Direct has a gallery surface that curates images from sources (Are.na channel, pharma visual editorial, scientific imagery) but doesn't generate new images. In that case this file stays a scaffold and the work lives in SOURCES.md (gallery sources section) and the curation pipeline.

3. **Generated gallery surface.** Lilly Direct has a visual surface that uses image generation to illustrate synthesis output, create meeting-prep visuals, or generate engagement-specific imagery. In that case this file gets populated with calibrated prompts.

The default assumption until kickoff is option 1 (no gallery) because an engagement intelligence surface is primarily a text/data product. The decision can change if the engagement reveals a specific visual need.

---

## WHAT THIS DOCUMENT WILL OWN (IF ACTIVATED)

If Lilly Direct activates a generated gallery surface, REPLICATE-PROMPTS.md will contain:

- **The aesthetic frame.** A prose paragraph describing what "a Lilly Direct image" should look like and why — tied to the engagement context (pharma, healthcare, innovation) and the material skins in SYSTEM-BRIEF.md.
- **Subject prompts by category.** Reusable prompt templates for the kinds of images the gallery would need. Possible categories: healthcare environments, clinical settings, patient experience moments, scientific abstraction, pharma innovation contexts, abstract material textures tied to the skin system.
- **Style modifiers.** Reusable fragments that can be appended to any prompt to nudge the output toward the product's aesthetic.
- **Anti-prompts.** Things the image generator must never produce in a Lilly Direct context — stock-photo smiling patients, cyan gradient medical backgrounds, molecule-graphic decoration, pharma marketing aesthetics, anything that reads as a drug advertisement, any image with a visible watermark (per `../os/DOCTRINE.md § Visual surfaces earn their place`).
- **Platform notes.** Any platform-specific syntax or parameter adjustments for Replicate / Midjourney / Ideogram.
- **Confidentiality note.** Whether image generation calls log query content in ways that could contain engagement-sensitive context. If yes, that's a constraint on what subjects the prompts can address.

---

## WHY THIS DOCUMENT EXISTS (EVEN AS A SCAFFOLD)

The canonical 14-file product doc set shape includes REPLICATE-PROMPTS.md. Every product carries every file regardless of whether that specific file will ever have content, because the shape makes products comparable and future additions discoverable. When the 50th session opens Lilly Direct's doc set and wants to know "is there a visual gallery here?", this file's status section answers that question directly — the absence of content is itself informative.

If the decision is ever revisited (Lilly Direct adds a gallery after a year of not having one), the scaffold is ready to be populated following the same pattern as Dispatch's and Explore's mature versions.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **Does Lilly Direct need any visual surface?** If the answer is "probably not," document that and move on.
2. **If yes, is it curated or generated?** Curated galleries don't need this file. Only generated galleries do.
3. **Would visible imagery in a Lilly Direct context help or hurt the engagement?** An engagement intelligence surface that has generated imagery might feel overworked compared to a clean text/data surface. Restraint argues for not adding a visual surface unless there's a specific reason.
4. **If the answer is "yes, eventually but not at kickoff,"** that's fine — leave this scaffold in place and activate it later. The canonical shape stays intact either way.

---

*Update this document when: a visual gallery surface is activated for Lilly Direct (this file transitions from scaffold to active); a new material skin is added that affects image aesthetics; a prompt convention produces reliably better output and becomes canonical; or a failure mode is identified and an anti-prompt is added.*

