"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { WishlistRepository } from "@repo/services/repositories/wishlist"
import { CartRepository } from "@repo/services/repositories/cart"

export async function toggleWishlist(productId: string) {
  try {
    if (!productId) {
      return { success: false, error: "Invalid product ID." }
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: "You must be logged in to manage your wishlist." }
    }

    const result = await WishlistRepository.toggleItem(session.user.id, productId)
    revalidatePath("/")
    return { success: true, added: result.added }
  } catch (error: any) {
    console.error("Wishlist error stack:", error.stack || error)
    return { success: false, error: "Failed to update wishlist. Please try again." }
  }
}

export async function moveWishlistToCart(wishlistItemId: string, productId: string) {
  try {
    if (!wishlistItemId || !productId) {
      return { success: false, error: "Invalid request parameters." }
    }

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access." }
    }

    // 1. Add to cart
    await CartRepository.addItem(session.user.id, productId, 1)
    
    // 2. Remove from wishlist
    await WishlistRepository.removeItem(session.user.id, wishlistItemId)
    
    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Move to cart error stack:", error.stack || error)
    return { success: false, error: "Failed to move item to cart. Please try again." }
  }
}
