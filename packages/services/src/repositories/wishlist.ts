import { prisma as db } from "@repo/db"

export class WishlistRepository {
  static async getWishlist(userId: string) {
    let wishlist = await db.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                inventory: true,
                category: true
              }
            }
          }
        }
      }
    })

    if (!wishlist) {
      wishlist = await db.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  inventory: true,
                  category: true
                }
              }
            }
          }
        }
      })
    }

    return wishlist
  }

  static async toggleItem(userId: string, productId: string) {
    const wishlist = await this.getWishlist(userId)

    const existingItem = await db.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId
        }
      }
    })

    if (existingItem) {
      await db.wishlistItem.delete({
        where: { id: existingItem.id }
      })
      return { added: false }
    } else {
      await db.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId
        }
      })
      return { added: true }
    }
  }

  static async removeItem(userId: string, wishlistItemId: string) {
    return db.wishlistItem.delete({
      where: { id: wishlistItemId }
    })
  }
}
