# LILLY DIRECT — Watchfile (scaffold)
Established: 2026-04-10 (scaffold — items land at kickoff)

*This document tracks active watch items — specific people, initiatives, deals, deadlines, decisions, or dynamics that Lilly Direct is monitoring in real time. Each item has a severity rating, a reason it matters, triggers that would change its severity, and an escalation protocol. It is distinct from LIVE-ENVIRONMENT.md (which describes the broader terrain) in that WATCHFILE is granular, named, and event-driven.*

*See LIVE-ENVIRONMENT.md for the broader context watch items sit inside. See CEREBRO-CHARTER.md for how the analytical function should surface watchfile items in conversation — these are the items Cerebro is authorized to bring up unprompted.*

---

## STATUS

**Scaffold.** Empty at kickoff. Items are added as specific trackable things emerge from the engagement. Explore's WATCHFILE.md is the mature template — it's structured around six active watch items with severity ratings, log format, and escalation protocols.

---

## WHAT THIS DOCUMENT WILL OWN

When populated, WATCHFILE.md contains a live, enumerated list of active watch items. Each item follows this structure:

```
### [Item Name]

**Severity:** [High / Medium / Low — or 1-5]
**Category:** [Engagement / Therapeutic / Regulatory / Competitive / Organizational]
**Why:** [One paragraph on the specific consequence if this item resolves in a given direction.]
**Triggers:** [What events would change the severity or close the item.]
**Last reviewed:** [YYYY-MM-DD]
**Related layers:** [Which of Lilly Direct's annotation layers this item lives in.]
**Notes:** [Ongoing observations as the item evolves.]
```

### Expected categories at kickoff

- **Engagement watch items.** The Lilly Direct engagement itself — milestones, contract dynamics, stakeholder changes, decision points that affect the work. Probably the highest-severity category during the first few weeks of active engagement.

- **Therapeutic area watch items.** Clinical trial outcomes, approval decisions, reimbursement events, patient population data points. Example: "Donanemab monthly infusion infrastructure — when and whether Lilly publicly addresses the care coordination gap. Severity: High. Triggers: any Lilly statement on care coordination, any real-world study publishing care coordination outcomes, any competitor launching a similar product."

- **Competitive watch items.** Specific named competitor moves. Novo Nordisk trial readouts. Pfizer oral GLP-1 development milestones. Other pharma CDO hires or internal restructures that signal strategic direction.

- **Organizational watch items.** Lilly internal signals — Rau's AI mandate progression, NVIDIA partnership visible outputs, hiring in the innovation team, any executive commentary that frames the strategic environment.

- **Regulatory watch items.** FDA actions, EMA decisions, specific policy debates affecting Lilly products.

- **Infrastructure watch items.** Things in the Lilly Direct stack itself that could force adaptation — Anthropic model changes, Vercel platform shifts, Next.js breaking changes. Low severity mostly but worth tracking.

---

## HOW THE WATCHFILE IS USED

1. **Cerebro reads WATCHFILE at session start.** The watchfile items become part of the Cerebro context. This lets Cerebro bring up watchfile changes unprompted ("The Novo Nordisk data you were watching landed this morning. Here's what it means for the Lilly competitive position.")

2. **The brief surface elevates watchfile-related signals.** When an annotated article is related to an active watch item, its score gets boosted. A low-urgency article that's actually about a high-severity watch item should rise above a high-urgency article that's unrelated to any watch item. The scoring implementation of this lives in the shared pipeline; the watchfile itself is the data.

3. **Escalation rules.** When a watch item changes severity (e.g., from Medium to High because new information landed), Cerebro should flag the change in the next session. When an item closes (resolves one way or another), Cerebro should note the resolution and what it means.

4. **Weekly review.** At least weekly, Jeremy reviews the watchfile: which items are still relevant, which have changed severity, which have closed, which new items need to be added.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **What are the three to five watch items that should be active from day one?** The scaffold is empty but there are probably obvious candidates based on the engagement context in `../os/OPERATOR.md`.
2. **What specific Lilly deliverable dates or milestones should be watch items?** If there's a first major engagement meeting, a first deliverable, a specific decision point — those become High-severity items immediately.
3. **Which competitor moves are most consequential to track?** Every pharma competitor has things happening constantly; the watchfile should capture only the moves that would materially change what Lilly Direct prioritizes.
4. **Who are the specific named people whose public moves should auto-elevate signal?** Rau, Dave Ricks, specific R&D leaders, specific innovation team leaders — if there are 5-10 specific names whose public statements or moves should automatically become high-signal, list them here.
5. **Is there a hard "watchfile stays current" cadence?** Weekly review is the default. Daily review during active engagement phases. Explicit so the rule is followed.

---

## WHY THIS DOCUMENT EXISTS

The layer taxonomy in MANDATE.md tells Lilly Direct what kinds of signals to score. The live environment tells Lilly Direct the terrain it's scoring against. The watchfile is the instrument that translates the abstract live environment into concrete, checkable state.

Without a watchfile, Cerebro drifts into reactive mode — only answering what Jeremy asks. With a watchfile, Cerebro operates proactively: "here's what changed on the things you're watching," which is the station-chief/field-correspondent discipline made concrete.

---

*Update this document when: a new watch item is added; an existing item's severity changes; an item closes or resolves; at least weekly during active engagement periods; or whenever Cerebro brings up a watchfile-related observation that reveals the underlying item needs refinement.*
