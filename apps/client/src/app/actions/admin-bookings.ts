"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { BookingRepository } from "@repo/services/repositories/booking"
import { BookingStatus } from "@prisma/client"
import { Resend } from "resend"
import { StatusUpdateEmail } from "@repo/ui/components/emails/status-update"
import { prisma as db } from "@repo/db"
import { siteConfig } from "@repo/ui/config/site"

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key')

export async function adminUpdateBookingStatus(bookingId: string, status: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" }
    }

    await BookingRepository.updateStatus(bookingId, status as BookingStatus)
    
    // Fetch user details for email
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { user: true }
    })

    if (booking && booking.user.email) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || `${siteConfig.name} <onboarding@resend.dev>`,
          to: booking.user.email,
          subject: `Booking Update #${booking.bookingNumber}`,
          react: StatusUpdateEmail({
            referenceNumber: booking.bookingNumber,
            customerName: booking.user.name || "Customer",
            type: "Booking",
            newStatus: status
          }),
        })
      } catch (e) {
        console.error("Email failed", e)
      }
    }

    revalidatePath("/admin/bookings")
    revalidatePath(`/admin/bookings/${bookingId}`)
    revalidatePath("/account/bookings")
    
    return { success: true }
  } catch (error: any) {
    console.error("Update booking status error stack:", error.stack || error)
    return { success: false, error: "Failed to update status. Please try again." }
  }
}
