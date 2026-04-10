# EXPLORE — Design System Generative Brief
Established: 2026-04-10

*This document is the primary context file for any AI agent generating UI components, pages, or patterns for Explore. It describes Explore's visual language, token architecture, themes, component patterns, and interaction philosophy — all calibrated to the civic/team intelligence context Explore serves (the National Design Studio's explore.gov engagement).*

*See `MANDATE.md` for what Explore is and who it serves. See `LIVE-ENVIRONMENT.md` for the political and engagement context that shapes visual decisions. See `CEREBRO-CHARTER.md` for the ranger voice that the visual language must support. See `../os/DOCTRINE.md` for the shared design convictions and `../os/PASSAGE.md` for the interaction philosophy Explore must implement.*

---

## ART DIRECTION

*In wildness is the preservation of the world.*

The visual language of Explore draws from the overwhelming, almost devotional encounter with American land — the moment a ridgeline breaks above treeline, the hour before storm light flattens a canyon into a single plane of color, the silence of old-growth forest so total it becomes a sound of its own.

This is not the outdoors as recreation. It is the outdoors as revelation.

**Scale and atmosphere over detail.** Imagery favors the vast and the enveloping — wide landscape compositions where the human figure, when present, is small, oriented away, absorbed into the scene rather than performing for the camera. We are after the feeling Thoreau described: not mastery of the land but submission to its terms.

**Light as the primary subject.** Golden hour, storm break, fog burn, alpine glow. The palette is earned from the land itself — granite grays, deep conifer, oxidized earth, glacial blue, the warm amber of late sun on sandstone. Color is never synthetic. It arrives the way it arrives in the field: slowly, then all at once.

**Romantic but never sentimental.** There is weight here. Silence. Solitude that is not loneliness but presence. The tone sits between the Hudson River School's operatic grandeur and the quiet, democratic observation of a topographic survey — monumental land rendered with documentary honesty.

**Stillness over action.** No one is mid-hike, mid-paddle, mid-summit. The compositions rest. They ask the viewer to stay, not to perform. The wilderness is not a backdrop for human ambition — it is the subject, and we are guests.

**Texture and grain are welcome.** Atmospheric haze, morning mist, the soft noise of low light. Perfection is not the goal. Authenticity is. The images should feel like memories of places that changed you — slightly dreamlike, slightly devotional, impossible to fully recall but impossible to forget.

---

## DESIGN PHILOSOPHY

### The Ranger Station

Explore's interface is a ranger station — a place where intelligence about the terrain is gathered, organized, and briefed to the team before they head out. The visual language serves this metaphor:

- **The station is calm.** No urgency theatrics. Even when policy shifts or competitive moves demand attention, the interface doesn't shout. The ranger delivers bad news with the same composure as good news. The visual register reflects this: muted, grounded, unhurried.
- **The station respects the terrain.** The visual language is earned from the land, not imposed on it. Color comes from geology and ecology, not from a brand guidelines PDF. Typography is legible and direct, not decorative. Spacing breathes the way a meadow breathes between treelines.
- **The station is always staffed.** When the team opens Explore, the briefing is already prepared. The synthesis is already written. The gallery was curated before anyone arrived. Passage applies here: this is a place you rejoin, not a place you visit.

### Signal and synthesis duality

Every surface distinguishes between what arrived from the world (articles, images, data) and what the system produced (annotations, scores, briefs, synthesis). This is the source/synthesis duality from `../os/DOCTRINE.md`, expressed in Explore's visual language through:

- **Typographic register.** Source material in one register (the reading face). System-generated interpretation in another (the intelligence face). The reader should never wonder which they're looking at.
- **Spatial separation.** Synthesis surfaces and source surfaces occupy distinct zones. They don't blend. The ranger's briefing and the raw field reports sit side by side but are never confused.
- **Attribution.** Every image in the gallery has provenance. Every claim in the synthesis has a confidence tier. The visual system encodes transparency structurally.

### Interaction philosophy: Passage

Explore implements the Passage philosophy from `../os/PASSAGE.md`. The specific commitments:

- **The gallery was curated before you opened it.** No loading spinners, no "fetching your content" states. The gallery exists in a persistent state. Opening it is rejoining something that was already happening.
- **The ranger station was already tracking the terrain.** The synthesis was generated, the feed was annotated, the watch items were checked — before the team arrived. The interface communicates this through its resting state: populated, current, ready.
- **Closing is not ending.** The system continues to ingest, annotate, and score while the team is away. When they return, the conversation picks up where it left off (30-day KV persistence). The interface should feel like re-entering a room where work was happening while you were gone.
- **Rest is valid.** Not every moment needs signal. When the feed is quiet, the interface is quiet. An empty-state gallery shows curated images, not a cartoon. An empty-state synthesis says "no new patterns detected" and means it.

---

## THE FIVE THEMES — FIVE BIOMES

Explore expresses itself through five themes, each grounded in a distinct American landscape biome. These are not decoration — they are the visual argument that America's public lands are as diverse as the people they belong to.

