# Architecture
Established: 2026-04-09

*The shared codebase that every product instance inherits. This document describes what lives in the shared layer versus what lives in each product's instance config — the structural contract that makes the white-label pattern work. It is the citadel of governance: the comprehensive reference for rules, patterns, and operational procedures that keep the shared layer honest.*

*See `DOC-AUTHORITY.md` for the inheritance model. See `PIPELINE.md` for the intelligence pipeline pattern the infrastructure implements. See product-level `ARCHITECTURE.md` files for product-specific decisions on top of this shared foundation.*

---

## THE ENGINE

```
                    ┌─────────────────────┐
                    │    The operator      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │            UI shell              │
              │  Next.js 16 · React 19 · Tailwind│
              │       Theme engine · Routing      │
              └──┬──────────┬──────────┬─────────┘
                 │          │          │
          ┌──────┴───┐ ┌───┴────┐ ┌───┴──────┐
          │ Brief +  │ │Cerebro │ │ Dispatch │
          │Synthesis │ │  Chat  │ │ Stage 6  │
          │Stage 4-5 │ │+ Search│ │  weekly  │
          └────┬─────┘ └───┬────┘ └───┬──────┘
               │           │          │
          ┌────┴───────────┴──────────┴──────┐
          │        Claude (Anthropic)         │
          │   Sonnet: reasoning · Haiku: ann. │
          └──────┬───────────────────┬───────┘
                 │                   │
          ┌──────┴───────┐   ┌──────┴───────┐
          │  Annotate +  │   │ Persistence  │
          │    Score     │   │  Vercel KV   │
          │  Stages 2-3  │   │ Article store│
          └──────┬───────┘   └──────┬───────┘
                 │                   │
          ┌──────┴───────────────────┴───────┐
          │         Ingest — Stage 1          │
          │  RSS · Podcasts · Gallery · Exa   │
          └──────────────┬───────────────────┘
                         │
          ┌──────────────┴───────────────────┐
          │   Vercel + GitHub                 │    ┌──────────────┐
          │   One repo, N deployments         │◄───│ White-label   │
          │   Instance-prefixed keys          │    │ config        │
          └──────────────────────────────────┘    │ (per product) │
                                                   └──────────────┘
```

The operator sits at the top. Everything below exists to serve them. The UI shell is the shared surface — identical scaffolding, components, and routing across every product. Below it, the intelligence surfaces (Brief, Synthesis, Cerebro, Act) present the pipeline's output. Claude powers both the reasoning surfaces and the annotation layer. Persistence holds the state between sessions. Ingest pulls from the world. Vercel hosts the whole thing. The white-label config runs alongside everything — it's what makes each instance distinct without touching the shared machinery.

---

## THE PATTERN

The OS is a single Next.js codebase that runs as multiple **instances** via a white-label configuration system. One repository, one dependency tree, one deployment pipeline — multiple products. Each instance is defined by a single file in `lib/config/` and selected at runtime via the `NEXT_PUBLIC_INSTANCE` environment variable.

The architectural commitment: **the shared codebase owns everything except identity, mandate, sources, and branding.** Every product inherits the full intelligence pipeline, the analytical function, the UI components, the theming engine, the API routes, and the persistence layer from the shared code. Every product owns what makes it specifically itself — its mandate prompt, its source list, its branding, its themes, its tagline — through its instance config.

This is the architecture that lets sibling products exist as peers without fragmenting the codebase. When a new capability ships, every product inherits it. When a product needs something specific, the config extends. When the shared layer can't accommodate a product's real need, the need either gets promoted into the shared layer or the product forks that specific concern — but the shared layer stays the default.

---

## THE STACK

Version numbers are current as of 2026-04-09; update this section when the stack is upgraded materially.

