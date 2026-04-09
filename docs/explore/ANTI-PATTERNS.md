# EXPLORE — Anti-Patterns
Established: 2026-04-09 (stub)

*This document is the stop list for Explore. It enumerates specific UI patterns, visual treatments, component behaviors, voice moves, and design decisions that are prohibited in the Explore interface. SYSTEM-BRIEF.md says what to build; this document says what to never build.*

*Universal OS-wide design convictions and the anti-patterns they imply live at `../os/DOCTRINE.md` (no dashboards, no widgets, no sycophancy, no celebratory animations, no pulsing badges, no emoji, no "Hey there!" greetings, the visual-surfaces-earn-their-place rule including the anti-watermark prohibition). Those apply to Explore without exception. This document adds Explore-specific prohibitions calibrated to the civic / federal / team context Explore serves.*

*Note: there is no separate `../os/ANTI-PATTERNS.md` file — OS-wide prohibitions are folded into DOCTRINE.md as the positive-and-negative expression of each shared conviction. If the project grows enough OS-wide prohibitions to justify their own file, we can promote them later.*

*See `SYSTEM-BRIEF.md` for the positive design guidance. See `../os/DOCTRINE.md` for the shared design convictions these prohibitions enforce. See `MANDATE.md` for the context that makes these prohibitions necessary.*

---

## STATUS

**Stub.** Content to be written. This file exists so Explore's doc set matches the canonical 14-file product doc set shape defined at `../os/DOC-AUTHORITY.md`.

Dispatch has a mature ANTI-PATTERNS at `../dispatch/ANTI-PATTERNS.md` — use it as the structural template. Many Dispatch anti-patterns will apply to Explore too. Universal prohibitions (the ones that should hold across every OS product) belong in `../os/DOCTRINE.md` rather than being duplicated in each product's ANTI-PATTERNS. If a Dispatch anti-pattern turns out to be universal, promote it to DOCTRINE first, then remove the duplicate from both product files.

---

## WHAT THIS DOCUMENT WILL OWN

When written, ANTI-PATTERNS.md will enumerate prohibited patterns organized by category:

- **Visual prohibitions.** Specific color, type, spacing, and layout decisions that are rejected. Examples (Dispatch-tested, likely shared): no pulsing badges, no gradient backgrounds on content cards, no emoji, no drop shadows for depth alone, no celebratory fills.
- **Behavioral prohibitions.** Component behaviors that are rejected. Examples: no auto-playing media, no infinite-scroll loading, no interruption-style notifications, no "you might also like" recommendations.
- **Voice and microcopy prohibitions.** Specific words, phrases, or tones Explore's interface must never use. The federal / civic context makes this especially load-bearing — the difference between legibility and bureaucratese is a one-word miss.
- **Civic-context-specific prohibitions.** Things that might be acceptable in a personal intelligence tool (Dispatch) but are wrong for a federal team tool. Examples to evaluate: assertiveness in the analytical voice (the field correspondent should not sound like a station chief), decoration that reads as "design studio polish" rather than "federal design legibility," any hint of consumer-grade friendliness.
- **Gallery prohibitions.** Rules about what images never appear in Explore's gallery — bad federal iconography, extractive outdoor-industry aesthetics, stock-photography hands on keyboards, cartoonish abstraction of public lands, etc.
- **Team-context prohibitions.** Explore serves a team. Single-user-assumption patterns (personalization, "your" possessives, individual authentication gating) are suspect by default.

---

## STRUCTURE EACH ENTRY WILL FOLLOW

When written, each anti-pattern entry will follow this shape (matching Dispatch's convention):

**Name of the anti-pattern.** A short sentence describing the pattern in one line.

**Why it's prohibited.** The specific harm the pattern does to Explore's purpose, voice, or operator trust.

**What to do instead.** The positive alternative. If SYSTEM-BRIEF.md covers it, link there; if not, describe inline.

**Example if relevant.** Real instance from a proposal or implementation if one exists.

---

## QUESTIONS TO ANSWER BEFORE WRITING

1. What specific patterns have already been proposed for Explore that should be rejected?
2. Which Dispatch anti-patterns apply wholesale to Explore and should be promoted to `../os/DOCTRINE.md` as shared convictions (with their implied prohibitions)?
3. Are there federal design standards (USWDS, 21st Century IDEA, Plain Language Act) that should be referenced for civic-context prohibitions?
4. What voice moves are acceptable for the station chief (Dispatch) but prohibited for the field correspondent (Explore)?
5. What gallery aesthetics should Explore reject that Dispatch might accept, and vice versa?

---

*Update this document when: a new anti-pattern is identified during design review; a pattern proposed by an AI agent is rejected; a pattern in SYSTEM-BRIEF.md needs the corresponding prohibition made explicit here.*
