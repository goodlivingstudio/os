// ─── Podcast Feed Definitions — Five-Layer Mandate ─────────────────────────

export interface PodcastFeed {
  url: string
  show: string
  category: string
  tag: string
  layer: string
}

export const PODCAST_FEEDS: PodcastFeed[] = [
  // ── OPPORTUNITY ───────────────────────────────────────────────────────────
  { url: "https://feeds.megaphone.fm/thereadoutloud",                        show: "The Readout Loud",       category: "Healthcare",        tag: "opportunity", layer: "opportunity" },

  // ── POSITION ──────────────────────────────────────────────────────────────
  { url: "https://api.substack.com/feed/podcast/10845.rss",                  show: "Lenny's Podcast",        category: "Product & Design",  tag: "position",    layer: "position" },
  { url: "https://feeds.acast.com/public/shows/67572f5f7205a5bc68e9792a",    show: "Design Matters",         category: "Design Leadership", tag: "position",    layer: "position" },
  { url: "http://feeds.harvardbusiness.org/harvardbusiness/ideacast",        show: "HBR IdeaCast",           category: "Business",          tag: "position",    layer: "position" },
  { url: "https://feeds.feedburner.com/harvardbusiness/on-leadership",       show: "HBR On Leadership",      category: "Leadership",        tag: "position",    layer: "position" },
  { url: "https://feeds.feedburner.com/harvardbusiness/on-strategy",         show: "HBR On Strategy",        category: "Strategy",          tag: "position",    layer: "position" },
  { url: "https://www.omnycontent.com/d/playlist/708664bd-6843-4623-8066-aede00ce0c8a/3f6f52af-fba1-496d-b11b-af040139456a/bfe0b44a-082f-495a-952a-af0401394590/podcast.rss", show: "McKinsey Podcast", category: "Strategy", tag: "position", layer: "position" },
  { url: "https://www.omnycontent.com/d/playlist/708664bd-6843-4623-8066-aede00ce0c8a/a7ee33f2-d500-4226-b99c-af04013945d6/36587f70-89f9-4631-ac19-af04013945e0/podcast.rss", show: "Inside the Strategy Room", category: "Strategy", tag: "position", layer: "position" },

  // ── DISCIPLINE ────────────────────────────────────────────────────────────
  { url: "https://feeds.simplecast.com/JGE3yC0V",                           show: "The a16z Show",          category: "Tech & Venture",    tag: "discipline",  layer: "discipline" },
  { url: "https://feeds.simplecast.com/6HKOhNgS",                           show: "Hard Fork",              category: "Technology",         tag: "discipline",  layer: "discipline" },
  { url: "https://anchor.fm/s/f7cac464/podcast/rss",                        show: "AI Daily Brief",         category: "AI",                tag: "discipline",  layer: "discipline" },
  { url: "https://feeds.transistor.fm/acquired",                             show: "Acquired",               category: "Tech & Business",   tag: "discipline",  layer: "discipline" },
  { url: "https://rss.art19.com/latent-space-ai",                           show: "Latent Space",           category: "AI Engineering",    tag: "discipline",  layer: "discipline" },
  { url: "https://rss.art19.com/no-priors-ai",                              show: "No Priors",              category: "AI & Venture",      tag: "discipline",  layer: "discipline" },

  // ── LANDSCAPE ─────────────────────────────────────────────────────────────
  { url: "https://feeds.simplecast.com/Sl5CSM3S",                           show: "The Daily",              category: "News",              tag: "landscape",   layer: "landscape" },
  { url: "https://feeds.simplecast.com/kEKXbjuJ",                           show: "Ezra Klein Show",        category: "Policy & Ideas",    tag: "landscape",   layer: "landscape" },
  { url: "https://feeds.npr.org/510318/podcast.xml",                        show: "Up First",               category: "News",              tag: "landscape",   layer: "landscape" },
  { url: "https://feeds.megaphone.fm/VMP5705694065",                        show: "Today, Explained",       category: "News & Policy",     tag: "landscape",   layer: "landscape" },
  { url: "https://feeds.npr.org/510355/podcast.xml",                        show: "Consider This",          category: "News",              tag: "landscape",   layer: "landscape" },
  { url: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/41764a4f-fc64-4e11-89ba-ae7c0030ab5e/9caafc41-289c-4115-995d-ae7c0030ab75/podcast.rss", show: "Bloomberg Tech", category: "Technology", tag: "landscape", layer: "landscape" },
  { url: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/825d4e29-b616-46f4-afd7-ae2b0013005c/8b1dd624-a026-43e9-8b57-ae2b00130066/podcast.rss", show: "Big Take", category: "Business", tag: "landscape", layer: "landscape" },
  { url: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/3b082bbf-691d-443b-bc59-ae2b0012ff93/9222076a-d22a-4a9f-9d26-ae2b0012ffb4/podcast.rss", show: "Bloomberg Businessweek", category: "Business", tag: "landscape", layer: "landscape" },
  { url: "https://access.acast.com/rss/ec380acc-fe13-46a0-991f-a1e508d126f8", show: "Economist Podcasts", category: "Global Analysis",  tag: "landscape",   layer: "landscape" },
  { url: "https://feeds.megaphone.fm/VMP1684715893",                        show: "On with Kara Swisher",   category: "Tech & Media",      tag: "landscape",   layer: "landscape" },
  { url: "http://feeds.feedburner.com/tnypoliticalscene",                    show: "The Political Scene",    category: "Politics",          tag: "landscape",   layer: "landscape" },
  { url: "https://my.slate.com/podcasts/feeds/political-gabfest/",           show: "Political Gabfest",      category: "Politics",          tag: "landscape",   layer: "landscape" },

  // ── CULTURE ───────────────────────────────────────────────────────────────
  { url: "https://feeds.simplecast.com/EmVW7VGp",                           show: "Radiolab",               category: "Science & Ideas",   tag: "culture",     layer: "culture" },
  { url: "https://feeds.simplecast.com/kwWc0lhf",                           show: "Hidden Brain",           category: "Behavioral Science", tag: "culture",    layer: "culture" },
  { url: "https://feeds.npr.org/510333/podcast.xml",                        show: "Throughline",            category: "History",           tag: "culture",     layer: "culture" },
  { url: "https://feeds.npr.org/381444908/podcast.xml",                     show: "Fresh Air",              category: "Interviews",        tag: "culture",     layer: "culture" },
  { url: "https://feeds.simplecast.com/P0r8htaw",                           show: "Time Sensitive",         category: "Design & Culture",  tag: "culture",     layer: "culture" },
  { url: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/ff0ba2f2-f33c-4193-aba2-ae32006cd633/11c188a1-cb86-4869-9c57-ae32006cd63c/podcast.rss", show: "Broken Record", category: "Music & Creativity", tag: "culture", layer: "culture" },
  { url: "https://feeds.simplecast.com/TRuO_SRo",                           show: "New Yorker Radio Hour",  category: "Culture & Ideas",   tag: "culture",     layer: "culture" },
  { url: "https://feeds.simplecast.com/BqbsxVfO",                           show: "99% Invisible",          category: "Design & Architecture", tag: "culture", layer: "culture" },
  { url: "https://feeds.npr.org/510312/podcast.xml",                        show: "Code Switch",            category: "Culture",           tag: "culture",     layer: "culture" },
  { url: "https://feeds.npr.org/510364/podcast.xml",                        show: "Book of the Day",        category: "Books",             tag: "culture",     layer: "culture" },
  { url: "https://feeds.megaphone.fm/the-rewatchables",                     show: "The Rewatchables",       category: "Film",              tag: "culture",     layer: "culture" },
]
