# LILLY DIRECT — Architecture (scaffold)
Established: 2026-04-10 (scaffold — content lands at kickoff)

*This document is canonical for how Lilly Direct is built — tech stack, API routes, data flow, surface inventory, AI surface specifications, and infrastructure. It describes Lilly Direct-specific architectural decisions sitting on top of the shared OS foundation at `../os/ARCHITECTURE.md`.*

*Read `../os/ARCHITECTURE.md` first to understand the white-label pattern, the instance loader, the shared API routes, and the boot sequence. This document only covers what's different or specific about Lilly Direct.*

---

## STATUS

**Scaffold.** Lilly Direct runs as instance `lilly-direct` from the shared OS codebase as of 2026-04-10. The instance boots cleanly on dev port 3003 via `npm run dev:lilly-direct` or `NEXT_PUBLIC_INSTANCE=lilly-direct next dev -p 3003`. Content is placeholder — the config file at `lib/config/lilly-direct.ts` satisfies the `InstanceConfig` interface with stub values so types resolve and the shared infrastructure adapts correctly. Real architectural decisions (beyond "it runs") happen at kickoff.

Dispatch's `ARCHITECTURE.md` is the closest template — it's mature and describes a single-operator intelligence system running on the shared OS. Explore's `ARCHITECTURE.md` is itself a scaffold.

---

## WHAT THIS DOCUMENT WILL OWN

When written, ARCHITECTURE.md will describe:

- **§ Shared foundation** — what Lilly Direct inherits unmodified from OS (Next.js 16, React 19, TypeScript, Anthropic Claude via `@anthropic-ai/sdk`, Vercel KV for conversation memory and article cache, the shared API routes for news/annotate/brief/chat/synthesis, the lib/config/ white-label pattern, instance ID prefixing on all storage keys).
- **§ Lilly Direct-specific instance config** — how `lib/config/lilly-direct.ts` differs from dispatch.ts and explore.ts. Mandate content, layer taxonomy, source list, branding, skins, any optional feature flags.
- **§ Surface inventory** — which of the shared surfaces Lilly Direct exposes (Signal feed? Cerebro chat? Synthesis? Gallery? Audio brief? Dispatch-style content pipeline?) and which it omits. Not every product needs every surface, and Lilly Direct's client-engagement context may argue for surfacing less than Dispatch does by default.
- **§ Engagement-specific data flow** — how signal flows through the pipeline for this product. Where does it diverge from the shared pattern? Any additional filters, annotation rules, or caching behaviors specific to pharma intelligence? Any additional KV keys or deployment-specific state?
- **§ AI surface specifications** — which Claude model each surface uses (inherited defaults unless a surface genuinely needs a different model), context window strategy, and how the voice character from `CEREBRO-CHARTER.md` gets enforced at the prompt assembly layer.
- **§ Deployment topology** — where Lilly Direct deploys. Vercel project naming. Domain (`lilly.goodliving.studio` per the placeholder config, or a client-owned domain, or nothing public-facing at all if it's a private tool). Environment variables beyond the shared set.
- **§ Known divergences from the shared OS** — any place Lilly Direct has forked shared behavior for engagement-specific needs. Flagged explicitly so the divergence can be revisited later (either promoted back into shared code if another product needs the same behavior, or kept as an intentional fork).
- **§ Confidentiality and data handling** — does the engagement impose any constraints on how Lilly Direct handles signal data? Client-sensitive intelligence, embargoed information, internal Lilly context — what's in scope and what's not? This section may not exist if the engagement doesn't impose constraints beyond normal operating practice.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **Which surfaces does Lilly Direct expose?** Dispatch has 6-8 surfaces (Signal, Audio, Synthesis, Surface/Gallery, Cerebro, Config, Dispatch/Content, sometimes Weekly). Lilly Direct probably doesn't need all of them. Which are load-bearing for the engagement?
2. **Does Lilly Direct deploy publicly?** If yes, to what domain? Client-owned, studio-owned, or behind-a-login? If no, is it a local-only tool, or a private Vercel project Jeremy accesses via an internal URL?
3. **Any confidentiality constraints on the intelligence?** If Jeremy is handling non-public Lilly context in the mandate or the source list, the architecture needs to treat that data carefully. Specifically: does Cerebro's web search (Exa) need to be restricted for this instance? Does the article cache need a shorter TTL? Does the KV session persistence need additional encryption?
4. **Does it use Vercel KV at all?** The shared default is yes. But if this product is a pre-meeting intelligence tool rather than a persistent conversation partner, maybe conversation persistence isn't needed — and simpler is better.
5. **What's the engagement's cadence?** Weekly pre-meeting briefs (synthesis runs on a weekly schedule)? Continuous (same as Dispatch's daily cadence)? Project-milestone-triggered? The cadence shapes whether the pipeline is background-continuous or operator-triggered.

---

## WHY THIS DOCUMENT EXISTS

The shared OS architecture handles the general case. Every product-specific architecture doc exists to name the product's specific decisions on top of that foundation. Without this document, a future session reading Lilly Direct's code would have to reconstruct the architectural intent from the source — expensive, error-prone, drifts over time. Writing this at kickoff (ahead of substantial product-specific code) means the code inherits from the doctrine rather than being retrofitted to it.

---

*Update this document when: a new API route is added or a shared route is forked for Lilly Direct-specific behavior; a deployment target changes; a new AI surface is added or retired; infrastructure is upgraded; confidentiality constraints change; or when a reviewer reading the code disagrees with what this doc says.*
