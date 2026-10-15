"use client"

import * as React from "react"
import { useTransition } from "react"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { moveWishlistToCart } from "@repo/services/actions/wishlist"

interface MoveToCartButtonProps {
  wishlistItemId: string
  productId: string
  disabled?: boolean
}

export function MoveToCartButton({ wishlistItemId, productId, disabled }: MoveToCartButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleMove = () => {
    startTransition(async () => {
      const result = await moveWishlistToCart(wishlistItemId, productId)
      if (result.success) {
        toast.success("Moved to cart!")
      } else {
        toast.error(result.error || "Failed to move to cart.")
      }
    })
  }

  return (
    <Button
      onClick={handleMove}
      disabled={isPending || disabled}
      className="w-full"
      variant="default"
    >
      {isPending ? "Moving..." : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {disabled ? "Out of Stock" : "Move to Cart"}
        </>
      )}
    </Button>
  )
}
