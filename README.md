# OS — Good Living Studio

**An ambient intelligence layer for four sibling products: Dispatch, Explore, Atlas, and Lilly.**

OS is the shared codebase and shared philosophy for Jeremy Grant's personal body of work across technology, culture, healthcare, and client engagement. Each product runs as a white-label instance of OS, driven by a config in `lib/config/`. Shared convictions (operator context, design doctrine, interaction philosophy) live once in `docs/os/` and are inherited by every product.

> **Naming note:** This repository is historically named `dispatch` on disk because Dispatch was the first product built here. Conceptually, the repository IS OS. The rename to `os` is planned as a separate operation. See `AGENTS.md` for the full framing.

## The four products

| Product | Role | Instance | Status |
|---|---|---|---|
| **Dispatch** | Personal intelligence | port 3001 (default) / `dispatch.goodliving.studio` | Production |
| **Explore** | Civic/team intelligence | port 3002 / `NEXT_PUBLIC_INSTANCE=explore` | WIP, doctrine complete |
| **Atlas** | Decision capture | separate repo at `~/claude-projects/atlas/` | On hold |
| **Lilly Direct** | Engagement intelligence (Eli Lilly innovation team) | port 3003 / `NEXT_PUBLIC_INSTANCE=lilly-direct` | Scaffolded 2026-04-10 |

## Dispatch — the first and flagship product

**Directed intelligence for strategic positioning across technology, culture, and healthcare.**

Personal field intelligence platform. Aggregates curated signal feeds, synthesizes relevance through AI annotation, and provides strategic advisory via Cerebro — a conversational agent tuned to career positioning and mandate alignment.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **AI:** Anthropic Claude (Sonnet) via `@anthropic-ai/sdk`
- **Data:** Curated RSS sources across policy, AI, design, healthcare, market, culture (source mix varies per instance)
- **Persistence:** Vercel KV for conversation memory
- **Styling:** Tailwind CSS v4, multi-skin theme system per instance
- **Hosting:** Vercel (API + SSR), GitHub (source)

## Architecture

```
app/
  page.tsx             Main client — feed, signals, Cerebro chat
  layout.tsx           Root layout, metadata, skip link
  globals.css          Skin system, animations, a11y
  api/
    chat/              Cerebro agent (agentic loop, web search, follow-ups)
    news/              RSS aggregation + annotation
    annotate/          Article relevance scoring
    brief/             Signal synthesis (Chief of Staff)
    health/            Deployment diagnostics
components/
  ticker.tsx           Signal headline ticker
  analytics-panel.tsx  Interactive dashboard (Recharts)
lib/
  config/              White-label instance configs (dispatch.ts, explore.ts, ...)
  memory.ts            Vercel KV session persistence
docs/
  os/                  Shared atmosphere — 8 OS-level docs (OPERATOR, DOCTRINE, PASSAGE,
                       VOICE, PIPELINE, ARCHITECTURE, GLOSSARY, DOC-AUTHORITY)
  dispatch/            Dispatch product docs (14 canonical files)
  explore/             Explore product docs (14 canonical files)
  atlas/               Atlas placeholder README (on hold, separate repo)
  lilly/               Lilly Direct product docs (14 canonical files, currently stubs)
```

## Environment

```
ANTHROPIC_API_KEY=   # Required — Claude API
EXA_API_KEY=         # Optional — web search in Cerebro
KV_REST_API_URL=     # Optional — Vercel KV for memory
KV_REST_API_TOKEN=   # Optional — Vercel KV auth
```

## Development

```bash
# Dispatch (default instance)
npm run dev:dispatch
# or: npm run dev -- -p 3001

# Explore instance
npm run dev:explore
# or: NEXT_PUBLIC_INSTANCE=explore npm run dev -- -p 3002

# Lilly Direct instance (engagement intelligence)
npm run dev:lilly-direct
# or: NEXT_PUBLIC_INSTANCE=lilly-direct npm run dev -- -p 3003
```

**Port 3000 is not us.** `~/claude-projects/lilly/` is an unrelated legacy repository (first Claude Code project, archival only); do not run anything on 3000 expecting OS behavior. The real Lilly Direct product runs inside OS on port 3003.
