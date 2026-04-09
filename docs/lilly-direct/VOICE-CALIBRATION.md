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
