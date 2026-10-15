"use client"

import * as React from "react"
import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { toggleWishlist } from "@repo/services/actions/wishlist" // Wait, I need removeItem action, or I can use toggleWishlist which will remove it if it exists. Wait, toggleWishlist takes productId. I need an action that takes wishlistItemId, or I can just use toggleWishlist. But I created `removeItem` in repository. I will create a new server action `removeFromWishlist`.

import { removeFromWishlist } from "./actions" // I will create this local action

interface RemoveWishlistButtonProps extends React.ComponentProps<typeof Button> {
  itemId: string
}

export function RemoveWishlistButton({ itemId, className, ...props }: RemoveWishlistButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      const result = await removeFromWishlist(itemId)
      if (result.success) {
        toast.success("Removed from wishlist")
      } else {
        toast.error(result.error || "Failed to remove")
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleRemove}
      disabled={isPending}
      className={className}
      {...props}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
