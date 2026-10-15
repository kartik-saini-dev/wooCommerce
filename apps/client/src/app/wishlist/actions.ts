"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { WishlistRepository } from "@repo/services/repositories/wishlist"

export async function removeFromWishlist(wishlistItemId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" }
    }

    await WishlistRepository.removeItem(session.user.id, wishlistItemId)
    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to remove item." }
  }
}
