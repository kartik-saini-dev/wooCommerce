import { NextResponse } from "next/server";
import { z } from "zod";
import { sendOTP } from "@repo/services/otp";
import { prisma } from "@repo/db";
import bcrypt from "bcrypt";
import { checkRateLimit } from "@repo/services/rate-limit";
import { headers } from "next/headers";

const sendOtpSchema = z.object({
  type: z.enum(["phone", "email"]),
  identifier: z.string().min(1, "Identifier is required"),
  password: z.string().optional(), // Required for admin email
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = sendOtpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { type, identifier, password } = result.data;
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for") || "unknown_ip";

    const rateLimit = await checkRateLimit(ip, `send_otp_${identifier}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please try again later." },
        { status: 429 }
      );
    }

    if (type === "email") {
      if (!password) {
        return NextResponse.json({ error: "Password is required for admin OTP" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { email: identifier } });
      if (!user || !user.password || user.role !== "ADMIN") {
        // Return success even if invalid to prevent user enumeration
        return NextResponse.json({ success: true, message: "If credentials are valid, an OTP has been sent." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return NextResponse.json({ success: true, message: "If credentials are valid, an OTP has been sent." });
      }
      
      // Credentials are valid, send OTP
      await sendOTP({ type: "email", identifier });
    } else if (type === "phone") {
      // For phone, just send it (account might be created on verification)
      await sendOTP({ type: "phone", identifier });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
