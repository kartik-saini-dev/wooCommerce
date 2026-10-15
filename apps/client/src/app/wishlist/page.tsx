import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingCart, HeartCrack } from "lucide-react"

import { authOptions } from "@repo/services/auth"
import { WishlistRepository } from "@repo/services/repositories/wishlist"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Button, buttonVariants } from "@repo/ui/components/ui/button"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { MoveToCartButton } from "./move-to-cart-button"
import { RemoveWishlistButton } from "./remove-wishlist-button"

export const metadata = {
  title: "My Wishlist",
}

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login?callbackUrl=/wishlist")
  }

  const wishlist = await WishlistRepository.getWishlist(session.user.id)
  const items = wishlist?.items || []

  return (
    <div className="bg-muted/10 dark:bg-background min-h-screen pb-12">
      <Container className="py-6">
        <Breadcrumbs items={[{ title: "My Wishlist" }]} />
      </Container>
      
      <Section className="pt-0">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
            <p className="text-muted-foreground mt-2">Manage your saved items and move them to cart when ready.</p>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => {
                const product = item.product
                const formattedPrice = new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(Number(product.price))

                return (
                  <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary hover:shadow-md">
                    <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].altText || product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
                      )}
                      <RemoveWishlistButton itemId={item.id} className="absolute top-2 right-2 rounded-full h-8 w-8 bg-background/80 hover:bg-destructive hover:text-destructive-foreground text-destructive shadow-sm" />
                    </div>
                    
                    <div className="flex flex-1 flex-col p-4">
                      {product.category && (
                        <div className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">
                          {product.category.name}
                        </div>
                      )}
                      <Link href={`/products/${product.slug}`} className="font-semibold hover:underline mb-2 line-clamp-1">
                        {product.name}
                      </Link>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="font-bold text-lg">{formattedPrice}</span>
                      </div>
                      <div className="mt-4">
                        <MoveToCartButton 
                          wishlistItemId={item.id} 
                          productId={product.id} 
                          disabled={!product.inventory || product.inventory.quantity === 0} 
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card border-dashed">
              <HeartCrack className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">Explore our products and save your favorites here.</p>
              <Link href="/products" className={buttonVariants({ variant: "default" })}>
                Browse Products
              </Link>
            </div>
          )}
        </Container>
      </Section>
    </div>
  )
}
