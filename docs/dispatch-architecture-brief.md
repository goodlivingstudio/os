# DISPATCH — Architecture Brief for Strategic Review

You are helping Jeremy Grant restructure the intelligence architecture of DISPATCH, his personal intelligence system. This document contains the complete current state: mandate, signal taxonomy, feed sources, AI surface configurations, and how everything connects. Jeremy wants to refine the layers, sources, and prompts. Use this as the foundation for that conversation.

---

## WHAT DISPATCH IS

Dispatch is a personal intelligence system: **Directed Intelligence for Strategic Positioning Across Technology, Culture & Healthcare.**

It continuously monitors 27 RSS text sources and 40 podcast feeds, classifies every article through AI annotation across five intelligence layers, synthesizes cross-domain patterns, and provides a conversational strategic advisor (Cerebro). It runs at dispatch.goodliving.studio.

---

## THE OPERATOR

Jeremy Grant. Design Director, 15 years agency experience, founder of Good Living Studio.

- **Immediate priority:** Permalance engagement at Eli Lilly's innovation team
- **Five-year target:** Head of Design (or CDO equivalent) at a significant product organization at the intersection of technology, culture, and healthcare
- **Operating thesis:** The most important design problems of the next decade live at the intersection of AI capability, healthcare delivery, and human experience. The leaders who shape these spaces need systems thinking, domain fluency, and cultural authority — not just craft excellence.

### Lilly Context (Primary Opportunity)
- 51M patients, $80-83B projected 2026 revenue
- Diogo Rau (EVP & CIDO): mandated every employee engage with AI daily
- $1B NVIDIA AI partnership, active OpenAI collaboration
- LillyDirect: direct-to-patient pharmacy platform
- Donanemab: monthly infusions, biomarker monitoring, new care coordination challenge
- 7M Americans with Alzheimer's, most undiagnosed
- 73% of pharma digital transformations fail
- Rau: "The whole space of interacting directly with consumers is completely untouched by any medicine company in the world"

---

## THE FIVE INTELLIGENCE LAYERS (Current)

Every article gets scored 0-10 on ALL five layers. Multi-layer signals (high on 2+) are the most valuable. The layers are used for filtering the feed and for structuring AI analysis.

### Layer 1: OPPORTUNITY
Healthcare, pharma, AI-health intersection. Lilly primary but not exclusive.
- Pharma digital transformation (successes, failures, investments)
- Patient experience design and direct-to-patient models
- AI in drug discovery, clinical operations, care coordination
- Healthcare system design challenges (access, adherence, navigation)
- Company intelligence: Lilly, J&J, Pfizer, Roche, Novo Nordisk, Anthem, UnitedHealth
- FDA policy shifts that create new design requirements

### Layer 2: POSITION
Jeremy's career trajectory. Hiring signals, compensation, competitive positioning.
- Senior design leadership job postings (CDO, VP Design, Head of Design) in healthcare, pharma, regulated industries
- Compensation benchmarks and trends
- Who is hiring, who is leaving, what transitions signal
- Agency-to-in-house migration patterns
- Permalance and fractional leadership models

### Layer 3: DISCIPLINE
How design leadership is evolving as a function. Not Jeremy's career — the profession itself.
- How the best design organizations are structured
- What CDOs at Fortune 500 companies actually do day-to-day
- Where design authority is expanding (regulated industries, AI governance) vs. contracting (execution automation)
- Design engineering convergence — how it reshapes teams, roles, value
- AI's impact on design practice: what it automates, what it amplifies, what it can't touch
- Tools shaping practice: Figma, Cursor, v0, Claude, Vercel

### Layer 4: LANDSCAPE
Broader forces. Technology, policy, economics, business model shifts.
- AI policy, regulation, capability shifts (Anthropic, OpenAI, Google DeepMind, NVIDIA)
- AI tooling and infrastructure
- Technology business model evolution
- Economic signals affecting hiring, investment, industry direction
- Political and regulatory dynamics reshaping healthcare, tech, creative industries

