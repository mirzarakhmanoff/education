import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const isAdmin = token?.role === "admin"
  const path = request.nextUrl.pathname

  // Protect admin routes
  if (path.startsWith("/admin")) {
    if (!isAuthenticated || !isAdmin) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  // Protect apply route (must be authenticated)
  if (path.startsWith("/apply") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/apply/:path*"],
}
