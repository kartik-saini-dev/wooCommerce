"use server"

import { revalidatePath } from "next/cache"
import { prisma as db } from "@repo/db"
import { LoggerService } from "@repo/services/services/logger.service"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"

export async function toggleMessageReadStatus(id: string, currentStatus: boolean) {
  try {
    const session = await getServerSession(authOptions)
    await db.contactMessage.update({
      where: { id },
      data: { isRead: !currentStatus }
    })
    
    await LoggerService.audit({
      userId: session?.user?.id,
      action: !currentStatus ? "READ_MESSAGE" : "UNREAD_MESSAGE",
      entity: "ContactMessage",
      entityId: id,
    })

    revalidatePath("/admin/messages")
    return { success: true }
  } catch (error) {
    console.error("Failed to toggle read status:", error)
    return { success: false, error: "Failed to update status." }
  }
}

export async function deleteMessage(id: string) {
  try {
    const session = await getServerSession(authOptions)
    await db.contactMessage.delete({
      where: { id }
    })
    
    await LoggerService.audit({
      userId: session?.user?.id,
      action: "DELETE_MESSAGE",
      entity: "ContactMessage",
      entityId: id,
    })

    revalidatePath("/admin/messages")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete message:", error)
    return { success: false, error: "Failed to delete message." }
  }
}
