"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface Article {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  summary: string
  category: string
  tag: string
}

interface Category {
  id: string
  label: string
  tag: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 36e5)
  if (h < 1) return "just now"
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function TagPill({ tag, label }: { tag: string; label: string }) {
  return (
    <span className={`tag-${tag} inline-flex items-center text-[10px] font-mono uppercase tracking-widest px-1.5 py-px rounded-sm`}>
      {label}
    </span>
  )
}

function ArticleCard({ article }: { article: Article }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="group cursor-pointer"
      style={{ borderBottom: "0.5px solid var(--bdr)" }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="px-6 py-4">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-2">
          <TagPill tag={article.tag} label={article.category} />
          <span className="text-[11px]" style={{ color: "var(--t3)" }}>
            {article.source}
          </span>
          <span style={{ color: "var(--t4)" }}>·</span>
          <span className="text-[11px]" style={{ color: "var(--t3)" }}>
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Headline */}
        <p
          className="text-[14px] leading-[1.55] font-medium group-hover:text-[var(--acc)] transition-colors duration-150"
          style={{ color: "var(--t1)", letterSpacing: "-0.012em" }}
        >
          {article.title}
        </p>

        {/* Expanded summary */}
        {expanded && (
          <div className="mt-3 pt-3" style={{ borderTop: "0.5px solid var(--bdr)" }}>
            <p className="text-[13px] leading-[1.8]" style={{ color: "var(--t2)" }}>
              {article.summary}
            </p>
            {article.url !== "#" && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-block mt-2.5 text-[11px] hover:underline"
                style={{ color: "var(--acc)" }}
              >
                Read full article →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function FeedPanel({ articles, categories, isLive, loading }: {
  articles: Article[]
  categories: Category[]
  isLive: boolean
  loading: boolean
}) {
  const [active, setActive] = useState("all")
  const allCats = [{ id: "all", label: "All", tag: "all" }, ...categories]
  const filtered = active === "all" ? articles : articles.filter(a => a.tag === active)

  return (
    <div className="flex flex-col h-full" style={{ borderRight: "0.5px solid var(--bdr)" }}>
      {/* Tabs */}
      <div
        className="flex items-center shrink-0 overflow-x-auto"
        style={{ borderBottom: "0.5px solid var(--bdr)", height: "44px", paddingLeft: "8px" }}
      >
        {allCats.map(c => (
          <button
            key={c.id}
            onClick={() => setActive(c.tag)}
            className="flex items-center h-full px-4 text-[11px] font-mono uppercase tracking-widest shrink-0 whitespace-nowrap transition-colors duration-150"
            style={{
              color: active === c.tag ? "var(--t1)" : "var(--t3)",
              borderBottom: active === c.tag ? "1px solid var(--acc)" : "1px solid transparent",
              letterSpacing: "0.08em",
            }}
          >
            {c.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 px-5 shrink-0">
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: isLive ? "var(--acc)" : "var(--t4)" }}
          />
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--t4)" }}>
            {isLive ? "Live" : "Demo"}
          </span>
        </div>
      </div>

      {/* Articles */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <span className="text-[12px]" style={{ color: "var(--t3)" }}>Loading feed…</span>
          </div>
        ) : filtered.map(a => <ArticleCard key={a.id} article={a} />)}
      </div>
    </div>
  )
}

function SynthesisPanel({ articles }: { articles: Article[] }) {
  const [synthesis, setSynthesis] = useState("")
  const [running, setRunning] = useState(false)
  const [lastRun, setLastRun] = useState<string | null>(null)

  const run = async () => {
    if (running || !articles.length) return
    setRunning(true)
    const context = articles.slice(0, 12).map(a => `[${a.category}] ${a.title}: ${a.summary}`).join("\n")
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Synthesize today's feed. What are the 2–3 most important patterns or signals for someone in my position? Be direct and specific." }],
          feedContext: { count: articles.length, articles: context },
        }),
      })
      const data = await res.json()
      setSynthesis(data.text || "")
      setLastRun(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    } catch {
      setSynthesis("Failed to reach Cerebro.")
    }
    setRunning(false)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 shrink-0"
        style={{ borderBottom: "0.5px solid var(--bdr)", height: "44px" }}
      >
        <span
          className="text-[11px] font-mono uppercase tracking-widest"
          style={{ color: "var(--t3)", letterSpacing: "0.1em" }}
        >
          Synthesis
        </span>
        <div className="flex items-center gap-3">
          {lastRun && (
            <span className="text-[10px] font-mono" style={{ color: "var(--t4)" }}>
              {lastRun}
            </span>
          )}
          <button
            onClick={run}
            disabled={running || !articles.length}
            className="text-[11px] px-3 py-1 rounded-sm transition-all duration-150"
            style={{
              background: running ? "transparent" : "var(--acc-l)",
              color: running ? "var(--t3)" : "var(--acc)",
              border: "0.5px solid var(--bdr)",
              cursor: running || !articles.length ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
            }}
          >
            {running ? "Thinking…" : "Run"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {synthesis ? (
          <p
            className="text-[13.5px] leading-[1.9]"
            style={{ color: "var(--t2)" }}
          >
            {synthesis}
          </p>
        ) : (
          <div className="flex items-start pt-1">
            <p className="text-[12px] leading-[1.7]" style={{ color: "var(--t3)", maxWidth: 220 }}>
              Run synthesis to surface patterns and signals across today's feed.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function CerebroChat({ articles }: { articles: Article[] }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [totalTokens, setTotalTokens] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, loading])

  useEffect(() => {
    const el = textareaRef.current
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 96) + "px" }
  }, [input])

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    const updated = [...messages, { role: "user" as const, content: text.trim() }]
    setMessages(updated)
    setInput("")
    setLoading(true)

    const feedContext = articles.length ? {
      count: articles.length,
      articles: articles.slice(0, 15).map(a => `[${a.category}] ${a.title}: ${a.summary}`).join("\n"),
    } : null

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated.map(m => ({ role: m.role, content: m.content })), feedContext }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.text || "No response." }])
      setTotalTokens(t => t + (data.inputTokens || 0) + (data.outputTokens || 0))
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Failed to reach Cerebro." }])
    }
    setLoading(false)
  }, [messages, loading, articles])

  return (
    <div
      className="shrink-0"
      style={{ borderTop: "0.5px solid var(--bdr)", background: "var(--surf)" }}
    >
      {/* Thread */}
      {messages.length > 0 && (
        <div
          className="overflow-y-auto px-6 pt-4 pb-3 space-y-4"
          style={{ maxHeight: "240px", borderBottom: "0.5px solid var(--bdr)" }}
        >
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
              {m.role === "user" ? (
                <span
                  className="inline-block text-[12.5px] leading-[1.5] px-3 py-1.5 rounded-sm"
                  style={{
                    background: "var(--acc-l)",
                    color: "var(--acc)",
                    maxWidth: "65%",
                    border: "0.5px solid var(--bdr)",
                  }}
                >
                  {m.content}
                </span>
              ) : (
                <p
                  className="text-[13.5px] leading-[1.85]"
                  style={{ color: "var(--t2)", maxWidth: "85%" }}
                >
                  {m.content}
                </p>
              )}
            </div>
          ))}
          {loading && (
            <p className="text-[12px]" style={{ color: "var(--t3)" }}>
              Cerebro is thinking…
            </p>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-4 px-6 py-3">
        <span
          className="text-[11px] font-mono uppercase tracking-widest shrink-0"
          style={{ color: "var(--acc)", letterSpacing: "0.1em" }}
        >
          Cerebro
        </span>
        <div className="w-px h-4 shrink-0" style={{ background: "var(--bdr)" }} />
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input) }
          }}
          placeholder="Ask anything about the feed…"
          rows={1}
          className="flex-1 resize-none text-[13px] leading-[1.5] outline-none bg-transparent"
          style={{ color: "var(--t1)", caretColor: "var(--acc)" }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          className="shrink-0 text-[11px] px-3 py-1.5 rounded-sm transition-all duration-150"
          style={{
            background: input.trim() && !loading ? "var(--acc)" : "transparent",
            color: input.trim() && !loading ? "var(--bg)" : "var(--t4)",
            border: "0.5px solid var(--bdr)",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            letterSpacing: "0.02em",
          }}
        >
          Send
        </button>
        <span
          className="shrink-0 text-[10px] font-mono"
          style={{ color: "var(--t4)" }}
        >
          {totalTokens > 0 ? `${totalTokens.toLocaleString()}t` : ""}
        </span>
      </div>
    </div>
  )
}

