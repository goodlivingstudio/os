# Dispatch Roadmap
Updated: 2026-04-02

## Next Session — Foundation Layer
1. **Server-side annotation** — merge annotate into news API ISR cycle. Eliminates second round-trip on page load. Pre-annotated articles returned from /api/news directly.
2. **Article persistence in Redis** — 7-day rolling window in Upstash KV. Store scored articles so Synthesis and Dispatch can analyze trends over time, not just today's feed.
3. **Synthesis activation** — replace hardcoded pattern templates with real AI-generated convergence analysis. Needs a dedicated AI endpoint that reads annotated articles and produces narrative patterns.

## Second Session — The Dispatch Tab
4. **Dispatch tab (Operations)** — the action layer. Weekly brief → content brief pipeline.
   - Aggregate week's highest multi-layer signals from Redis history
   - AI-generated pitches: 4-5 publishable angles per week
   - Content briefs: thesis, target platform, talking points, adaptation notes
   - Two output modes: thought leadership (LinkedIn/Medium/Substack) vs. creative expression (IG/Lummi)
   - Track what's been published and what performed

## Parallel / Quick Wins
5. **Atlas API key swap** — OpenAI → Anthropic (all routes)
6. **Lilly API key swap** — add Anthropic key, swap code
7. **Apply shared style constants** — finish remaining TYPE token replacements across components

## Strategic (Dependent on Architecture Conversation)
8. **Mandate refinement** — restructure the five intelligence layers, update all system prompts across Brief/Chat/Annotate
9. **Braintrust integration** — prompt quality evaluation, A/B testing prompt versions
10. **Settings page polish** — annotation TTL controls, manual feed refresh, session data export

## Completed (2026-04-02)
- Full Anthropic Claude swap (Haiku for COS/Annotation, Sonnet for Cerebro)
- Exa web search + Upstash KV conversation memory
- Citation hover popovers (COS + Cerebro) with source provenance
- Configuration page: source inventory, Cerebro Station, diagnostics, preferences
- Social intelligence feeds: 10 Substack/Medium sources integrated
- Typography system: Geist Sans everywhere, Mono reserved for Cerebro voice
- Type scale consolidation: 6 tokens (xs/sm/body/reading/heading/display), 92 tokenized declarations
- Accessibility: contrast boost across all dark skins, 11px text floor, card tints per skin
- Card-based layouts across all views (feed, audio, synthesis, DCOS)
- Staggered reveal animations on all three tabs
- DCOS → cards with collapsible panel, renamed from COS
- Cerebro extracted to own component (580 lines out of page.tsx)
- 850+ lines dead code removed (analytics panel, recharts, dead annotation function)
- React.memo on FeedCard, shared feed data in lib/feeds.ts + lib/podcasts.ts
- Duplicate Economist key error fixed
- Architecture brief compiled for Claude conversation (docs/dispatch-architecture-brief.md)
- Global arrow key navigation for view modes
- Gear icon settings access in left rail
