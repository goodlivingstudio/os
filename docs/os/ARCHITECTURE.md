# OS — Shared Architecture
Established: 2026-04-09

*This document is canonical for OS's shared codebase — the infrastructure every product instance inherits when it runs. It describes what lives in the shared layer (one codebase, many instances) versus what lives in each product's instance config. It is the structural counterpart to each product's own `ARCHITECTURE.md`, which describes the product-specific decisions sitting on top of this shared foundation.*

*See `DOC-AUTHORITY.md` for the inheritance model. See `PIPELINE.md` for the intelligence pipeline pattern the infrastructure implements. See `../dispatch/ARCHITECTURE.md` and `../explore/ARCHITECTURE.md` for product-specific architectural decisions on top of this shared foundation.*

---

## THE PATTERN

OS is a single Next.js codebase that runs as multiple **instances** via a white-label configuration system. One repository, one `node_modules`, one deployment pipeline — multiple products. Each instance is defined by a single file in `lib/config/` and selected at runtime via the `NEXT_PUBLIC_INSTANCE` environment variable.

The architectural commitment: **the shared codebase owns everything except identity, mandate, sources, and branding.** Every product inherits the full intelligence pipeline, the analytical function, the UI components, the theming engine, the API routes, and the persistence layer from the shared code. Every product owns what makes it specifically itself — its mandate prompt, its source list, its branding, its skins, its tagline — through its instance config.

This is the architecture that lets four sibling products (Dispatch, Explore, Atlas, Lilly) exist as peers without fragmenting the codebase. When a new capability ships, every product inherits it. When a product needs something specific, the config extends. When the shared layer can't accommodate a product's real need, the need either gets promoted into the shared layer or the product forks that specific concern — but the shared layer stays the default.

---

## THE STACK

Version numbers are current as of 2026-04-09; update this section when the stack is upgraded materially.

| Layer | Choice | Notes |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Turbopack dev server. ISR for cached API routes. Catch-all routing via `app/[[...view]]/`. |
| **UI** | React 19 + TypeScript 5 | Server components by default, client components where interaction lives. |
| **Styling** | Tailwind CSS v4 | Multi-skin theme system driven by instance config. |
| **AI** | Anthropic Claude via `@anthropic-ai/sdk` ^0.80 | Sonnet for reasoning surfaces (Cerebro, synthesis, briefs). Haiku for annotation. No OpenAI. |
| **Persistence** | Vercel KV via `@vercel/kv` ^3.0 | Conversation memory (30-day TTL), article cache, annotation cache. All keys prefixed by instance ID. |
| **Web search** | Exa (Cerebro only) | Up to 5 results per query, up to 5 iterations per response. |
| **Images** | Sharp, ColorThief | Gallery image processing, color palette extraction. |
| **Scraping** | Playwright | Gallery source scraping. |
| **Hosting** | Vercel | One Vercel project per instance (Dispatch → `dispatch.goodliving.studio`, Explore → `explore.goodliving.studio`, etc.). |
| **Source** | GitHub, single repo historically named `dispatch` | Rename to `os` pending a dedicated operation. See § HISTORICAL NAMING ARTIFACT. |

Next.js 16 has breaking changes from prior versions. Agents working in this codebase must read the relevant guide in `node_modules/next/dist/docs/` before writing code — the project's AGENTS.md enforces this rule.

---

## THE WHITE-LABEL PATTERN

### `lib/config/` — the contract

Every instance provides a single TypeScript file conforming to the `InstanceConfig` interface in `lib/config/types.ts`. The interface is the contract between the shared mother codebase and its child instances:

- **Identity** — `id`, `branding` (name, tagline, domain, dev port, favicons)
- **Mandate** — `operator`, `clientContext`, `voice`, `sourceModes` (the AI preamble blocks this product wants assembled into every prompt)
- **Taxonomy** — `layers` (the intelligence layers this product scores against), `layerColors`
- **Content** — `feeds` (RSS), `podcasts`, `gallerySources`
- **Ticker** — `headlines`, `categoryStyleDay`, `categoryStyleNight`
- **Theme** — `skins`, `defaultSkin`
- **Cerebro** — `provocations` (rotating prompt suggestions), `cerebroWelcome`
- **Gallery scraper** — `galleryScraper`, optional `ugcScraper` (arena slug, scrape targets, taste prompt)

