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
