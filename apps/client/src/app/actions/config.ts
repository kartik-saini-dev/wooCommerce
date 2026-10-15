"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { ConfigService, StoreConfiguration } from "@repo/services/services/config.service"
import { revalidatePath } from "next/cache"

export async function updateConfig(data: Partial<StoreConfiguration>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        await ConfigService.setConfig(key as keyof StoreConfiguration, value)
      }
    }

    revalidatePath("/")
    revalidatePath("/admin/settings/delivery")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update configuration" }
  }
}
