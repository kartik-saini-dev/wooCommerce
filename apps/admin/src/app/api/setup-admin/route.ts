import { NextResponse } from "next/server"
import { prisma } from "@repo/db"
import bcrypt from "bcrypt"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")
  const password = searchParams.get("password") || "admin123"

  if (!email) {
    return NextResponse.json({ error: "Please provide an email in the query params: ?email=your@email.com" }, { status: 400 })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN",
        password: hashedPassword,
      },
      create: {
        email,
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: `Admin account created/updated for ${email}`,
      defaultPassword: password
    }, { status: 200 })
  } catch (error: any) {
    console.error("Failed to setup admin:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