The comment at the top of `types.ts` describes the division of labor precisely: *"The mother (shared infrastructure) reads from this contract. Children own: identity, mandate, content sources, branding. Mother owns: components, layout, views, AI pipeline, theme engine, caching."* That comment is canonical — this document echoes it.

### `lib/config/index.ts` — the loader

The instance loader reads `process.env.NEXT_PUBLIC_INSTANCE` at module load time and returns the matching config object. Dispatch is the default when no instance is specified.

```typescript
const CONFIGS: Record<string, InstanceConfig> = {
  dispatch: dispatchConfig,
  explore: exploreConfig,
  // lilly: lillyConfig,  // TODO: add when ready
}

const instanceId = process.env.NEXT_PUBLIC_INSTANCE || "dispatch"
const config: InstanceConfig = CONFIGS[instanceId] || dispatchConfig

export default config
```

The loader also exposes helpers that the rest of the codebase uses to build prompts from config:

- **`storageKey(key)`** / **`kvKey(key)`** — prefix all localStorage and KV cache keys with the instance ID. This is how multiple instances coexist on the shared Vercel KV without namespace collisions. Dispatch's cache keys start with `dispatch:`, Explore's with `explore:`, and so on.
- **`layerLabelsSlash(cfg)`** / **`layerIdsPipe(cfg)`** — format the instance's intelligence layers for prompt insertion (e.g., `Opportunity / Position / Discipline / Landscape / Culture`).
- **`scoreJsonExample(cfg)`** / **`scoreJsonRange(cfg)`** — generate JSON skeletons for the annotation prompt so Claude knows what shape to return.
- **`buildPreamble(cfg)`** — assemble the full AI system preamble from `mandate.operator`, `mandate.clientContext`, the layer block, `mandate.sourceModes`, and `mandate.voice`. This is the function every AI surface reaches for when it needs the product's voice and context injected.
- **`getLayerConfig(cfg)`** / **`getLayerIds(cfg)`** — format layer lists for UI filters.

### `lib/prompts.ts` — the thin derivation layer

This file used to hold hard-coded prompt blocks. It now reads from the active config and exports config-derived constants:

```typescript
export const OPERATOR = config.mandate.operator
export const FIVE_LAYERS = (...) // built from config.layers
export const INSTANCE_PREAMBLE = buildPreamble(config)
```

`INSTANCE_PREAMBLE` contains whichever instance's preamble was loaded at module init — Dispatch by default, Explore under `NEXT_PUBLIC_INSTANCE=explore`, Lilly Direct under `NEXT_PUBLIC_INSTANCE=lilly-direct`, and so on. The name deliberately does not encode a specific product. (Prior to 2026-04-09 this constant was named `DISPATCH_PREAMBLE` as a historical artifact of the pre-white-label codebase; it was renamed during the os-content-fill pass along with all five runtime call sites.)

### `lib/feeds.ts`, `lib/podcasts.ts`, `lib/gallery.ts`

These files do the same thing: `import config from "@/lib/config"` and re-export `config.feeds`, `config.podcasts`, etc., as named exports. They exist as adapters so the rest of the codebase can keep using imports like `FEEDS` from `lib/feeds` without knowing about the config system. When a new source shows up in `lib/config/<product>.ts`, every consumer picks it up automatically.

### `lib/config/products.ts` — the OS-level products registry

This file is distinct from the per-instance configs. Where `lib/config/dispatch.ts` and `lib/config/explore.ts` describe a *single* product in full, `lib/config/products.ts` is a compact enumeration of *all* Good Living Studio products with their identity metadata: `id`, `name`, `url`, `status` (production / wip / upcoming / on-hold), `description`, and `isOsInstance` (true for products that run as white-label instances of this codebase, false for products like Atlas that live in separate repositories).

Any UI surface that needs to render a cross-product switcher, product selector, or navigation across products reads from `PRODUCTS` in this file — never from hardcoded literals. This is the single source of truth for "which products exist, what are they called, where do they live, and what state are they in." It also exposes helpers: `getProduct(id)`, `getOsInstances()`, `getNavigableProducts()`.

