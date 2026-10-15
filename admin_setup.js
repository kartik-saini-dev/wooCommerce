const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'apps/admin/src/app');

// 1. Create (admin) and (auth) directories
fs.mkdirSync(path.join(adminDir, '(admin)'), { recursive: true });
fs.mkdirSync(path.join(adminDir, '(auth)'), { recursive: true });

// 2. Read what's currently in app
const items = fs.readdirSync(adminDir);
const routesToMove = [
  'admins', 'bookings', 'categories', 'dashboard', 'logs',
  'messages', 'orders', 'products', 'services', 'settings', 'page.tsx'
];

for (const item of items) {
  if (routesToMove.includes(item)) {
    fs.renameSync(path.join(adminDir, item), path.join(adminDir, '(admin)', item));
  }
}

// 3. Move login to (auth)
if (fs.existsSync(path.join(adminDir, 'login'))) {
  fs.renameSync(path.join(adminDir, 'login'), path.join(adminDir, '(auth)', 'login'));
}

// 4. Move layout.tsx to (admin) layout
if (fs.existsSync(path.join(adminDir, 'layout.tsx'))) {
  fs.renameSync(path.join(adminDir, 'layout.tsx'), path.join(adminDir, '(admin)', 'layout.tsx'));
}

// 5. Create Root Layout
const rootLayout = `
import "@repo/ui/globals.css"
import type { Metadata } from "next"
import { Toaster } from "@repo/ui/components/ui/sonner"

export const metadata: Metadata = {
  title: "Admin Dashboard",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
`;
fs.writeFileSync(path.join(adminDir, 'layout.tsx'), rootLayout.trim());

// 6. Create API auth route
const apiAuthDir = path.join(adminDir, 'api/auth/[...nextauth]');
fs.mkdirSync(apiAuthDir, { recursive: true });
const nextAuthRoute = `
import { authOptions } from "@repo/services/auth"
import NextAuth from "next-auth"

const adminAuthOptions = {
  ...authOptions,
  cookies: {
    ...authOptions.cookies,
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-admin-next-auth.session-token" : "admin-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
}

const handler = NextAuth(adminAuthOptions)

export { handler as GET, handler as POST }
`;
fs.writeFileSync(path.join(apiAuthDir, 'route.ts'), nextAuthRoute.trim());

console.log("Admin setup complete!");
