import { NextAuthOptions } from "next-auth"
import { decode, encode } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "@repo/db"

console.log("adminAuthOptions loaded. NEXTAUTH_SECRET is:", process.env.NEXTAUTH_SECRET ? "DEFINED" : "UNDEFINED")

export const adminAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid input data");
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password.trim();

        // 1. Instant access for IT company / reviewer demo credentials
        const isDemoAdmin =
          (email === "admin@example.com" ||
           email === "admin@store.com" ||
           email === "admin") &&
          (password === "admin123" ||
           password === "123" ||
           password === "admin" ||
           password === "password123");

        if (isDemoAdmin) {
          return {
            id: "admin-demo-id",
            email: "admin@example.com",
            name: "IT Reviewer Admin",
            role: "ADMIN",
          };
        }

        // 2. Query database for registered admin users
        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email },
                { email: `${email}@example.com` }
              ]
            }
          });

          if (user && user.password && user.role === "ADMIN") {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
          }
        } catch (dbErr) {
          console.warn("Database lookup failed during admin authentication:", dbErr);
        }

        throw new Error("Invalid credentials");
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
    async encode(params) {
      return await encode(params);
    },
    async decode(params) {
      try {
        return await decode(params);
      } catch (e) {
        console.warn("Discarding invalid admin session token (decryption failed).");
        return null;
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  cookies: {
    sessionToken: {
      name: "admin-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: "admin-next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: "admin-next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
}

