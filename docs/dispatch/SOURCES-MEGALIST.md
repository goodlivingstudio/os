# DISPATCH — Sources Mega List
Established: 2026-04-10

*The discovery and expansion layer for Dispatch's source inventory. This document stages candidate sources — things that have been identified, evaluated, or proposed but not yet added to the active feed. Cross-reference with `SOURCES.md` before promoting any candidate to the active inventory.*

*See `SOURCES.md` for the canonical active feed. See `LIVE-ENVIRONMENT.md` for the terrain sources are expected to illuminate — the mega list exists to close gaps identified there.*

---

## HOW THIS DOCUMENT WORKS

**Promotion protocol:** a candidate moves from here to `SOURCES.md` when it demonstrates it belongs — via a trial run of 2+ weeks, a manual evaluation against the five annotation layers, or an explicit gap it closes in the active feed. The promotion decision is the operator's.

**Organization:** by intelligence mode first (Intelligence / Formation / Positioning), then by strategic domain or annotation layer within each mode. This mirrors `SOURCES.md` structure but includes sources that haven't earned their place yet.

**Status markers:**
- **CANDIDATE** — identified but not yet evaluated
- **EVALUATING** — in a trial run or under active consideration
- **PASSED** — evaluated and ready for promotion to SOURCES.md
- **DECLINED** — evaluated and rejected, with rationale preserved
- **GAP-DRIVEN** — added specifically to close a gap identified in LIVE-ENVIRONMENT.md

---

## INTELLIGENCE MODE — CANDIDATES

### Pharma and healthcare (Opportunity layer)

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| FiercePharma | RSS | CANDIDATE | Broader pharma industry coverage than Fierce Healthcare; covers marketing, commercial, manufacturing angles |
| Pharma Intelligence / Scrip | RSS | CANDIDATE | Deep pharma pipeline intelligence. Paid — evaluate whether the free tier provides enough signal |
| MedCity News | RSS | CANDIDATE | Health tech and innovation coverage. Bridges pharma and digital health |
| Health Affairs Blog | RSS | CANDIDATE | Health policy scholarship with practical implications. Would strengthen the policy dimension of Opportunity |
| Rock Health | RSS | CANDIDATE | Digital health funding and market data. Quarterly reports are high-value Landscape signal |
| CB Insights Healthcare | RSS | CANDIDATE | Market maps, startup tracking, trend analysis in healthcare tech |

### AI and platform (Discipline + Landscape layers)

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| Simon Willison's Blog | RSS | CANDIDATE | Deep practitioner AI coverage. High signal-to-noise. Bridges Intelligence and Formation |
| The Gradient | RSS | CANDIDATE | AI research commentary aimed at practitioners, not researchers. Formation-leaning |
| Jack Clark's Import AI | Newsletter | CANDIDATE | Weekly AI policy and capability newsletter. Landscape layer |
| Ben Thompson's Stratechery | Newsletter | CANDIDATE | Business strategy and tech platform analysis. Landscape layer, high depth |
| Platformer | Newsletter | CANDIDATE | Casey Newton on platform policy and regulation. Landscape layer |

### Business, policy, and markets (Landscape layer)

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| Harvard Business Review | RSS | CANDIDATE | Org design, leadership, management — CDO role discourse sometimes surfaces here |
| McKinsey Quarterly | RSS | CANDIDATE | Enterprise transformation discourse. The operator's future employers read this |
| FDA Voice Blog | RSS | GAP-DRIVEN | Regulatory signals for pharma/AI. Currently under-monitored per LIVE-ENVIRONMENT |

---

## FORMATION MODE — CANDIDATES

### Design and creative practice (Discipline + Culture layers)

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| n+1 | RSS | CANDIDATE | Literary and cultural criticism. Deep Formation layer — judgment-shaping, not information-gathering |
| Places Journal | RSS | CANDIDATE | Architecture, landscape, urbanism writing with intellectual depth. Culture layer |
| Dezeen | RSS | CANDIDATE | Architecture and design news. Higher volume than Formation typically warrants — may need filtering |
| The Pudding | RSS | CANDIDATE | Data-driven visual storytelling. Discipline layer (craft of communication) + Culture (what stories get told) |
| Craig Mod's newsletter | Newsletter | CANDIDATE | Walking, books, technology, photography. Formation-mode sensibility-building at its purest |
| Magnum Photos | RSS | CANDIDATE | Photojournalism and visual culture. Gallery-adjacent — would inform REPLICATE-PROMPTS aesthetic frame |
| Monocle | RSS | CANDIDATE | Global culture, design, and affairs. International perspective the feed currently lacks |

