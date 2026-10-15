import { NextAuthOptions } from "next-auth"
import { decode, encode } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "./db"
import { loginSchema } from "./validations/auth"
import { checkRateLimit, recordLoginAttempt } from "./rate-limit"
import { headers } from "next/headers"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "customer-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials, _req) {
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error("Missing phone or OTP");
        }

        const { phone, otp } = credentials;
        const reqHeaders = await headers();
        const ip = reqHeaders.get("x-forwarded-for") || "unknown_ip";

        const rateLimit = await checkRateLimit(ip, phone);
        if (!rateLimit.allowed) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        try {
          // Verify OTP first (using an imported function or logic)
          const { verifyOTP } = await import("./otp");
          await verifyOTP({ type: "phone", identifier: phone, code: otp });

          let user = await prisma.user.findUnique({
            where: { phone }
          });

          if (!user) {
            // Auto-create customer
            user = await prisma.user.create({
              data: {
                phone,
                role: "USER",
                phoneVerified: new Date()
              }
            });
          }

          await recordLoginAttempt(ip, phone, true);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
          };
        } catch (error: any) {
          await recordLoginAttempt(ip, phone, false);
          if (error.message === "Invalid OTP" || error.message === "OTP has expired" || error.message === "No pending OTP found" || error.message === "Maximum verification attempts exceeded. Request a new OTP.") {
            throw error;
          }
          console.error("Auth DB error:", error);
          throw new Error("Authentication service is temporarily unavailable.");
        }
      }
    }),
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _req) {
        const parsedCredentials = loginSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          throw new Error("Invalid input data");
        }

        const { email, password } = parsedCredentials.data;

        const reqHeaders = await headers();
        const ip = reqHeaders.get("x-forwarded-for") || "unknown_ip";

        const rateLimit = await checkRateLimit(ip, email);
        if (!rateLimit.allowed) {
          throw new Error("Too many login attempts. Please try again later.");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user || !user.password || user.role !== "ADMIN") {
            await recordLoginAttempt(ip, email, false);
            throw new Error("Invalid credentials");
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            await recordLoginAttempt(ip, email, false);
            throw new Error("Invalid credentials");
          }

          // OTP removed from admin login

          await recordLoginAttempt(ip, email, true);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          await recordLoginAttempt(ip, email, false);
          if (error.message === "Invalid credentials") {
            throw error;
          }
          console.error("Auth DB error:", error);
          throw new Error("Authentication service is temporarily unavailable.");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    async encode(params) {
      return await encode(params);
    },
    async decode(params) {
      try {
        return await decode(params);
      } catch (e) {
        console.warn("Discarding invalid session token (decryption failed).");
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
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: "client-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  }
}
