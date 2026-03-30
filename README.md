# Dispatch

**Directed Intelligence for Strategic Positioning Across Technology, Culture & Healthcare**

Personal field intelligence platform. Aggregates curated signal feeds, synthesizes relevance through AI annotation, and provides strategic advisory via Cerebro — a conversational agent tuned to career positioning and mandate alignment.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **AI:** Anthropic Claude (Sonnet) via `@anthropic-ai/sdk`
- **Data:** 27 curated RSS sources across policy, AI, design, healthcare, market, culture
- **Persistence:** Vercel KV for conversation memory
- **Styling:** Tailwind CSS v4, three-skin theme system (Mineral, Slate, Forest)
- **Hosting:** Vercel (API + SSR), GitHub (source)

## Architecture

```
app/
  page.tsx          Main client — feed, signals, Cerebro chat
  layout.tsx        Root layout, metadata, skip link
  globals.css       Skin system, animations, a11y
  api/
    chat/           Cerebro agent (agentic loop, web search, follow-ups)
    news/           RSS aggregation + annotation
    annotate/       Article relevance scoring
    brief/          Signal synthesis (Chief of Staff)
    health/         Deployment diagnostics
components/
  ticker.tsx        Signal headline ticker
  analytics-panel.tsx  Interactive dashboard (Recharts)
lib/
  memory.ts         Vercel KV session persistence
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
npm run dev -- -p 3001
```

Port 3001. Not 3000 — that's Lilly.
