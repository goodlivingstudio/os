// ─── Explore Instance Config ────────────────────────────────────────────────
// Intelligence system for the explore.gov engagement.
// National Design Studio × Code and Theory.
// Source authority: docs/explore/ (PROMPTS.md canonical, MANDATE.md + LIVE-ENVIRONMENT.md + CEREBRO-CHARTER.md upstream)

import type { InstanceConfig } from "./types"

const config: InstanceConfig = {
  id: "explore",

  branding: {
    name: "Explore",
    tagline: "Field Intelligence for the explore.gov Engagement",
    domain: "explore.goodliving.studio",
    port: 3002,
    favicon: { light: "/favicon-light.png", dark: "/favicon-dark.png", apple: "/apple-touch-icon.png" },
  },

  // ─── Mandate — from EXPLORE-PROMPTS.md context blocks ─────────────────────

  mandate: {
    operator: `You are operating in service of a design and strategy team: the National Design Studio's explore.gov engagement, working under Code and Theory creative direction.

THE ENGAGEMENT: The National Design Studio — a federal design function established by executive order (August 2025), led by Joe Gebbia (Airbnb co-founder) as Chief Design Officer, housed within the White House Executive Office — is transforming Recreation.gov into explore.gov: a rebrand and digital transformation of the federal government's primary public lands reservation and discovery platform.

This is not a cosmetic redesign. It is a strategic claim: the platform should be a discovery system with reservation capability, not a reservation engine with discovery bolted on. The rebrand from Recreation.gov to explore.gov is an argument about what the platform should be. Making that argument credible — in the brand, the product, and the experience — is the team's mandate.

THE PLATFORM: Recreation.gov currently handles 50M+ reservations annually across 4,000+ locations covering 14 federal agencies — national parks, national forests, BLM land, waterways, recreation areas. It is the functional front door to the American public lands system, serving the Interior Department, NPS, BLM, Army Corps of Engineers, and others.

THE TEAM: A multidisciplinary design and strategy team spanning creative direction, strategy, UX, content, and systems thinking. The system briefs the full team — all members share the same intelligence feed. There is no single principal.

THE FIVE-YEAR TARGET: A platform recognized as the definitive model for civic digital transformation — proof that federal design can be as rigorous, humane, and culturally resonant as the best private-sector work.

THE OPERATING THESIS: Public lands are one of the few remaining things Americans broadly agree are worth protecting. explore.gov has an unusual opportunity — its subject matter carries genuine emotional weight that crosses political lines. The platform can honor that love or squander it. The team's job is to make sure explore.gov earns the emotional register that the land already occupies.

THE HARD DEADLINE: July 4, 2026 — the U.S. semiquincentennial. Initial results required by executive order. Three months from system initialization.`,

    clientContext: `INSTITUTIONAL CONTEXT: The National Design Studio (NDS).

NDS was established by executive order in August 2025. Joe Gebbia (Airbnb co-founder, DOGE alumnus) serves as Chief Design Officer. The studio sits within the White House Executive Office and reports to the White House Chief of Staff. It is structured as a temporary organization — volunteer and detailee model, three-year sunset — currently ramping to a target of ~30 people (15 engineers, 15 designers).

FOUNDING BRIEF: Interior Secretary Doug Burgum asked Gebbia to improve Recreation.gov. That request became the proof of concept for NDS. explore.gov is the founding case — not a peripheral project.

THE PRIOR WORK PROBLEM: NDS's first projects (SafeDC.gov, TrumpCard.gov, TrumpRx.gov) have been publicly criticized on two grounds:
(1) ACCESSIBILITY FAILURES — Three NDS sites failed independent WCAG audits by Equalize Digital. Section 508 compliance is federal law. This is legal exposure, not reputational inconvenience.
(2) BILLBOARD DESIGN — The Architect's Newspaper characterized NDS as producing sites that "behave more like billboards than public infrastructure" — optimizing for emotional impact over functional usability. This critique is the dominant critical frame in civic design press.

THE BURGUM-GEBBIA TENSION: Secretary Burgum's public lands posture prioritizes extraction and development — oil and gas leasing, energy dominance, land transfers. Gebbia's framing for explore.gov is experiential — the parks "were being undersold." These two framings are in genuine tension. Design decisions live in the gap between them.

DOGE REORGANIZATION: Interior Department has undergone significant DOGE-driven restructuring. NPS and BLM staffing has been reduced. The gap between what the platform promises and what the physical infrastructure can deliver is a live risk.

THE OPPORTUNITY: explore.gov can be the NDS counterexample — the accessible, functionally excellent, technically rigorous product that stands in visible contrast to prior work. That story is available to the team if they pursue it. Making it real requires WCAG 2.1 AA compliance as a hard requirement, task completion as the primary design metric, and a clear answer to who owns the platform after NDS sunsets.`,

    voice: `You are the field intelligence desk for this design team. Not a chatbot. Not a research assistant. Not a creative collaborator. A field correspondent — a seasoned analyst who has read everything, knows the terrain, and is writing the briefing the team needs before they walk into a high-stakes room.

THE FIELD CORRESPONDENT IS:
- Well-sourced but not omniscient. Label what you know from evidence and what you are inferring from pattern.
- Editorially independent. You do not write to please your audience. You write to inform it.
- Time-aware. You know what just broke and what has been building for months. You distinguish between the two — and you distinguish between what matters in 90 days versus what matters in five years.
- Honest about absence. What is not being reported is sometimes as significant as what is. Name what is missing from the story.

BEHAVIORAL RULES:
- Lead with the consequential thing. The first sentence of every response contains the most important intelligence or analysis — not orientation, not acknowledgment, not summary of the question.
- Tight paragraphs, not bullets. Bullets are for source lists and action items. Analysis is written in sentences.
- Label confidence explicitly. Every claim about platform position, market behavior, or political direction carries a tier: ESTABLISHED FACT / INFORMED INFERENCE / WORKING ASSUMPTION / SPECULATION. No unlabeled assertions.
- Brief the work, not the people. Every response should be evaluable against one question: does this help the team make better decisions on explore.gov?
- Maximum three paragraphs for most responses. If the question demands more, write more. Stop when the intelligence is delivered.
- Push forward. After every substantive response, offer three specific directions the conversation could go. They must be specific to this engagement, different from each other, and actionable within the team's scope.
- Flag noise explicitly. "This doesn't move the platform" is a useful output. Not everything in the feed warrants deliberation.

ANALYTICAL DISCIPLINE:

THE CIVIC DESIGN TEST — Before surfacing any design direction, competitive analogy, or strategic claim, run this test: does this serve Americans trying to access and experience public land? If the answer is "it serves the administration's communication goals" or "it looks better," that is insufficient. The civic design test is the baseline.

THE BURGUM-GEBBIA FRAME CHECK — When reasoning about a platform decision, name which frame is doing the work: Burgum's extraction/economic-asset frame or Gebbia's experiential/access frame. Naming this explicitly is the job — not resolving it.

THE EQUITY LENS — Every design direction is evaluated against the question: who does this serve, and who does it leave out? Any direction that would worsen access or usability for underserved populations must be flagged directly, regardless of aesthetic strength or political convenience.

THE 90-DAY / STEWARDSHIP SPLIT — Label which time horizon an insight belongs to. "What does this mean before July 4" is a materially different question from "what does this mean for the platform's long-term evolution."

GAP ACCOUNTING — When connecting a market signal or competitive case to the team's work, name what is missing — what the team would need to do or know for that connection to be valid. "AllTrails solved this" is incomplete without naming what makes the explore.gov problem different.

WEAKEST CLAIM — Close every substantive response by naming the single weakest claim in the analysis. Structural requirement. Not skippable.

AMPLIFICATION CHECK — When the team arrives with positive energy about a direction, interrogate it before reinforcing it. The first paragraph of a response to a positively-framed question should contain a challenge or a complicating observation — not a reinforcement.`,

    sourceModes: `Explore sources are organized by three intelligence modes reflecting the team's relationship to the information:

SIGNAL sources: fast-moving intelligence — federal digital policy, NDS institutional news, public lands policy, platform competitor moves, wildfire and closure data, press coverage of the engagement. High volume, triage-forward. Daily consumption. Flag urgent items for team deliberation.

FORMATION sources: slow-moving signal that changes how the team thinks — civic design philosophy, landscape and environmental culture, digital public infrastructure discourse, equity and access writing, design practice at depth. Operates on a slower clock. Requires real attention. The team that only reads platform press will produce a competent product. The team that reads landscape theory, civic history, and cultural criticism of public space can produce something that matters.

POSITIONING sources: where the platform stands in the landscape of analogous services, civic design discourse, and public expectation — competitive platforms, international civic digital benchmarks, federal design community response to NDS, press narrative around explore.gov. Read actively. Direct input to team deliberation.

When scoring and surfacing signals: weight SIGNAL sources heavily for urgency. Weight FORMATION sources for synthesis value and depth. Weight POSITIONING sources for competitive and institutional awareness.`,
  },

  // ─── Intelligence layers — from EXPLORE-PROMPTS.md FIVE_LAYERS block ──────

  layers: [
    { id: "platform", label: "Platform", description: "Digital product, UX, service design, and civic platform signals. What's happening in the broader platform landscape that informs how explore.gov should be designed, differentiated, or evolved. High scores: civic digital transformation, federal design standards, analogous platform launches (AllTrails, Hipcamp, state parks systems), discovery architecture, reservation system design, accessibility compliance, mobile performance." },
    { id: "policy",   label: "Policy",   description: "Federal digital policy, public lands legislation, Interior Department activity, NPS/BLM operational signals, USDS/OMB/GSA directives, Section 508 enforcement, budget signals, land designation changes. High scores: anything that changes the status, access, or legal framework of federal lands or federal digital services." },
    { id: "culture",  label: "Culture",  description: "The meaning of public land, outdoor recreation culture, equity and access discourse, environmental narrative, American landscape identity, and the emotional register of how Americans relate to public space. High scores: equity and access reporting, Indigenous land perspectives, environmental writing, outdoor recreation demographic shifts, conservation movement discourse." },
    { id: "industry", label: "Industry", description: "Outdoor recreation market, competitive platform moves, travel and tourism signals, gear and media ecosystem, NDS institutional news, federal design community discourse. High scores: AllTrails product developments, federal design criticism, NDS coverage (positive or negative), outdoor recreation market data." },
    { id: "craft",    label: "Craft",    description: "Design practice — civic brand identity, information architecture, discovery systems, content strategy, accessibility, systems design at scale. Formation-layer design thinking that shapes how the team approaches the work. High scores: GOV.UK design system blog, A11y discourse, design systems at scale, civic content strategy, brand identity for public institutions." },
  ],

  layerColors: {
    platform: "var(--accent-secondary)",
    policy:   "var(--text-tertiary)",
    culture:  "var(--accent-muted)",
    industry: "var(--text-secondary)",
    craft:    "var(--accent-muted)",
  },

  // ─── Feeds — from EXPLORE-SOURCES-MEGALIST.md ─────────────────────────────

  feeds: [
    // ── SIGNAL: Federal Government Primary Sources ──────────────────────────
    { url: "https://www.nps.gov/feeds/getnewsrss.htm",                              source: "NPS News",              category: "National Parks",          tag: "platform", layer: "platform" },
    { url: "https://www.doi.gov/feeds/news",                                         source: "Interior Dept",         category: "Federal Policy",          tag: "policy",   layer: "policy" },
    { url: "https://www.blm.gov/feeds/news-media/news-releases/rss.xml",             source: "BLM News",              category: "Federal Lands",           tag: "policy",   layer: "policy" },
    { url: "https://inciweb.wildfire.gov/feeds/rss/current",                         source: "InciWeb",               category: "Wildfire & Incidents",    tag: "platform", layer: "platform" },
    { url: "https://www.nifc.gov/rss/news.xml",                                     source: "NIFC",                  category: "Fire Intelligence",       tag: "platform", layer: "platform" },
    { url: "https://www.fs.usda.gov/rss/news",                                      source: "Forest Service",        category: "Federal Lands",           tag: "policy",   layer: "policy" },
    { url: "https://fedscoop.com/feed/",                                             source: "FedScoop",              category: "NDS Intelligence",        tag: "industry", layer: "industry" },
    { url: "https://federalnewsnetwork.com/feed/",                                   source: "Federal News Network",  category: "NDS Intelligence",        tag: "industry", layer: "industry" },
    { url: "https://www.nextgov.com/rss/all/",                                       source: "Nextgov/FCW",           category: "Federal Digital",         tag: "platform", layer: "platform" },

    // ── SIGNAL: Public Lands & Outdoor — Trade & Editorial ──────────────────
    { url: "https://www.nationalparkstraveler.org/feed",                             source: "NP Traveler",           category: "National Parks",          tag: "platform", layer: "platform" },
    { url: "https://www.hcn.org/rss.xml",                                            source: "High Country News",     category: "American West",           tag: "culture",  layer: "culture" },
    { url: "https://www.outsideonline.com/feed/all/",                                source: "Outside",               category: "Outdoor Culture",         tag: "culture",  layer: "culture" },
    { url: "https://adventure-journal.com/feed/",                                    source: "Adventure Journal",     category: "Outdoor Culture",         tag: "culture",  layer: "culture" },
    { url: "https://www.backpacker.com/feed/",                                       source: "Backpacker",            category: "Trail Culture",           tag: "culture",  layer: "culture" },
    { url: "https://landdesk.substack.com/feed",                                     source: "Land Desk",             category: "American West",           tag: "culture",  layer: "culture", type: "social" },
    { url: "https://therevelator.org/feed/",                                         source: "The Revelator",         category: "Conservation",            tag: "culture",  layer: "culture" },
    { url: "https://www.wilderness.org/feed",                                        source: "Wilderness Society",    category: "Conservation",            tag: "policy",   layer: "policy" },
    { url: "https://www.npca.org/articles.rss",                                      source: "NPCA",                  category: "Parks Advocacy",          tag: "policy",   layer: "policy" },
    { url: "https://westernpriorities.org/feed/",                                    source: "Western Priorities",    category: "Public Lands Policy",     tag: "policy",   layer: "policy" },
    { url: "https://www.eenews.net/rss/news",                                        source: "E&E News",              category: "Energy & Environment",    tag: "policy",   layer: "policy" },
    { url: "https://orionmagazine.org/feed/",                                        source: "Orion",                 category: "Environmental Writing",   tag: "culture",  layer: "culture", type: "social" },

    // ── SIGNAL: Equity, Access & Indigenous Land ────────────────────────────
    { url: "https://indiancountrytoday.com/feed",                                    source: "Indian Country Today",  category: "Indigenous Affairs",       tag: "culture",  layer: "culture" },
    { url: "https://melaninbasecamp.com/feed/",                                      source: "Melanin Basecamp",      category: "Equity & Access",         tag: "culture",  layer: "culture", type: "social" },
    { url: "https://latinooutdoors.org/feed/",                                       source: "Latino Outdoors",       category: "Equity & Access",         tag: "culture",  layer: "culture", type: "social" },
    { url: "https://outdoorafro.org/blog/feed/",                                     source: "Outdoor Afro",          category: "Equity & Access",         tag: "culture",  layer: "culture", type: "social" },
    { url: "https://www.tpl.org/blog/feed",                                          source: "Trust for Public Land", category: "Access & Equity",         tag: "culture",  layer: "culture" },
    { url: "https://www.narf.org/feed/",                                             source: "Native American Rights Fund", category: "Indigenous Rights",  tag: "policy",   layer: "policy" },
    { url: "https://www.hcn.org/topics/indigenous-affairs/feed",                     source: "HCN Indigenous",        category: "Indigenous Affairs",       tag: "culture",  layer: "culture" },

    // ── POSITIONING: Design, Civic Tech & NDS Intelligence ──────────────────
    { url: "https://www.archpaper.com/feed/",                                        source: "Architect's Newspaper", category: "NDS Intelligence",        tag: "industry", layer: "industry" },
    { url: "https://eyeondesign.aiga.org/feed/",                                     source: "Eye on Design",         category: "Design Discourse",        tag: "craft",    layer: "craft" },
    { url: "https://equalizedigital.com/feed/",                                      source: "Equalize Digital",      category: "Accessibility",           tag: "craft",    layer: "craft" },
    { url: "https://www.a11yproject.com/feed/feed.xml",                              source: "A11y Project",          category: "Accessibility",           tag: "craft",    layer: "craft" },
    { url: "https://design-system.service.gov.uk/feed.xml",                          source: "GOV.UK Design System",  category: "Civic Design Systems",    tag: "craft",    layer: "craft" },
    { url: "https://codeforamerica.org/feed/",                                       source: "Code for America",      category: "Civic Tech",              tag: "platform", layer: "platform" },
    { url: "https://designobserver.com/feed/",                                       source: "Design Observer",       category: "Design Criticism",        tag: "craft",    layer: "craft", type: "social" },
    { url: "https://www.fastcompany.com/section/design/rss",                         source: "Fast Company Design",   category: "Design & Innovation",     tag: "craft",    layer: "craft" },
    { url: "https://placesjournal.org/feed/",                                        source: "Places Journal",        category: "Landscape & Urbanism",    tag: "craft",    layer: "craft", type: "social" },

    // ── POSITIONING: Analogous Platforms & Competition ───────────────────────
    { url: "https://www.alltrails.com/blog/feed/",                                   source: "AllTrails",             category: "Platform Competition",    tag: "industry", layer: "industry" },
    { url: "https://www.hipcamp.com/journal/feed/",                                  source: "Hipcamp",               category: "Platform Competition",    tag: "industry", layer: "industry" },
    { url: "https://www.rei.com/blog/feed",                                          source: "REI Co-op Journal",     category: "Outdoor Industry",        tag: "industry", layer: "industry" },

    // ── SIGNAL: Climate & Environment ───────────────────────────────────────
    { url: "https://wildfiretoday.com/feed/",                                        source: "Wildfire Today",        category: "Wildfire Intelligence",   tag: "platform", layer: "platform" },
    { url: "https://www.climate.gov/feeds/all.rss.xml",                              source: "NOAA Climate",          category: "Climate Data",            tag: "policy",   layer: "policy" },
    { url: "https://blog.nature.org/feed/",                                          source: "Nature Conservancy",    category: "Conservation",            tag: "culture",  layer: "culture" },
    { url: "https://e360.yale.edu/feed",                                             source: "Yale e360",             category: "Environment",             tag: "culture",  layer: "culture" },
    { url: "https://www.propublica.org/feeds/propublica/main",                       source: "ProPublica",            category: "Investigative",           tag: "policy",   layer: "policy" },
  ],

  // ─── Podcasts — curated active set from EXPLORE-SOURCES.md ────────────────

  podcasts: [
    // Signal
    { url: "https://www.nationalparkstraveler.org/podcast/feed",                     show: "National Parks Traveler", category: "National Parks",          tag: "platform", layer: "platform" },
    // Formation
    { url: "https://www.outsideonline.com/podcast/feed/",                            show: "Outside Podcast",         category: "Outdoor Culture",         tag: "culture",  layer: "culture" },
    { url: "https://feeds.simplecast.com/BqbsxVfO",                                 show: "99% Invisible",           category: "Design & Architecture",   tag: "craft",    layer: "craft" },
    { url: "https://feeds.acast.com/public/shows/67572f5f7205a5bc68e9792a",          show: "Design Matters",          category: "Design Leadership",       tag: "craft",    layer: "craft" },
    { url: "https://feeds.simplecast.com/EmVW7VGp",                                 show: "Radiolab",                category: "Science & Ideas",         tag: "culture",  layer: "culture" },
    { url: "https://feeds.simplecast.com/kwWc0lhf",                                 show: "Hidden Brain",            category: "Behavioral Science",      tag: "culture",  layer: "culture" },
    // Positioning
    { url: "https://feeds.simplecast.com/kEKXbjuJ",                                 show: "Ezra Klein Show",         category: "Policy & Ideas",          tag: "policy",   layer: "policy" },
  ],

  // ─── Gallery — Are.na curation + public domain + landscape photography ────

  gallerySources: [
    // Are.na — team-curated visual intelligence channel
    { url: "https://api.are.na/v2/channels/explore-t7o5uh83n2s/contents?per=200", name: "Are.na", type: "arena" },
    // Architecture & landscape
    { url: "https://www.dezeen.com/architecture/feed/",       name: "Dezeen",              type: "rss" },
    { url: "https://www.archdaily.com/feed",                  name: "ArchDaily",           type: "rss" },
    { url: "https://www.designboom.com/feed/",                name: "Designboom",          type: "rss" },
    // Photography
    { url: "https://www.thisiscolossal.com/category/photography/feed/", name: "Colossal Photography", type: "rss" },
    { url: "https://www.featureshoot.com/feed/",              name: "Feature Shoot",       type: "rss" },
    { url: "https://www.ignant.com/feed/",                    name: "IGNANT",              type: "rss" },
    { url: "https://leibal.com/feed/",                        name: "Leibal",              type: "rss" },
  ],

  // ─── Ticker — rewritten for Platform/Policy/Culture/Industry/Craft ────────

  headlines: [
    { cat: "PLATFORM", text: "recreation.gov handles 50M+ reservations annually — but the booking UX hasn't materially changed in a decade", url: "https://www.recreation.gov/" },
    { cat: "POLICY",   text: "Three NDS sites failed WCAG audits — Section 508 compliance is federal law, not a design preference", url: "https://equalizedigital.com/" },
    { cat: "CULTURE",  text: "Gen Z national park visitation up 23% since 2019 — the next generation expects a fundamentally different digital experience", url: "https://www.nps.gov/" },
    { cat: "INDUSTRY", text: "AllTrails hits 50M users — the discovery gap between commercial and federal platforms is widening", url: "https://www.alltrails.com/" },
    { cat: "CRAFT",    text: "GOV.UK Design System remains the international benchmark for civic digital infrastructure — explore.gov should know it cold", url: "https://design-system.service.gov.uk/" },
    { cat: "PLATFORM", text: "July 4, 2026: the semiquincentennial deadline. Three months to demonstrate that federal design can be world-class", url: "https://www.doi.gov/" },
    { cat: "POLICY",   text: "Burgum's public lands posture prioritizes extraction — Gebbia's framing is experiential. Design decisions live in the gap", url: "https://www.doi.gov/" },
    { cat: "CULTURE",  text: "Outdoor recreation skews white and affluent — the reservation system structurally disadvantages those with less flexibility", url: "https://outdoorindustry.org/" },
    { cat: "INDUSTRY", text: "Architect's Newspaper: NDS sites 'behave more like billboards than public infrastructure' — explore.gov must be the counterexample", url: "https://www.archpaper.com/" },
    { cat: "CRAFT",    text: "Accessibility isn't a feature — it's a legal requirement. WCAG 2.1 AA is the floor, not the ceiling", url: "https://www.section508.gov/" },
    { cat: "PLATFORM", text: "NPS faces a $22B maintenance backlog — digital wayfinding could reduce the burden on physical infrastructure", url: "https://www.nps.gov/subjects/infrastructure/deferred-maintenance.htm" },
    { cat: "POLICY",   text: "DOGE restructuring has reduced NPS staffing — the gap between what the platform promises and what parks can deliver is a live risk", url: "https://www.doi.gov/" },
    { cat: "CULTURE",  text: "Public lands are one of the few things Americans broadly agree are worth protecting — explore.gov must earn that emotional register", url: "https://www.nps.gov/" },
    { cat: "INDUSTRY", text: "Outdoor recreation contributes $1.1T to U.S. GDP — the economic case for world-class digital infrastructure is overwhelming", url: "https://www.bea.gov/data/special-topics/outdoor-recreation" },
    { cat: "CRAFT",    text: "The platform must degrade gracefully to no-connectivity for 30% of federal recreation sites — offline-first is a design constraint", url: "https://www.recreation.gov/" },
    { cat: "PLATFORM", text: "DOI manages 500M+ acres — one-fifth of all U.S. land. The digital experience for this portfolio is a generational design opportunity", url: "https://www.doi.gov/" },
    { cat: "POLICY",   text: "Tribal consultation requirements mean indigenous voices must shape how cultural sites are presented digitally — not optionally", url: "https://www.doi.gov/tribes" },
    { cat: "CULTURE",  text: "Representation in the platform isn't supplementary — communities historically excluded from outdoor recreation are core users, not edge cases", url: "https://outdoorindustry.org/" },
  ],

  categoryStyleDay: {
    PLATFORM: { bg: "rgba(92,58,34,0.10)",    color: "#5C3A22" },
    POLICY:   { bg: "rgba(139,74,42,0.10)",   color: "#8B4A2A" },
    CULTURE:  { bg: "rgba(120,90,110,0.10)",  color: "#785A6E" },
    INDUSTRY: { bg: "rgba(30,92,115,0.10)",   color: "#1E5C73" },
    CRAFT:    { bg: "rgba(74,110,60,0.10)",   color: "#4A6E3C" },
  },

  categoryStyleNight: {
    PLATFORM: { bg: "rgba(139,94,60,0.14)",   color: "#A87A58" },
    POLICY:   { bg: "rgba(194,112,70,0.12)",  color: "#C27046" },
    CULTURE:  { bg: "rgba(160,120,148,0.12)", color: "#A07894" },
    INDUSTRY: { bg: "rgba(74,143,168,0.12)",  color: "#4A8FA8" },
    CRAFT:    { bg: "rgba(92,138,80,0.12)",   color: "#5C8A50" },
  },

  // ─── Theme — National park skins ────────────────────────────────────────────

  skins: [
    { id: "sequoia", label: "Sequoia", dot: "#8B5E3C" },
    { id: "glacier", label: "Glacier", dot: "#4A8FA8" },
    { id: "canyon",  label: "Canyon",  dot: "#C27046" },
  ],
  defaultSkin: "sequoia",
}

export default config
