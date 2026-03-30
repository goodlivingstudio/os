export const revalidate = 1800 // 30 min cache

// ─── Types ───────────────────────────────────────────────────────────────────

interface Episode {
  id: string
  title: string
  showName: string
  url: string
  publishedAt: string
  summary: string
  duration: string
  artworkUrl: string
  category: string
  tag: string
  layer: string
}

interface PodcastFeed {
  url: string
  show: string
  category: string
  tag: string
  layer: string
}

// ─── Podcast Feed Map — Five-Layer Mandate ───────────────────────────────────

const PODCAST_FEEDS: PodcastFeed[] = [
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

// ─── RSS Parser ──────────────────────────────────────────────────────────────

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}

function extractCDATA(raw: string): string {
  const m = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  return m ? m[1] : raw
}

function stripHTML(str: string): string {
  return str.replace(/<[^>]+>/g, "").trim()
}

function extractTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return m ? decodeEntities(extractCDATA(m[1]).trim()) : ""
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const m = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i"))
  return m ? m[1] : ""
}

function formatDuration(raw: string): string {
  if (!raw) return ""
  // Could be seconds (e.g., "2580") or HH:MM:SS
  if (raw.includes(":")) return raw
  const totalSec = parseInt(raw, 10)
  if (isNaN(totalSec)) return raw
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m} min`
}

async function fetchPodcastFeed(feed: PodcastFeed): Promise<Episode[]> {
  try {
    const res = await fetch(feed.url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Dispatch/1.0 (+https://dispatch.goodliving.studio)" },
    })
    if (!res.ok) return []
    const xml = await res.text()

    // Extract show-level artwork
    const showArtwork = extractAttr(xml, "itunes:image", "href")
      || extractAttr(xml, "image", "href")
      || ""

    // Parse items
    const items = xml.match(/<item[\s\S]*?<\/item>/gi) || []
    return items.slice(0, 5).map((item, i) => {
      const title = stripHTML(extractTag(item, "title"))
      const link = extractTag(item, "link") || extractAttr(item, "enclosure", "url") || ""
      const pubDate = extractTag(item, "pubDate")
      const desc = stripHTML(extractTag(item, "description") || extractTag(item, "itunes:summary") || "")
      const duration = formatDuration(extractTag(item, "itunes:duration"))
      const episodeArt = extractAttr(item, "itunes:image", "href")

      return {
        id: `${feed.show.toLowerCase().replace(/\s+/g, "-")}-${i}`,
        title: title || "Untitled Episode",
        showName: feed.show,
        url: link,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        summary: desc.slice(0, 200),
        duration,
        artworkUrl: episodeArt || showArtwork,
        category: feed.category,
        tag: feed.tag,
        layer: feed.layer,
      }
    })
  } catch {
    return []
  }
}

// ─── GET Handler ─────────────────────────────────────────────────────────────

export async function GET() {
  const results = await Promise.allSettled(
    PODCAST_FEEDS.map(feed => fetchPodcastFeed(feed))
  )

  const episodes: Episode[] = []
  let liveSources = 0

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.length > 0) {
      episodes.push(...result.value)
      liveSources++
    }
  }

  // Sort by most recent
  episodes.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return Response.json({
    episodes,
    isLive: liveSources > 0,
    showCount: liveSources,
    totalShows: PODCAST_FEEDS.length,
  })
}
