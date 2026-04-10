# DISPATCH — Replicate Prompts
Established: 2026-04-10

*This document is the production reference for Dispatch's image generation pipeline. It documents the art direction, prompt architecture, and production constraints that govern how generated images are produced for Dispatch's surfaces. The prompt constants live in `lib/image-gen.ts` — this document is the canonical source those constants derive from.*

*See `SYSTEM-BRIEF.md` for the themes (Mineral / Slate / Forest / Ink) and visual language that generated images must respect. See `../os/DOCTRINE.md` § Visual surfaces earn their place for the gallery discipline: every image carries signal or it doesn't ship.*

---

## PRODUCTION PIPELINE

### Platform and model

- **API:** Replicate (`https://api.replicate.com/v1`)
- **Model:** `black-forest-labs/flux-schnell` — fast, low-cost, good at abstract/painterly styles
- **Cost:** ~$0.003 per image
- **Implementation:** `lib/image-gen.ts` — prompt assembly, API calls, polling, retry logic

### Output format and quality

- **Format:** WebP — chosen for compression efficiency and broad browser support
- **Quality:** 85 (out of 100) — balances visual fidelity with file size
- **Storage:** images are downloaded from Replicate's temporary delivery URL and converted to permanent base64 data URIs via `lib/image-utils.ts`. This means **image file size directly affects payload size** in API responses, Redis cache entries, and client-side rendering. Keep images as small as they can be without visible quality loss.

### Aspect ratios

Two aspect ratios are supported in the current pipeline. These are the only ratios the `generateCardImage()` function accepts:

| Ratio | Use | Context |
|-------|-----|---------|
| **3:2** | Standard landscape | Signal cards, synthesis cards, default gallery images. Horizontal composition. Comfortable in the masonry grid at any column count. |
| **21:9** | Ultra-wide panoramic | Cinematic compositions. Used when the surface wants a hero or atmospheric image. Spans wider in the masonry grid. |

**Gallery layout note:** the gallery uses a masonry grid (CSS flexbox, responsive column count). Images flow at their natural aspect ratio within columns. Both 3:2 and 21:9 render well in this layout. If a new aspect ratio is needed, add it to the `AspectRatio` type in `lib/image-gen.ts` and update this document.

### Token and prompt budget

Flux Schnell produces best results with prompts under ~200 tokens. The current prompt assembly concatenates:
1. `GLOBAL_STYLE` (~65 tokens) — the universal visual language
2. Format hint (~10 tokens) — aspect ratio instruction
3. `SURFACE_STYLES[surface]` (~40 tokens) — surface-specific character
4. Concept/title (~10-20 tokens) — what the image evokes
5. `LAYER_PALETTES[layer]` (~15 tokens) — color shift hint

**Total: ~130-150 tokens per assembled prompt.** Room for ~50 additional tokens if a future modifier is needed. Stay under 200 total — longer prompts degrade Flux Schnell's output coherence.

---

## ART DIRECTION

### Philosophy — maximum flexibility, minimum constraint

Dispatch's gallery is the operator's creative playground. Unlike Explore (which will have a specific National Parks visual mission), Dispatch's image generation is intentionally unconstrained in subject and mood. The only constraints are **quality** and the **anti-prompts** below.

The operator wants leverage and flexibility to mix it up. No rigid aesthetic rules. The gallery should surprise, not repeat. What makes a Dispatch image is not a specific look — it's the fact that it was generated with intention, earned its place, and doesn't feel generic.

### Global style (canonical — lives in `lib/image-gen.ts`)

```
Painterly abstract. Wet-on-wet watercolor technique with visible paper
texture. Pigment bleeding organically across damp surface. Translucent
layered washes. Precise edges where color meets untouched paper. No text,
no people, no logos, no icons, no UI elements, no objects, no literal
depictions. Purely abstract — evocative, not illustrative.
```

This global style is the foundation every generated image inherits. It's abstract and painterly — not photographic, not illustrative, not literal. Surface substyles and layer palettes modify the mood within this language.

### Surface substyles (canonical — live in `lib/image-gen.ts`)

**Synthesis surface:**
```
Analytical and layered. Cool grays, soft teals, and muted slate blue.
Multiple translucent wash layers visible simultaneously — the feeling of
patterns converging. Architectural undertone — structure emerging from
fluid washes. More white paper breathing through. Measured, not expressive.
```

