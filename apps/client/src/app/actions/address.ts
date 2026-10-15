"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { z } from "zod"

import { authOptions } from "@repo/services/auth"
import { AddressRepository } from "@repo/services/repositories/address"

import { addressSchema } from "@repo/services/validations/address"

export async function addAddress(data: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { success: false, error: "Unauthorized" }

    const parsed = addressSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    await AddressRepository.create(session.user.id, parsed.data as any)
    
    revalidatePath("/account/addresses")
    revalidatePath("/checkout")
    return { success: true }
  } catch (error: any) {
    console.error("Add address error stack:", error.stack || error)
    return { success: false, error: "Failed to add address. Please try again." }
  }
}

export async function updateAddress(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { success: false, error: "Unauthorized" }

    const parsed = addressSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    await AddressRepository.update(id, session.user.id, parsed.data as any)
    
    revalidatePath("/account/addresses")
    revalidatePath("/checkout")
    return { success: true }
  } catch (error: any) {
    console.error("Update address error stack:", error.stack || error)
    return { success: false, error: "Failed to update address. Please try again." }
  }
}

export async function deleteAddress(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { success: false, error: "Unauthorized" }

    await AddressRepository.delete(id, session.user.id)
    
    revalidatePath("/account/addresses")
    revalidatePath("/checkout")
    return { success: true }
  } catch (error: any) {
    console.error("Delete address error stack:", error.stack || error)
    return { success: false, error: "Failed to delete address. Please try again." }
  }
}