| Layer | Choice | Notes |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Turbopack dev server. ISR for cached API routes. Catch-all routing. |
| **UI** | React 19 + TypeScript 5 | Server components by default, client components where interaction lives. |
| **Styling** | Tailwind CSS v4 | Multi-theme system driven by instance config. |
| **AI** | Anthropic Claude | Sonnet for reasoning surfaces. Haiku for annotation. No OpenAI. |
| **Persistence** | Vercel KV | Conversation memory, article cache, annotation cache. All keys prefixed by instance ID. |
| **Web search** | Exa (Cerebro only) | Up to 5 results per query, up to 5 iterations per response. |
| **Images** | Sharp, ColorThief | Gallery image processing, color palette extraction. |
| **Scraping** | Playwright | Gallery source scraping. |
| **Hosting** | Vercel | One Vercel project per instance, each on its own subdomain. |
| **Source** | GitHub, single repo | See § HISTORICAL NAMING ARTIFACT. |

Next.js 16 has breaking changes from prior versions. Agents working in this codebase must read the relevant guide in `node_modules/next/dist/docs/` before writing code — the project's AGENTS.md enforces this rule.

---

## THE WHITE-LABEL PATTERN

### The contract — `lib/config/`

Every instance provides a single TypeScript file conforming to the `InstanceConfig` interface in `lib/config/types.ts`. The interface is the contract between the shared codebase and its instances:

- **Identity** — `id`, `branding` (name, tagline, domain, dev port, favicons)
- **Mandate** — `operator`, `clientContext`, `voice`, `sourceModes` (the AI preamble blocks assembled into every prompt)
- **Taxonomy** — `layers` (the intelligence layers this product scores against), `layerColors`
- **Content** — `feeds` (RSS), `podcasts`, `gallerySources`
- **Ticker** — `headlines`, `categoryStyleDay`, `categoryStyleNight`
- **Theme** — `skins`, `defaultSkin`
- **Cerebro** — `provocations` (rotating prompt suggestions), `cerebroWelcome`
- **Gallery scraper** — `galleryScraper`, optional `ugcScraper`

The canonical division of labor is stated in the comment at the top of `types.ts`: the shared codebase reads from this contract. Instances own identity, mandate, content sources, and branding. The shared layer owns components, layout, views, the AI pipeline, the theme engine, and caching.

### Shared capabilities every instance inherits

Beyond the UI shell and routing, every product instance inherits these operational surfaces without any additional configuration:

- **Synthesis** — pattern detection across the 7-day article window
- **Annotation + scoring** — AI-driven classification against the product's layer taxonomy
- **Cerebro** — the conversational analytical function with web search and conversation memory
- **Customization / settings** — theme selection, source management, and instance configuration surfaces
- **Analytics** — API usage tracking and cache introspection

These are the bare minimum. A product instance that boots with a valid config file immediately has all five.

### The loader — `lib/config/index.ts`

Reads `NEXT_PUBLIC_INSTANCE` at module load time and returns the matching config. Exposes helpers for prompt assembly, layer formatting, storage key prefixing, and preamble building. See the file directly for the current API surface.

### The prompt layer — `lib/prompts.ts`

Reads from the active config and exports config-derived constants. Every AI surface imports from here rather than constructing prompts inline. The preamble assembler draws from the instance's mandate, operator context, voice directives, layer taxonomy, and source modes.

### Content adapters — `lib/feeds.ts`, `lib/podcasts.ts`, `lib/gallery.ts`

Each imports from `lib/config` and re-exports the active instance's content sources. The rest of the codebase imports from these adapters without knowing about the config system.

### The products registry — `lib/config/products.ts`

A compact enumeration of all products with identity metadata: `id`, `name`, `url`, `status`, `description`, and `isOsInstance`. The single source of truth for which products exist, what state they're in, and where they live.

### Feature flags — `config.features`

Per-instance opt-ins to shared-layer behaviors that only apply to some products. Default for every flag is off. A product opts in by setting the flag in its config file.

**When to use a feature flag vs an instance-specific config field:**

