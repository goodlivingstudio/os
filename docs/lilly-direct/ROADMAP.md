# LILLY DIRECT — Roadmap (scaffold)
Established: 2026-04-10

*This document tracks active work, priorities, and completed work for Lilly Direct. It is the canonical answer to "what should I build next?"*

---

## STATUS

**Scaffold → active.** As of 2026-04-10, Lilly Direct exists as a runnable scaffold with placeholder content. The roadmap below reflects the immediate post-scaffold work, prioritized for the kickoff session and the first week of active engagement.

---

## PHASE 0 — SCAFFOLD (complete)

**Done as of 2026-04-10:**

- ✅ `lib/config/lilly-direct.ts` created with valid placeholder `InstanceConfig`
- ✅ Instance registered in `lib/config/index.ts` CONFIGS map
- ✅ Entry added to `lib/config/products.ts` with status `"wip"`
- ✅ `dev:lilly-direct` and `build:lilly-direct` npm scripts added
- ✅ All 14 canonical doc files created as structural stubs at `docs/lilly-direct/`
- ✅ Instance boots on dev port 3003 and renders
- ✅ Root docs updated with Lilly Direct references

---

## PHASE 1 — KICKOFF (2026-04-10)

**Target: complete during the first engagement session.**

### Priority 1 — Voice character decision
**What:** Decide whether Lilly Direct uses Station Chief (Dispatch), Field Correspondent (Explore), or a new character. Fill in CEREBRO-CHARTER.md with the chosen model.
**Why first:** Nothing else can be written coherently until the voice is decided. MANDATE.md, PROMPTS.md, SYSTEM-BRIEF.md all depend on knowing what the analytical function sounds like.
**Acceptance:** CEREBRO-CHARTER.md has real content in § THE CHARACTER, § REGISTER AND DELIVERY, and § BEHAVIORAL DIRECTIVES. Placeholder text gone.

### Priority 2 — Layer taxonomy definition
**What:** Decide the five-ish annotation layers Lilly Direct scores against. The scaffold placeholder uses Therapeutic / Regulatory / Digital / Organizational / Competitive — may be right, may not be. Fill in MANDATE.md § Layer taxonomy with final layers and definitions.
**Why second:** The layer taxonomy drives annotation, scoring, and feed organization. It's the most engagement-specific part of the config.
**Acceptance:** MANDATE.md has real layer definitions. `lib/config/lilly-direct.ts` updated with matching layer ids, labels, descriptions, and colors.

### Priority 3 — Mandate content
**What:** Write MANDATE.md in full: THE LILLY DIRECT MODEL, THE ENGAGEMENT, THE OPERATOR'S POSITION, THE INTELLIGENCE MODEL, SYNTHESIS PURPOSE, GENERATIVE BRIEF CLUSTER, WHAT LILLY DIRECT IS NOT. Derive operator context from `../os/OPERATOR.md` rather than restating.
**Why third:** Mandate is the source of truth that PROMPTS.md and every downstream surface derives from.
**Acceptance:** MANDATE.md has no `[PLACEHOLDER]` strings. `lib/config/lilly-direct.ts` mandate blocks updated to match.

### Priority 4 — Source inventory
**What:** Populate SOURCES.md with the real feed list. Update `lib/config/lilly-direct.ts` `feeds` array to match. Start with ~10-15 sources, expand from SOURCES-MEGALIST.md as candidates earn their place.
**Why fourth:** The feed is the foundation of every downstream surface. Bad sources → bad intelligence.
**Acceptance:** SOURCES.md lists each active source with mode, layer, rationale, and last-reviewed date. Config matches.

### Priority 5 — Initial watchfile
**What:** Populate WATCHFILE.md with the three to five watch items that should be active from day one — probably engagement-relationship items, a donanemab care coordination item, and a GLP-1 competitive item at minimum.
**Why fifth:** Without a watchfile, Cerebro drifts into reactive mode. The initial watchfile makes Lilly Direct proactive from day one.
**Acceptance:** At least 3 active watch items with severity, triggers, and reasons.

### Priority 6 — Live environment
**What:** Populate LIVE-ENVIRONMENT.md with the current state of the engagement terrain. Laree Ross relationship specifics, current pharma context, active tensions.
**Why sixth:** Anchors the scoring rules to real-world state. Gets updated near-continuously thereafter.
**Acceptance:** LIVE-ENVIRONMENT.md has no placeholder sections. Dated and reviewable.

### Priority 7 — Deploy to Vercel
**What:** Create the Vercel project. Connect to the repo. Set `NEXT_PUBLIC_INSTANCE=lilly-direct`. Set secrets. Assign a domain. First deploy.
**Why seventh:** Until it's deployed, the engagement has no live surface to use. After the first six priorities are done, deployment is straightforward.
**Acceptance:** Live URL. Feed populates. Cerebro responds with Lilly Direct's voice. `lib/config/products.ts` updated with real URL and status `"production"` (or `"wip"` until content stabilizes).

---

## PHASE 2 — EARLY ENGAGEMENT (first week after kickoff)

### Content fill-in
- Complete SYSTEM-BRIEF.md with real visual language decisions
- Complete ARCHITECTURE.md with real surface inventory and deployment notes
- Complete ANTI-PATTERNS.md with the first few product-specific prohibitions
- Complete PROMPTS.md with all surface prompts in copyable form

### Watchfile growth
- Add items as they emerge from the engagement
- Retire items that have resolved
- Track escalations

### Source tuning
- Remove sources that aren't producing usable signal
- Promote candidates from SOURCES-MEGALIST.md
- Identify gaps that the current active feed can't fill

### Voice calibration
- Start VOICE-CALIBRATION.md log with real usage observations
- Note any drift between what the character is supposed to be and what it actually sounds like

---

## PHASE 3 — ONGOING

### Weekly
- Review LIVE-ENVIRONMENT.md and update active tensions
- Review WATCHFILE.md and update severity ratings
- Write any calibration entries in VOICE-CALIBRATION.md

### Monthly
- Review source performance and rotate as needed
- Audit MANDATE.md for drift against how the engagement is actually evolving
- Update ROADMAP.md with next-month priorities

### Quarterly
- Full doc set review for drift
- Check DOC-AUTHORITY.md known-drift section
- Consider promoting any Lilly Direct-specific pattern back into shared OS code if it's general

---

## OPEN QUESTIONS FOR KICKOFF

1. Does Lilly Direct need its own domain, or does it live under `lilly.goodliving.studio` (studio-owned), `dispatch.goodliving.studio/lilly` (nested), or a client-owned domain?
2. Is there anything in the engagement that requires confidentiality handling beyond normal operating practice?
3. What's the first engagement deliverable Lilly Direct is supposed to support? That deliverable should become the first WATCHFILE item and should shape the Act-stage surface inventory in ARCHITECTURE.md.
4. Does Lilly Direct need a visual surface (gallery) at all? If not, delete the gallery-related scaffold files? (Current answer: keep them scaffolded; activating or deleting is a future decision.)

---

*Update this document when: a priority lands (mark it done); a new priority emerges; a phase completes; an open question gets answered and shapes future work.*
