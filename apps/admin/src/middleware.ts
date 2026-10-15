import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  let token = null
  try {
    const cookieName = req.cookies.has("__Secure-admin-next-auth.session-token")
      ? "__Secure-admin-next-auth.session-token"
      : "admin-next-auth.session-token"

    token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_JWT_SECRET || process.env.NEXTAUTH_SECRET || "2f9e6c8a0d4b5c7e9a1f3b4d6e7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
      cookieName,
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