### Layer 5: CULTURE
Taste, criticism, creative practice. The intellectual currents that make a design leader worth following.
- Architecture, industrial design, spatial practice
- Film, music, literary criticism
- Cultural commentary on technology, society, creativity
- Creative practices and philosophies of people doing exceptional work
- Emerging aesthetics, movements, counter-movements

---

## THREE AI SURFACES

### 1. COS (Chief of Staff) — The Brief
Reads the day's feed and surfaces the 3 signals that matter most right now. Runs on page load.

**Current voice directive:**
- Composed, direct, unhurried. No urgency theater.
- One signal may be Lilly-specific, one broader market/career, one something Jeremy might miss.
- Cites sources inline as [1], [2] with hover popovers showing provenance.
- Clicking a signal card sends it to Cerebro for deeper deliberation.

### 2. Cerebro — The Advisor
Conversational strategic advisor with web search and conversation memory.

**Current voice directive:**
- Trusted senior advisor, not a search engine or yes-machine
- Synthesis first — surface connections Jeremy might miss
- Name patterns across layers
- Flag noise explicitly — "this doesn't move your needle"
- Maximum 3 paragraphs. No bullet points. Tight paragraphs.
- Sycophancy is a system failure. Challenge weak reasoning.
- Labels claims: established fact, informed inference, working assumption, speculation
- Cites web search results inline as [1], [2]
- After every response: follow-up question + 2 alternative directions

**Cerebro has access to:**
- The full day's signal feed (injected as context)
- Web search via Exa API (5 results per query, agentic loop up to 5 searches)
- Conversation history (persisted 30 days via Vercel KV)

### 3. Annotation Engine — The Classifier
Silently classifies every article in the feed. Runs on each article batch.

**For each article, produces:**
- `synopsis` — one sentence: what this article covers, framed for the mandate
- `hook` (displayed as "relevance") — one sentence: why it matters to DISPATCH
- `type` — DATA | CASE | OPINION | TREND | RESEARCH | NEWS | CULTURAL
- `lens` — primary layer: OPPORTUNITY | POSITION | DISCIPLINE | LANDSCAPE | CULTURE
- `scores` — 0-10 on all five layers + urgency (0 = evergreen, 10 = act now)

### 4. Synthesis View (Partially Built)
Pattern detection across layers. Currently uses hardcoded templates for convergence patterns, not AI-generated. The briefing module is placeholder text. This surface is the least developed.

---

## COMPLETE FEED SOURCES

### RSS Text Sources (27 feeds)

**OPPORTUNITY — Healthcare & Pharma (6 sources)**
| Source | Category |
|--------|----------|
| STAT News | Healthcare & Pharma |
| BioPharma Dive | Healthcare & Pharma |
| Fierce Healthcare | Healthcare & Pharma |
| Endpoints News | Pharma Deals & FDA |
| Lilly Newsroom | Eli Lilly (direct) |
| New York Times Health | Health |

**POSITION — Design Leadership (4 sources)**
| Source | Category |
|--------|----------|
| Eye on Design (AIGA) | Design Leadership |
| Fast Company (Co.Design) | Design & Business |
| Core77 | Design Industry |
| Harvard Business Review (via Google News) | Business & Leadership |

**DISCIPLINE — Design Practice & Tooling (8 sources)**
| Source | Category |
|--------|----------|
| Vercel | Platform & Tooling |
| Linear (changelog) | Product Engineering |
| Linear (blog, via Google News) | Product Engineering |
| IBM Design | Enterprise Design |
| Dezeen (design) | Design Practice |
| Figma Blog (via Google News) | Design Tooling |
| Anthropic (via Google News) | AI Platform |
| Cursor (via Google News) | Design Engineering |