- **Feature flag** — when the behavior lives in the shared layer and some products want it while others don't.
- **Instance config field** — when the product is providing content the shared layer will consume.
- **UI gating on config state** — when a shared surface adapts to a product's content naturally.

**The double-guard pattern:** feature flags should be enforced at both the data layer (the API route) and the UI layer (the component). Either guard alone would suffice, but the combination makes the behavior robust.

When a new feature flag is added: define it in `FeatureFlags` in `lib/config/types.ts`, enable it in the relevant product configs, gate the behavior at both layers, and document the flag in this document.

---

## PIPELINE-TO-INFRASTRUCTURE MAPPING

`PIPELINE.md` owns the six-stage pattern. This section maps each stage to its implementation in the shared codebase:

| Pipeline Stage | Primary Routes | Supporting Libraries |
|---|---|---|
| **Ingest** | `/api/news`, `/api/podcasts`, `/api/gallery` | `lib/feeds.ts`, `lib/podcasts.ts`, `lib/gallery.ts`, `lib/gallery-fetch.ts` |
| **Annotate** | `/api/annotate` | `lib/prompts.ts`, `lib/config/index.ts` |
| **Score** | Computed within `/api/annotate` and downstream | `lib/article-store.ts` |
| **Brief** | `/api/brief`, `/api/audio-brief` | Vercel KV (instance-prefixed cache) |
| **Synthesize** | `/api/synthesis` | `lib/article-store.ts` (weekly window) |
| **Act** | Product-specific | Varies by product mandate |

Every route reads from the active instance's config at request time. Adding a new product instance does not require touching any shared route.

---

## GLOBAL VS LOCAL — THE HARDCODING RULES

The white-label pattern makes architectural sharing possible. The hardcoding rules make it actually true in practice.

**The rule, stated once:** every piece of product-specific content — name, URL, tagline, theme, source list, mandate, layer taxonomy, operator profile, voice character, image prompts — lives in that product's config or its doc set. Every consumer reads from config or docs, never from string literals.

**What the shared layer owns:**
- UI components and the main client
- All shared API routes
- The intelligence pipeline and its implementations
- The theme system and material rendering
- The prompt assembly layer
- Persistence layer (conversation memory, article cache)
- Gallery infrastructure, image generation, usage tracking, caching
- The product switcher, cross-product navigation, and the products registry
- Universal analytical voice disciplines (`VOICE.md`)
- Interaction philosophy (`PASSAGE.md`)
- Shared design convictions (`DOCTRINE.md`)

**What each product owns:**
- Identity: name, tagline, domain, port, favicons
- Mandate prompt blocks: operator, clientContext, voice, sourceModes
- Intelligence layer taxonomy
- Feeds, podcasts, gallery sources
- Ticker headlines and category styles
- Themes and the default theme choice
- Cerebro provocations and welcome message
- Gallery scraper configuration
- The full canonical doc set under `docs/<product>/`
- Voice character — expressed through `CEREBRO-CHARTER.md`

**The hardcoding rules:**

1. **Never hardcode a product name as a string literal in code.** Read from `instanceConfig.branding.name` for the active product. Read from the products registry when enumerating.
2. **Never hardcode a product URL.** Use the products registry for cross-product navigation. Use `instanceConfig.branding.domain` for self-references.
3. **Never hardcode a layer name, taxonomy, or annotation label.** Read from `instanceConfig.layers` at runtime or derive via config helpers.
4. **Never hardcode an operator context, engagement context, or voice directive in code.** These live in `config.mandate.*` fields and are assembled by the preamble builder.
5. **Never hardcode a source URL outside the config file.** Sources belong in `config.feeds`, `config.podcasts`, `config.gallerySources`.
6. **Never hardcode a theme name or material token.** The theme system is config-driven. Products with a single theme should not render a theme picker.
7. **Never hardcode a product name as a fallback label.** The fallback is `instanceConfig.branding.name`.
8. **Never hardcode product-specific UI features into shared components.** Put them behind a feature flag and gate at both layers. Default to off; opt in per product.

