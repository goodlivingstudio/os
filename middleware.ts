// Standard error response: { error: string }
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const OPEN_METHODS: Record<string, string[]> = {
  "/api/memory": ["GET"],
  "/api/gallery/curate": ["GET"],
}

export function middleware(request: NextRequest) {
  const secret = process.env.API_SECRET
  if (!secret) return NextResponse.next()

  const path = request.nextUrl.pathname
  const method = request.method

  const openMethods = OPEN_METHODS[path]
  if (openMethods && openMethods.includes(method)) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get("authorization")
  if (authHeader === `Bearer ${secret}`) {
    return NextResponse.next()
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export const config = {
  matcher: [
    "/api/dispatch-purge",
    "/api/synthesis-purge",
    "/api/purge-images",
    "/api/memory",
    "/api/gallery/curate",
    "/api/usage",
  ],
}
