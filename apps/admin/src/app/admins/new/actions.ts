"use server"

import { prisma } from "@repo/db"
import { getServerSession } from "next-auth/next"
import { adminAuthOptions } from "@/lib/auth"
import bcrypt from "bcrypt"
import { z } from "zod"

const adminSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN"]),
})

export async function createAdmin(prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return { error: "Unauthorized" }
    }

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      role: "ADMIN" as const,
    }

    const result = adminSchema.safeParse(data)
    if (!result.success) {
      return { error: result.error.issues[0].message }
    }

    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: result.data.email },
          { phone: result.data.phone },
        ],
      },
    })

    if (existingAdmin) {
      return { error: "Admin with this email or phone already exists" }
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10)

    await prisma.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
        phoneVerified: new Date(),
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Create admin error:", error)
    return { error: "Failed to create admin" }
  }
}

