// Article history — returns up to 7 days of scored articles from KV
import { loadArticleHistory, ARTICLE_STORE_AVAILABLE } from "@/lib/article-store"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const days = Math.min(parseInt(searchParams.get("days") || "7", 10), 7)

  if (!ARTICLE_STORE_AVAILABLE) {
    return Response.json({ available: false, articles: [], days: 0 })
  }

  const articles = await loadArticleHistory(days)
  return Response.json({
    available: true,
    articles,
    days,
    count: articles.length,
  })
}
