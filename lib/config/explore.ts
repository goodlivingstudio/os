// ─── Explore Instance Config ────────────────────────────────────────────────
// Strategic intelligence tool for the recreation.org / explore.gov redesign.
// Operated by the National Design Studio for the Secretary of the Interior.
// Mandate: modernizing America's public lands digital experience.

import type { InstanceConfig } from "./types"

const config: InstanceConfig = {
  id: "explore",

  branding: {
    name: "Explore",
    tagline: "Strategic Intelligence for America's Public Lands & Recreation",
    domain: "explore.goodliving.studio",
    port: 3002,
    favicon: { light: "/favicon-light.png", dark: "/favicon-dark.png", apple: "/apple-touch-icon.png" },
  },

  mandate: {
    operator: `You are the intelligence system for the National Design Studio, operating under the Office of the Secretary of the Interior. Everything you produce is read by the design and strategy team leading the recreation.org redesign (formerly rec.gov). Write to them directly.

The team is redesigning the digital front door to America's public lands. This is not a website redesign — it is a reimagining of how 300M+ Americans discover, plan, and experience public lands, waters, and cultural sites managed by the Department of the Interior and its bureaus (NPS, BLM, USFWS, BOR, BSEE).

Strategic context: recreation.gov serves 100K+ federal recreation sites but suffers from fragmented information architecture, poor mobile experience, and disconnection between digital discovery and on-the-ground experience. The redesign must serve everyone from first-time national park visitors to experienced backcountry users.

Design principles: accessible by default, works in low-connectivity environments, respects the dignity of public lands, serves diverse communities including those historically excluded from outdoor recreation. The brand must convey both the grandeur of the landscape and the practicality of trip planning.

The team operates at the intersection of civic design, service design, and experience strategy — building systems that work at federal scale while feeling personal and inviting.`,

    clientContext: `Primary intelligence target: Department of the Interior recreation ecosystem.

Key intelligence:
- recreation.gov processes 5M+ reservations annually across 100K+ sites
- 312M visits to national parks in 2023 — visitation trending upward post-pandemic
- NPS faces $22B maintenance backlog affecting visitor experience infrastructure
- Great American Outdoors Act providing $9.5B for deferred maintenance and land acquisition
- Digital equity mandate: 15% of Americans lack reliable broadband; federal sites must be accessible offline
- Visitor demographics shifting: Gen Z and millennial visitation up 23% since 2019
- DOI managing 500M+ acres — one-fifth of all U.S. land
- Competing with AllTrails, Hipcamp, Dyrt for discovery and planning mindshare
- Recreation Economy Account: outdoor recreation contributes $1.1T to U.S. GDP
- Federal accessibility requirements: Section 508, WCAG 2.1 AA minimum
- Tribal consultation requirements for sites on or adjacent to indigenous lands
- Climate adaptation: parks seeing shifted seasons, new hazards, changed access patterns`,

    voice: `You are the strategic intelligence function for the National Design Studio's recreation.org project.

You are not a government communications officer. You are a design strategy intelligence system. Your job is to surface signals that affect how this redesign should be shaped, identify emerging patterns in how Americans use public lands, and flag risks to the project before they become problems.

BEHAVIORAL RULES:

- Lead with what's changed or what's at stake for the redesign. Every signal should connect to a design decision.
- Synthesis first. Connect recreation trends, technology shifts, policy changes, and visitor behavior into actionable design intelligence.
- Challenge assumptions directly. If a design direction conflicts with visitor data or accessibility requirements, say so.
- No preamble. No bureaucratic hedging. Begin with substance.
- Write in tight paragraphs. This should feel like a briefing from a senior strategist who understands both design and policy.
- Push the conversation forward. After every response, offer three specific directions for the redesign conversation.
- Flag when something is noise vs. signal for this specific project.

ANALYTICAL DISCIPLINE:

VISITOR-FIRST FRAMING — Every opportunity or trend must be connected to a specific visitor need or behavior. "This technology exists" is not useful. "This technology addresses X visitor frustration" is useful.

ACCESSIBILITY AUDIT — When discussing any feature or pattern, note the accessibility implications. What works offline? What serves screen readers? What about older devices?

EQUITY LENS — Flag when signals or recommendations might inadvertently exclude communities that have historically been underrepresented in outdoor recreation.

SCALE AWARENESS — Solutions must work across 100K+ sites managed by multiple bureaus with different systems. Flag when a recommendation assumes centralized control that doesn't exist.`,

    sourceModes: `Explore sources are organized by three intelligence modes:

POLICY sources: federal recreation policy, DOI announcements, Congressional action on public lands, state-level recreation initiatives. High priority — directly shapes project constraints.

EXPERIENCE sources: visitor behavior research, recreation technology, trip planning innovation, accessibility advances, outdoor industry trends. Core fuel for design decisions.

LANDSCAPE sources: broader forces — climate impact on recreation, demographic shifts, technology adoption patterns, civic design precedents. Context that shapes the 5-year arc.

When scoring and surfacing signals, weight POLICY sources for urgency (they create deadlines and constraints). Weight EXPERIENCE sources for design value. Weight LANDSCAPE sources for strategic framing.`,
  },

  // ─── Intelligence layers ────────────────────────────────────────────────────

  layers: [
    { id: "access",       label: "Access",       description: "Digital and physical access to public lands. Connectivity, offline capability, ADA compliance, transportation, equity in access. High scores: broadband and cell coverage at federal sites, Section 508 compliance, transit-to-trailhead initiatives, programs serving underrepresented communities." },
    { id: "experience",   label: "Experience",    description: "Visitor experience design and innovation. How people discover, plan, and navigate public lands digitally and physically. High scores: wayfinding, trip planning UX, reservation systems, real-time conditions, visitor feedback loops." },
    { id: "conservation", label: "Conservation",  description: "Intersection of conservation and visitor management. Sustainable visitation, capacity management, habitat protection balanced with public enjoyment. High scores: permit systems, dispersed camping, Leave No Trace innovation, wildlife corridor design." },
    { id: "policy",       label: "Policy",        description: "Federal recreation policy, legislation, and agency directives. DOI, NPS, BLM, USFWS actions that affect the redesign. High scores: Great American Outdoors Act implementation, fee structure changes, interagency data sharing, tribal consultation requirements." },
    { id: "culture",      label: "Culture",       description: "Cultural relationship with public lands. How Americans think about, value, and engage with outdoor recreation. Storytelling, interpretation, inclusion, and the evolving meaning of public lands. High scores: indigenous land acknowledgment, representation in outdoor media, cultural site interpretation, changing demographics of outdoor recreation." },
  ],

  layerColors: {
    access:       "var(--accent-secondary)",
    experience:   "var(--accent-muted)",
    conservation: "var(--text-secondary)",
    policy:       "var(--text-tertiary)",
    culture:      "var(--accent-muted)",
  },

  // ─── Feeds ──────────────────────────────────────────────────────────────────

  feeds: [
    // ACCESS — Digital equity, connectivity, transportation to public lands
    { url: "https://www.nps.gov/feeds/servicesRSS.xml",                           source: "NPS Services",       category: "Park Access",           tag: "access",       layer: "access" },
    { url: "https://news.google.com/rss/search?q=%22digital+equity%22+broadband+rural&hl=en-US&gl=US", source: "Digital Equity", category: "Connectivity", tag: "access", layer: "access" },
    { url: "https://news.google.com/rss/search?q=Section+508+accessibility+federal&hl=en-US&gl=US", source: "Federal A11y", category: "Accessibility", tag: "access", layer: "access" },
    { url: "https://news.google.com/rss/search?q=%22recreation.gov%22+OR+%22rec.gov%22&hl=en-US&gl=US", source: "Rec.gov News", category: "Platform", tag: "access", layer: "access" },
    { url: "https://news.google.com/rss/search?q=%22transit+to+trails%22+OR+%22public+transit%22+national+park&hl=en-US&gl=US", source: "Transit to Trails", category: "Transportation", tag: "access", layer: "access" },

    // EXPERIENCE — Visitor experience, trip planning, outdoor tech
    { url: "https://news.google.com/rss/search?q=AllTrails+OR+Hipcamp+OR+Dyrt+outdoor+app&hl=en-US&gl=US", source: "Outdoor Apps", category: "Recreation Tech", tag: "experience", layer: "experience" },
    { url: "https://www.outsideonline.com/feed/",                                  source: "Outside",            category: "Outdoor Experience",    tag: "experience",   layer: "experience" },
    { url: "https://news.google.com/rss/search?q=%22national+park%22+reservation+system+2026&hl=en-US&gl=US", source: "Reservation Systems", category: "Booking UX", tag: "experience", layer: "experience" },
    { url: "https://news.google.com/rss/search?q=%22visitor+experience%22+national+park+design&hl=en-US&gl=US", source: "Visitor XD", category: "Experience Design", tag: "experience", layer: "experience" },
    { url: "https://news.google.com/rss/search?q=wayfinding+signage+public+lands&hl=en-US&gl=US", source: "Wayfinding", category: "Navigation", tag: "experience", layer: "experience" },
    { url: "https://www.theverge.com/rss/index.xml",                               source: "The Verge",          category: "Technology",            tag: "experience",   layer: "experience" },
    { url: "https://www.nngroup.com/feed/rss/",                                    source: "NNGroup",            category: "UX Research",           tag: "experience",   layer: "experience" },

    // CONSERVATION — Sustainable visitation, capacity management
    { url: "https://www.nps.gov/feeds/newsRSS.xml",                               source: "NPS News",           category: "National Parks",        tag: "conservation", layer: "conservation" },
    { url: "https://news.google.com/rss/search?q=%22national+park%22+overcrowding+capacity+management&hl=en-US&gl=US", source: "Capacity Mgmt", category: "Visitor Management", tag: "conservation", layer: "conservation" },
    { url: "https://news.google.com/rss/search?q=%22Leave+No+Trace%22+2026&hl=en-US&gl=US", source: "Leave No Trace", category: "Stewardship", tag: "conservation", layer: "conservation" },
    { url: "https://news.google.com/rss/search?q=climate+change+national+park+adaptation&hl=en-US&gl=US", source: "Climate Impact", category: "Climate Adaptation", tag: "conservation", layer: "conservation" },
    { url: "https://news.google.com/rss/search?q=wildlife+corridor+conservation+federal&hl=en-US&gl=US", source: "Wildlife", category: "Habitat", tag: "conservation", layer: "conservation" },

    // POLICY — Federal recreation policy, legislation, DOI directives
    { url: "https://news.google.com/rss/search?q=%22Department+of+Interior%22+recreation+2026&hl=en-US&gl=US", source: "DOI", category: "Federal Policy", tag: "policy", layer: "policy" },
    { url: "https://news.google.com/rss/search?q=%22Great+American+Outdoors+Act%22+implementation&hl=en-US&gl=US", source: "GAOA", category: "Legislation", tag: "policy", layer: "policy" },
    { url: "https://news.google.com/rss/search?q=%22Bureau+of+Land+Management%22+recreation+access&hl=en-US&gl=US", source: "BLM", category: "Federal Lands", tag: "policy", layer: "policy" },
    { url: "https://news.google.com/rss/search?q=federal+park+fees+entrance+2026&hl=en-US&gl=US", source: "Fee Policy", category: "Revenue", tag: "policy", layer: "policy" },
    { url: "https://news.google.com/rss/search?q=tribal+consultation+public+lands+indigenous&hl=en-US&gl=US", source: "Tribal Affairs", category: "Indigenous Lands", tag: "policy", layer: "policy" },
    { url: "https://news.google.com/rss/search?q=%22civic+design%22+OR+%22government+design%22+federal+digital&hl=en-US&gl=US", source: "Civic Design", category: "Gov Design", tag: "policy", layer: "policy" },

    // CULTURE — Public lands culture, outdoor recreation demographics
    { url: "https://news.google.com/rss/search?q=%22outdoor+recreation%22+equity+diversity+inclusion&hl=en-US&gl=US", source: "Outdoor Equity", category: "Inclusion", tag: "culture", layer: "culture" },
    { url: "https://news.google.com/rss/search?q=%22national+park%22+storytelling+interpretation&hl=en-US&gl=US", source: "NPS Interpretation", category: "Storytelling", tag: "culture", layer: "culture" },
    { url: "https://www.theatlantic.com/feed/all/",                                source: "The Atlantic",       category: "Ideas & Culture",       tag: "culture",      layer: "culture" },
    { url: "https://www.dezeen.com/architecture/feed/",                            source: "Dezeen",             category: "Architecture",          tag: "culture",      layer: "culture" },
    { url: "https://news.google.com/rss/search?q=%22outdoor+industry%22+trends+2026&hl=en-US&gl=US", source: "Outdoor Industry", category: "Market Trends", tag: "culture", layer: "culture" },
    { url: "https://news.google.com/rss/search?q=Patagonia+OR+REI+sustainability+outdoor&hl=en-US&gl=US", source: "Outdoor Brands", category: "Industry", tag: "culture", layer: "culture" },
  ],

  // ─── Podcasts ───────────────────────────────────────────────────────────────

  podcasts: [
    { url: "https://feeds.simplecast.com/BqbsxVfO",                               show: "99% Invisible",          category: "Design & Architecture", tag: "experience", layer: "experience" },
    { url: "https://feeds.simplecast.com/kEKXbjuJ",                                show: "Ezra Klein Show",        category: "Policy & Ideas",        tag: "policy",     layer: "policy" },
    { url: "https://feeds.simplecast.com/EmVW7VGp",                                show: "Radiolab",               category: "Science & Ideas",       tag: "culture",    layer: "culture" },
    { url: "https://feeds.npr.org/510333/podcast.xml",                             show: "Throughline",            category: "History",               tag: "culture",    layer: "culture" },
    { url: "https://feeds.npr.org/381444908/podcast.xml",                          show: "Fresh Air",              category: "Interviews",            tag: "culture",    layer: "culture" },
    { url: "https://feeds.simplecast.com/kwWc0lhf",                                show: "Hidden Brain",           category: "Behavioral Science",    tag: "experience", layer: "experience" },
    { url: "https://feeds.simplecast.com/Sl5CSM3S",                                show: "The Daily",              category: "News",                  tag: "policy",     layer: "policy" },
  ],

  // ─── Gallery — National parks, public lands, landscape photography ─────────

  gallerySources: [
    { url: "https://www.nps.gov/feeds/photosRSS.xml", name: "NPS Photos", type: "rss" },
    { url: "https://www.dezeen.com/architecture/feed/", name: "Dezeen", type: "rss" },
    { url: "https://www.archdaily.com/feed", name: "ArchDaily", type: "rss" },
    { url: "https://www.thisiscolossal.com/category/photography/feed/", name: "Colossal Photography", type: "rss" },
    { url: "https://www.featureshoot.com/feed/", name: "Feature Shoot", type: "rss" },
    { url: "https://leibal.com/feed/", name: "Leibal", type: "rss" },
    { url: "https://www.ignant.com/feed/", name: "IGNANT", type: "rss" },
    { url: "https://www.designboom.com/feed/", name: "Designboom", type: "rss" },
  ],

  // ─── Ticker ─────────────────────────────────────────────────────────────────

  headlines: [
    { cat: "ACCESS",       text: "15% of Americans lack reliable broadband — federal recreation sites must work offline-first", url: "https://www.fcc.gov/broadbanddata" },
    { cat: "EXPERIENCE",   text: "AllTrails hits 50M users — the discovery gap between commercial and federal platforms is widening", url: "https://www.alltrails.com/" },
    { cat: "CONSERVATION", text: "312M national park visits in 2023 — capacity management is now a design problem, not just an operations one", url: "https://www.nps.gov/subjects/socialscience/annual-visitation-highlights.htm" },
    { cat: "POLICY",       text: "Great American Outdoors Act: $9.5B for deferred maintenance — the physical and digital experience must evolve together", url: "https://www.nps.gov/subjects/legal/great-american-outdoors-act.htm" },
    { cat: "CULTURE",      text: "Gen Z national park visitation up 23% since 2019 — the next generation of visitors expects a fundamentally different digital experience", url: "https://www.nps.gov/" },
    { cat: "ACCESS",       text: "recreation.gov processes 5M+ reservations annually — but the booking UX hasn't materially changed in a decade", url: "https://www.recreation.gov/" },
    { cat: "EXPERIENCE",   text: "NPS faces a $22B maintenance backlog — digital wayfinding and conditions reporting could reduce the burden on physical infrastructure", url: "https://www.nps.gov/subjects/infrastructure/deferred-maintenance.htm" },
    { cat: "POLICY",       text: "Section 508 compliance isn't optional — every federal digital product must meet WCAG 2.1 AA at minimum", url: "https://www.section508.gov/" },
    { cat: "CONSERVATION", text: "Climate adaptation is reshaping park access: shifted seasons, new hazards, and unpredictable conditions require real-time design systems", url: "https://www.nps.gov/subjects/climatechange/index.htm" },
    { cat: "CULTURE",      text: "Outdoor recreation contributes $1.1T to U.S. GDP — the economic case for world-class digital recreation infrastructure is overwhelming", url: "https://www.bea.gov/data/special-topics/outdoor-recreation" },
    { cat: "ACCESS",       text: "Tribal consultation requirements mean indigenous voices must shape how cultural sites are presented digitally", url: "https://www.doi.gov/tribes" },
    { cat: "EXPERIENCE",   text: "The gap between trip inspiration and trip execution is where most visitors are lost — the redesign must close it", url: "https://www.recreation.gov/" },
    { cat: "POLICY",       text: "DOI manages 500M+ acres — one-fifth of all U.S. land. The digital experience for this portfolio is a generational design opportunity", url: "https://www.doi.gov/" },
    { cat: "CONSERVATION", text: "Dispersed camping growing 40% faster than developed sites — the permit and information system hasn't caught up", url: "https://www.blm.gov/" },
    { cat: "CULTURE",      text: "Representation matters: communities historically excluded from outdoor recreation need to see themselves in the platform's design and content", url: "https://outdoorindustry.org/" },
    { cat: "EXPERIENCE",   text: "Mobile-first isn't enough — the experience must degrade gracefully to no-connectivity for 30% of federal recreation sites", url: "https://www.recreation.gov/" },
    { cat: "ACCESS",       text: "ADA trail information is inconsistent across 100K+ sites — standardized accessibility data is a design systems problem", url: "https://www.nps.gov/subjects/accessibility/index.htm" },
    { cat: "POLICY",       text: "Interagency data sharing between NPS, BLM, USFWS, and BOR remains the single biggest technical constraint on a unified experience", url: "https://www.doi.gov/bureaus" },
  ],

  categoryStyleDay: {
    ACCESS:       { bg: "rgba(92,58,34,0.10)",    color: "#5C3A22" },
    EXPERIENCE:   { bg: "rgba(30,92,115,0.10)",   color: "#1E5C73" },
    CONSERVATION: { bg: "rgba(74,110,60,0.10)",   color: "#4A6E3C" },
    POLICY:       { bg: "rgba(139,74,42,0.10)",   color: "#8B4A2A" },
    CULTURE:      { bg: "rgba(120,90,110,0.10)",  color: "#785A6E" },
  },

  categoryStyleNight: {
    ACCESS:       { bg: "rgba(139,94,60,0.14)",   color: "#A87A58" },
    EXPERIENCE:   { bg: "rgba(74,143,168,0.12)",  color: "#4A8FA8" },
    CONSERVATION: { bg: "rgba(92,138,80,0.12)",   color: "#5C8A50" },
    POLICY:       { bg: "rgba(194,112,70,0.12)",  color: "#C27046" },
    CULTURE:      { bg: "rgba(160,120,148,0.12)", color: "#A07894" },
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
