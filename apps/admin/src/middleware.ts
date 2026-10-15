import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  let token = null
  try {
    token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_JWT_SECRET,
      cookieName: process.env.NODE_ENV === "production" ? "__Secure-admin-next-auth.session-token" : "admin-next-auth.session-token"
    })
  } catch (err) {
    console.error("Middleware getToken error:", err)
  }
  
  const path = req.nextUrl.pathname
  const isAdmin = token?.role === "ADMIN"

  // Public paths
  if (
    path.startsWith("/login") || 
    path.startsWith("/unauthorized") || 
    path.startsWith("/api/auth") ||
    path.startsWith("/api/setup-admin") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico"
  ) {
    // If logged in as admin, redirect from login to dashboard
    if (isAdmin && path.startsWith("/login")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    }
    return NextResponse.next()
  }

  // Not logged in at all -> redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Logged in but not an admin -> redirect to unauthorized
  if (!isAdmin) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
