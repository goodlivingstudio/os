# Architecture: White-Label Instance System

This codebase serves multiple instances of the same intelligence tool. Each instance has its own mandate, content sources, and branding but shares all infrastructure.

## The Rule

**Before editing any file, ask: is this change instance-specific or universal?**

- **Universal** → edit the file directly. All instances inherit the change.
- **Instance-specific** → edit the instance's config file in `lib/config/`.

## File Boundaries

### Mother (shared infrastructure) — changes cascade to ALL instances

```
components/*          All UI components
app/[[...view]]/*     Page shell, state management, view system
app/api/*             API route handlers (they read prompts from config)
app/globals.css       Theme system (skins, animations, design tokens)
app/layout.tsx        Shell layout (reads branding from config)
lib/styles.ts         TYPE scale, spacing rhythm, semantic composites
lib/types.ts          Core types (Article, Signal, ViewMode)
lib/config/types.ts   InstanceConfig schema
lib/config/index.ts   Config loader, helpers (storageKey, kvKey, buildPreamble)
```

### Children (instance-specific) — changes affect ONLY that instance

```
lib/config/dispatch.ts   Dispatch config (mandate, feeds, gallery, ticker, skins)
lib/config/explore.ts    Explore config
lib/config/lilly.ts      Lilly config (TODO)
```

### What lives in each config file

| Section | What it controls |
|---------|-----------------|
| `branding` | Name, tagline, domain, port, favicons |
| `mandate` | operator, clientContext, voice, sourceModes — the AI personality |
| `layers` | Intelligence taxonomy (5 layers with IDs, labels, descriptions) |
| `feeds` | RSS news sources |
| `podcasts` | Podcast feed sources |
| `gallerySources` | Surface gallery image sources |
| `headlines` | Ticker curated headlines |
| `categoryStyleDay/Night` | Ticker category color palette |
| `skins` | Theme skin options and default |

## Running Instances

```bash
npm run dev           # Dispatch on :3001 (default)
npm run dev:dispatch  # Dispatch on :3001 (explicit)
npm run dev:explore   # Explore on :3002
```

## Storage Isolation

All client-side (localStorage) and server-side (Vercel KV) cache keys are prefixed with the instance ID via `storageKey()` and `kvKey()` from `lib/config`. This prevents data collisions when instances share the same browser or KV store.

- `storageKey("annotations-v3")` → `"dispatch-annotations-v3"` or `"explore-annotations-v3"`
- `kvKey("synthesis:weekly")` → `"dispatch:synthesis:weekly"` or `"explore:synthesis:weekly"`

## Gallery Header Pattern

The gallery filter bar has a fixed structure:

```
[ All · Warm · Cool · Earth · Vivid · Neutral ]  |  [ instance-specific chips ]
```

- **Left of hairline** — universal mood filters, shared by all instances
- **Right of hairline** — instance-specific toggles, rendered only when the instance config warrants them (e.g., Explore shows Curated / UGC because it has a UGC Are.na channel)

Dispatch: no custom chips (no UGC channel)
Explore: Curated / UGC chips
Lilly: TBD

This pattern extends to any future per-instance gallery features — they go right of the hairline.

## Adding a New Instance

1. Create `lib/config/{name}.ts` implementing `InstanceConfig`
2. Import it in `lib/config/index.ts` and add to the `CONFIGS` map
3. Add npm scripts to `package.json`
4. Add a launch config to `.claude/launch.json`
5. Deploy as a separate Vercel project with `NEXT_PUBLIC_INSTANCE={name}`

## Deployment

Each instance is a separate Vercel project pointing at the same repo, differentiated by environment variable:

| Instance | Env Var | Domain |
|----------|---------|--------|
| Dispatch | `NEXT_PUBLIC_INSTANCE=dispatch` (or unset) | `dispatch.goodliving.studio` |
| Explore | `NEXT_PUBLIC_INSTANCE=explore` | `explore.goodliving.studio` |
| Lilly | `NEXT_PUBLIC_INSTANCE=lilly` | TBD |
