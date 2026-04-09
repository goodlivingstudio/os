# OS — Shared Architecture
Established: 2026-04-09 (stub)

*This document is canonical for OS's shared codebase — the infrastructure that every product instance inherits when it runs. It describes what lives in the shared layer (one codebase, many instances) vs what lives in each product's instance config. It is the structural counterpart to each product's own ARCHITECTURE.md, which describes the product-specific decisions sitting on top of this shared foundation.*

*See `DOC-AUTHORITY.md` for the inheritance model. See `PIPELINE.md` for the shared intelligence pipeline pattern every product implements. See each product's ARCHITECTURE.md (`../dispatch/ARCHITECTURE.md`, `../explore/ARCHITECTURE.md`) for the product-specific architectural decisions.*

---

## STATUS

**Stub.** Content to be written. This file exists so OS's doc set includes a canonical description of the shared codebase — currently a real gap. Each product has its own ARCHITECTURE.md, but the shared infrastructure underneath has no canonical home. This file closes that gap.

---

## WHAT THIS DOCUMENT WILL OWN

When written, ARCHITECTURE.md will describe:

- **The shared stack.** Next.js 16 (App Router), React 19, TypeScript, Anthropic Claude via `@anthropic-ai/sdk`, Tailwind CSS v4, Vercel KV for persistence, Vercel deployment. Why these choices and what they enable.
- **The white-label pattern.** How `lib/config/` works. The `InstanceConfig` schema in `lib/config/types.ts`. The `NEXT_PUBLIC_INSTANCE` environment variable. How `lib/config/index.ts` selects the active config and exposes it to the rest of the codebase. The boot sequence when a new instance starts.
- **The shared API routes.** What lives in `app/api/` and is shared across all instances: chat (Cerebro), news (RSS aggregation), annotate (relevance scoring), brief (synthesis), health (diagnostics). How each route reads instance-specific config and behaves differently per product.
- **Shared components and lib.** The shared `components/` (ticker, analytics-panel, etc.) and shared `lib/` (memory, skin system, annotation engine, prompt assembly). What's truly shared vs what should eventually be pulled into instance-specific code.
- **The instance boot sequence.** What happens when `NEXT_PUBLIC_INSTANCE=explore npm run dev` runs. How the config loads, how the branding applies, how the source list gets injected, how the prompt blocks get assembled.
- **How a new product instance is added.** The concrete steps: create `lib/config/<product>.ts`, add to `lib/config/index.ts`, create `docs/<product>/` with the canonical doc set shape, create a Vercel project and domain, set environment variables. This is the spin-up checklist as a canonical reference.
- **Deployment topology.** How Vercel hosts multiple instances from one repo. How domains map (`dispatch.goodliving.studio`, `explore.goodliving.studio`, etc.). How environment variables scope per deployment.
- **The historical naming artifact.** The on-disk folder and GitHub repo are named `dispatch/` for historical reasons — this section explains the situation, the rename-to-`os` operation that's pending, and why it hasn't been done yet.

---

## WHY THIS DOCUMENT EXISTS

Right now the shared codebase is undocumented. New sessions learning the OS have to reconstruct the white-label pattern from reading `lib/config/` source, which works but is expensive and error-prone. Product-level ARCHITECTURE docs describe individual products, not the shared foundation — which means the thing that actually runs all four products has no canonical description.

This document closes that gap. It's the doc a new contributor would read first to understand how the OS is built. It's also the doc that governs shared-infra decisions — when should a pattern be promoted from one product into the shared layer? When should a shared pattern be forked for product-specific needs? This file owns those decisions.

---

## QUESTIONS TO ANSWER BEFORE WRITING

1. What's the authoritative boot sequence when a new instance spins up? (The instance spinup checklist memory has 12 steps — can those become canonical here?)
2. What's currently in the shared layer that should actually be product-specific, and vice versa?
3. How should the document handle forks? When Explore diverges from a shared route, should the divergence be documented here, in Explore's ARCHITECTURE, or both?
4. Should this file include the Vercel / CNAME / GitHub topology, or should that be its own doc?
5. When the rename-to-`os` operation happens, this file becomes the authoritative migration plan. Should we start drafting that plan here now, or wait until the operation is scheduled?

---

*Update this document when: a new pattern is promoted into the shared layer; a shared pattern is forked for product-specific needs; a new product instance is added; the deployment topology changes; the stack is upgraded materially; the rename-to-`os` operation is planned or executed.*
