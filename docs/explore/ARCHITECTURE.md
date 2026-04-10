# EXPLORE — Architecture
Established: 2026-04-10

*This document is canonical for how Explore is built — tech stack, API routes, data flow, surface inventory, AI surface specifications, and any Explore-specific infrastructure decisions. It describes decisions sitting on top of the shared OS foundation at `../os/ARCHITECTURE.md`.*

*Read `../os/ARCHITECTURE.md` first to understand the white-label pattern, the instance loader, the shared API routes, and the boot sequence. This document only covers what's different or specific about Explore.*

---

## SHARED FOUNDATION

Explore runs as a white-label instance of the OS codebase. It inherits everything described in `../os/ARCHITECTURE.md`:

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5, Turbopack dev server
- **AI:** Anthropic Claude — Sonnet for reasoning surfaces (Cerebro, synthesis, briefs), Haiku for annotation
- **Persistence:** Vercel KV — conversation memory (30-day TTL), article cache, annotation cache. All keys prefixed with `explore:` via the `kvKey()` helper.
- **Styling:** Tailwind CSS v4 with the multi-theme system
- **Search:** Exa API for Cerebro web search
- **Deployment:** Vercel project `explore`, domain `explore.goodliving.studio`

The boot sequence: `NEXT_PUBLIC_INSTANCE=explore` → `lib/config/index.ts` loads `lib/config/explore.ts` → every shared module reads from the Explore config → the surfaces render with Explore's identity, sources, layers, and voice.

---

## WHAT MAKES EXPLORE DIFFERENT

### Instance config — `lib/config/explore.ts`

Explore's config diverges from Dispatch in these key areas:

| Concern | Dispatch | Explore |
|---------|----------|---------|
| **Operator** | Single principal (Jeremy) | Team (NDS Explore team) |
| **Voice** | Station Chief | The Ranger |
| **Intelligence layers** | Opportunity / Position / Discipline / Landscape / Culture | Platform / Policy / Culture / Industry / Craft |
| **Themes** | 1 (Ink) | 5 (Cascadia, Mesa, Marina, Prairie, Bayou) |
| **Gallery biomes** | Disabled | Enabled — `features.galleryBiomes: true` |
| **Source count** | 85 (48 RSS + 37 podcasts) | ~60+ (curated for civic/public-lands intelligence) |
| **Gallery scraper** | Are.na `dispatch-zen` channel | Are.na `explore-t7o5uh83n2s` channel + 80+ scrape targets |
| **Taste prompt** | Standard curatorial filter | Extended curatorial intelligence brief calibrated to American-land visual language |

### Feature flags

Explore opts into one shared-layer feature that other instances leave off:

- **`galleryBiomes: true`** — enables biome taxonomy classification for gallery images. The gallery scraper classifies each image into biome categories (alpine, forest, desert, coastal, wetland, prairie, arctic, underwater) via keyword analysis. Gallery filter UI shows biome chips when this flag is on. This is meaningful for Explore because its gallery is American public lands imagery; it's meaningless for Dispatch (abstract painterly images don't have biomes).

The double-guard pattern applies: the flag is read at both the data layer (scraper classifies biomes only if enabled) and the UI layer (biome filter chips render only if enabled). Adding a new feature flag for Explore follows the same pattern.

### Gallery curation — the curatorial eye

Explore's gallery scraper has a specialized taste prompt (in `lib/config/explore.ts`) that serves as curatorial intelligence for Claude Vision. The prompt describes what Explore's gallery is looking for: the devotional encounter with American land, the feeling of being undone by the natural world. It explicitly rejects: stock-photo landscapes, technical-perfection-for-its-own-sake, golden hour without atmosphere, Instagram-grid compositions.

The taste prompt rates images 1-5:
- **1 (Out of scope)** — urban, commercial, UI, portraiture, watermarks, AI-generated
- **2 (Nature without feeling)** — correct ingredients, wrong result. Could be stock
- **3 (Pleasant but familiar)** — competent sunset, pretty waterfall. Nature present, wonder absent
- **4 (You feel something)** — atmosphere, not just subject matter. Something is happening
- **5 (Expand the collection)** — stops you. Demands attention. Gallery-worthy

