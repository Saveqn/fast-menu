import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  getTokenFromRequest,
  validateSession,
} from "@/lib/auth"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protege rotas de admin
  if (pathname.startsWith("/admin")) {
    // Permite página de login e API de login sem sessão
    if (
      pathname === "/admin/login" ||
      pathname.startsWith("/api/admin/login")
    ) {
      return NextResponse.next()
    }

    const token = getTokenFromRequest(req.headers)
    if (!token || !(await validateSession(token))) {
      const loginUrl = new URL("/admin/login", req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
