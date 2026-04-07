// ─── News Feed Definitions — Five-Layer Mandate ────────────────────────────
// Source: docs/SOURCES.md
// Every feed maps to a primary intelligence layer. Articles are scored across
// all five layers by the annotation engine regardless of primary assignment.
//
// Curation principle: top shelf only. No junk food. Every source should be
// worth reading at length, not just scanning headlines.

export interface FeedDef {
  url: string
  source: string
  category: string
  tag: string
  layer: string
  type?: "news" | "social"
}

export const FEEDS: FeedDef[] = [

  // ── OPPORTUNITY — Healthcare, pharma, AI-health intersection ──────────────
  { url: "https://www.statnews.com/feed/",                       source: "STAT News",         category: "Healthcare & Pharma",  tag: "opportunity",  layer: "opportunity" },
  { url: "https://www.biopharmadive.com/feeds/news/",            source: "BioPharma Dive",    category: "Healthcare & Pharma",  tag: "opportunity",  layer: "opportunity" },
  { url: "https://www.fiercehealthcare.com/rss.xml",             source: "Fierce Healthcare", category: "Healthcare & Pharma",  tag: "opportunity",  layer: "opportunity" },
  { url: "https://endpts.com/feed/",                             source: "Endpoints News",    category: "Pharma Deals & FDA",   tag: "opportunity",  layer: "opportunity" },
  { url: "https://investor.lilly.com/rss/news-releases.xml",     source: "Lilly Newsroom",    category: "Eli Lilly",            tag: "opportunity",  layer: "opportunity" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml", source: "New York Times",  category: "Health",              tag: "opportunity",  layer: "opportunity" },
  { url: "https://www.mobihealthnews.com/feed",                  source: "MobiHealthNews",    category: "Healthcare Digital",   tag: "opportunity",  layer: "opportunity" },

  // ── POSITION — Design leadership careers, hiring, compensation ────────────
  { url: "https://eyeondesign.aiga.org/feed/",                   source: "Eye on Design",     category: "Design Leadership",    tag: "position",     layer: "position" },
  { url: "https://www.core77.com/feed",                          source: "Core77",            category: "Design Industry",      tag: "position",     layer: "position" },
  { url: "https://designobserver.com/feed/",                     source: "Design Observer",   category: "Design Criticism",     tag: "position",     layer: "position" },
  { url: "https://www.nngroup.com/feed/rss/",                    source: "NNGroup",           category: "UX Research & Org",    tag: "position",     layer: "position" },
  { url: "https://www.svpg.com/feed/",                           source: "SVPG",              category: "Product & Design Org", tag: "position",     layer: "position" },
  { url: "https://news.google.com/rss/search?q=site:hbr.org&hl=en-US&gl=US", source: "Harvard Business Review", category: "Business & Leadership", tag: "position", layer: "position" },

  // ── DISCIPLINE — How design leadership is evolving as a function ──────────
  { url: "https://vercel.com/atom",                              source: "Vercel",            category: "Platform & Tooling",   tag: "discipline",   layer: "discipline" },
  { url: "https://news.google.com/rss/search?q=%22linear+app%22+product+engineering&hl=en-US&gl=US", source: "Linear", category: "Product Engineering", tag: "discipline", layer: "discipline" },
  { url: "https://medium.com/feed/design-ibm",                   source: "IBM Design",        category: "Enterprise Design",    tag: "discipline",   layer: "discipline" },
  { url: "https://news.google.com/rss/search?q=site:research.ibm.com/blog&hl=en-US&gl=US", source: "IBM Research", category: "AI & Enterprise Research", tag: "discipline", layer: "discipline" },
  { url: "https://www.dezeen.com/design/feed/",                  source: "Dezeen",            category: "Design Practice",      tag: "discipline",   layer: "discipline" },
  { url: "https://news.google.com/rss/search?q=site:figma.com/blog&hl=en-US&gl=US", source: "Figma Blog", category: "Design Tooling", tag: "discipline", layer: "discipline" },
  { url: "https://news.google.com/rss/search?q=site:anthropic.com&hl=en-US&gl=US", source: "Anthropic", category: "AI Platform", tag: "discipline", layer: "discipline" },
  { url: "https://news.google.com/rss/search?q=site:cursor.com/blog+OR+site:cursor.sh/blog&hl=en-US&gl=US", source: "Cursor", category: "Design Engineering", tag: "discipline", layer: "discipline" },

  // Shopify — engineering, design, and product culture
  { url: "https://medium.com/feed/shopify-ux",                   source: "Shopify UX",        category: "Product Design",       tag: "discipline",   layer: "discipline", type: "social" },
  { url: "https://news.google.com/rss/search?q=site:shopify.engineering&hl=en-US&gl=US", source: "Shopify Engineering", category: "Design Engineering", tag: "discipline", layer: "discipline" },
  { url: "https://news.google.com/rss/search?q=%22shopify+editions%22&hl=en-US&gl=US", source: "Shopify Editions", category: "Product Platform", tag: "discipline", layer: "discipline" },

  // ── LANDSCAPE — Technology, policy, economics, AI capability ──────────────
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

  // ── COLOR INTELLIGENCE — Visual culture, color forecasting ────────────────
  { url: "https://heuritech.com/blog/feed/",                      source: "Heuritech",         category: "Color & Fashion Intelligence", tag: "culture", layer: "culture" },
  // It's Nice That — feed dead since 2020, removed
  // Creative Boom — no RSS feed exists, removed
  { url: "https://www.canva.com/newsroom/feed/",                   source: "Canva Newsroom",    category: "Design Platform",              tag: "culture", layer: "culture" },
  // Frame Magazine — no RSS feed exists, removed
  { url: "https://www.architecturaldigest.com/feed/rss",           source: "Architectural Digest", category: "Interior Color Direction",  tag: "culture", layer: "culture" },
  // Forecaster mention monitoring (Google News proxies)
  { url: "https://news.google.com/rss/search?q=WGSN+color+forecast+2026&hl=en-US&gl=US", source: "WGSN", category: "Color Forecasting", tag: "culture", layer: "culture" },
  { url: "https://news.google.com/rss/search?q=Pantone+color+year+2026&hl=en-US&gl=US", source: "Pantone", category: "Color Forecasting", tag: "culture", layer: "culture" },
  { url: "https://news.google.com/rss/search?q=Coloro+key+colors+2026&hl=en-US&gl=US", source: "Coloro", category: "Color Forecasting", tag: "culture", layer: "culture" },
  { url: "https://news.google.com/rss/search?q=%22Farrow+Ball%22+OR+%22Dulux%22+OR+%22Benjamin+Moore%22+OR+%22Sherwin+Williams%22+color+year&hl=en-US&gl=US", source: "Paint Authorities", category: "Color of the Year", tag: "culture", layer: "culture" },
  { url: "https://news.google.com/rss/search?q=Edelkoort+OR+%22Colour+Hive%22+color+trend&hl=en-US&gl=US", source: "Trend Forecasters", category: "Color Forecasting", tag: "culture", layer: "culture" },

  // ── CULTURE — Taste, criticism, creative practice ─────────────────────────
  { url: "https://www.theatlantic.com/feed/all/",                source: "The Atlantic",      category: "Ideas & Culture",      tag: "culture",      layer: "culture" },
  { url: "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml", source: "New York Times",   category: "Arts & Culture",       tag: "culture",      layer: "culture" },
  { url: "https://www.dezeen.com/architecture/feed/",            source: "Dezeen",            category: "Architecture",         tag: "culture",      layer: "culture" },
  { url: "https://www.architectural-review.com/rss",             source: "Arch Review",       category: "Architecture Criticism", tag: "culture",    layer: "culture" },
  { url: "https://pitchfork.com/feed/feed-news/rss",             source: "Pitchfork",         category: "Music & Criticism",    tag: "culture",      layer: "culture" },
  { url: "https://www.nplusonemag.com/feed/",                    source: "n+1",               category: "Literary & Ideas",     tag: "culture",      layer: "culture" },
  { url: "https://news.google.com/rss/search?q=site:criterion.com&hl=en-US&gl=US", source: "Criterion", category: "Film & Cinema", tag: "culture", layer: "culture" },

  // Film & Cinema
  { url: "https://news.google.com/rss/search?q=%22A24%22+film+2026&hl=en-US&gl=US", source: "A24", category: "Film & Cinema", tag: "culture", layer: "culture" },
  { url: "https://filmcomment.com/feed/",                        source: "Film Comment",      category: "Film Criticism",       tag: "culture",      layer: "culture" },
  { url: "https://www.indiewire.com/feed/",                      source: "IndieWire",         category: "Film & Industry",      tag: "culture",      layer: "culture" },
  { url: "https://www.hollywoodreporter.com/feed/",              source: "Hollywood Reporter", category: "Film & Entertainment", tag: "culture",     layer: "culture" },

  // ── VANGUARD THINKERS — Deep, forefront perspectives ──────────────────────
  // These are the voices operating at the leading edge, not the trailing edge.

  { url: "https://www.doc.cc/feed",                              source: "doc.cc",            category: "Deep Design",          tag: "discipline",   layer: "discipline", type: "social" },
  { url: "https://www.oneusefulthing.org/feed",                  source: "Ethan Mollick",     category: "AI & Organizations",   tag: "landscape",    layer: "landscape",  type: "social" },
  { url: "https://news.google.com/rss/search?q=site:ben-evans.com&hl=en-US&gl=US", source: "Ben Evans", category: "Technology Strategy", tag: "landscape", layer: "landscape" },
  { url: "https://news.google.com/rss/search?q=site:every.to&hl=en-US&gl=US", source: "Every", category: "AI & Creative Work", tag: "landscape", layer: "landscape" },
  { url: "https://www.theintrinsicperspective.com/feed",         source: "Intrinsic Perspective", category: "AI & Consciousness", tag: "culture", layer: "culture", type: "social" },
  { url: "https://www.construction-physics.com/feed",            source: "Construction Physics", category: "Industry Transformation", tag: "landscape", layer: "landscape", type: "social" },
  { url: "https://www.noahpinion.blog/feed",                     source: "Noahpinion",        category: "Economics & Policy",    tag: "landscape",    layer: "landscape",  type: "social" },
  { url: "https://danco.substack.com/feed",                      source: "Alex Danco",        category: "Systems & Markets",     tag: "landscape",    layer: "landscape",  type: "social" },
  { url: "https://www.platformer.news/rss/",                     source: "Platformer",        category: "Platform Accountability", tag: "landscape", layer: "landscape",  type: "social" },
  { url: "https://newsletter.pragmaticengineer.com/feed",        source: "Pragmatic Engineer", category: "Engineering Leadership", tag: "discipline", layer: "discipline", type: "social" },

  // ── SOCIAL INTELLIGENCE — Substack, Medium, editorial voices ──────────────

  // Position — Senior design leadership voices
  { url: "https://www.lennysnewsletter.com/feed",                source: "Lenny Rachitsky",   category: "Product & Design",     tag: "position",     layer: "position",   type: "social" },
  { url: "https://lg.substack.com/feed",                         source: "Julie Zhuo",        category: "Design Leadership",    tag: "position",     layer: "position",   type: "social" },
  { url: "https://medium.com/feed/@joulee",                      source: "Julie Zhuo (Medium)", category: "Design Leadership", tag: "position",     layer: "position",   type: "social" },
  { url: "https://www.subtraction.com/feed/",                    source: "Khoi Vinh",         category: "Design Authority",     tag: "position",     layer: "position",   type: "social" },
  { url: "https://medium.com/feed/@khoi",                        source: "Khoi Vinh (Medium)", category: "Design Leadership",  tag: "position",     layer: "position",   type: "social" },
  { url: "https://maeda.pm/feed/",                               source: "John Maeda",        category: "Design & Technology",  tag: "position",     layer: "position",   type: "social" },
  { url: "https://frankchimero.com/feed.xml",                    source: "Frank Chimero",     category: "Design Philosophy",    tag: "position",     layer: "position",   type: "social" },
  { url: "https://carlrivera.substack.com/feed",                 source: "Carl Rivera",       category: "Design Operations",    tag: "position",     layer: "position",   type: "social" },

  // Discipline — Product, engineering, design practice
  { url: "https://cutlefish.substack.com/feed",                  source: "John Cutler",       category: "Product Strategy",     tag: "discipline",   layer: "discipline", type: "social" },
  { url: "https://www.proofofconcept.pub/feed",                  source: "Brian Lovin",       category: "Design Engineering",   tag: "discipline",   layer: "discipline", type: "social" },
  { url: "https://medium.com/feed/google-design",                source: "Google Design",     category: "Design Practice",      tag: "discipline",   layer: "discipline", type: "social" },
  { url: "https://medium.com/feed/mule-design",                  source: "Mule Design",       category: "Design Ethics",        tag: "discipline",   layer: "discipline", type: "social" },

  // Landscape — Strategy, economics, technology
  { url: "https://www.digitalnative.tech/feed",                  source: "Digital Native",    category: "Tech & Culture",       tag: "landscape",    layer: "landscape",  type: "social" },
  { url: "https://stratechery.com/feed/",                        source: "Stratechery",       category: "Tech Strategy",        tag: "landscape",    layer: "landscape",  type: "social" },
]