Images scoring 4-5 are pushed to the Are.na channel. Images scoring 1-3 are filtered out. The operator curates further via the in-gallery approve/reject/low-quality actions.

---

## SURFACE INVENTORY

Explore exposes the same shared surfaces as every OS instance, adapted by config:

| Surface | Route | What it does in Explore |
|---------|-------|------------------------|
| **Signal feed** | `app/[[...view]]/page.tsx` | RSS + podcast feed annotated against Platform/Policy/Culture/Industry/Craft layers |
| **DCOS Brief** | `/api/brief` | Three urgency-sorted signal cards — the ranger's morning briefing for the team |
| **Synthesis** | `/api/synthesis` | Weekly pattern layer — what's converging across the five layers for explore.gov |
| **Cerebro** | `/api/chat` | The ranger. Conversational intelligence with web search, memory, full engagement context |
| **Gallery** | Gallery overlay | Curated American public lands imagery with biome filtering. Are.na-sourced + scraped |
| **Dispatch (Act)** | `/api/dispatch` | Weekly content pipeline — intelligence translated into content pitches for the team |

### AI model assignments

| Surface | Model | Reason |
|---------|-------|--------|
| Annotation | Haiku | Cost efficiency at volume (~60+ articles/day × 5 layers) |
| Brief | Sonnet | Reasoning quality for the morning briefing |
| Synthesis | Sonnet | Pattern detection across the weekly corpus |
| Cerebro | Sonnet | Full reasoning capability for the ranger's deliberation |
| Gallery taste filter | Sonnet (Vision) | Image evaluation requires visual reasoning |

---

## DEPLOYMENT

| Property | Value |
|----------|-------|
| **Vercel project** | `explore` |
| **Domain** | `explore.goodliving.studio` |
| **Branch** | `main` (shared with all OS instances) |
| **Env vars** | `NEXT_PUBLIC_INSTANCE=explore`, `ANTHROPIC_API_KEY`, `EXA_API_KEY`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `ARENA_ACCESS_TOKEN` |
| **Dev port** | 3002 (`npm run dev:explore`) |
| **Build** | `npm run build:explore` (sets env var during build) |

Auto-deploys on every push to `main`. Shares the same deployment pipeline as Dispatch and Lilly Direct — one commit, three deploys.

---

## KNOWN DIVERGENCES FROM DISPATCH

| Divergence | Rationale |
|------------|-----------|
| **5 themes vs 1** | Explore's biome themes are a visual argument about American land diversity. Dispatch has one theme (Ink) because its visual identity is singular and personal. |
| **Gallery biomes enabled** | Explore's gallery has a specific subject domain (American land) where biome classification is meaningful. Dispatch's abstract painterly gallery doesn't have biomes. |
| **Extended taste prompt** | Explore's gallery curation requires a specialized curatorial brief for Claude Vision. Dispatch uses a simpler quality filter. |
| **Team-serving operator block** | The runtime AI prompt addresses a team, not an individual. The ranger's voice is calibrated for equal-service, not principal-briefing. |
| **Civic-specific analytical protocols** | Cerebro carries the Civic Design Test, Burgum-Gebbia Frame Check, Accessibility Audit Standard, and 90-Day/Stewardship Split. These are Explore-specific and don't exist in Dispatch. |

---

## WHAT THIS DOCUMENT DOES NOT OWN

- **The shared codebase.** See `../os/ARCHITECTURE.md` for the white-label pattern, shared routes, and the canonical spinup checklist.
- **Design language.** See `SYSTEM-BRIEF.md` for Explore's visual language, themes, and token architecture.
- **Intelligence model.** See `MANDATE.md` for the ranger station model, intelligence modes, and annotation layers.
- **Voice and behavioral contract.** See `CEREBRO-CHARTER.md` for the ranger model's behavioral directives.
- **Prohibited patterns.** See `ANTI-PATTERNS.md` for civic-context-specific prohibitions.

---

*Update this document when: a new surface is added to Explore; a feature flag is enabled or disabled; the deployment topology changes; a new divergence from the shared pattern is introduced; or when a shared-layer change affects Explore's behavior specifically.*