**The one exception:** strings that describe shared-layer functionality. "Cerebro," "Signal," "Synthesis," "Source" are shared vocabulary for surfaces every product has. These may appear as string literals because they describe the shared layer, not any specific product. The test: would the string change under a different product? If yes, it belongs in config. If no, it's shared vocabulary.

---

## PROMOTION GUIDANCE

When a product builds something that might belong in the shared layer:

**Promote when:** the capability is useful to two or more products, the implementation doesn't carry product-specific assumptions, and the cost of maintaining it in the shared layer is lower than duplicating it. The trigger is concrete: when the second product needs the same pattern, promote it.

**Keep product-scoped when:** the capability is tightly coupled to one product's mandate, the implementation carries assumptions about that product's audience or context, or promoting it would require abstractions that make the shared layer harder to understand.

**The grey zone:** a product builds something that feels generalizable but only one product currently uses it. Leave it in the product. Add a comment noting that it's a promotion candidate. When a second product reaches for the same pattern, that's the signal to extract.

When promoting: move the implementation into the shared layer, put it behind a feature flag if not every product wants it, update the relevant product configs, and document the promotion in this file.

---

## THE INSTANCE BOOT SEQUENCE

When a dev server starts or a Vercel build runs:

1. **Environment read.** `NEXT_PUBLIC_INSTANCE` is evaluated. If set, that instance is selected. Otherwise the default instance loads.
2. **Config load.** `lib/config/index.ts` imports the matching config and returns it as the default export.
3. **Config propagation.** Every module that imports from `lib/config` receives the active instance's values. No runtime switching; config is frozen at module init.
4. **Prompt assembly.** `buildPreamble(cfg)` assembles the full AI preamble from the instance's mandate block. Every Claude API call inherits the product's voice and context.
5. **Cache namespacing.** Storage key helpers prefix every cache key with the instance ID. Multiple instances sharing the same Vercel KV don't collide.
6. **UI render.** Server components read the active config for branding, theme defaults, layer taxonomy, and navigation. Client components read the same config embedded at build time.
7. **Surface routing.** The catch-all page handles all view routing client-side. Shared API routes serve every instance and adapt via config.

---

## HOW A NEW PRODUCT INSTANCE IS ADDED

This is the canonical checklist. Use it when spinning up any new product.

**Code work:**

1. **Create the config file.** Copy an existing config in `lib/config/` as a template. Rename the exported config object. The product ID is the lowercase slug used in env vars, storage keys, and the loader map.
2. **Register in the loader.** Add the import and entry to the configs map in `lib/config/index.ts`.
3. **Register in the products registry.** Add an entry to `lib/config/products.ts` with identity, URL, status, description, and `isOsInstance`.
4. **Populate identity and branding.** Name, tagline, domain, dev port, favicons. Pick a dev port that doesn't collide with existing instances.
5. **Populate the mandate.** Write the operator, clientContext, voice, and sourceModes prompt blocks. These derive from the product's `MANDATE.md` and `CEREBRO-CHARTER.md`. Do not write these inline without corresponding canonical sources in the doc set.
6. **Populate the layer taxonomy.** Define the intelligence layers this product scores against. This is the most bespoke part of the config.
7. **Populate feeds, podcasts, gallery sources.** Derive from `SOURCES.md`. Start with a curated core set; promote candidates from `SOURCES-MEGALIST.md` as they earn it.
8. **Populate themes.** Define the product's themes and default.
9. **Add npm scripts and launch config.** Add `dev:<product>` and `build:<product>` to `package.json`. Add a matching entry to `.claude/launch.json` for dev-server preview tooling.

**Alignment and deployment work:**