### Technology and society (Landscape + Culture layers)

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| Logic Magazine | RSS | CANDIDATE | Technology criticism with depth and rigor. Formation layer |
| Real Life Magazine | RSS | CANDIDATE | Technology and culture criticism. Slower cadence, genuine analysis |
| Rest of World | RSS | CANDIDATE | Global technology coverage. Addresses the international-perspective gap from LIVE-ENVIRONMENT |

---

## POSITIONING MODE — CANDIDATES

*This section directly addresses the Positioning sub-domains strengthened in MANDATE.md: hiring intelligence, comp/market dynamics, org design signals, reputation/visibility.*

### Hiring intelligence

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| Spencer Stuart design leadership blog | Web | GAP-DRIVEN | Executive search firm with design leadership practice. CDO search patterns, comp data, market reports |
| Heidrick & Struggles design practice | Web | GAP-DRIVEN | Same as above — different firm, different networks |
| AIGA Eye on Design | RSS | CANDIDATE | AIGA's design publication. Sometimes covers design leadership discourse |
| Core77 | RSS | CANDIDATE | Industrial and product design community. CDO discourse surfaces occasionally |
| LinkedIn job alerts (CDO / Head of Design) | Manual | GAP-DRIVEN | Specific filtered alerts for CDO, VP Design, Head of Design at healthcare/pharma companies. Not an RSS feed — requires manual monitoring or LinkedIn notification setup |

### Org design and leadership discourse

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| Org Design Podcast (Jay Galbraith heritage) | Podcast | CANDIDATE | Org design thinking from practitioners. Rare topic for podcasts |
| Lenny's Newsletter | Newsletter | CANDIDATE | Product management and product leadership. The PM-side discourse that CDOs need to be fluent in |
| Intercom Blog | RSS | CANDIDATE | Product and design leadership at scale. Org design signals from a design-forward company |

### Reputation and visibility tracking

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| Google Alerts: "Jeremy Grant" + design | Alert | GAP-DRIVEN | Operator's own name visibility. The Positioning layer scores the market but doesn't score the operator's presence. This closes the gap named in LIVE-ENVIRONMENT |
| Conference CFPs (SXSW, Config, Figma, etc.) | Manual | GAP-DRIVEN | Speaking opportunities with positioning value. Not an RSS feed — requires active monitoring |
| Design leadership Substacks / LinkedIn voices | Manual | GAP-DRIVEN | What the operator's peer set is publishing. Competitive positioning intelligence |

---

## GAP-DRIVEN DISCOVERY — FROM LIVE-ENVIRONMENT

*These candidates were identified specifically because LIVE-ENVIRONMENT.md § WHAT'S CONSPICUOUSLY ABSENT named the terrain they cover.*

### Government and public-sector design leadership

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| USDS Blog | RSS | GAP-DRIVEN | Federal digital services design leadership. The federal CDO-equivalent path |
| GSA / 18F Blog | RSS | GAP-DRIVEN | Federal technology and design practice. TTS (Technology Transformation Services) discourse |
| Federal CDO Council publications | Web | GAP-DRIVEN | If discoverable — federal Chief Design Officer equivalents. Position + Landscape layers |
| GOV.UK Design System Blog | RSS | GAP-DRIVEN | The gold standard for civic design practice. International but directly relevant to the federal design leadership path |

### International design leadership discourse

| Source | Type | Status | Rationale |
|--------|------|--------|-----------|
| Design Council UK | RSS | GAP-DRIVEN | UK national design body. CDO-equivalent discourse in a different governance model |
| IF (Interaction Foundation) | RSS | GAP-DRIVEN | Nordic/European design institution discourse. Design leadership in public and social contexts |
| Design Korea / Japan Design Foundation | Web | CANDIDATE | Asian design leadership discourse. Less accessible in English but worth monitoring for translated publications |

---

## DECLINED SOURCES

*Sources evaluated and rejected. Rationale preserved to prevent re-evaluation.*

*(No declined sources yet — mega list established 2026-04-10.)*

---

## PROMOTION LOG

*When a source moves from this list to `SOURCES.md`, log it here with date and rationale.*

*(No promotions yet — mega list established 2026-04-10.)*

---

*Update this document when: a candidate source is identified; a source is evaluated (pass or fail); a gap in the active feed is discovered via LIVE-ENVIRONMENT or WATCHFILE; or before the next quarterly source review.*
