"use client"

import Link from "next/link"
import Image from "next/image"
import { Product, ProductImage, Category } from "@prisma/client"
import { ShoppingCart, Eye } from "lucide-react"

import { Badge } from "@repo/ui/components/ui/badge"
import { buttonVariants } from "@repo/ui/components/ui/button"
import { AddToCartButton } from "@repo/ui/components/shop/add-to-cart-button"
import { ToggleWishlistButton } from "@repo/ui/components/shop/toggle-wishlist-button"
import { cn } from "@repo/services/utils"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

type ProductWithRelations = Product & {
  images: ProductImage[]
  category?: Category
}

interface ProductCardProps {
  product: ProductWithRelations
  className?: string
  isWishlisted?: boolean
}

export function ProductCard({ product, className, isWishlisted = false }: ProductCardProps) {
  const { t } = useTranslation()
  const images = Array.isArray(product?.images) ? product.images : []
  const primaryImage = images.find(img => img.isPrimary) || images[0]
  
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(Number(product.price))
  
  const formattedComparePrice = product.comparePrice 
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(Number(product.comparePrice))
    : null

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 dark:border-border/40 dark:bg-card/40 dark:backdrop-blur-xl dark:hover:border-primary/40 dark:hover:bg-card/60", 
      className
    )}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.discount && Number(product.discount) > 0 && (
          <Badge className="bg-destructive/90 text-destructive-foreground backdrop-blur-md shadow-sm">
            {Number(product.discount)}% OFF
          </Badge>
        )}
        {product.isFeatured && (
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground backdrop-blur-md shadow-sm border-0">
            {t("shop.featured")}
          </Badge>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
        <ToggleWishlistButton 
          productId={product.id} 
          initialIsWishlisted={isWishlisted}
          size="icon" 
          variant="secondary"
          className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-md shadow-sm hover:bg-background/90"
        />
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/50 dark:bg-muted/10">
        <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0 block">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              fill
              className="object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted/50">
              <span className="text-muted-foreground font-medium text-sm">No image</span>
            </div>
          )}
        </Link>
        
        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center gap-3 bg-gradient-to-t from-background/90 via-background/60 to-transparent pb-4 pt-12 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:from-background/95">
          <Link href={`/products/${product.slug}`} className={cn(buttonVariants({ variant: "secondary", size: "icon" }), "h-10 w-10 shrink-0 rounded-full shadow-md hover:scale-105 transition-transform")}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Link>
          <AddToCartButton 
            product={product}
            productId={product.id} 
            isOutOfStock={false}
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-full shadow-md hover:scale-105 transition-transform"
          >
            <ShoppingCart className="h-4 w-4" />
          </AddToCartButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {product.category && (
          <div className="text-[11px] text-muted-foreground/80 mb-1.5 font-semibold tracking-wider uppercase">
            {product.category.name}
          </div>
        )}
        <Link href={`/products/${product.slug}`} className="mb-3 line-clamp-2 text-base font-semibold leading-tight hover:text-primary transition-colors group-hover:underline decoration-primary/30 underline-offset-4">
          {product.name}
        </Link>
        
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {formattedComparePrice && (
              <span className="text-xs text-muted-foreground line-through mb-0.5">
                {formattedComparePrice}
              </span>
            )}
            <span className="text-lg font-bold text-foreground tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <div className="sm:hidden">
            <AddToCartButton 
              product={product}
              productId={product.id} 
              isOutOfStock={false}
              size="icon" 
              className="h-9 w-9 rounded-full bg-primary text-primary-foreground shadow-sm"
            >
              <ShoppingCart className="h-4 w-4" />
            </AddToCartButton>
          </div>
        </div>
      </div>
    </div>
  )
}
