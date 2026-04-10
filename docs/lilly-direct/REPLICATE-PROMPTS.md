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

- **The aesthetic frame.** A prose paragraph describing what "a Lilly Direct image" should look like and why — tied to the engagement context (pharma, healthcare, innovation) and the themes in SYSTEM-BRIEF.md.
- **Subject prompts by category.** Reusable prompt templates for the kinds of images the gallery would need. Possible categories: healthcare environments, clinical settings, patient experience moments, scientific abstraction, pharma innovation contexts, abstract material textures tied to the theme system.
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

*Update this document when: a visual gallery surface is activated for Lilly Direct (this file transitions from scaffold to active); a new theme is added that affects image aesthetics; a prompt convention produces reliably better output and becomes canonical; or a failure mode is identified and an anti-prompt is added.*
