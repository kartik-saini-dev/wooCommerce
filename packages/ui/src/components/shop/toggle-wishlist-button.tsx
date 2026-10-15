"use client"

import * as React from "react"
import { useTransition, useState } from "react"
import { Heart } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/ui/button"
import { toggleWishlist } from "@repo/services/actions/wishlist"
import { cn } from "@repo/services/utils"

interface ToggleWishlistButtonProps extends React.ComponentProps<typeof Button> {
  productId: string
  initialIsWishlisted?: boolean
}

export function ToggleWishlistButton({ 
  productId, 
  initialIsWishlisted = false, 
  className, 
  children, 
  ...props 
}: ToggleWishlistButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent link navigation if inside a Link
    
    // Optimistic update
    setIsWishlisted(!isWishlisted)
    
    startTransition(async () => {
      const result = await toggleWishlist(productId)
      if (result.success) {
        setIsWishlisted(!!result.added)
        toast.success(result.added ? "Added to wishlist" : "Removed from wishlist")
      } else {
        // Revert on error
        setIsWishlisted(isWishlisted)
        toast.error(result.error || "Failed to update wishlist.")
      }
    })
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      className={cn("group transition-all", className)}
      {...props}
    >
      {children || (
        <Heart 
          className={cn(
            "h-4 w-4 transition-all duration-300 group-active:scale-90", 
            isWishlisted ? "fill-destructive text-destructive" : "text-current"
          )} 
        />
      )}
    </Button>
  )
}
