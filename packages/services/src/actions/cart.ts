"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { CartRepository } from "@repo/services/repositories/cart"
import { prisma } from "@repo/db"

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    if (!productId) {
      return { success: false, error: "Invalid product ID." }
    }
    
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return { success: false, error: "Quantity must be a positive integer." }
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: "You must be logged in to add items to the cart." }
    }

    // Guard: Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true }
    })

    if (!product) {
      return { success: false, error: "Product not found." }
    }
    
    // Note: If you want strictly enforce stock, do it here. 
    // Assuming 0 inventory quantity means out of stock if tracking is enabled.
    if (product.inventory && product.inventory.quantity < quantity) {
      return { success: false, error: "Not enough stock available." }
    }

    await CartRepository.addItem(session.user.id, productId, quantity)
    revalidatePath("/") 
    return { success: true }
  } catch (error: any) {
    console.error("Add to cart error stack:", error.stack || error)
    return { success: false, error: "An unexpected error occurred while adding to cart." }
  }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  try {
    if (!cartItemId) {
      return { success: false, error: "Invalid cart item ID." }
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return { success: false, error: "Quantity must be a positive integer." }
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access." }
    }

    await CartRepository.updateItemQuantity(session.user.id, cartItemId, quantity)
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Update cart error stack:", error.stack || error)
    return { success: false, error: "Failed to update item quantity." }
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    if (!cartItemId) {
      return { success: false, error: "Invalid cart item ID." }
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access." }
    }

    await CartRepository.removeItem(session.user.id, cartItemId)
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Remove from cart error stack:", error.stack || error)
    return { success: false, error: "Failed to remove item from cart." }
  }
}
