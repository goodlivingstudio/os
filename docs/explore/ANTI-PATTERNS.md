# EXPLORE — Anti-Patterns
Established: 2026-04-10

*This document is the stop list for Explore. It enumerates specific UI patterns, visual treatments, component behaviors, voice moves, and design decisions that are prohibited in the Explore interface. SYSTEM-BRIEF.md says what to build; this document says what to never build.*

*Universal OS-wide design convictions and the anti-patterns they imply live at `../os/DOCTRINE.md` (no dashboards, no widgets, no sycophancy, no celebratory animations, no pulsing badges, no emoji, no "Hey there!" greetings, the visual-surfaces-earn-their-place rule including the anti-watermark prohibition). Those apply to Explore without exception. This document adds Explore-specific prohibitions calibrated to the civic / federal / team context Explore serves.*

*Note: there is no separate OS-level ANTI-PATTERNS file — OS-wide prohibitions are folded into `../os/DOCTRINE.md` as the positive-and-negative expression of each shared conviction. If the project grows enough OS-wide prohibitions to justify their own file, we can promote them later.*

*See `SYSTEM-BRIEF.md` for the positive design guidance. See `../os/DOCTRINE.md` for the shared design convictions these prohibitions enforce. See `MANDATE.md` for the context that makes these prohibitions necessary.*

*Dispatch has a mature ANTI-PATTERNS at `../dispatch/ANTI-PATTERNS.md` — most of its visual and component prohibitions apply to Explore wholesale (no drop shadows, no pulsing badges, no glassmorphism, no dashboard widgets, no emoji). This document focuses on prohibitions that are SPECIFIC to Explore's civic/team context.*

---

## THE STANDARD

Every anti-pattern entry follows this shape:

**The pattern:** what it is, stated specifically enough to recognize it.
**Why it's prohibited:** what principle it violates and why that matters in Explore's context.
**What to do instead:** the positive alternative.

---

## VOICE AND REGISTER ANTI-PATTERNS

### Never sound like the Station Chief

The ranger is not the station chief. The station chief is authoritative, direct, briefing a single principal. That register feels presumptuous in a team context. The ranger is composed, knowledgeable, terrain-first — but not commanding. The ranger reports; the team decides.

**Why:** Explore serves a team. No single team member should feel like the system is giving them orders. The ranger offers intelligence, not directives.

**What to do instead:** lead with observations, not instructions. "The terrain shows..." not "You need to..." The ranger's composure is earned from knowing the terrain, not from hierarchical authority.

### Never adopt a consultant's deference

The opposite failure mode from the station chief: being too polite, too deferential, too eager to validate the team's direction. The ranger doesn't say "great question" or "that's an interesting approach." The ranger says what the terrain actually looks like.

**Why:** deference erodes trust in a civic intelligence system. The team needs to know the ranger will tell them the truth about the landscape, especially when the truth is uncomfortable (the Burgum-Gebbia tension, the accessibility failures, the political constraints).

**What to do instead:** directness without authority. Observations, evidence, confidence labels. The ranger is editorially independent — not above the team, not below them, not performing for them.

### Never create urgency that doesn't exist

The July 4, 2026 deadline creates genuine urgency on specific decisions. Everything else is at its actual severity level. The ranger never inflates the urgency of a signal to make it feel more important. If something isn't urgent, say so. "This matters but not before July 4" is a useful output.

**Why:** false urgency is noise. In a civic context with genuine political pressure and genuine deadlines, manufactured urgency wastes the team's limited attention on the wrong things.

**What to do instead:** label the time horizon explicitly (90-day vs stewardship). Reserve urgency language for signals that actually demand immediate action.

---

## VISUAL AND AESTHETIC ANTI-PATTERNS

### Never use consumer outdoor-app aesthetics

No AllTrails polish. No REI catalog photography. No adventure-lifestyle branding. No trail-rating cards. No "find your next adventure" language. Explore is a civic intelligence system for a federal design team, not a consumer product for weekend hikers.

**Why:** consumer outdoor aesthetics signal recreation. Explore's visual language signals revelation. The difference is the entire art direction (see SYSTEM-BRIEF.md § ART DIRECTION). A UI element that could live in AllTrails fails the Explore test.

**What to do instead:** earn the palette from the land (granite gray, deep conifer, oxidized earth). Scale and atmosphere over detail. Stillness over action. The images should feel like memories of places that changed you.

### Never default to government-website aesthetics

No USWDS out-of-the-box appearance. No blue-header-white-body federal template. No Times New Roman fallback. No form-heavy bureaucratic patterns. Explore exists to prove that federal design can be as rigorous, humane, and culturally resonant as the best private-sector work.

