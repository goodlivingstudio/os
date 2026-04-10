# DISPATCH — Replicate Prompts
Established: 2026-04-09 (stub)

*This document contains image generation prompts for Dispatch's visual / gallery surface, calibrated to Dispatch's mood, subject matter, and theme system. It is named for the Replicate platform convention but is not platform-specific — the prompts here should work across Replicate, Midjourney, Ideogram, or any equivalent image model, with minor syntax adjustments noted inline.*

*See `SYSTEM-BRIEF.md` for the themes (Mineral / Slate / Forest / Ink / Sumi / Dispatch Paper) and visual language that image prompts must respect. See `../os/DOCTRINE.md` § Restraint is the proof of quality and § Visual surfaces earn their place for the visual discipline that governs when a generated image earns its place.*

---

## STATUS

**Stub.** Content to be written. Dispatch has or will have a gallery surface — this file is reserved for the calibrated prompt library once the gallery surface is built out.

Explore has a mature REPLICATE-PROMPTS.md at `../explore/REPLICATE-PROMPTS.md` — see it for the structural template and as a reference for how a sibling product calibrates its image prompts to its own visual language.

---

## WHAT THIS DOCUMENT WILL OWN

When written, REPLICATE-PROMPTS.md will contain:

- **The aesthetic frame.** A short prose paragraph describing what "a Dispatch image" looks like and why — tied to the themes, the station chief voice, and the doctrine of restraint.
- **Subject prompts by category.** Reusable prompt templates for the kinds of images Dispatch's gallery is expected to hold. Expected categories:
  - Healthcare and pharma environments (labs, clinics, care settings, instruments)
  - Design leadership and office environments (quiet, high-stakes, not performative)
  - Architecture and urban landscapes (anchoring the Culture annotation layer)
  - Natural and material textures (tied to the theme system — mineral, ink, forest, etc.)
  - Abstract compositional studies (for the interstitial / atmospheric gallery slots)
- **Style modifiers.** Reusable fragments that can be appended to any prompt to nudge the output toward a specific theme's aesthetic (Mineral warmth, Slate coolness, Forest organic, Ink gravity, etc.).
- **Anti-prompts.** Things the image generator must never produce in a Dispatch context — consumer-grade stock photography, celebratory imagery, corporate handshakes, cartoonish abstraction, AI-hallucinated text, etc.
- **Platform notes.** Any platform-specific syntax or parameter adjustments (Replicate model versions, Midjourney `--ar` ratios, seed conventions, etc.).

---

## WHY THIS DOCUMENT EXISTS

Image generation is the most likely failure mode for Dispatch's visual discipline. A single badly-calibrated prompt will produce output that feels consumer-grade, and once that output is in the gallery it corrupts the operator's trust in the surface. This file exists so image prompts are authored with the same discipline as the system prompts — version-controlled, rationale-attached, and tied to the doctrine.

---

## QUESTIONS TO ANSWER BEFORE WRITING

1. What does the operator currently use for image generation in other contexts, and what prompt conventions are already working?
2. How does Dispatch's gallery relate conceptually to Explore's gallery — are they structural siblings with different subject matter, or genuinely different surfaces?
3. Which themes need explicit prompt calibration first (probably the current default + the two or three in active rotation)?
4. Is there a reference library of approved Dispatch imagery that can anchor "what a Dispatch image looks like"?

---

*Update this document when: a new theme is added; a prompt convention produces reliably better output and becomes canonical; a failure mode is identified and an anti-prompt is added; the image generation platform changes or gets replaced.*
