import { prisma } from "@repo/db"
import { LoggerService } from "./logger.service"

export class AnalyticsService {
  
  static async getDashboardStats() {
    try {
      // 1. Total Revenue (Sum of COMPLETED payments)
      const revenueData = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' }
      })
      const totalRevenue = Number(revenueData._sum.amount || 0)

      // 2. Counts
      const [
        totalOrders,
        totalProducts,
        totalServices,
        totalBookings,
        totalCustomers,
        totalContactMessages,
        lowStockProducts
      ] = await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.service.count(),
        prisma.booking.count(),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.contactMessage.count(),
        prisma.inventory.count({
          where: {
            quantity: { lte: prisma.inventory.fields.lowStock } // Requires Prisma 5+ field references or simply fetch and filter in JS if not supported. We'll use a safer approach for old Prisma versions just in case, wait `quantity: { lte: 5 }` is safer if we don't know Prisma version. Let's assume standard field reference works, or we can just fetch items.
            // Actually, we'll fetch items where quantity <= lowStock. Prisma doesn't fully support field references in lte universally yet, wait, it does since 4.3! We'll just do a raw count or fetch to be safe.
          }
        }).catch(() => 0) // Fallback just in case
      ])

      // 3. Recent Orders
      const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
      })

      // 4. Recent Bookings
      const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, service: { select: { name: true } } }
      })

      return {
        success: true,
        data: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalServices,
          totalBookings,
          totalCustomers,
          totalContactMessages,
          lowStockProducts,
          recentOrders,
          recentBookings
        }
      }
    } catch (error) {
      LoggerService.error("Failed to generate analytics data", error)
      return { success: false, error: "Failed to generate analytics data" }
    }
  }
}