export default function Page() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  })

  useEffect(() => {
    fetch("/api/news")
      .then(r => r.json())
      .then(data => {
        setArticles(data.articles || [])
        setCategories(data.categories || [])
        setIsLive(data.isLive || false)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 shrink-0"
        style={{
          height: "52px",
          borderBottom: "0.5px solid var(--bdr)",
          background: "var(--surf)",
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="text-[15px] font-semibold tracking-tight"
            style={{ color: "var(--t1)", letterSpacing: "-0.04em" }}
          >
            Dispatch
          </span>
          <span style={{ color: "var(--bdr)" }}>·</span>
          <span
            className="text-[12px]"
            style={{ color: "var(--t3)" }}
          >
            {now}
          </span>
        </div>
        <span
          className="text-[11px] font-mono"
          style={{ color: "var(--t3)", letterSpacing: "0.04em" }}
        >
          Jeremy Grant
        </span>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div style={{ flex: "3" }} className="overflow-hidden">
          <FeedPanel
            articles={articles}
            categories={categories}
            isLive={isLive}
            loading={loading}
          />
        </div>
        <div style={{ flex: "2" }} className="overflow-hidden">
          <SynthesisPanel articles={articles} />
        </div>
      </div>

      {/* Cerebro */}
      <CerebroChat articles={articles} />
    </div>
  )
}
