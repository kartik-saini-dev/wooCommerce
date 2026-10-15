"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { OrderRepository } from "@repo/services/repositories/order"
import { CartRepository } from "@repo/services/repositories/cart"
import { checkActionRateLimit } from "@repo/services/action-rate-limit"

import { DeliveryService } from "@repo/services/services/delivery.service"
import { PickupService } from "@repo/services/services/pickup.service"

export async function processCheckout(data: {
  deliveryMethod: "HOME_DELIVERY" | "PICKUP"
  shippingAddressId?: string
  billingAddressId?: string
  paymentMethod: string
  transactionId?: string
  paymentProofUrl?: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" }
    }

    if (!checkActionRateLimit(session.user.id, "checkout")) {
      return { success: false, error: "Too many checkout attempts. Please wait a moment and try again." }
    }

    // 1. Fetch user's cart
    const cart = await CartRepository.getCart(session.user.id)
    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Your cart is empty." }
    }

    // 2. Calculate totals (ideally this should be robust against price tampering)
    // We fetch the current price from the DB product relation
    let subtotal = 0
    const itemsForOrder = []

    for (const item of cart.items) {
      const price = Number(item.product.price)
      
      // Stock check before processing
      if (item.product.inventory && item.product.inventory.quantity < item.quantity) {
        return { success: false, error: `Not enough stock for ${item.product.name}.` }
      }

      subtotal += price * item.quantity
      itemsForOrder.push({
        productId: item.productId,
        quantity: item.quantity,
        price
      })
    }

    let shippingAmount = 0
    let pickupSlotStart: Date | undefined
    let pickupSlotEnd: Date | undefined

    if (data.deliveryMethod === "HOME_DELIVERY") {
      if (!data.shippingAddressId) {
        return { success: false, error: "Shipping address is required for home delivery." }
      }
      const deliveryInfo = await DeliveryService.calculateDeliveryFee(subtotal)
      shippingAmount = deliveryInfo.fee
    } else if (data.deliveryMethod === "PICKUP") {
      const slot = await PickupService.generatePickupSlot()
      pickupSlotStart = slot.start
      pickupSlotEnd = slot.end
    }

    const taxAmount = subtotal * 0.18 // 18% GST (placeholder, can move to config)
    const totalAmount = subtotal + shippingAmount + taxAmount

    // 3. Create the Order Transaction
    const order = await OrderRepository.createOrder({
      userId: session.user.id,
      deliveryMethod: data.deliveryMethod,
      shippingAddressId: data.deliveryMethod === "HOME_DELIVERY" ? data.shippingAddressId : undefined,
      billingAddressId: data.billingAddressId,
      totalAmount,
      taxAmount,
      shippingAmount,
      pickupSlotStart,
      pickupSlotEnd,
      items: itemsForOrder,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
      paymentProofUrl: data.paymentProofUrl
    })

    // 4. Send Email Confirmation with Resend
    try {
      const formatCurrency = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val)
      
      const { NotificationService } = await import("@repo/services/services/notification")
      await NotificationService.notifyOrderPlaced({
        orderNumber: order.orderNumber,
        customerName: session.user.name || "Customer",
        customerEmail: session.user.email as string,
        totalAmount: formatCurrency(totalAmount),
        paymentMethod: data.paymentMethod
      })
    } catch (emailError) {
      console.error("Failed to send order email:", emailError)
      // We don't fail the checkout if the email fails, just log it.
    }

    revalidatePath("/")
    // Ensure response only contains serializable primitives
    const response: Record<string, any> = {
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    }
    if (order.pickupSlotStart) {
      response.pickupSlotStart = order.pickupSlotStart.toISOString()
    }
    if (order.pickupSlotEnd) {
      response.pickupSlotEnd = order.pickupSlotEnd.toISOString()
    }
    return response

  } catch (error: any) {
    // Log full error details for debugging
    console.error('Checkout error stack:', error.stack || error);
    // Return the actual error message if available, otherwise generic
    const message = error?.message || 'An error occurred during checkout. Please try again.';
    return { success: false, error: message };
  }
}

export async function saveAddress(data: {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" }
    }

    if (!data.street || !data.city || !data.state || !data.postalCode) {
      return { success: false, error: "Missing required address fields." }
    }

    const { prisma: db } = await import("@repo/db")
    
    // If setting as default, unset others
    if (data.isDefault) {
      await db.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      })
    }

    const address = await db.address.create({
      data: {
        userId: session.user.id,
        street: data.street,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country || "India",
        isDefault: data.isDefault || false
      }
    })

    revalidatePath("/checkout")
    return { success: true, address }
  } catch (error: any) {
    console.error("Save address error:", error)
    return { success: false, error: "Failed to save address." }
  }
}