When a new product is added, the registry entry is added here in the same commit that creates the instance config. When a product changes lifecycle status (wip → production, on-hold → wip), the status field updates here and every consumer rerenders accordingly. Status pills in the project switcher ("soon" for upcoming, "on hold" for on-hold) are derived from this field.

### `config.features` — per-instance feature flags

The `InstanceConfig` schema includes an optional `features` map (`FeatureFlags` interface in `lib/config/types.ts`) for per-instance opt-ins to shared-layer behaviors that only apply to some products. Default behavior for every flag is `false` or equivalent — the shared layer treats an omitted flag as "off." A product opts in by setting the flag in its config file.

**When to use a feature flag vs an instance-specific config field:**

- Use a **feature flag** when the behavior lives in the shared layer and some products want it while others don't. Example: `features.galleryBiomes` — the biome classification logic, filter chip UI, and data pipeline all live in shared code; Explore wants them on; Dispatch wants them off.
- Use an **instance-specific config field** (like `config.skins` or `config.feeds`) when the product is providing *content* that the shared layer will consume. The shared layer always renders skins; what varies is *which* skins and *how many*.
- Use **UI gating on config state** when a shared surface adapts to a product's content. Example: the mobile skin picker renders only when `instanceConfig.skins.length > 1` — no feature flag needed, because the content itself (the length of the skins array) is what determines whether the UI is meaningful.

**Current feature flags:**

- **`galleryBiomes`** (default: `false`) — Classify gallery images by biome taxonomy (alpine, forest, desert, coastal, wetland, prairie, arctic, underwater) using keyword matching in title/source/URL. When enabled, the gallery overlay renders biome filter chips and `/api/gallery` tags every image with a biome field. Currently enabled on Explore for its public-lands imagery. Dispatch and other products leave this off.

**The double-guard pattern:** feature flags should be enforced at BOTH the data layer (the API route that produces the tagged data) AND the UI layer (the component that renders it). The biome flag is a good example — the API route in `app/api/gallery/route.ts` skips classification entirely when the flag is off, and the gallery component in `components/gallery.tsx` also gates rendering on the flag. Either guard alone would be sufficient in practice, but the combination makes the behavior robust against stale caches, race conditions, and future changes to the data pipeline.

