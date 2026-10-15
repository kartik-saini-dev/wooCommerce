"use client"

import * as React from "react"
import { useTransition } from "react"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { addToCart } from "@repo/services/actions/cart"
import { useCart } from "@repo/ui/components/shop/cart-provider"
import { useTranslation } from "@repo/services/i18n/LanguageContext"
import { Product } from "@prisma/client"

interface AddToCartButtonProps extends React.ComponentProps<typeof Button> {
  product?: (Product & { images: import("@prisma/client").ProductImage[] }) | null // Passing the full product for optimistic UI
  productId: string
  isOutOfStock?: boolean
}

export function AddToCartButton({ product, productId, isOutOfStock, className, children, ...props }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const { addToCartOptimistic } = useCart()
  const { t } = useTranslation()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Optimistic Update
    if (product) {
      addToCartOptimistic({
        id: `temp-${Date.now()}`,
        cartId: "optimistic",
        productId: productId,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: product
      })
    }
    
    startTransition(async () => {
      const result = await addToCart(productId, 1)
      if (result.success) {
        toast.success(t("shop.addedToCart") || "Added to cart!")
      } else {
        toast.error(result.error || t("shop.failedToAdd") || "Failed to add to cart.")
      }
    })
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isPending || isOutOfStock}
      className={className}
      {...props}
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 animate-pulse" />
          {t("shop.adding") || "Adding..."}
        </span>
      ) : (
        children || (
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t("shop.addToCart") || "Add to Cart"}
          </span>
        )
      )}
    </Button>
  )
}
