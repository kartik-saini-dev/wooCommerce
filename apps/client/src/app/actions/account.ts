"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import bcrypt from "bcrypt"
import { z } from "zod"

import { authOptions } from "@repo/services/auth"
import { UserRepository } from "@repo/services/repositories/user"
import { prisma as db } from "@repo/db"

import { updateProfileSchema, changePasswordSchema } from "@repo/services/validations/account"

export async function updateProfile(data: { name: string }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { success: false, error: "Unauthorized" }

    const parsed = updateProfileSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    await UserRepository.updateProfile(session.user.id, parsed.data.name)
    revalidatePath("/account/profile")
    return { success: true }
  } catch (error: any) {
    console.error("Update profile error stack:", error.stack || error)
    return { success: false, error: "Failed to update profile. Please try again." }
  }
}

export async function changePassword(data: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { success: false, error: "Unauthorized" }

    const parsed = changePasswordSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const user = await db.user.findUnique({ where: { id: session.user.id } })
    if (!user || !user.password) return { success: false, error: "User not found or uses OAuth" }

    const isValid = await bcrypt.compare(parsed.data.currentPassword, user.password)
    if (!isValid) return { success: false, error: "Incorrect current password" }

    const hashed = await bcrypt.hash(parsed.data.newPassword, 10)
    await UserRepository.updatePassword(session.user.id, hashed)

    return { success: true }
  } catch (error: any) {
    console.error("Change password error stack:", error.stack || error)
    return { success: false, error: "Failed to change password. Please try again." }
  }
}
