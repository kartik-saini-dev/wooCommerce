"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { CartRepository } from "@repo/services/repositories/cart"
import { WishlistRepository } from "@repo/services/repositories/wishlist"

export async function getInitialUserData() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return { cart: null, wishlistCount: 0, userRole: null }
  }

  try {
    const [cart, wishlist] = await Promise.all([
      CartRepository.getCart(session.user.id),
      WishlistRepository.getWishlist(session.user.id)
    ])
    
    return { 
      cart, 
      wishlistCount: wishlist?.items?.length || 0,
      userRole: session.user.role
    }
  } catch (error) {
    console.error("Failed to fetch initial user data", error)
    return { cart: null, wishlistCount: 0, userRole: session.user.role }
  }
}
