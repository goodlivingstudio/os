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
