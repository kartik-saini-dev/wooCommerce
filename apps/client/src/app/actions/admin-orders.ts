"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { OrderRepository } from "@repo/services/repositories/order"
import { OrderStatus } from "@prisma/client"
import { Resend } from "resend"
import { StatusUpdateEmail } from "@repo/ui/components/emails/status-update"
import { prisma as db } from "@repo/db"
import { siteConfig } from "@repo/ui/config/site"

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    await OrderRepository.updateOrderStatus(orderId, status as OrderStatus)
    
    // Fetch order user details to send email
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    })

    if (order && order.user.email) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || `${siteConfig.name} <onboarding@resend.dev>`,
          to: order.user.email,
          subject: `Order Update #${order.orderNumber}`,
          react: StatusUpdateEmail({
            referenceNumber: order.orderNumber,
            customerName: order.user.name || "Customer",
            type: "Order",
            newStatus: status
          }),
        })
      } catch (e) {
        console.error("Email failed", e)
      }
    }

    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath("/account/orders")
    
    return { success: true }
  } catch (error: any) {
    console.error("Update order status error stack:", error.stack || error)
    return { success: false, error: "Failed to update status. Please try again." }
  }
}
