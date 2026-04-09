# DISPATCH — Watchfile
Established: 2026-04-09 (stub)

*This document tracks active watch items — specific people, initiatives, deals, deadlines, decisions, or dynamics that Dispatch is monitoring in real time. Each item has a severity rating, a reason it matters, and an escalation protocol. It is distinct from LIVE-ENVIRONMENT.md (which describes the broader terrain) in that WATCHFILE is granular, named, and event-driven.*

*See `LIVE-ENVIRONMENT.md` for the broader context watch items sit inside. See `CEREBRO-CHARTER.md` for how Cerebro should surface watchfile items in conversation — these are the items Cerebro is authorized to bring up unprompted.*

---

## STATUS

**Stub.** Content to be written. This file exists so Dispatch's doc set matches the canonical 14-file product doc set shape defined at `../os/DOC-AUTHORITY.md`.

---

## WHAT THIS DOCUMENT WILL OWN

When written, WATCHFILE.md will contain a live, enumerated list of active watch items. Each item expected to include:

- **Name** — what is being watched
- **Severity** — how much it matters (High / Medium / Low or a 1–5 scale)
- **Why** — the specific consequence if the item resolves in a given direction
- **Triggers** — what events would change the severity or close the item
- **Last update** — when the item was last reviewed
- **Related layers** — which of the five annotation layers the item lives in

Expected categories:

- **Engagement watch items.** The Lilly engagement progress, specific milestones, contract dynamics, stakeholder changes (Laree Ross relationship, Diogo Rau decisions, etc.).
- **Market watch items.** Hiring patterns in the design leadership market, specific CDO searches or departures, comp benchmark shifts, org restructures.
- **Capability watch items.** Specific AI model releases or deprecations that affect the operator's fluency thesis or Dispatch's own infrastructure.
- **Infrastructure watch items.** Next.js breaking changes, Vercel platform shifts, Claude API changes, anything in the stack that could force Dispatch to adapt.
- **Cultural watch items.** Discourse shifts in design, architecture, film, or ideas that would change the Culture annotation layer's scoring.

---

## HOW THIS DOCUMENT IS USED

Watchfile items feed directly into Cerebro's "flag what demands attention" directive. When an item changes severity or gets closed, Cerebro should surface the change unprompted in the next session. The 7-day Redis article history feeds the "has this watch item appeared in the feed recently" check.

The watchfile is the instrument that translates the abstract live environment into concrete, checkable state. Without it, Dispatch drifts back toward being a news aggregator. With it, Dispatch stays a directed intelligence function.

---

## QUESTIONS TO ANSWER BEFORE WRITING

1. What are the three to five items you want Cerebro to check on at every session open, unprompted?
2. Which Lilly-engagement milestones should be explicit watch items with dates attached?
3. Are there specific people (designers, executives, researchers) whose movements or public statements should automatically elevate a watch item?
4. What's the escalation protocol when a High-severity item changes? (Email alert? In-feed banner? Cerebro brings it up at next session?)
5. What's the retirement protocol for a watch item once it resolves? Archive in place, or move to a log?

---

*Update this document when: a new watch item is added; an existing item's severity changes; an item is closed or resolved; at least weekly during active engagement periods.*
