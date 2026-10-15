import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@repo/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { password, token } = body

    if (!token || !password) {
      return NextResponse.json({ error: "Missing token or password" }, { status: 400 })
    }

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetRecord || resetRecord.expires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword }
    })

    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