**LANDSCAPE — Technology, Policy & Markets (12 sources)**
| Source | Category |
|--------|----------|
| The Verge | Technology |
| Wired | Technology & Culture |
| MIT Technology Review | Deep Technology |
| TechCrunch | Startups & Venture |
| Politico | Policy & Regulation |
| Axios | Policy & Tech |
| Bloomberg Markets | Markets & Finance |
| The Economist (direct) | Global Business |
| The Economist (via Google News) | Global Analysis |
| New York Times Technology | Technology |
| New York Times Business | Business |
| Reuters (via Google News) | Global Wire |

**CULTURE — Taste & Criticism (9 sources)**
| Source | Category |
|--------|----------|
| The Atlantic | Ideas & Culture |
| Slate | Culture & Commentary |
| New York Times Arts | Arts & Culture |
| Dezeen (architecture) | Architecture |
| Architectural Review | Architecture Criticism |
| Pitchfork | Music & Criticism |
| n+1 | Literary & Ideas |
| Fast Company (latest) | Innovation & Culture |
| Criterion (via Google News) | Film & Cinema |

---

### Podcast Sources (40 shows)

**OPPORTUNITY (1 show)**
- The Readout Loud — Healthcare

**POSITION (7 shows)**
- Lenny's Podcast — Product & Design
- Design Matters — Design Leadership
- HBR IdeaCast — Business
- HBR On Leadership — Leadership
- HBR On Strategy — Strategy
- McKinsey Podcast — Strategy
- Inside the Strategy Room — Strategy

**DISCIPLINE (6 shows)**
- The a16z Show — Tech & Venture
- Hard Fork — Technology
- AI Daily Brief — AI
- Acquired — Tech & Business
- Latent Space — AI Engineering
- No Priors — AI & Venture

**LANDSCAPE (12 shows)**
- The Daily — News
- Ezra Klein Show — Policy & Ideas
- Up First — News
- Today, Explained — News & Policy
- Consider This — News
- Bloomberg Tech — Technology
- Big Take — Business
- Bloomberg Businessweek — Business
- Economist Podcasts — Global Analysis
- On with Kara Swisher — Tech & Media
- The Political Scene — Politics
- Political Gabfest — Politics

**CULTURE (11 shows)**
- Radiolab — Science & Ideas
- Hidden Brain — Behavioral Science
- Throughline — History
- Fresh Air — Interviews
- Time Sensitive — Design & Culture
- Broken Record — Music & Creativity
- New Yorker Radio Hour — Culture & Ideas
- 99% Invisible — Design & Architecture
- Code Switch — Culture
- Book of the Day — Books
- The Rewatchables — Film

---

## SIGNAL PROCESSING PRINCIPLES

1. **Relevance is not binary.** Every signal exists on a spectrum from noise to essential. The system scores, it does not hide.
2. **Multi-layer signals are the most valuable.** Cross-domain convergence is the highest-value intelligence.
3. **Recency decays.** Today's signal > last week's. Urgency scoring reflects this.
4. **Source credibility is weighted.** HBR analysis ≠ TechCrunch headline. Anthropic research paper ≠ blog post about Anthropic.
5. **The whole corpus is available.** Nothing filtered out. Architecture makes it navigable.
6. **Everything flows toward Cerebro.** Every view, every signal, every synthesis has a path to the conversational layer.

---

## WHAT JEREMY WANTS TO RETHINK

Jeremy is looking at this architecture with fresh eyes after seeing it function. Areas for discussion:

1. **The five layers** — Are these the right categories? Do the labels make sense as user-facing filters? Should they be restructured?
2. **Feed sources** — Are these the right 27 text sources and 40 podcasts? What's missing? What's noise?
3. **How the layers surface in the UI** — The filters currently show counts (e.g., "Opportunity 30") but the labels feel abstract when scanning a feed.
4. **Synthesis** — This surface is underdeveloped. What should it become?
5. **COS brief quality** — Are the right 3 signals being surfaced? Is the prompt effective?
6. **Cerebro personality** — Is the voice right? Is the advisory useful?

This is a strategic conversation about the intelligence architecture, not a coding task. Help Jeremy think through what this system should be.