| Theme | Biome | Character |
|-------|-------|-----------|
| **Cascadia** | Pacific Northwest — old-growth forest, volcanic peaks, maritime fog | Deep conifer, wet stone, silver mist. The default. Quiet authority. |
| **Mesa** | Desert Southwest — sandstone, canyon, high desert | Oxidized earth, burnt sienna, dry heat. Warm, ancient, expansive. |
| **Marina** | Coastal — Atlantic and Pacific shoreline, tidal flats, barrier islands | Glacial blue, salt-bleached driftwood, morning fog. Cool, open, democratic. |
| **Prairie** | Central grasslands — tallgrass, sky-dominant horizons, agricultural geometry | Golden wheat, storm light, infinite horizon. Honest, exposed, patient. |
| **Bayou** | Gulf South — cypress swamp, moss, subtropical delta | Deep water, oxidized copper, humid green. Slow, rich, layered. |

Each theme defines semantic color slots across dark and light modes. The dark mode is the canonical expression. Light mode exists as a contextual variant — the way the land looks different at noon vs dusk, but it's the same land.

**The theme is not a toggle.** Each one shifts how the entire interface feels. Cascadia is the default — the ranger station in the Pacific Northwest, surrounded by old-growth, fog rolling in. Switching to Mesa doesn't just change colors — it changes the emotional register of the entire surface. The operator chooses the biome that matches the terrain they want to think inside.

---

## TOKEN ARCHITECTURE

### Color

Color is earned from the land. Each biome theme defines ten semantic color slots:

- `--bg-primary`, `--bg-surface`, `--bg-elevated` — depth and hierarchy
- `--text-primary`, `--text-secondary`, `--text-tertiary` — typographic weight
- `--accent-primary`, `--accent-secondary` — intelligence signal (the ranger is present)
- `--border`, `--border-subtle` — structural separation

**The accent color rule (inherited from Dispatch, adapted for Explore):** when the accent color appears, the system is present — classifying, scoring, synthesizing, or briefing. If an element uses the accent and the system isn't doing analytical work, the accent is misused.

### Typography

Two faces, two registers:

- **The reading face** — body text, source material, article content. Set in Söhne. Clean, neutral, high legibility. This is the world's voice — the operator's voice, the sources' voice, the voice of what arrived from outside.
- **The intelligence face** — ranger briefings, synthesis, annotations, Cerebro responses. Set in Söhne Mono. This is the system's voice. The typographic shift from proportional to monospace is how the reader knows the ranger is speaking.

### Spacing

Generous. The interface breathes. Spacing between elements should feel like the distance between trees in an old-growth forest — deliberate, not cramped, with room for the eye to rest. Dense information layouts are a failure mode, not a feature. If a screen feels dense, show less.

---

## WHAT EXPLORE IS NOT

- **It is not a consumer outdoor app.** No AllTrails polish, no REI catalog aesthetics, no adventure-lifestyle branding. Explore serves a federal design team building public infrastructure, not consumers planning a weekend trip.
- **It is not a government website.** No USWDS defaults, no bureaucratic form language, no ".gov looks like .gov" assumptions. Explore proves that federal design can be as rigorous, humane, and culturally resonant as the best private-sector work. That is the team's reputational goal.
- **It is not a dashboard.** No widgets, no KPI tiles, no data visualization for its own sake. Intelligence surfaces information architecture, not charts.
- **It is not Dispatch with different colors.** Dispatch serves a single operator making career decisions. Explore serves a team making civic decisions. The visual language reflects that difference: less personal intensity, more democratic composure. The ranger's calm, not the station chief's authority.

---

## AGENT INSTRUCTIONS

When generating UI for Explore:

1. **Read this document completely before writing any code.** The art direction is specific and load-bearing. Do not default to generic UI patterns.
2. **Use the Cascadia theme as the default** unless explicitly told otherwise. Cascadia is the canonical expression of Explore's visual identity.
3. **Check every element against the accent rule.** If you're using the accent color, the system should be doing analytical work at that element. If it's decorative, remove the accent.
4. **Distinguish source from synthesis typographically.** Source material in Söhne (proportional). System intelligence in Söhne Mono (monospace). No exceptions.
5. **Spacing defaults to generous.** When in doubt, add more space. Explore's interface should never feel cramped.
6. **No literal outdoor imagery in the UI itself.** The gallery curates landscape photography and generated imagery. The UI chrome is abstract and atmospheric — earned from the land's palette but never depicting it literally.
7. **Reference `../os/DOCTRINE.md`** for the shared design convictions. Restraint, craft, source/synthesis visibility, visual surfaces earning their place — all apply without exception.
8. **Check ANTI-PATTERNS.md** before finalizing any component. The civic context creates specific prohibitions that don't apply to Dispatch.

---

*Update this document when: a new theme is added; a token value changes; a component pattern is promoted or retired; an interaction decision diverges from `../os/PASSAGE.md` (in which case the divergence must be named and justified); or when a real agent-generated UI run produces something that feels wrong and reveals a gap in the brief.*
