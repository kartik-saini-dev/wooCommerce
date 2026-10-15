import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@repo/db"
import { forgotPasswordSchema } from "@repo/services/validations/auth"
import { NotificationService } from "@repo/services/services/notification.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || user.role !== "ADMIN") {
      // Return 200 to prevent email enumeration attacks
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour

    await prisma.passwordResetToken.upsert({
      where: {
        email_token: {
          email,
          token: resetToken, // This assumes email+token is unique, but upsert usually requires unique field.
        }
      },
      update: {
        token: resetToken,
        expires,
      },
      create: {
        email,
        token: resetToken,
        expires,
      }
    }).catch(async () => {
       // If upsert fails due to compound key issues, fallback to manual delete and create
       await prisma.passwordResetToken.deleteMany({ where: { email } })
       await prisma.passwordResetToken.create({
         data: { email, token: resetToken, expires }
       })
    })

    // Use the request origin if available, otherwise fallback to NEXTAUTH_URL
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000"
    const resetUrl = `${origin}/reset-password?token=${resetToken}`

    // Log the link for local testing if no email provider is configured
    console.log("-----------------------------------------")
    console.log(`Password reset requested for: ${email}`)
    console.log(`RESET LINK: ${resetUrl}`)
    console.log("-----------------------------------------")

    await NotificationService.sendPasswordReset(email, resetUrl)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
