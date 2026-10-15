import { prisma as db } from "@repo/db"

export class CartRepository {
  static async getCart(userId: string) {
    let cart = await db.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                inventory: true
              }
            }
          }
        }
      }
    })

    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                  inventory: true
                }
              }
            }
          }
        }
      })
    }

    return cart
  }

  static async addItem(userId: string, productId: string, quantity: number = 1) {
    const cart = await this.getCart(userId)

    const existingItem = await db.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })

    if (existingItem) {
      return db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    }

    return db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    })
  }

  static async updateItemQuantity(userId: string, cartItemId: string, quantity: number) {
    const cart = await db.cart.findUnique({ where: { userId } })
    if (!cart) throw new Error("Cart not found")

    if (quantity <= 0) {
      return db.cartItem.delete({ where: { id: cartItemId } })
    }

    return db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    })
  }

  static async removeItem(userId: string, cartItemId: string) {
    return db.cartItem.delete({
      where: { id: cartItemId }
    })
  }

  static async clearCart(userId: string) {
    const cart = await db.cart.findUnique({ where: { userId } })
    if (!cart) return

    return db.cartItem.deleteMany({
      where: { cartId: cart.id }
    })
  }
}
