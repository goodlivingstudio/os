# LILLY DIRECT — Sources (scaffold)
Established: 2026-04-10 (scaffold — inventory lands at kickoff)

*This document is the canonical source inventory for Lilly Direct. Every source in the active feed exists here with a mode assignment, a layer assignment, a rationale, and a last-reviewed date. The `feeds`, `podcasts`, and `gallerySources` arrays in `lib/config/lilly-direct.ts` derive from this file.*

*See SOURCES-MEGALIST.md for the discovery/staging layer — candidate sources under evaluation before they earn a place in the active feed.*

---

## STATUS

**Scaffold.** The scaffold placeholder in `lib/config/lilly-direct.ts` has five minimum-viable feeds so the API returns something on first boot:

- Lilly Newsroom RSS (Therapeutic layer)
- STAT News (Therapeutic)
- Endpoints News (Regulatory)
- BioPharma Dive (Competitive)
- Fierce Healthcare (Digital)

These are five of the most reliable pharma intelligence sources, chosen because they produce usable signal from day one without requiring curation decisions. They are NOT the final source list — they are the bootstrap.

---

## WHAT THIS DOCUMENT WILL OWN

When written at kickoff, SOURCES.md will contain the complete active feed inventory. Each source entry:

```
### [Source Name]
- **URL:** [feed URL]
- **Mode:** [Intelligence / Formation / Positioning — or whatever Lilly Direct's modes are]
- **Layer:** [Therapeutic / Regulatory / Digital / Organizational / Competitive — or whatever Lilly Direct's layers are]
- **Rationale:** [One sentence on why this source belongs in the active feed for THIS engagement]
- **Last reviewed:** [YYYY-MM-DD]
```

Organized by category. Expected categories (may shift at kickoff):

- **Lilly-first sources.** Lilly Newsroom, Lilly SEC filings, Lilly investor calls transcribed, any public Lilly executive communications. Probably the smallest category but the highest signal.
- **Pharma trade press.** STAT News, Endpoints, BioPharma Dive, Fierce Pharma, Pharmaceutical Technology, PMLiVE.
- **Regulatory signal.** FDA announcements, EMA decisions, reimbursement policy (CMS, NICE, etc.), international approvals.
- **Competitive pharma.** Novo Nordisk (primary GLP-1 competitor), Pfizer, Sanofi, BMS, Roche, Merck, AbbVie.
- **Therapeutic area deep sources.** GLP-1 / metabolic, Alzheimer's / neurology, oncology, immunology. Probably one or two sources per active area.
- **Digital health and AI-pharma.** Where the intersection of Lilly Direct's mandate lives. MobiHealthNews, Rock Health commentary, specific AI-in-pharma analysts.
- **Healthcare policy and business.** HBR healthcare pieces, McKinsey Pharma & Life Sciences, Deloitte Pharma perspectives.
- **Longer-form analysis.** For Formation-mode consumption (or Lilly Direct's equivalent of Formation). In-depth healthcare systems thinking, clinical leadership commentary.

### Gap analysis section

After the inventory, a gap analysis: which annotation layers are under-represented in the current source mix? What's missing that would materially improve Lilly Direct's intelligence quality? This section feeds the SOURCES-MEGALIST.md discovery process.

### Source maintenance protocol

How often the source list gets reviewed. What triggers adding or removing a source. Who decides. (Probably Jeremy, always — but documented so the rule is explicit.)

---

## WHY THIS DOCUMENT EXISTS

The feed is the foundation of every downstream intelligence product. Bad sources → bad annotation → bad brief → bad counsel. Good sources → everything else has a chance. This document exists so every source earns its place via a stated rationale, and so the source list stays a curated object rather than drifting into an aggregator.

The distinction between SOURCES.md (active, earned-its-place) and SOURCES-MEGALIST.md (candidates, under evaluation) is load-bearing. Without that distinction, every interesting-seeming feed ends up in the active list and the list loses its coherence.

---

## QUESTIONS TO ANSWER AT KICKOFF

1. **What sources does Jeremy already use to track Lilly?** The answer is a starting point for the active inventory.
2. **What sources does the innovation team at Lilly use internally?** If accessible, those are high-signal because they tell you what signal the team is already attending to.
3. **Which competitive pharma companies matter most for this engagement?** Not all pharma companies are equally relevant to Lilly Direct. Probably Novo Nordisk (GLP-1), Pfizer (general scale), and two or three others TBD.
4. **Are there academic or clinical journals that belong in the active feed?** NEJM, JAMA, Lancet, specific therapeutic area journals. Usually too slow for Intelligence mode but may fit Formation mode.
5. **Does Lilly Direct need any non-pharma sources?** Dispatch inherits culture, design, and AI sources because Jeremy's operator profile demands them. Lilly Direct may be narrower — strictly pharma intelligence — or may need to retain some cross-cutting signal (AI-in-enterprise for the Rau mandate context, healthcare delivery for the patient experience argument, etc.).

---

*Update this document when: a source is added to the active feed (with rationale); a source is retired from the active feed (with reason); a source's mode or layer assignment changes; or during the quarterly source review.*