When a new feature flag is added:
1. Add the field to `FeatureFlags` in `lib/config/types.ts` with a JSDoc comment explaining what it controls
2. Enable it in the config files of the products that want it (leave omitted for products that don't)
3. Gate the behavior at both the data layer and the UI layer
4. Document the flag in this document under § Current feature flags
5. Add a runtime verification that confirms the flag works as expected in both enabled and disabled states

---

## SHARED VS BESPOKE — THE HARDCODING RULES

This codebase exists because four sibling products (Dispatch, Explore, Atlas, Lilly Direct) should share a common foundation while each remains rigorously itself. The white-label pattern makes this possible architecturally. The hardcoding rules below make it actually true in practice.

**The rule, stated once:** every piece of product-specific content — name, URL, tagline, skin, source list, mandate, layer taxonomy, operator profile, voice character, active engagement, image prompts — lives in that product's config (`lib/config/<product>.ts`) or its doc set (`docs/<product>/`). Every consumer of that content reads from config or docs, never from string literals.

**What the shared layer OWNS:**
- UI components (`components/*`) and the main client (`app/[[...view]]/page.tsx`)
- All shared API routes (`app/api/*`)
- The intelligence pipeline (Ingest → Annotate → Score → Brief → Synthesize → Act) and its implementations
- The theme engine, skin system, and material rendering (`lib/styles.ts`)
- The prompt assembly layer (`lib/prompts.ts`, `lib/config/index.ts` helpers)
- Persistence layer (`lib/memory.ts`, `lib/article-store.ts`)
- Gallery infrastructure, image generation, usage tracking, caching
- The product switcher, cross-product navigation, and the products registry itself
- Universal analytical voice disciplines (`docs/os/VOICE.md`)
- Interaction philosophy (`docs/os/PASSAGE.md`)
- Shared design convictions (`docs/os/DOCTRINE.md`)

**What each product OWNS:**
- Identity: name, tagline, domain, port, favicons
- Mandate prompt blocks: operator, clientContext, voice, sourceModes
- Intelligence layer taxonomy: which layers this product scores against and what they mean
- Feeds, podcasts, gallery sources
- Ticker headlines and category styles
- Material skins and the default skin choice
- Cerebro provocations and welcome message
- Gallery scraper configuration (if the product has a gallery surface)
- The full 14-file canonical doc set under `docs/<product>/`
- Voice character (Station Chief, Field Correspondent, TBD) — expressed through `CEREBRO-CHARTER.md`

**The hardcoding rules:**
1. **Never hardcode a product name as a string literal in `.tsx` or `.ts` files.** Read from `instanceConfig.branding.name` for the active product. Read from `PRODUCTS[n].name` when enumerating all products.
2. **Never hardcode a product URL.** Use `PRODUCTS` for cross-product navigation. Use `instanceConfig.branding.domain` for self-references.
3. **Never hardcode a layer name, layer taxonomy, or annotation label.** Read from `instanceConfig.layers` (runtime) or derive via `layerLabelsSlash(cfg)` / `layerIdsPipe(cfg)` helpers (prompts).
4. **Never hardcode an operator context block, engagement context block, or voice directive in `.tsx` or `.ts` files.** These live in `config.mandate.*` fields and are assembled into prompts by `buildPreamble()` and exported as `INSTANCE_PREAMBLE`.
5. **Never hardcode a source URL, podcast URL, or gallery source URL outside the config file.** Sources belong in `config.feeds`, `config.podcasts`, `config.gallerySources`.
6. **Never hardcode a skin name or material token.** The skin system is config-driven; themes live in `lib/styles.ts` and are selected by the active instance's `defaultSkin`. UI surfaces that render skin pickers must gate on `instanceConfig.skins.length > 1` — products with a single skin should not see a picker with one useless option.
7. **Never hardcode "Dispatch" as a fallback label for a generic UI element.** The fallback is `instanceConfig.branding.name` — whichever product is currently running.
8. **Never hardcode product-specific UI features into shared components.** If a feature belongs to one product (biome filters on Explore's gallery, the weekly content pipeline on Dispatch), put it behind a `config.features.*` flag and gate the behavior at both the data layer and the UI layer. See § `config.features` above for the pattern. Default to off; opt in per product.

**The one exception:** strings that describe functionality the shared layer itself owns, not a product. "Cerebro" is shared vocabulary for the analytical function across all products and may appear as a hardcoded label in chrome (the right rail, the chat surface). "Signal," "Synthesis," "Source," "All," and "Config" are shared surface names. "SIGNAL" as a panel header is shared. These exist as string literals because they describe *the shared layer*, not any specific product.

**How to tell the difference:** ask whether the string would change if you were reading it under a different product. If yes (Dispatch vs Explore), it belongs in config. If no (every product has a Cerebro, every product has a Signal panel), it's shared vocabulary and can be a literal.

**Known drift points and their status:**
- `components/source-pulse.tsx` line 181 and 184 — the "Dispatch" cache-clear action label. This is correctly scoped: the button clears `/api/dispatch`, which is Dispatch's Act-stage surface. Under Explore the button has no effect because Explore doesn't use that route. Technically drift, practically harmless. Revisit when Explore's own Act-stage surface is built.
- `components/source-pulse.tsx` line 310 — `"dispatch": "Dispatch"` in the `ENDPOINT_LABELS` map. Here `"dispatch"` is the endpoint slug, not the product name. The label is confusing but not wrong. Cosmetic-only.

When a new hardcoding violation is discovered, fix it in the same commit that discovers it and add the pattern to this document's rule list if it reveals a new category.

---

## THE INSTANCE BOOT SEQUENCE

When a dev server starts or a Vercel build runs, this is what happens:

1. **Environment read.** `process.env.NEXT_PUBLIC_INSTANCE` is evaluated. If set (e.g., `NEXT_PUBLIC_INSTANCE=explore`), that instance is selected. Otherwise Dispatch is the default.
2. **Config load.** `lib/config/index.ts` imports the matching config file from the `CONFIGS` map and returns it as the default export. Any instance not in the map falls back to Dispatch.
3. **Config propagation.** Every module that imports from `lib/config` (directly or through adapters like `lib/feeds.ts` and `lib/prompts.ts`) receives the active instance's values. No runtime switching — the config is frozen at module init.
4. **Prompt assembly.** `buildPreamble(cfg)` assembles the full AI preamble from the instance's `mandate` block. Every Claude API call that includes the preamble inherits the product's voice and context.
5. **Cache namespacing.** `storageKey()` and `kvKey()` prefix every cache key with the instance ID. Dispatch and Explore running simultaneously on different Vercel deployments don't collide because their KV entries are in separate namespaces.
6. **UI render.** Server components read the active config for branding, skin defaults, layer taxonomy, and navigation. Client components read the same config (it's statically embedded at build time via `NEXT_PUBLIC_*` env vars).
7. **Surface routing.** `app/[[...view]]/page.tsx` is a catch-all that handles all view routing client-side. The shared API routes (`app/api/*`) serve every instance and read config for any instance-specific behavior.

---

## THE SHARED SURFACE INVENTORY

As of 2026-04-09, these are the shared API routes in `app/api/`:

- **`/api/chat`** — Cerebro agent. Agentic loop, web search via Exa, three-direction follow-ups, KV-backed conversation memory.
- **`/api/news`** — RSS aggregation. Pulls from `config.feeds`, deduplicates, caches, returns annotated articles.
- **`/api/annotate`** — Per-article relevance scoring. Reads `config.layers`, sends each article to Claude Haiku with the scoring prompt, returns the five-layer JSON plus urgency.
- **`/api/brief`** — Daily intelligence brief synthesis. Reads the annotated feed and produces three urgency-sorted signal cards (the DCOS surface in Dispatch).
- **`/api/synthesis`** — Pattern layer. Operates on the full 7-day Redis article history to surface week-over-week patterns rather than single-day summaries.
- **`/api/audio-brief`** — Audio rendering of the brief output.
- **`/api/dispatch`** — Weekly content brief generation (Dispatch's "Act" surface in the pipeline).
- **`/api/dispatch-purge`** — Cache clearing for dispatch-specific surfaces.
- **`/api/gallery`** — Gallery image fetch and curation.
- **`/api/history`** — Historical article access (7-day window).
- **`/api/memory`** — Direct KV session persistence access.
- **`/api/podcasts`** — Podcast feed aggregation from `config.podcasts`.
- **`/api/health`** — Deployment diagnostics.
- **`/api/synthesis-purge`** — Synthesis cache clearing.
- **`/api/cache-status`** — Cache introspection for debugging.
- **`/api/figma-push`** — Figma integration (design token sync).
- **`/api/purge-images`** — Gallery image cleanup.
- **`/api/usage`** — API usage tracking and reporting.

Every route reads `config` at request time and adapts its behavior to the active instance. Adding a new product instance does not require touching any of these routes.

Shared library files in `lib/`:

- **`lib/config/`** — the white-label contract (this document's main subject)
- **`lib/config/products.ts`** — OS-level registry of all Good Living Studio products with identity, URL, status, description
- **`lib/prompts.ts`** — config-derived prompt exports
- **`lib/feeds.ts`** / **`lib/podcasts.ts`** / **`lib/gallery.ts`** — config adapters for content sources
- **`lib/memory.ts`** — Vercel KV conversation persistence (30-day TTL, `MAX_STORED = 30` messages per session)
- **`lib/article-store.ts`** — 7-day Redis article history for synthesis
- **`lib/styles.ts`** — skin system and theme engine
- **`lib/color-utils.ts`** — color palette extraction (gallery + skin support)
- **`lib/gallery-fetch.ts`** — gallery scraping runtime
- **`lib/image-gen.ts`** / **`lib/image-utils.ts`** — image generation and processing
- **`lib/usage-tracker.ts`** — API usage accounting
- **`lib/use-scroll-guard.ts`** — scroll state hook used in Passage-pattern scroll restoration

Shared UI in `app/` and `components/` — not enumerated here because the component surface evolves frequently and this document would drift. The rule is: anything that reads from `config` is shared; anything hard-coded to a specific product is a fork and should be flagged.

---

## HOW A NEW PRODUCT INSTANCE IS ADDED

This is the canonical checklist. Use it when spinning up Lilly Direct (2026-04-10), when Atlas comes off hold, or for any future product.

1. **Create the config file.** Copy `lib/config/dispatch.ts` or `lib/config/explore.ts` as a template to `lib/config/<product-id>.ts`. Rename the exported config object. The product ID is the lowercase slug used in env vars, storage keys, and the loader map.
2. **Register the instance in the loader.** Add the new import and CONFIGS entry to `lib/config/index.ts`. Uncomment the `// TODO: add when ready` line if it's already scaffolded.
3. **Register the product in `lib/config/products.ts`.** Add an entry to the `PRODUCTS` array with `id`, `name`, `url`, `status`, `description`, and `isOsInstance`. This is what makes the product appear in the cross-product switcher and any other OS-wide product enumeration. Status should start as `"upcoming"` or `"wip"` depending on how ready the instance is.
4. **Populate identity and branding.** Name, tagline, domain, dev port, favicons. Pick a dev port that doesn't collide (Dispatch is 3001, Explore is 3002; pick 3003+ for Lilly, Atlas).
5. **Populate the mandate.** Write the `operator`, `clientContext`, `voice`, and `sourceModes` prompt blocks. These derive from the product's `docs/<product>/MANDATE.md` and `docs/<product>/CEREBRO-CHARTER.md`. Do not write these inline without corresponding canonical sources in the doc set.
6. **Populate the layer taxonomy.** Each product can define its own intelligence layers. Dispatch uses Opportunity/Position/Discipline/Landscape/Culture; Explore uses a different set calibrated to civic intelligence. Lilly Direct will define its own. This is the most bespoke part of the config.
7. **Populate feeds, podcasts, gallery sources.** These derive from `docs/<product>/SOURCES.md`. Start with a curated core set; move candidates from `docs/<product>/SOURCES-MEGALIST.md` into the active feed as they earn it.
8. **Populate skins and theming.** Define the product's material skins and the default. Each skin is an aesthetic commitment that lives in `lib/styles.ts` downstream — new skins may require adding entries there.
9. **Add npm scripts.** Add `dev:<product>` and `build:<product>` to `package.json` following the Explore pattern (`NEXT_PUBLIC_INSTANCE=<product> next dev -p <port>`). Also add a matching entry to `.claude/launch.json` so dev-server preview tooling (`preview_start` in Claude Code) can launch the instance by name. The launch.json entry mirrors the npm script: same name, same port, same `NEXT_PUBLIC_INSTANCE` env var, with the full paths to node and npm.
10. **Create the product doc set.** Scaffold all 14 canonical files under `docs/<product>/` per `docs/os/DOC-AUTHORITY.md` § THE CANONICAL PRODUCT DOC SET. Stubs are acceptable; missing files are not. Also regenerate `docs-export/<product>-complete.md` per the script in `docs-export/README.md` so Claude.ai sessions can paste the full doc set as context.
11. **Create the Vercel project.** New Vercel project, connected to the same GitHub repo, with `NEXT_PUBLIC_INSTANCE=<product>` set in the project's environment variables. Assign a CNAME (`<product>.goodliving.studio` or a client-specific domain).
12. **Set the secrets.** `ANTHROPIC_API_KEY` is required. `EXA_API_KEY`, `KV_REST_API_URL`, `KV_REST_API_TOKEN` are optional but expected for full functionality.
13. **Verify the boot.** Run `npm run dev:<product>` locally, confirm the instance renders with its own branding, confirm the feed populates, confirm KV cache keys are namespaced with the new instance ID, confirm Cerebro carries the new voice. Run `npx tsc --noEmit` to confirm types still resolve. Update the product's `status` in `lib/config/products.ts` from `"upcoming"` to `"wip"` once the instance boots and renders.
14. **Deploy.** Push to main. Vercel picks up the new project and deploys. Verify the production deployment renders the new instance by visiting the assigned domain. Update the product's `url` in `lib/config/products.ts` once the domain is live.
15. **Document the instance.** Update `AGENTS.md` with the new product row (role, instance, dev port, status). Update `README.md` product table. Update `docs/os/DOC-AUTHORITY.md` project-level authority section. Promote the product's `status` in `lib/config/products.ts` to `"production"` once the deployment is stable.

Steps 1-9 are the code work. Steps 10-15 are the alignment and deployment work that keeps the instance legible and live. Both are non-optional.

---

## DEPLOYMENT TOPOLOGY

- **One GitHub repo** (historically named `dispatch`, conceptually `os`). All instances live here.
- **One `main` branch.** Every instance deploys from `main`. Feature branches are used for product work and merged via PR or fast-forward.
- **N Vercel projects** — one per instance. Each project's build differs only by the `NEXT_PUBLIC_INSTANCE` environment variable.
- **N domains** — one per instance. Dispatch is live at `dispatch.goodliving.studio`. Explore will live at `explore.goodliving.studio` when production-ready. Lilly Direct's domain TBD depending on whether it's hosted under the studio domain or the client's.
- **One Vercel KV database** — shared across instances, with instance-prefixed keys for namespace isolation.
- **Shared secrets** — `ANTHROPIC_API_KEY`, `EXA_API_KEY`, and the KV keys are set once per Vercel project (not globally). Each instance has its own copy.

---

## HISTORICAL NAMING ARTIFACT

The repository's on-disk folder, GitHub remote, and `package.json` `name` field are all `dispatch`. This is an artifact of the first product that lived here — before the white-label refactor, this repo *was* Dispatch. The white-label pattern lifted Dispatch's product-specific content into `lib/config/dispatch.ts` and left a shared codebase that was suddenly OS-shaped, but the repository name didn't get updated in the same operation.

**Conceptually, the repository is OS.** The name-on-disk is historical. A rename operation is planned as a separate, dedicated session — it touches the GitHub repo, the git remote URL, the Vercel project links, the CNAME pointer at `dispatch.goodliving.studio`, local working copies and worktrees, `package.json`'s `name` field, and hardcoded paths in `AGENTS.md`, `CLAUDE.md`, `.claude/settings.local.json`, and any scripts. It's a real operation with a real blast radius, and it deserves its own session rather than being bundled with other work.

Until the rename happens, treat the repo-name-as-`dispatch` as an artifact. Never rely on it as identity. The active instance is determined by `NEXT_PUBLIC_INSTANCE`, not by the folder name.

---

## KNOWN DRIFT AND OPPORTUNITIES

A short list of things this architecture document will grow to address:

- **`lilly` entry in CONFIGS.** Line 17 of `lib/config/index.ts` has `// lilly: lillyConfig, // TODO: add when ready` commented out. Lilly Direct kickoff (2026-04-10) will uncomment this and add the import.
- **Automatic watermark detection at gallery ingest.** `docs/os/DOCTRINE.md § Gallery discipline` names watermarked images as an OS-wide prohibition, but the current pipeline only enforces the rule at the operator level via the `low-quality` curation action. The safety net works but it asks the operator to do the detection. A pre-ingest pass — cheap Claude Vision call, open-weights detection model, or a curated corpus of known watermark fingerprints — would promote the rule from manual curation to automatic rejection. Worth doing when the gallery surface grows beyond manual curation scale.
- **Shared `components/` documentation.** This doc enumerates shared API routes and lib files but not shared components. Components evolve quickly; enumerating them here would drift. A separate shared-components reference may be worth writing if the component surface stabilizes.
- **Migration to real monorepo.** At some scale, the single-codebase white-label pattern will hit limits and the right move will be a proper monorepo with `apps/` and `packages/`. The current scale (four products, single operator) does not justify that migration. The decision trigger is: when the second piece of non-trivial shared code gets copied between two products, it's time to extract it into a package and move to monorepo structure.

---

*Update this document when: the stack is upgraded materially; a new shared API route or lib file is added; a pattern is promoted from product-specific code into the shared layer; a shared pattern is forked for product-specific needs; the deployment topology changes; the rename-to-`os` operation is planned or executed; or the boot sequence changes.*