**Why:** the team's reputational goal is to establish that government design can lead, not follow. A design system that defaults to the standard federal template undermines that argument before the team ships a single pixel.

**What to do instead:** meet WCAG 2.1 AA accessibility standards rigorously (non-negotiable, given NDS's prior audit failures) while expressing a visual language that is distinctly Explore — biome themes, the Ranger Station calm, the land-earned palette.

### Never use color synthetically

No neon accents. No gradient backgrounds. No color that could not plausibly be found in the American landscape. Explore's palette is earned from geology and ecology: granite, conifer, oxidized earth, glacial blue, sandstone amber. Color is never decorative.

**Why:** synthetic color breaks the connection between the interface and the land it serves. The biome themes (Cascadia, Mesa, Marina, Prairie, Bayou) are grounded in real places. The colors should feel like they come from the field, not from a brand guidelines PDF.

**What to do instead:** use the semantic color slots defined in SYSTEM-BRIEF.md. When a new color is needed, ask: where in the American landscape does this color occur?

---

## TEAM-CONTEXT ANTI-PATTERNS

### Never assume a single user

No "your feed." No "your preferences." No individual personalization. No single-user authentication gating. Explore serves a team — all members see the same intelligence feed, the same synthesis, the same gallery. The ranger briefs everyone equally.

**Why:** individual personalization fragments the team's shared context. If different team members see different signal, they arrive at meetings with different intelligence baselines. That defeats the purpose of a shared intelligence system.

**What to do instead:** "the feed" not "your feed." Shared state, shared context, equal service. If individual members want to explore different angles, Cerebro (the ranger) handles that in conversation — not in the feed itself.

### Never create hierarchy in the intelligence

No "admin" views. No "lead" dashboards. No stratified access. Every team member gets the same intelligence at the same depth. The ranger doesn't brief the project lead more thoroughly than the junior designer.

**Why:** this is a civic intelligence system. Equal access to intelligence is a design principle, not just an access-control decision. If the system privileges some voices over others, it replicates the power dynamics the team is trying to navigate — rather than providing an independent intelligence layer that holds everyone accountable to the same evidence.

---

## GALLERY ANTI-PATTERNS

### Never include extractive outdoor imagery

No gear-focused photography. No brand-sponsored expedition content. No mountain-as-backdrop-for-human-achievement shots. No influencer-style adventure content. No images where the human figure dominates the landscape.

**Why:** Explore's gallery is about the land as revelation, not the land as backdrop. The human figure, when present, should be small, oriented away, absorbed into the scene. The wilderness is the subject, and we are guests (see SYSTEM-BRIEF.md § ART DIRECTION).

**What to do instead:** the taste prompt in `lib/config/explore.ts` defines the curatorial eye. Images score 4-5 (gallery-worthy) when they produce atmosphere, emotional pull, and the feeling of being undone by scale. They score 1-3 (rejected) when they feel like stock photography, Instagram grids, or technical exercises.

### Never include watermarked, AI-generated, or stock images

Watermarks destroy the atmospheric quality the gallery holds. AI-generated landscape imagery currently fails the authenticity test (texture and grain are welcome; synthetic perfection is not). Stock photography by definition lacks the specificity Explore requires.

**Why:** per `../os/DOCTRINE.md` § Visual surfaces earn their place — every image carries signal or it doesn't ship. Watermarks, AI artifacts, and stock aesthetics are the three fastest ways to erode the gallery's credibility.

---

## ACCESSIBILITY ANTI-PATTERNS

### Never ship without WCAG 2.1 AA compliance

Given NDS's prior accessibility failures (SafeDC.gov, TrumpCard.gov, TrumpRx.gov all failed independent WCAG audits), accessibility compliance is not a stretch goal for Explore — it is a hard requirement and a reputational necessity. Every component, every page, every interaction must meet WCAG 2.1 AA at minimum.

**Why:** Section 508 compliance is federal law. NDS has already been publicly criticized for accessibility failures. Explore's credibility depends on getting this right — not as a checkbox, but as a demonstration that civic design can be both beautiful and accessible.

**What to do instead:** test every component against WCAG 2.1 AA before shipping. Color contrast ratios, keyboard navigation, screen reader compatibility, focus management, alt text for gallery images. Treat accessibility audits as release-blocking, not post-launch cleanup.

---

*Update this document when: a new anti-pattern is identified during design review; a pattern proposed by an AI agent is rejected; a pattern in SYSTEM-BRIEF.md needs the corresponding prohibition made explicit here; or when a shared OS prohibition needs to be promoted to `../os/DOCTRINE.md`.*
