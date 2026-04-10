# EXPLORE — Voice Calibration
Established: 2026-04-09 (stub)

*This document is an observation instrument, not a directive document. The directives for Explore's analytical voice live in `CEREBRO-CHARTER.md` (Explore's ranger model) and `../os/VOICE.md` (the universal OS-wide voice disciplines). This document tracks whether those directives are actually working in practice — drift detection, calibration notes, and a log of real usage sessions.*

*See `CEREBRO-CHARTER.md` for what the voice is supposed to be. See `PROMPTS.md` VOICE block for the actual implementation text. See `../os/VOICE.md` for the universal disciplines every analytical function inherits.*

---

## STATUS

**Stub.** Content accumulates with real usage. This file will stay mostly empty until Explore has been running long enough to surface actual voice drift or calibration notes.

Dispatch has a VOICE-CALIBRATION.md at `../dispatch/VOICE-CALIBRATION.md` that is also mostly empty but has the structural scaffolding. Use that as the template.

---

## WHAT THIS DOCUMENT WILL CONTAIN

As Explore accumulates real usage, this document will grow to contain:

- **Current voice directive summary.** A compressed restatement of what the ranger voice is supposed to sound like, drawn from CEREBRO-CHARTER.md. Updated when the charter updates.
- **Watch-for checklist.** Specific failure modes to watch for in Explore responses — sycophancy creeping in, station-chief authoritativeness leaking over from Dispatch, "helpful assistant" register replacing the ranger discipline, over-hedging instead of labeling confidence, etc.
- **Calibration log entries.** Dated observations from real sessions. Each entry names the drift observed, the prompt or response excerpt that revealed it, and the fix applied (usually a prompt update).

---

## HOW THIS DOCUMENT IS USED

The calibration log is read before any change to `PROMPTS.md` VOICE block or `CEREBRO-CHARTER.md`. The point is to prevent voice regressions — a change that fixes one drift often introduces another, and the log is where those trade-offs get visible.

It is also the leading indicator that a CEREBRO-CHARTER.md update is needed. When the log accumulates multiple entries about the same drift and prompt-level fixes keep failing, the charter itself probably needs a new directive.

---

## ENTRY TEMPLATE

When entries are added, each will follow this shape:

**Date.** 2026-MM-DD
**Drift observed.** What the voice did that it shouldn't have.
**Where.** Which surface (Signal, Cerebro chat, Synthesis, etc.) and which query/context triggered it.
**Excerpt.** The specific response text that revealed the drift.
**Fix applied.** What changed in PROMPTS.md or CEREBRO-CHARTER.md.
**Verification.** How the fix was confirmed to work.

---

*Update this document when: a voice drift is observed in real usage; a fix is applied; a pattern of drift reveals a charter-level gap; or during periodic voice audits (quarterly at minimum).*