**Dispatch surface:**
```
Directional and decisive. Warm amber meeting cool steel. Deliberate
brushwork — confident single strokes over atmospheric washes. The feeling
of intelligence crystallizing into action. Slight asymmetric tension in
the composition. Authority without aggression.
```

### Layer palette hints (canonical — live in `lib/image-gen.ts`)

| Layer | Palette direction |
|-------|-------------------|
| Opportunity | Lean cooler — soft clinical blues and teals suggesting analytical clarity |
| Position | Lean warmer — amber and ochre suggesting decisive confidence |
| Discipline | Lean greener — muted sage and deep indigo suggesting structural evolution |
| Landscape | Stay neutral — silver grays with atmospheric depth |
| Culture | Lean earthier — raw umber, oxide, burnt sienna suggesting material honesty |

---

## ANTI-PROMPTS

Things the image generator must never produce. These are baked into `GLOBAL_STYLE` and reinforced here for any future prompt additions:

- **No text.** No words, numbers, letters, or typographic elements in generated images. Flux Schnell hallucinates text badly; suppressing it entirely is the only reliable approach.
- **No people.** No faces, hands, bodies, silhouettes. Abstract only.
- **No logos, icons, or UI elements.** Nothing that reads as interface or branding.
- **No literal depictions.** No recognizable objects, scenes, or environments. The images are evocative, not illustrative. "The feeling of intelligence crystallizing into action" — not a picture of someone having an idea.
- **No stock photography aesthetic.** Nothing that could appear on Shutterstock. If the image feels like it could be a stock photo, the prompt failed.
- **No consumer-grade brightness or saturation.** The palette is muted, material, considered. Nothing that reads as "marketing collateral."

---

## GALLERY CURATION PIPELINE

Generated images enter the gallery surface via the curation pipeline managed by `scripts/gallery-scraper.ts` and the curate API at `app/api/gallery/curate/route.ts`. The operator curates via hover actions:

| Action | What it does |
|--------|-------------|
| **Approve** (thumbs up) | Protects from auto-archiving, positive taste signal |
| **Reject** (X) | Wrong content. Remove + blocklist + teach taste to avoid this subject |
| **Low quality** | Right subject, bad execution. Remove + blocklist URL but don't penalize subject |
| **Wrong biome** | Biome misclassification (Explore-specific — not used in Dispatch currently) |

The taste filter runs via Claude Vision when enabled (`--taste` flag on the scraper). It evaluates each image against the operator's visual sensibility as expressed in the global style above.

---

## EXTENDING THE PROMPT LIBRARY

When adding new prompt variations or surface substyles:

1. **Draft the prompt text in this document first.** Version-control the prose before it enters code.
2. **Test with the current model** (`flux-schnell`). Different models respond differently to the same prompt.
3. **Verify output at both aspect ratios** (3:2 and 21:9). A prompt that works at 3:2 may produce poor composition at 21:9.
4. **Keep the assembled prompt under 200 tokens.** Measure before committing.
5. **Check WebP file size.** Base64 data URIs for a single image should be under ~100KB. If the model is producing consistently larger images, reduce the quality setting or add compression in `lib/image-utils.ts`.
6. **Commit the code change to `lib/image-gen.ts`** and reference this document in the commit message.

---

## FUTURE CONSIDERATIONS

- **Model upgrades.** Flux Schnell may be superseded by a higher-quality model at similar cost. When evaluating a replacement, test against the same prompts and compare: does the global style still produce the right feeling? Do the anti-prompts still suppress the right things?
- **Gallery-specific generation.** Currently generation only serves synthesis and dispatch surfaces (signal cards). A dedicated gallery-generation surface would need its own substyle and possibly its own aspect ratios (square 1:1 for masonry variety, vertical 2:3 for portrait compositions).
- **Theme-aware generation.** The current pipeline doesn't adapt to the active theme (Mineral / Slate / Forest / Ink). A future enhancement could adjust the layer palette hints based on the operator's active theme for tighter visual coherence.

---

*Update this document when: a new surface substyle is added; a new aspect ratio is needed; the model is upgraded or replaced; the anti-prompt list needs expansion based on observed failures; or when the global style evolves based on the operator's curatorial feedback.*
