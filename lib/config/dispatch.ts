// ─── Dispatch Instance Config ───────────────────────────────────────────────
// Personal strategic intelligence tool for Jeremy Grant.
// Mandate: career positioning across technology, culture & healthcare.

import type { InstanceConfig } from "./types"

const config: InstanceConfig = {
  id: "dispatch",

  branding: {
    name: "Dispatch",
    tagline: "Directed Intelligence for Strategic Positioning Across Technology, Culture & Healthcare",
    domain: "dispatch.goodliving.studio",
    port: 3001,
    favicon: { light: "/favicon-light.png", dark: "/favicon-dark.png", apple: "/apple-touch-icon.png" },
  },

  mandate: {
    operator: `You are the intelligence system for a single operator. Everything you produce is read by this person directly. Write to them, not about them. Never use their name in output. Never refer to "the operator" in copy that they will read — just address the situation directly.

The operator is a Senior Design Director with 15 years of agency experience, founder of Good Living Studio. Positioning for a Head of Design or CDO role at a significant product organization — primary focus on healthcare, pharma, and AI-native product contexts. Immediate engagement opportunity at Eli Lilly's innovation team.

Professional evolution thesis: the role is no longer design leader alone — it is design leader, product leader, and strategy leader simultaneously. Actively closing the gap between design authority and technical/product fluency. Builds AI-augmented systems (Dispatch, Atlas) and directs AI agents for execution. Operates primarily in the defensible layers of design leadership: strategic framing, expressive judgment, system architecture, and AI direction.

Operating thesis: the most important design problems of the next decade live at the intersection of AI capability, healthcare delivery, and human experience. The operator is building toward the authority level required to lead at that intersection.`,

    clientContext: `Current primary intelligence target: Eli Lilly and Company.

Key intelligence:
- 51M patients, $80–83B projected 2026 revenue on GLP-1 momentum
- Diogo Rau (EVP & CIDO) has mandated every Lilly employee engage with AI daily
- $1B NVIDIA AI co-innovation lab partnership; active OpenAI collaboration
- LillyDirect: direct-to-patient pharmacy platform — Lilly's most visible patient experience product
- Donanemab approved for early Alzheimer's: monthly infusions, biomarker monitoring, new care coordination challenges
- 7M Americans with Alzheimer's disease, most undiagnosed; 1yr+ average wait to see a dementia specialist
- 73% of pharma digital transformations fail (Galen Growth 2025)
- Lilly's retatrutide (triple agonist) in Phase 3 with significant A1C and weight results
- Zepbound and Mounjaro driving $80–83B revenue projection
- Strategic argument: Lilly's science has outpaced the experience of receiving it

Active engagement context: in conversations with Laree Ross at Lilly's innovation team for a permalance design leadership engagement. A strategic inflection point — a potential bridge between agency experience and in-house credibility at a significant healthcare organization.`,

    voice: `You are the station chief of this operator's intelligence system.

A station chief is not a counselor who gives advice when asked. A station chief manages what the operator knows and doesn't know, tracks what has changed, and tells them what demands action. You are proactive, not reactive.

BEHAVIORAL RULES:

- Lead with what's changed or what's at stake. The first sentence contains intelligence, not orientation.
- Synthesis first. Surface connections across layers that the operator would miss. Multi-layer signals are always more interesting than single-layer ones.
- Challenge weak reasoning directly. If the operator's framing is wrong, say so. Clarity over encouragement.
- No preamble. No "great question." No "certainly." Begin with substance.
- No bullet points. Write in tight paragraphs. The prose should feel like a briefing from someone who has thought carefully.
- Push the conversation forward. After every response, offer three specific directions the conversation could go next.
- Flag noise explicitly. "This doesn't move your needle" is a useful output. Not everything in the feed is worth deliberating on.
- Never hedge excessively. State your read, name your confidence level once, move on.

ANALYTICAL DISCIPLINE:

MANDATORY GAP ACCOUNTING — When you cite a market opportunity, role, or strategic position in relation to this operator, you must explicitly state what the operator currently lacks to compete for it. Not implied — written out. "This role exists. Here is what you would need to close to be a credible candidate." If you cannot identify a gap, state that explicitly and label the claim as untested.

CONFIDENCE TIER LABELING — When citing market signals or making positional claims, label the epistemic status of each claim:
- ESTABLISHED FACT — verified, sourced, materially reliable
- INFORMED INFERENCE — reasonable conclusion from partial but credible data
- WORKING ASSUMPTION — useful framing, not yet pressure-tested
- SPECULATION — hypothesis without supporting evidence
Do not mix tiers without labeling. "Companies are hiring hybrid CDO roles" is informed inference. "You are positioned for those roles" is speculation unless you can cite specific evidence. Name the tier every time.

AMPLIFICATION CHECK — When the operator introduces a new idea, direction, or framing with positive energy, you must offer at least one substantive challenge before building on it. Not devil's advocate — a genuine interrogation of whether the direction is warranted by the evidence available. If the idea survives the challenge, say so and proceed. If it doesn't, say that too.

WEAKEST CLAIM DISCIPLINE — At the close of any substantive analysis, name the single weakest claim you made in that response — the point most likely to be wrong, the inference with the thinnest support, or the assumption most in need of testing. Do not wait to be asked.`,

    sourceModes: `Dispatch sources are organized by three intelligence modes:

INTELLIGENCE sources: fast-moving signal — pharma news, AI platform updates, policy, markets. High volume. Skim and triage. Flag urgent items for deliberation.

FORMATION sources: slow-moving signal that changes how the operator thinks — craft, culture, design POV, creative practice. Not subject to daily triage. Requires real attention and absorption.

POSITIONING sources: discourse around design leadership, CDO roles, org design, and the career market for senior design talent. Read actively. Direct input to Cerebro deliberation.

When scoring and surfacing signals, weight INTELLIGENCE and POSITIONING sources more heavily for urgency. Weight FORMATION sources more heavily for depth and synthesis value.`,
  },

  // ─── Intelligence layers ────────────────────────────────────────────────────

  layers: [
    { id: "opportunity",  label: "Opportunity",  description: "Healthcare, pharma, AI-health signal. Relevance to Lilly and the broader healthcare transformation space. High scores: patient experience design, pharma digital transformation, AI in care delivery, direct-to-patient models, Lilly-specific news." },
    { id: "position",     label: "Position",     description: "Career trajectory signal. Relevance to positioning as a senior design leader. High scores: CDO and Head of Design hiring, agency-to-in-house transitions, design leadership compensation, what companies are hiring senior design leaders to solve." },
    { id: "discipline",   label: "Discipline",   description: "Design leadership evolution. How the profession is changing. High scores: CDO role scope, AI impact on design practice, design-engineering convergence, org design for product teams, design systems and infrastructure, tools shaping the discipline (Figma, Cursor, v0, Claude, Vercel, Linear)." },
    { id: "landscape",    label: "Landscape",    description: "Broader forces shaping the operating environment. High scores: AI policy and capability shifts, healthcare regulation, technology business model evolution, economic signals affecting hiring and investment." },
    { id: "culture",      label: "Culture",       description: "Taste, criticism, creative practice, and intellectual currents. High scores: architecture, film criticism, music, cultural theory, essays on technology and society. A design leader who only reads industry publications is a technician. Formation signals belong here." },
  ],

  layerColors: {
    opportunity: "var(--accent-secondary)",
    position:    "var(--accent-muted)",
    discipline:  "var(--text-secondary)",
    landscape:   "var(--text-tertiary)",
    culture:     "var(--accent-muted)",
  },

  // ─── Feeds ──────────────────────────────────────────────────────────────────

  feeds: [
    // OPPORTUNITY
    { url: "https://www.statnews.com/feed/",                       source: "STAT News",         category: "Healthcare & Pharma",  tag: "opportunity",  layer: "opportunity" },
    { url: "https://www.biopharmadive.com/feeds/news/",            source: "BioPharma Dive",    category: "Healthcare & Pharma",  tag: "opportunity",  layer: "opportunity" },
    { url: "https://www.fiercehealthcare.com/rss.xml",             source: "Fierce Healthcare", category: "Healthcare & Pharma",  tag: "opportunity",  layer: "opportunity" },
    { url: "https://endpts.com/feed/",                             source: "Endpoints News",    category: "Pharma Deals & FDA",   tag: "opportunity",  layer: "opportunity" },
    { url: "https://investor.lilly.com/rss/news-releases.xml",     source: "Lilly Newsroom",    category: "Eli Lilly",            tag: "opportunity",  layer: "opportunity" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml", source: "New York Times",  category: "Health",              tag: "opportunity",  layer: "opportunity" },
    { url: "https://www.mobihealthnews.com/feed",                  source: "MobiHealthNews",    category: "Healthcare Digital",   tag: "opportunity",  layer: "opportunity" },

    // POSITION
    { url: "https://eyeondesign.aiga.org/feed/",                   source: "Eye on Design",     category: "Design Leadership",    tag: "position",     layer: "position" },
    { url: "https://www.core77.com/feed",                          source: "Core77",            category: "Design Industry",      tag: "position",     layer: "position" },
    { url: "https://designobserver.com/feed/",                     source: "Design Observer",   category: "Design Criticism",     tag: "position",     layer: "position" },
    { url: "https://www.nngroup.com/feed/rss/",                    source: "NNGroup",           category: "UX Research & Org",    tag: "position",     layer: "position" },
    { url: "https://www.svpg.com/feed/",                           source: "SVPG",              category: "Product & Design Org", tag: "position",     layer: "position" },
    { url: "https://news.google.com/rss/search?q=site:hbr.org&hl=en-US&gl=US", source: "Harvard Business Review", category: "Business & Leadership", tag: "position", layer: "position" },

    // DISCIPLINE
    { url: "https://vercel.com/atom",                              source: "Vercel",            category: "Platform & Tooling",   tag: "discipline",   layer: "discipline" },
    { url: "https://news.google.com/rss/search?q=%22linear+app%22+product+engineering&hl=en-US&gl=US", source: "Linear", category: "Product Engineering", tag: "discipline", layer: "discipline" },
    { url: "https://medium.com/feed/design-ibm",                   source: "IBM Design",        category: "Enterprise Design",    tag: "discipline",   layer: "discipline" },
    { url: "https://news.google.com/rss/search?q=site:research.ibm.com/blog&hl=en-US&gl=US", source: "IBM Research", category: "AI & Enterprise Research", tag: "discipline", layer: "discipline" },
    { url: "https://www.dezeen.com/design/feed/",                  source: "Dezeen",            category: "Design Practice",      tag: "discipline",   layer: "discipline" },
    { url: "https://news.google.com/rss/search?q=site:figma.com/blog&hl=en-US&gl=US", source: "Figma Blog", category: "Design Tooling", tag: "discipline", layer: "discipline" },
    { url: "https://news.google.com/rss/search?q=site:anthropic.com&hl=en-US&gl=US", source: "Anthropic", category: "AI Platform", tag: "discipline", layer: "discipline" },
    { url: "https://news.google.com/rss/search?q=site:cursor.com/blog+OR+site:cursor.sh/blog&hl=en-US&gl=US", source: "Cursor", category: "Design Engineering", tag: "discipline", layer: "discipline" },
    { url: "https://medium.com/feed/shopify-ux",                   source: "Shopify UX",        category: "Product Design",       tag: "discipline",   layer: "discipline" },
    { url: "https://news.google.com/rss/search?q=site:shopify.engineering&hl=en-US&gl=US", source: "Shopify Engineering", category: "Design Engineering", tag: "discipline", layer: "discipline" },
    { url: "https://news.google.com/rss/search?q=%22shopify+editions%22&hl=en-US&gl=US", source: "Shopify Editions", category: "Product Platform", tag: "discipline", layer: "discipline" },

    // LANDSCAPE
    { url: "https://www.theverge.com/rss/index.xml",               source: "The Verge",         category: "Technology",           tag: "landscape",    layer: "landscape" },
    { url: "https://www.wired.com/feed/rss",                       source: "Wired",             category: "Technology & Culture", tag: "landscape",    layer: "landscape" },
    { url: "https://www.technologyreview.com/feed/",               source: "MIT Tech Review",   category: "Deep Technology",      tag: "landscape",    layer: "landscape" },
    { url: "https://feeds.bloomberg.com/markets/news.rss",         source: "Bloomberg",         category: "Markets & Finance",    tag: "landscape",    layer: "landscape" },
    { url: "https://www.economist.com/business/rss.xml",           source: "The Economist",     category: "Global Business",      tag: "landscape",    layer: "landscape" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", source: "New York Times", category: "Technology",        tag: "landscape",    layer: "landscape" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",  source: "New York Times", category: "Business",          tag: "landscape",    layer: "landscape" },
    { url: "https://news.google.com/rss/search?q=site:ibm.com/blog&hl=en-US&gl=US", source: "IBM Blog", category: "Enterprise & AI", tag: "landscape", layer: "landscape" },
    { url: "https://news.google.com/rss/search?q=site:ibm.com/think&hl=en-US&gl=US", source: "IBM Think", category: "Enterprise Strategy", tag: "landscape", layer: "landscape" },
    { url: "https://news.google.com/rss/search?q=site:reuters.com&hl=en-US&gl=US", source: "Reuters", category: "Global Wire", tag: "landscape", layer: "landscape" },
    { url: "https://news.google.com/rss/search?q=site:economist.com&hl=en-US&gl=US", source: "The Economist", category: "Global Analysis", tag: "landscape", layer: "landscape" },

    // COLOR INTELLIGENCE
    { url: "https://heuritech.com/blog/feed/",                      source: "Heuritech",         category: "Color & Fashion Intelligence", tag: "culture", layer: "culture" },
    { url: "https://www.canva.com/newsroom/feed/",                   source: "Canva Newsroom",    category: "Design Platform",              tag: "culture", layer: "culture" },
    { url: "https://www.architecturaldigest.com/feed/rss",           source: "Architectural Digest", category: "Interior Color Direction",  tag: "culture", layer: "culture" },
    { url: "https://news.google.com/rss/search?q=WGSN+color+forecast+2026&hl=en-US&gl=US", source: "WGSN", category: "Color Forecasting", tag: "culture", layer: "culture" },
    { url: "https://news.google.com/rss/search?q=Pantone+color+year+2026&hl=en-US&gl=US", source: "Pantone", category: "Color Forecasting", tag: "culture", layer: "culture" },
    { url: "https://news.google.com/rss/search?q=Coloro+key+colors+2026&hl=en-US&gl=US", source: "Coloro", category: "Color Forecasting", tag: "culture", layer: "culture" },
    { url: "https://news.google.com/rss/search?q=%22Farrow+Ball%22+OR+%22Dulux%22+OR+%22Benjamin+Moore%22+OR+%22Sherwin+Williams%22+color+year&hl=en-US&gl=US", source: "Paint Authorities", category: "Color of the Year", tag: "culture", layer: "culture" },
    { url: "https://news.google.com/rss/search?q=Edelkoort+OR+%22Colour+Hive%22+color+trend&hl=en-US&gl=US", source: "Trend Forecasters", category: "Color Forecasting", tag: "culture", layer: "culture" },

    // CULTURE
    { url: "https://www.theatlantic.com/feed/all/",                source: "The Atlantic",      category: "Ideas & Culture",      tag: "culture",      layer: "culture" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml", source: "New York Times",   category: "Arts & Culture",       tag: "culture",      layer: "culture" },
    { url: "https://www.dezeen.com/architecture/feed/",            source: "Dezeen",            category: "Architecture",         tag: "culture",      layer: "culture" },
    { url: "https://www.architectural-review.com/rss",             source: "Arch Review",       category: "Architecture Criticism", tag: "culture",    layer: "culture" },
    { url: "https://pitchfork.com/feed/feed-news/rss",             source: "Pitchfork",         category: "Music & Criticism",    tag: "culture",      layer: "culture" },
    { url: "https://www.nplusonemag.com/feed/",                    source: "n+1",               category: "Literary & Ideas",     tag: "culture",      layer: "culture" },
    { url: "https://news.google.com/rss/search?q=site:criterion.com&hl=en-US&gl=US", source: "Criterion", category: "Film & Cinema", tag: "culture", layer: "culture" },
    { url: "https://news.google.com/rss/search?q=%22A24%22+film+2026&hl=en-US&gl=US", source: "A24", category: "Film & Cinema", tag: "culture", layer: "culture" },
    { url: "https://filmcomment.com/feed/",                        source: "Film Comment",      category: "Film Criticism",       tag: "culture",      layer: "culture" },
    { url: "https://www.indiewire.com/feed/",                      source: "IndieWire",         category: "Film & Industry",      tag: "culture",      layer: "culture" },
    { url: "https://www.hollywoodreporter.com/feed/",              source: "Hollywood Reporter", category: "Film & Entertainment", tag: "culture",     layer: "culture" },

    // VANGUARD THINKERS
    { url: "https://www.doc.cc/feed",                              source: "doc.cc",            category: "Deep Design",          tag: "discipline",   layer: "discipline", type: "social" },
    { url: "https://www.oneusefulthing.org/feed",                  source: "Ethan Mollick",     category: "AI & Organizations",   tag: "landscape",    layer: "landscape",  type: "social" },
    { url: "https://news.google.com/rss/search?q=site:ben-evans.com&hl=en-US&gl=US", source: "Ben Evans", category: "Technology Strategy", tag: "landscape", layer: "landscape", type: "social" },
    { url: "https://news.google.com/rss/search?q=site:every.to&hl=en-US&gl=US", source: "Every", category: "AI & Creative Work", tag: "landscape", layer: "landscape" },
    { url: "https://www.theintrinsicperspective.com/feed",         source: "Intrinsic Perspective", category: "AI & Consciousness", tag: "culture", layer: "culture", type: "social" },
    { url: "https://www.construction-physics.com/feed",            source: "Construction Physics", category: "Industry Transformation", tag: "landscape", layer: "landscape", type: "social" },
    { url: "https://www.noahpinion.blog/feed",                     source: "Noahpinion",        category: "Economics & Policy",    tag: "landscape",    layer: "landscape",  type: "social" },
    { url: "https://danco.substack.com/feed",                      source: "Alex Danco",        category: "Systems & Markets",     tag: "landscape",    layer: "landscape",  type: "social" },
    { url: "https://www.platformer.news/rss/",                     source: "Platformer",        category: "Platform Accountability", tag: "landscape", layer: "landscape",  type: "social" },
    { url: "https://newsletter.pragmaticengineer.com/feed",        source: "Pragmatic Engineer", category: "Engineering Leadership", tag: "discipline", layer: "discipline", type: "social" },

    // SOCIAL — Position
    { url: "https://www.lennysnewsletter.com/feed",                source: "Lenny Rachitsky",   category: "Product & Design",     tag: "position",     layer: "position",   type: "social" },
    { url: "https://lg.substack.com/feed",                         source: "Julie Zhuo",        category: "Design Leadership",    tag: "position",     layer: "position",   type: "social" },
    { url: "https://medium.com/feed/@joulee",                      source: "Julie Zhuo (Medium)", category: "Design Leadership", tag: "position",     layer: "position",   type: "social" },
    { url: "https://www.subtraction.com/feed/",                    source: "Khoi Vinh",         category: "Design Authority",     tag: "position",     layer: "position",   type: "social" },
    { url: "https://medium.com/feed/@khoi",                        source: "Khoi Vinh (Medium)", category: "Design Leadership",  tag: "position",     layer: "position",   type: "social" },
    { url: "https://maeda.pm/feed/",                               source: "John Maeda",        category: "Design & Technology",  tag: "position",     layer: "position",   type: "social" },
    { url: "https://frankchimero.com/feed.xml",                    source: "Frank Chimero",     category: "Design Philosophy",    tag: "position",     layer: "position",   type: "social" },
    { url: "https://carlrivera.substack.com/feed",                 source: "Carl Rivera",       category: "Design Operations",    tag: "position",     layer: "position",   type: "social" },

    // SOCIAL — Discipline
    { url: "https://cutlefish.substack.com/feed",                  source: "John Cutler",       category: "Product Strategy",     tag: "discipline",   layer: "discipline", type: "social" },
    { url: "https://www.proofofconcept.pub/feed",                  source: "Brian Lovin",       category: "Design Engineering",   tag: "discipline",   layer: "discipline", type: "social" },
    { url: "https://medium.com/feed/google-design",                source: "Google Design",     category: "Design Practice",      tag: "discipline",   layer: "discipline" },
    { url: "https://medium.com/feed/mule-design",                  source: "Mule Design",       category: "Design Ethics",        tag: "discipline",   layer: "discipline" },

    // SOCIAL — Landscape
    { url: "https://www.digitalnative.tech/feed",                  source: "Digital Native",    category: "Tech & Culture",       tag: "landscape",    layer: "landscape",  type: "social" },
    { url: "https://stratechery.com/feed/",                        source: "Stratechery",       category: "Tech Strategy",        tag: "landscape",    layer: "landscape",  type: "social" },
  ],

  // ─── Podcasts ───────────────────────────────────────────────────────────────

  podcasts: [
    { url: "https://feeds.megaphone.fm/thereadoutloud",                        show: "The Readout Loud",       category: "Healthcare",        tag: "opportunity", layer: "opportunity" },
    { url: "https://api.substack.com/feed/podcast/10845.rss",                  show: "Lenny's Podcast",        category: "Product & Design",  tag: "position",    layer: "position" },
    { url: "https://feeds.acast.com/public/shows/67572f5f7205a5bc68e9792a",    show: "Design Matters",         category: "Design Leadership", tag: "position",    layer: "position" },
    { url: "http://feeds.harvardbusiness.org/harvardbusiness/ideacast",        show: "HBR IdeaCast",           category: "Business",          tag: "position",    layer: "position" },
    { url: "https://feeds.feedburner.com/harvardbusiness/on-leadership",       show: "HBR On Leadership",      category: "Leadership",        tag: "position",    layer: "position" },
    { url: "https://feeds.feedburner.com/harvardbusiness/on-strategy",         show: "HBR On Strategy",        category: "Strategy",          tag: "position",    layer: "position" },
    { url: "https://www.omnycontent.com/d/playlist/708664bd-6843-4623-8066-aede00ce0c8a/3f6f52af-fba1-496d-b11b-af040139456a/bfe0b44a-082f-495a-952a-af0401394590/podcast.rss", show: "McKinsey Podcast", category: "Strategy", tag: "position", layer: "position" },
    { url: "https://www.omnycontent.com/d/playlist/708664bd-6843-4623-8066-aede00ce0c8a/a7ee33f2-d500-4226-b99c-af04013945d6/36587f70-89f9-4631-ac19-af04013945e0/podcast.rss", show: "Inside the Strategy Room", category: "Strategy", tag: "position", layer: "position" },
    { url: "https://feeds.simplecast.com/JGE3yC0V",                           show: "The a16z Show",          category: "Tech & Venture",    tag: "discipline",  layer: "discipline" },
    { url: "https://feeds.simplecast.com/6HKOhNgS",                           show: "Hard Fork",              category: "Technology",         tag: "discipline",  layer: "discipline" },
    { url: "https://feeds.transistor.fm/acquired",                             show: "Acquired",               category: "Tech & Business",   tag: "discipline",  layer: "discipline" },
    { url: "https://rss.art19.com/latent-space-ai",                           show: "Latent Space",           category: "AI Engineering",    tag: "discipline",  layer: "discipline" },
    { url: "https://rss.art19.com/no-priors-ai",                              show: "No Priors",              category: "AI & Venture",      tag: "discipline",  layer: "discipline" },
    { url: "https://feeds.simplecast.com/Sl5CSM3S",                           show: "The Daily",              category: "News",              tag: "landscape",   layer: "landscape" },
    { url: "https://feeds.simplecast.com/kEKXbjuJ",                           show: "Ezra Klein Show",        category: "Policy & Ideas",    tag: "landscape",   layer: "landscape" },
    { url: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/41764a4f-fc64-4e11-89ba-ae7c0030ab5e/9caafc41-289c-4115-995d-ae7c0030ab75/podcast.rss", show: "Bloomberg Tech", category: "Technology", tag: "landscape", layer: "landscape" },
    { url: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/825d4e29-b616-46f4-afd7-ae2b0013005c/8b1dd624-a026-43e9-8b57-ae2b00130066/podcast.rss", show: "Big Take", category: "Business", tag: "landscape", layer: "landscape" },
    { url: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/3b082bbf-691d-443b-bc59-ae2b0012ff93/9222076a-d22a-4a9f-9d26-ae2b0012ffb4/podcast.rss", show: "Bloomberg Businessweek", category: "Business", tag: "landscape", layer: "landscape" },
    { url: "https://access.acast.com/rss/ec380acc-fe13-46a0-991f-a1e508d126f8", show: "Economist Podcasts", category: "Global Analysis",  tag: "landscape",   layer: "landscape" },
    { url: "https://feeds.megaphone.fm/VMP1684715893",                        show: "On with Kara Swisher",   category: "Tech & Media",      tag: "landscape",   layer: "landscape" },
    { url: "http://feeds.feedburner.com/tnypoliticalscene",                    show: "The Political Scene",    category: "Politics",          tag: "landscape",   layer: "landscape" },
    { url: "https://feeds.simplecast.com/EmVW7VGp",                           show: "Radiolab",               category: "Science & Ideas",   tag: "culture",     layer: "culture" },
    { url: "https://feeds.simplecast.com/kwWc0lhf",                           show: "Hidden Brain",           category: "Behavioral Science", tag: "culture",    layer: "culture" },
    { url: "https://feeds.npr.org/510333/podcast.xml",                        show: "Throughline",            category: "History",           tag: "culture",     layer: "culture" },
    { url: "https://feeds.npr.org/381444908/podcast.xml",                     show: "Fresh Air",              category: "Interviews",        tag: "culture",     layer: "culture" },
    { url: "https://feeds.simplecast.com/P0r8htaw",                           show: "Time Sensitive",         category: "Design & Culture",  tag: "culture",     layer: "culture" },
    { url: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/ff0ba2f2-f33c-4193-aba2-ae32006cd633/11c188a1-cb86-4869-9c57-ae32006cd63c/podcast.rss", show: "Broken Record", category: "Music & Creativity", tag: "culture", layer: "culture" },
    { url: "https://feeds.simplecast.com/TRuO_SRo",                           show: "New Yorker Radio Hour",  category: "Culture & Ideas",   tag: "culture",     layer: "culture" },
    { url: "https://feeds.simplecast.com/BqbsxVfO",                           show: "99% Invisible",          category: "Design & Architecture", tag: "culture", layer: "culture" },
    { url: "https://feeds.npr.org/510312/podcast.xml",                        show: "Code Switch",            category: "Culture",           tag: "culture",     layer: "culture" },
  ],

  // ─── Gallery ────────────────────────────────────────────────────────────────

  gallerySources: [
    { url: "https://api.are.na/v2/channels/dispatch-zen/contents?per=200", name: "Are.na", type: "arena" },
    { url: "https://www.dezeen.com/architecture/feed/", name: "Dezeen", type: "rss" },
    { url: "https://www.architectural-review.com/rss", name: "Architectural Review", type: "rss" },
    { url: "https://www.archdaily.com/feed", name: "ArchDaily", type: "rss" },
    { url: "https://www.designboom.com/feed/", name: "Designboom", type: "rss" },
    { url: "https://leibal.com/feed/", name: "Leibal", type: "rss" },
    { url: "https://www.wallpaper.com/rss", name: "Wallpaper*", type: "rss" },
    { url: "https://www.ignant.com/feed/", name: "IGNANT", type: "rss" },
    { url: "https://minimalissimo.com/feed/", name: "Minimalissimo", type: "rss" },
    { url: "https://plainmagazine.com/feed/", name: "Plain Magazine", type: "rss" },
    { url: "https://www.yellowtrace.com.au/feed/", name: "Yellowtrace", type: "rss" },
    { url: "https://www.featureshoot.com/feed/", name: "Feature Shoot", type: "rss" },
    { url: "https://www.thisiscolossal.com/category/photography/feed/", name: "Colossal Photography", type: "rss" },
    { url: "https://trendland.com/feed/", name: "Trendland", type: "rss" },
    { url: "https://www.thisiscolossal.com/feed/", name: "Colossal", type: "rss" },
    { url: "https://www.booooooom.com/feed/", name: "Booooooom", type: "rss" },
    { url: "https://www.juxtapoz.com/feed/", name: "Juxtapoz", type: "rss" },
    { url: "https://www.fubiz.net/en/feed/", name: "Fubiz", type: "rss" },
    { url: "https://hypebeast.com/feed", name: "Hypebeast", type: "rss" },
    { url: "https://highsnobiety.com/feed/", name: "Highsnobiety", type: "rss" },
    { url: "https://www.awwwards.com/feed", name: "Awwwards", type: "rss" },
    { url: "https://www.minimal.gallery/feed", name: "Minimal Gallery", type: "rss" },
    { url: "https://tympanus.net/codrops/feed/", name: "Codrops", type: "rss" },
    { url: "https://www.tendril.ca/feed", name: "Tendril", type: "rss" },
    { url: "https://www.architecturaldigest.com/feed/rss", name: "Architectural Digest", type: "rss" },
    // Visual culture + photography (expanded)
    { url: "https://www.itsnicethat.com/rss", name: "Its Nice That", type: "rss" },
    { url: "https://www.creativeboom.com/feed/", name: "Creative Boom", type: "rss" },
    { url: "https://abduzeedo.com/feed/", name: "Abduzeedo", type: "rss" },
    { url: "https://weandthecolor.com/feed", name: "We And The Color", type: "rss" },
    { url: "https://www.creativereview.co.uk/feed/", name: "Creative Review", type: "rss" },
    { url: "https://theinspirationgrid.com/feed/", name: "Inspiration Grid", type: "rss" },
    // Tumblr (RSS via /rss suffix)
    { url: "https://thedsgnblog.tumblr.com/rss", name: "The Design Blog", type: "rss" },
    { url: "https://designeverywhere.tumblr.com/rss", name: "Design Everywhere Tumblr", type: "rss" },
  ],

  // ─── Ticker ─────────────────────────────────────────────────────────────────

  headlines: [
    { cat: "PHARMA",  text: "Diogo Rau: 'The whole space of interacting directly with consumers is completely untouched by any medicine company in the world'", url: "https://www.mckinsey.com/industries/life-sciences/our-insights/the-most-important-part-of-the-technology-puzzle-people" },
    { cat: "AI",      text: "Harvard Business Review: design leaders who brief AI outperform those who merely use it", url: "https://hbr.org/2024/11/how-ai-is-changing-design" },
    { cat: "DESIGN",  text: "CDO roles at Fortune 500 companies up 34% YoY — healthcare and pharma lead all sectors", url: "https://eyeondesign.aiga.org/" },
    { cat: "CAREER",  text: "Permalancing is reshaping how design leadership moves between companies", url: "https://www.fastcompany.com/design" },
    { cat: "PHARMA",  text: "73% of pharma digital transformations fail — the patient-facing UX layer is always the weak point", url: "https://galenrowden.com/" },
    { cat: "AI",      text: "Nielsen Norman Group: AI cannot replace design judgment — it amplifies it. The briefing gap is the bottleneck", url: "https://www.nngroup.com/articles/ai-design/" },
    { cat: "DESIGN",  text: "McKinsey: companies with design at C-suite level outperform peers by 32 basis points over 5 years", url: "https://www.mckinsey.com/capabilities/mckinsey-design/our-insights/the-business-value-of-design" },
    { cat: "PHARMA",  text: "LillyDirect year two: prescription fulfillment times down significantly in direct-to-patient channel", url: "https://www.lillydirect.com/" },
    { cat: "CULTURE", text: "The Brutalist is the most important film about authorship and creative work in a decade — The Atlantic", url: "https://www.theatlantic.com/culture/" },
    { cat: "AI",      text: "Figma CEO: 'Design is entering its infrastructure decade — the tooling question is settled, the judgment question isn't'", url: "https://www.figma.com/blog/" },
    { cat: "DESIGN",  text: "The Head of Design role is being redefined around systems thinking and org-level influence, not craft", url: "https://eyeondesign.aiga.org/" },
    { cat: "PHARMA",  text: "Donanemab real-world adoption requires care coordination infrastructure that doesn't exist yet — BioPharma Dive", url: "https://www.biopharmadive.com/" },
    { cat: "CAREER",  text: "VP Design compensation at healthcare tech reached $580K median in 2025 — pharma paying 20-30% above market", url: "https://www.levels.fyi/" },
    { cat: "AI",      text: "Anthropic: Claude's extended thinking mode enables multi-step design research synthesis previously requiring senior strategists", url: "https://www.anthropic.com/news" },
    { cat: "DESIGN",  text: "Design leadership gap widening: pharma is the most underserved sector for senior design talent — Core77", url: "https://www.core77.com/" },
    { cat: "PHARMA",  text: "NEJM Catalyst: digital health UX is still failing patients — gap between clinical excellence and experience is widening", url: "https://catalyst.nejm.org/" },
    { cat: "CULTURE", text: "Five years into AI, the design discipline is splitting into two distinct professions — Wired", url: "https://www.wired.com/category/design/" },
    { cat: "AI",      text: "GTC 2026: agentic AI hits inflection point in life sciences — every pharma workflow is being reimagined", url: "https://nvidianews.nvidia.com/" },
    { cat: "DESIGN",  text: "Strategy teams are encroaching on design territory — leaders who only offer execution are being sidelined", url: "https://www.mckinsey.com/capabilities/mckinsey-design/our-insights" },
    { cat: "PHARMA",  text: "Lilly's $1B NVIDIA AI lab signals pharma is moving from pilot to production infrastructure", url: "https://nvidianews.nvidia.com/" },
    { cat: "CAREER",  text: "Agency-to-in-house design migration accelerating — judgment and positioning matter more than execution credentials", url: "https://www.digiday.com/" },
    { cat: "AI",      text: "Cursor's composer mode compresses the design-to-code cycle from days to hours — design engineering is now a real role", url: "https://www.cursor.com/" },
    { cat: "DESIGN",  text: "CDO roles proliferating in regulated industries — specs emphasize systems thinking, regulatory fluency, cross-functional alignment", url: "https://www.core77.com/" },
    { cat: "PHARMA",  text: "Rau: 'Every single person in our company — without exception — to jump in and start using AI.' The mandate is real", url: "https://www.mckinsey.com/industries/life-sciences/our-insights/the-most-important-part-of-the-technology-puzzle-people" },
    { cat: "CULTURE", text: "Jack White on attention, craft, and the cost of compression: the album that punishes distraction and rewards full listens", url: "https://pitchfork.com/" },
    { cat: "AI",      text: "The rise of the design engineer: the highest-leverage hire in product-led companies — didn't exist as a category five years ago", url: "https://linear.app/blog" },
    { cat: "DESIGN",  text: "Google's Head of Design succession signals a broader trend: product leaders with design sensibility replacing design practitioners", url: "https://eyeondesign.aiga.org/" },
    { cat: "PHARMA",  text: "7M Americans with Alzheimer's, most undiagnosed — 1yr+ average wait to see a dementia specialist", url: "https://www.alz.org/alzheimers-dementia/facts-figures" },
    { cat: "CAREER",  text: "Strategic hiring: pharma companies targeting agency leaders with systems experience over pure product designers", url: "https://eyeondesign.aiga.org/" },
    { cat: "AI",      text: "v0 component generation is production-ready — the design brief quality going in is now the only constraint", url: "https://v0.dev/" },
  ],

  categoryStyleDay: {
    AI:      { bg: "rgba(85,121,73,0.10)",   color: "#557949" },
    DESIGN:  { bg: "rgba(68,119,132,0.10)",  color: "#447784" },
    PHARMA:  { bg: "rgba(120,104,144,0.10)", color: "#786890" },
    CAREER:  { bg: "rgba(140,106,59,0.10)",  color: "#8C6A3B" },
    CULTURE: { bg: "rgba(156,95,83,0.10)",   color: "#9C5F53" },
  },

  categoryStyleNight: {
    AI:      { bg: "rgba(123,175,106,0.14)", color: "#7BAF6A" },
    DESIGN:  { bg: "rgba(90,158,176,0.12)",  color: "#5A9EB0" },
    PHARMA:  { bg: "rgba(154,133,184,0.12)", color: "#9A85B8" },
    CAREER:  { bg: "rgba(212,160,90,0.12)",  color: "#D4A05A" },
    CULTURE: { bg: "rgba(200,122,106,0.12)", color: "#C87A6A" },
  },

  // ─── Cerebro ────────────────────────────────────────────────────────────────

  provocations: [
    "What's the sharpest thing you read today?",
    "What would Rau ask you in the first five minutes?",
    "Where does design sit in Lilly's AI stack?",
    "What's the difference between your pitch and everyone else's?",
    "What signal are you ignoring?",
    "If you had the role today, what's day-one?",
    "What's the question you're afraid they'll ask?",
    "Who else is circling this opportunity?",
    "What does 'Head of Design' mean at a pharma company?",
    "What would you kill from your portfolio right now?",
    "What's the systems argument, not the craft argument?",
    "Where does patient experience break down first?",
    "What's the five-year move if Lilly doesn't happen?",
    "What does design leadership look like without a team?",
    "What are you over-indexing on?",
    "What would make them say no?",
    "How do you talk about AI without sounding like everyone else?",
    "What's the organizational layer no one is designing?",
  ],
  cerebroWelcome: {
    title: "Strategic intelligence ready.",
    subtitle: "Feed analysis, Lilly positioning, career trajectory.",
  },

  // ─── Theme ──────────────────────────────────────────────────────────────────

  themes: [
    { id: "ink", label: "Ink", dot: "#C83028" },
  ],
  defaultTheme: "ink",

  // ─── Gallery Scraper ──────────────────────────────────────────────────────

  galleryScraper: {
    arenaChannelSlug: "dispatch-zen",
    tastePrompt: `You are a senior design director curating a visual inspiration gallery for a strategic intelligence tool. Rate each image 1-5:
1 = UI screenshot, logo, text-heavy, diagram, wireframe, or low quality
2 = Generic stock photography or mundane content
3 = Decent design or photography but not exceptional
4 = Strong visual work — good composition, interesting subject
5 = Exceptional — the kind of image a design leader would save for reference`,
    targets: [
      // ── Ricardo Matos dailies — the benchmark ────────────────────────
      { url: "https://ricardommatos.github.io/daily-gllry-1/", name: "Ricardo Daily 1", category: "gallery" },
      { url: "https://ricardommatos.github.io/daily-gllry-2/", name: "Ricardo Daily 2", category: "gallery" },
      { url: "https://ricardommatos.github.io/daily-gllry-3/", name: "Ricardo Daily 3", category: "gallery" },
      { url: "https://ricardommatos.github.io/daily-gllry-4/", name: "Ricardo Daily 4", category: "gallery" },
      { url: "https://ricardommatos.github.io/daily-gllry-5/", name: "Ricardo Daily 5", category: "gallery" },
      { url: "https://ricardommatos.github.io/daily-gllry-6/", name: "Ricardo Daily 6", category: "gallery" },

      // ── Web design galleries ──────────────────────────────────────────
      { url: "https://savee.it/", name: "Savee", category: "gallery" },
      { url: "https://godly.website/", name: "Godly", category: "gallery" },
      { url: "https://www.siteinspire.com/", name: "Siteinspire", category: "gallery" },
      { url: "https://dribbble.com/shots/popular", name: "Dribbble", category: "gallery" },
      { url: "https://www.behance.net/", name: "Behance", category: "gallery" },
      { url: "https://minimal.gallery/", name: "Minimal Gallery", category: "gallery" },
      { url: "https://www.awwwards.com/websites/", name: "Awwwards", category: "gallery" },
      { url: "https://www.searchsystem.co/", name: "SearchSystem", category: "gallery" },
      { url: "https://www.designeverywhere.co/", name: "Design Everywhere", category: "gallery" },
      { url: "https://www.curated.design/", name: "Curated Inspiration", category: "gallery" },
      { url: "https://www.visualjournal.it/", name: "Visual Journal", category: "gallery" },
      { url: "https://landing.love/", name: "Landing Love", category: "gallery" },

      // ── Visual culture + photography ──────────────────────────────────
      { url: "https://www.ignant.com/", name: "IGNANT", category: "editorial" },
      { url: "https://www.thisiscolossal.com/", name: "Colossal", category: "editorial" },
      { url: "https://www.booooooom.com/", name: "Booooooom", category: "editorial" },
      { url: "https://www.featureshoot.com/", name: "Feature Shoot", category: "editorial" },
      { url: "https://www.juxtapoz.com/", name: "Juxtapoz", category: "editorial" },
      { url: "https://www.fubiz.net/en/", name: "Fubiz", category: "editorial" },
      { url: "https://trendland.com/", name: "Trendland", category: "editorial" },
      { url: "https://www.yellowtrace.com.au/", name: "Yellowtrace", category: "editorial" },
      { url: "https://plainmagazine.com/", name: "Plain Magazine", category: "editorial" },
      { url: "https://minimalissimo.com/", name: "Minimalissimo", category: "editorial" },
      { url: "https://www.itsnicethat.com/", name: "Its Nice That", category: "editorial" },
      { url: "https://www.creativeboom.com/", name: "Creative Boom", category: "editorial" },
      { url: "https://www.theinspirationgrid.com/", name: "Inspiration Grid", category: "editorial" },
      { url: "https://abduzeedo.com/", name: "Abduzeedo", category: "editorial" },
      { url: "https://weandthecolor.com/", name: "We And The Color", category: "editorial" },
      { url: "https://www.creativereview.co.uk/", name: "Creative Review", category: "editorial" },

      // ── Tumblr — curated visual culture (still active) ────────────────
      { url: "https://thedsgnblog.tumblr.com/", name: "The Design Blog", category: "gallery" },
      { url: "https://designeverywhere.tumblr.com/", name: "Design Everywhere Tumblr", category: "gallery" },
      { url: "https://www.thisishappiness.com/", name: "This Isn't Happiness", category: "gallery" },

      // ── Architecture + interiors ──────────────────────────────────────
      { url: "https://www.dezeen.com/", name: "Dezeen", category: "editorial" },
      { url: "https://www.archdaily.com/", name: "ArchDaily", category: "editorial" },
      { url: "https://www.designboom.com/", name: "Designboom", category: "editorial" },
      { url: "https://leibal.com/", name: "Leibal", category: "editorial" },
      { url: "https://www.wallpaper.com/", name: "Wallpaper*", category: "editorial" },
      { url: "https://www.architecturaldigest.com/", name: "Architectural Digest", category: "editorial" },

      // ── Street culture + fashion photography ──────────────────────────
      { url: "https://hypebeast.com/", name: "Hypebeast", category: "editorial" },
      { url: "https://highsnobiety.com/", name: "Highsnobiety", category: "editorial" },

      // ── Digital craft + code art ──────────────────────────────────────
      { url: "https://tympanus.net/codrops/", name: "Codrops", category: "gallery" },

      // ── AI-generated visual art ───────────────────────────────────────
      { url: "https://www.lummi.ai/creator/ricardomatos", name: "Ricardo Matos (Lummi)", category: "gallery" },

      // ── Design agencies — existing ─────────────────────────────────────
      { url: "https://fantasy.co/", name: "Fantasy", category: "agency" },
      { url: "https://www.monks.com/work", name: "Monks", category: "agency" },
      { url: "https://erichu.info/", name: "Eric Hu", category: "agency" },
      { url: "https://www.daisychainstudio.net/", name: "Daisy Chain", category: "agency" },
      { url: "https://mouthwash.studio/", name: "Mouthwash Studio", category: "agency" },
      { url: "https://koto.studio/", name: "Koto", category: "agency" },
      { url: "https://dfrnt.com/", name: "DFRNT", category: "agency" },
      { url: "https://tendril.ca/", name: "Tendril", category: "agency" },
      { url: "https://watsondesign.com/", name: "Watson", category: "agency" },
      { url: "https://locomotive.ca/en", name: "Locomotive", category: "agency" },
      { url: "https://metalab.com/work", name: "Metalab", category: "agency" },
      { url: "https://portorocha.com/", name: "Porto Rocha", category: "agency" },
      { url: "https://www.studiodumbar.com/work", name: "Studio Dumbar", category: "agency" },
      { url: "https://www.pentagram.com/work", name: "Pentagram", category: "agency" },
      { url: "https://wearecollins.com/", name: "Collins", category: "agency" },
      { url: "https://order.design/", name: "Order", category: "agency" },

      // ── Awwwards Agency of the Year nominees 2025 ─────────────────────
      { url: "https://saltandpepper.pt/", name: "Salt & Pepper", category: "agency" },
      { url: "https://numbered.studio/", name: "Numbered", category: "agency" },
      { url: "https://unseen.studio/", name: "Unseen Studio", category: "agency" },
      { url: "https://www.videinfra.com/", name: "Vide Infra", category: "agency" },
      { url: "https://tubik.arts.co/", name: "Tubik", category: "agency" },
      { url: "https://www.merci-michel.com/", name: "Merci Michel", category: "agency" },
      { url: "https://www.monogrid.com/", name: "Monogrid", category: "agency" },
      { url: "https://tuxcreativehouse.com/", name: "Tux Creative House", category: "agency" },
      { url: "https://nkstudio.co/", name: "/nk.studio", category: "agency" },
      { url: "https://noomo.agency/", name: "Noomo", category: "agency" },
      { url: "https://www.gladeye.com/", name: "Gladeye", category: "agency" },
      { url: "https://springsummer.dk/", name: "Spring/Summer", category: "agency" },
      { url: "https://zajno.com/", name: "Zajno", category: "agency" },
      { url: "https://basement.studio/", name: "Basement Studio", category: "agency" },
      { url: "https://shiftbrain.com/en/", name: "Shiftbrain", category: "agency" },
      { url: "https://wild.as/", name: "WILD", category: "agency" },
      { url: "https://www.mallardandclaret.com/", name: "Mallard & Claret", category: "agency" },
      { url: "https://www.makemepulse.com/", name: "Makemepulse", category: "agency" },
      { url: "https://serious.business/", name: "Serious Business", category: "agency" },
      { url: "https://zypsy.com/", name: "Zypsy", category: "agency" },
      { url: "https://www.bfrst.com/", name: "Bornfight Studio", category: "agency" },
      { url: "https://dogstudio.co/", name: "Dogstudio", category: "agency" },
      { url: "https://www.hellomonday.com/", name: "Hello Monday", category: "agency" },
      { url: "https://papertiger.com/", name: "Paper Tiger", category: "agency" },
      { url: "https://cuberto.com/", name: "Cuberto", category: "agency" },
      { url: "https://www.mill3.studio/", name: "MILL3", category: "agency" },
      { url: "https://owow.io/", name: "OWOW", category: "agency" },
      { url: "https://www.buildinamsterdam.com/", name: "Build in Amsterdam", category: "agency" },
      { url: "https://monopo.vn/", name: "Monopo", category: "agency" },
      { url: "https://www.significa.co/", name: "Significa", category: "agency" },
      { url: "https://activetheory.net/", name: "Active Theory", category: "agency" },
    ],
  },
}

export default config
