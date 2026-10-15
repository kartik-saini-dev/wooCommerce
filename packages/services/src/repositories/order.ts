import { prisma as db } from "@repo/db"
import { Prisma, OrderStatus } from "@prisma/client"

export class OrderRepository {
  static async createOrder(data: {
    userId: string
    deliveryMethod: "HOME_DELIVERY" | "PICKUP"
    shippingAddressId?: string
    billingAddressId?: string
    totalAmount: number
    taxAmount: number
    shippingAmount: number
    pickupSlotStart?: Date
    pickupSlotEnd?: Date
    items: { productId: string; quantity: number; price: number }[]
    paymentMethod: string
    transactionId?: string
    paymentProofUrl?: string
  }) {
    return db.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create Order
      const order = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
          userId: data.userId,
          status: OrderStatus.PENDING,
          deliveryMethod: data.deliveryMethod,
          shippingAddressId: data.shippingAddressId,
          billingAddressId: data.billingAddressId,
          totalAmount: data.totalAmount,
          taxAmount: data.taxAmount,
          shippingAmount: data.shippingAmount,
          pickupSlotStart: data.pickupSlotStart,
          pickupSlotEnd: data.pickupSlotEnd,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      })

      // 2. Create Payment
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: data.totalAmount,
          method: data.paymentMethod,
          status: "COMPLETED", // Simulated payment success for demo
          transactionId: data.transactionId || `TXN-DEMO-${Date.now()}`,
          proofs: data.paymentProofUrl ? {
            create: [{ url: data.paymentProofUrl }]
          } : undefined
        }
      })

      // 3. Decrement Inventory & Record Stock Movement
      for (const item of data.items) {
        const inventory = await tx.inventory.findUnique({
          where: { productId: item.productId }
        })

        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product ID: ${item.productId}`)
        }

        await tx.inventory.update({
          where: { id: inventory.id },
          data: { quantity: { decrement: item.quantity } }
        })

        await tx.stockMovement.create({
          data: {
            inventoryId: inventory.id,
            quantity: -item.quantity,
            reason: "ORDER_FULFILLMENT"
          }
        })
      }

      // 4. Clear User's Cart
      const cart = await tx.cart.findUnique({ where: { userId: data.userId } })
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
      }

      return order
    })
  }

  static async getOrderDetails(orderId: string, userId: string) {
    return db.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } }
            }
          }
        },
        shippingAddress: true,
        payment: {
          include: { proofs: true }
        },
        review: true
      }
    })
  }

  static async getUserOrders(userId: string) {
    return db.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async getAllOrders(status?: string) {
    const where: Prisma.OrderWhereInput = status ? { status: status as import("@prisma/client").OrderStatus } : {}
    return db.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async updateOrderStatus(id: string, status: import("@prisma/client").OrderStatus) {
    return db.order.update({
      where: { id },
      data: { status }
    })
  }
}
