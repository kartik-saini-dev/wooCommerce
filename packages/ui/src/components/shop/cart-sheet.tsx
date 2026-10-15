"use client"

import * as React from "react"
import { useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, ShoppingBag, Trash2, Plus, Minus } from "lucide-react"

import { Button, buttonVariants } from "@repo/ui/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@repo/ui/components/ui/sheet"
import { Separator } from "@repo/ui/components/ui/separator"
import { ScrollArea } from "@repo/ui/components/ui/scroll-area"
import { updateCartItemQuantity, removeFromCart } from "@repo/services/actions/cart"
import { toast } from "sonner"
import { Badge } from "@repo/ui/components/ui/badge"
import { useCart } from "@repo/ui/components/shop/cart-provider"
import { useTranslation } from "@repo/services/i18n/LanguageContext"

export function CartSheet() {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = React.useState(false)
  const { optimisticCart, updateQuantityOptimistic, removeItemOptimistic } = useCart()
  const { t } = useTranslation()

  const items = optimisticCart?.items || []
  const itemCount = items.reduce((total: number, item) => total + item.quantity, 0)
  const cartTotal = items.reduce((total: number, item) => total + (Number(item.product.price) * item.quantity), 0)

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(cartTotal)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    updateQuantityOptimistic(itemId, newQuantity)
    startTransition(async () => {
      const result = await updateCartItemQuantity(itemId, newQuantity)
      if (!result.success) toast.error(result.error)
    })
  }

  const removeItem = (itemId: string) => {
    removeItemOptimistic(itemId)
    startTransition(async () => {
      const result = await removeFromCart(itemId)
      if (!result.success) toast.error(result.error)
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "relative" })} aria-label="Cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs">
            {itemCount}
          </Badge>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle className="text-2xl font-bold tracking-tight border-b pb-4 flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            {t("nav.cart")} {itemCount > 0 && `(${itemCount})`}
          </SheetTitle>
        </SheetHeader>
        
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-6">
              <div className="flex flex-col gap-5 pt-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-xs">No img</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <Link href={`/products/${item.product.slug}`} onClick={() => setIsOpen(false)} className="font-medium hover:underline line-clamp-1">
                          {item.product.name}
                        </Link>
                        <span className="font-semibold ml-2">
                          {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(item.product.price) * item.quantity)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(item.product.price))} {t("shop.each")}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center rounded-md border">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" disabled={isPending || item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" disabled={isPending || !!(item.product.inventory && item.quantity >= item.product.inventory.quantity)} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isPending} onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="pr-6 pt-4">
              <Separator className="mb-4" />
              <div className="flex justify-between text-base font-semibold border-b pb-4 mb-4">
                <span>{t("shop.subtotal")}</span>
                <span>{formattedTotal}</span>
              </div>
              <SheetFooter>
                <SheetClose>
                  <Button render={<Link href="/checkout" />} className="w-full text-base py-6 shadow-md hover:shadow-lg transition-all" size="lg">
                    {t("shop.proceedToCheckout") || "Proceed to Checkout"}
                  </Button>
                </SheetClose>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4 pr-6">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
            <div className="text-xl font-medium">{t("shop.cartEmpty")}</div>
            <Link href="/products" className={buttonVariants({ variant: "outline" })} onClick={() => setIsOpen(false)}>
              {t("shop.continueShopping")}
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
