# OS — Good Living Studio

This repository is **OS** — the ambient intelligence layer that holds shared philosophy, operator context, and authority for four sibling products: **Dispatch**, **Explore**, **Atlas**, and **Lilly**. OS is not a command center. It is the atmosphere that's already present before any of the four products start thinking.

## Naming note — READ FIRST

The repository's on-disk folder, GitHub remote, and package.json `name` are historically **`dispatch`** because Dispatch was the first product built here. Conceptually this folder IS OS. A future dedicated operation will rename the folder and remote to `os`; until then, treat the on-disk name as an artifact of history, not as identity.

**When speaking about the container, call it OS. When speaking about the personal intelligence product, call it Dispatch.** Do not conflate them. Do not call the container "the dispatch repo" or "the Mother repo" — both are wrong.

## The four products

Each product runs from this shared codebase via a white-label instance config in `lib/config/`:

- **Dispatch** — personal intelligence. Runs at **port 3001** in dev, deploys to `dispatch.goodliving.studio`. Default instance when no `NEXT_PUBLIC_INSTANCE` is set. In production.
- **Explore** — civic/team intelligence. Runs at **port 3002** in dev (`NEXT_PUBLIC_INSTANCE=explore`), will deploy to `explore.goodliving.studio`. Doc set complete; build active.
- **Atlas** — decision capture. The layer that makes the between-state visible. Currently **on hold**. Lives as a separate repository at `~/claude-projects/atlas/` with its own stack. Strategic doc placeholder at `docs/atlas/README.md` reserves its seat in OS.
- **Lilly** — engagement intelligence. Starts **2026-04-10**. Working product name: *Lilly Direct* (final name TBD). Will run as a new white-label instance inside OS. Doc set to be established this week at `docs/lilly/`.

## Doc hierarchy

```
docs/
├── os/             Shared atmosphere — OPERATOR, DOCTRINE, PASSAGE, DOC-AUTHORITY
├── dispatch/       Dispatch product doc set
├── explore/        Explore product doc set
├── atlas/          Atlas placeholder (on hold)
└── lilly/          Lilly placeholder (starts 2026-04-10)
```

When product docs reference shared philosophy or operator context, they inherit from `docs/os/`. OS-level docs win on principle and intent. Product docs win on project-specific implementation. See `docs/os/DOC-AUTHORITY.md` for the full inheritance model.

## Lineage

OS inherits concepts, vocabulary, and philosophical commitments from an earlier thesis Jeremy Grant has been developing since August 2025 called **The Machine**. OS is NOT The Machine — The Machine is the conceptual grandfather. The Machine docs live with the operator, not in this repo. OS is the narrower application of that tradition to a specific body of work.

Vocabulary like *ambient*, *atmospheric*, *creative convergence*, *Flow State*, and *Paradox* comes from The Machine lineage and is used deliberately in OS prose. When editing OS-level or product-level documents, prefer this vocabulary over generic synonyms.

## BEFORE USING ANY TOOL

1. Confirm your working directory is `/Users/jeremygrant/claude-projects/dispatch/` (or a worktree inside it at `.claude/worktrees/*`).
2. **Port 3000 is NOT us.** `~/claude-projects/lilly/` is an **unrelated legacy repository** — Jeremy's first Claude Code project, kept for archival reasons. It is NOT the Lilly Direct product that starts Friday. Stay off port 3000 and stay out of that folder unless explicitly asked.
3. If a dev-mode screenshot shows "Eli Lilly", "Extraordinary medicine", or any Lilly-branded chrome: **STOP**. You are either in the legacy lilly repo (wrong) or running OS with a Lilly instance config that doesn't exist yet. Confirm the folder and port before continuing.
4. The dev identity badge "DISPATCH · :3001" appears bottom-left in dev mode when the default instance runs. A different badge means a different instance of OS is running — still OS, just a different product.

## Session logs

At the end of each working session (or on request), produce a commit log and summary: what shipped, what's open, what's next. Logs live in conversation, not as committed files.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
