"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { prisma as db } from "@repo/db"
import { revalidatePath } from "next/cache"

export async function submitReview(orderId: string, rating: number, comment: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { success: false, error: "Unauthorized" }

    const order = await db.order.findUnique({
      where: { id: orderId, userId: session.user.id }
    })

    if (!order || order.status !== "DELIVERED") {
      return { success: false, error: "Order not found or not delivered" }
    }

    if (order.reviewed) {
      return { success: false, error: "Review already submitted" }
    }

    await db.$transaction([
      db.orderReview.create({
        data: {
          orderId,
          userId: session.user.id,
          rating,
          comment
        }
      }),
      db.order.update({
        where: { id: orderId },
        data: { reviewed: true }
      })
    ])

    revalidatePath(`/account/orders/${orderId}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: "Internal Error" }
  }
}