10. **Create the product doc set.** Scaffold all 14 canonical files under `docs/<product>/` per `DOC-AUTHORITY.md`. Stubs are acceptable; missing files are not. Regenerate the docs-export file.
11. **Create the Vercel project.** New project, same repo, with the `NEXT_PUBLIC_INSTANCE` env var set. Assign the domain.
12. **Set secrets.** `ANTHROPIC_API_KEY` required. `EXA_API_KEY`, KV credentials optional but expected for full functionality.
13. **Verify the boot.** Run the dev script locally. Confirm branding, feed population, KV namespacing, and Cerebro voice. Run type checks. Update status in the products registry.
14. **Deploy.** Push to main. Verify the production deployment. Update the URL in the products registry. Promote status to production once stable.
15. **Document.** Update `AGENTS.md`, `README.md`, and `DOC-AUTHORITY.md` with the new product.

Steps 1–9 are the code work. Steps 10–15 are the alignment work. Both are non-optional.

---

## DEPLOYMENT TOPOLOGY

- **One GitHub repo.** All instances live here.
- **One main branch.** Every instance deploys from main. Feature branches for product work.
- **N Vercel projects** — one per instance. Each differs only by the `NEXT_PUBLIC_INSTANCE` environment variable.
- **N domains** — one per instance, each on a subdomain of `goodliving.studio` or a product-specific domain.
- **One Vercel KV database** — shared across instances, with instance-prefixed keys for namespace isolation.
- **Per-project secrets** — API keys are set per Vercel project, not globally.

---

## HISTORICAL NAMING ARTIFACT

The repository's on-disk name, GitHub remote, and `package.json` name field are historically `dispatch` — an artifact of the first product that lived here before the white-label refactor. Conceptually, the repository is OS. A rename operation is planned as a dedicated session; it touches the GitHub remote, Vercel project links, CNAME pointers, local working copies, and hardcoded paths in project configuration files. Until the rename happens, treat the repo name as an artifact. The active instance is determined by `NEXT_PUBLIC_INSTANCE`, not by the folder name.

---

## KNOWN DRIFT AND OPPORTUNITIES

- **Design system documentation.** The shared UI components, tokens, and patterns lack a single living reference outside the code itself. A dedicated design system document or tooling (Figma source of truth, Storybook, or equivalent) would reduce the time spent troubleshooting UI in Claude Code and establish the visual governance this architecture needs. This is a separate workstream — see the Design R&D session for direction.
- **Shared components documentation.** This document enumerates shared API routes via the pipeline mapping but not shared components. Components evolve quickly; enumerating them here would drift. A separate shared-components reference may be worth writing if the component surface stabilizes.
- **Migration to real monorepo.** At some scale, the single-codebase white-label pattern will hit limits. The decision trigger: when the second piece of non-trivial shared code gets copied between products, extract it into a package and move to monorepo structure. Current scale does not justify this.

---

## WHAT THIS DOCUMENT DOES NOT OWN

- **The intelligence pipeline pattern.** See `PIPELINE.md`. This document maps the pipeline to infrastructure; PIPELINE owns the pattern itself.
- **Design convictions and interaction philosophy.** See `DOCTRINE.md` and `PASSAGE.md`.
- **Analytical voice disciplines.** See `VOICE.md`.
- **Operator context.** See `OPERATOR.md`.
- **Product-specific architectural decisions.** See product-level `ARCHITECTURE.md` files.
- **Product-specific cadences and refresh intervals.** See product-level `ARCHITECTURE.md` files.
- **Design system governance.** Visual tokens, component patterns, and material specifications. See product-level `SYSTEM-BRIEF.md` files and the forthcoming design system reference.

---

*Update this document when: the stack is upgraded materially; a new shared pattern is promoted from product-specific code; a shared pattern is forked for product-specific needs; the deployment topology changes; the rename operation is executed; the boot sequence changes; or a new hardcoding violation reveals a rule category this document doesn't yet cover.*
