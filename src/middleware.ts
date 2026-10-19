import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAdminSession } from "@/lib/auth"

export function middleware(req: NextRequest) {
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

    const session = getAdminSession()
    if (!session) {
      const loginUrl = new URL("/admin/login", req.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
