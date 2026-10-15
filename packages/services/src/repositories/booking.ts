import { prisma } from "../db"
import { BookingStatus, Prisma } from "@prisma/client"

export class BookingRepository {
  static async getUserBookings(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        service: true,
        address: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async getById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        address: true,
        user: { select: { name: true, email: true } }
      }
    })
  }

  static async createBooking(data: {
    userId: string
    serviceId: string
    scheduledDate: Date
    serviceAddressId: string
    notes?: string
  }) {
    // Generate a unique booking number like BKG-12345678
    const timestamp = Date.now().toString().slice(-8)
    const bookingNumber = `BKG-${timestamp}`

    return prisma.booking.create({
      data: {
        ...data,
        bookingNumber
      }
    })
  }

  static async updateStatus(id: string, status: BookingStatus) {
    return prisma.booking.update({
      where: { id },
      data: { status }
    })
  }

  static async cancelBooking(id: string, userId: string) {
    return prisma.booking.updateMany({
      where: { id, userId }, // Ensure user owns the booking
      data: { status: "CANCELLED" }
    })
  }

  // Admin: Get all bookings
  static async getAllBookings(status?: BookingStatus) {
    const where: Prisma.BookingWhereInput = status ? { status } : {}
    return prisma.booking.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        service: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}
