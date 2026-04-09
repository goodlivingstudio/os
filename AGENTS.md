# OS — Good Living Studio

This repository is **OS** — the ambient intelligence layer that holds shared philosophy, operator context, and authority for four sibling products: **Dispatch**, **Explore**, **Atlas**, and **Lilly**. OS is not a command center. It is the atmosphere that's already present before any of the four products start thinking.

## Naming note — READ FIRST

The repository's on-disk folder, GitHub remote, and package.json `name` are historically **`dispatch`** because Dispatch was the first product built here. Conceptually this folder IS OS. A future dedicated operation will rename the folder and remote to `os`; until then, treat the on-disk name as an artifact of history, not as identity.

**When speaking about the container, call it OS. When speaking about the personal intelligence product, call it Dispatch.** Do not conflate them. Do not call the container "the dispatch repo" or "the Mother repo" — both are wrong.

## The four products

Each product runs from this shared codebase via a white-label instance config in `lib/config/`:

- **Dispatch** — personal intelligence. Runs at **port 3001** in dev, deploys to `dispatch.goodliving.studio`. Default instance when no `NEXT_PUBLIC_INSTANCE` is set. In production. Voice character: Station Chief.
- **Explore** — civic/team intelligence. Runs at **port 3002** in dev (`NEXT_PUBLIC_INSTANCE=explore`), will deploy to `explore.goodliving.studio`. Doc set complete; build active. Voice character: Field Correspondent.
- **Atlas** — decision capture. The layer that makes the between-state visible. Currently **on hold**. Lives as a separate repository at `~/claude-projects/atlas/` with its own stack. Strategic doc placeholder at `docs/atlas/README.md` reserves its seat in OS.
- **Lilly Direct** — engagement intelligence for Eli Lilly's innovation team. Runs at **port 3003** in dev (`NEXT_PUBLIC_INSTANCE=lilly-direct`). **Scaffolded 2026-04-10.** All 14 canonical doc files exist as structural stubs at `docs/lilly-direct/`; content lands during kickoff. Voice character: TBD at kickoff (Station Chief, Field Correspondent, or new).

## Doc hierarchy

```
docs/
├── os/             Shared atmosphere — OPERATOR, DOCTRINE, PASSAGE, VOICE, PIPELINE,
│                   ARCHITECTURE, GLOSSARY, DOC-AUTHORITY (8 OS-level docs)
├── dispatch/       Dispatch product doc set (14 canonical files)
├── explore/        Explore product doc set (14 canonical files)
├── atlas/          Atlas placeholder README (on hold, separate repo)
└── lilly/          Lilly Direct product doc set (14 canonical files, all currently stubs)
```

When product docs reference shared philosophy or operator context, they inherit from `docs/os/`. OS-level docs win on principle and intent. Product docs win on project-specific implementation. See `docs/os/DOC-AUTHORITY.md` for the full inheritance model.

## Lineage

OS inherits concepts, vocabulary, and philosophical commitments from an earlier thesis Jeremy Grant has been developing since August 2025 called **The Machine**. OS is NOT The Machine — The Machine is the conceptual grandfather. The Machine docs live with the operator, not in this repo. OS is the narrower application of that tradition to a specific body of work.

Vocabulary like *ambient*, *atmospheric*, *creative convergence*, *Flow State*, and *Paradox* comes from The Machine lineage and is used deliberately in OS prose. When editing OS-level or product-level documents, prefer this vocabulary over generic synonyms.

## BEFORE USING ANY TOOL

1. Confirm your working directory is `/Users/jeremygrant/claude-projects/dispatch/` (or a worktree inside it at `.claude/worktrees/*`).
2. **Port 3000 is NOT us.** `~/claude-projects/lilly/` is an **unrelated legacy repository** — Jeremy's first Claude Code project, kept for archival reasons. It is NOT the Lilly Direct product (which runs as an OS instance inside THIS repo on port 3003). Stay off port 3000 and stay out of that folder unless explicitly asked.
3. If a dev-mode screenshot shows "Extraordinary medicine" or any Eli Lilly corporate-branded chrome: **STOP**. You are in the legacy lilly repo (wrong) — the real Lilly Direct product lives inside OS and renders its own Good Living Studio chrome.
4. The dev identity badge appears bottom-left in dev mode and names the active instance: "DISPATCH · :3001", "EXPLORE · :3002", or "LILLY DIRECT · :3003". If the badge doesn't match the instance you intended to run, check `NEXT_PUBLIC_INSTANCE` and the port.

## Session logs

At the end of each working session (or on request), produce a commit log and summary: what shipped, what's open, what's next. Logs live in conversation, not as committed files.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
