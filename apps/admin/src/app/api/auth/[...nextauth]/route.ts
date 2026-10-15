import NextAuth from "next-auth/next"
import { adminAuthOptions } from "@/lib/auth"

console.log("Initializing NextAuth handler...");
let handler;
try {
  handler = NextAuth(adminAuthOptions)
  console.log("NextAuth handler initialized successfully.");
} catch (error) {
  console.error("FATAL ERROR INITIALIZING NEXTAUTH:", error);
  // Fallback handler to prevent 500 HTML
  handler = (req: Request) => new Response(JSON.stringify({ error: "Failed to initialize NextAuth", details: String(error) }), { status: 500 });
}

const wrappedHandler = async (req: Request, ...args: any[]) => {
  try {
    const res = await handler(req, ...args);
    console.log(`[NextAuth] ${req.method} ${req.url} -> ${res.status}`);
    const headers = Object.fromEntries(res.headers.entries());
    console.log(`[NextAuth] Set-Cookie:`, headers['set-cookie']);
    return res;
  } catch (error) {
    console.error("FATAL ERROR IN NEXTAUTH HANDLER:", error);
    return new Response(JSON.stringify({ error: "Handler failed", details: String(error) }), { status: 500, headers: { "content-type": "application/json" } });
  }
}

export { wrappedHandler as GET, wrappedHandler as POST }
