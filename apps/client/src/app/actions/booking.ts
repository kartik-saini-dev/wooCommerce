"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { prisma as db } from "@repo/db"
import { authOptions } from "@repo/services/auth"
import { BookingRepository } from "@repo/services/repositories/booking"
import { checkActionRateLimit } from "@repo/services/action-rate-limit"
import { bookingSchema } from "@repo/services/validations/booking"

export async function createBooking(data: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { success: false, error: "Unauthorized" }

    if (!checkActionRateLimit(session.user.id, "booking")) {
      return { success: false, error: "Too many booking attempts. Please wait a moment and try again." }
    }

    const parsed = bookingSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const booking = await BookingRepository.createBooking({
      userId: session.user.id,
      serviceId: parsed.data.serviceId,
      scheduledDate: new Date(parsed.data.scheduledDate),
      serviceAddressId: parsed.data.serviceAddressId,
      notes: parsed.data.notes
    })

    // Fetch service details for email
    const service = await db.service.findUnique({ where: { id: parsed.data.serviceId } })

    try {
      const { NotificationService } = await import("@repo/services/services/notification")
      await NotificationService.notifyServiceBooked({
        bookingId: booking.id,
        serviceName: service?.name || "Service",
        customerName: session.user.name || "Customer",
        customerEmail: session.user.email as string,
        date: booking.scheduledDate.toLocaleString()
      })
    } catch (e) {
      console.error("Email failed", e)
    }

    revalidatePath("/account/bookings")
    revalidatePath("/admin/bookings")
    return { success: true, bookingId: booking.id }
  } catch (error: any) {
    console.error("Booking error stack:", error.stack || error)
    return { success: false, error: "Failed to create booking. Please try again." }
  }
}

export async function cancelBooking(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return { success: false, error: "Unauthorized" }

    await BookingRepository.cancelBooking(id, session.user.id)
    
    revalidatePath("/account/bookings")
    revalidatePath("/admin/bookings")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to cancel booking" }
  }
}
