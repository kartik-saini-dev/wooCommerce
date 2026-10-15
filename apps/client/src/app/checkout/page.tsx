import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { authOptions } from "@repo/services/auth"
import { prisma as db } from "@repo/db"
import { CartRepository } from "@repo/services/repositories/cart"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { CheckoutForm } from "@repo/ui/components/shop/checkout-form"
import { getTranslation } from "@repo/services/i18n/server"
import { ConfigService } from "@repo/services/services/config.service"

export const metadata = {
  title: "Checkout",
}

export default async function CheckoutPage() {
  const { t } = await getTranslation()
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout")
  }

  const fetchedCart = await CartRepository.getCart(session.user.id)
  
  const cart = fetchedCart ? {
    ...fetchedCart,
    items: fetchedCart.items.map(item => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
        discount: item.product.discount ? Number(item.product.discount) : null,
      }
    }))
  } : null;
  
  if (!cart || cart.items.length === 0) {
    redirect("/products") // Redirect to products if cart is empty
  }

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: 'desc' }
  })

  const config = await ConfigService.getConfig()

  // If no address exists, we can handle it in the form or create a default one
  return (
    <div className="bg-muted/10 dark:bg-background min-h-screen pb-12">
      <Container className="py-6">
        <Breadcrumbs items={[{ title: t("shop.checkout") || "Checkout" }]} />
      </Container>
      
      <Section className="pt-0">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{t("shop.checkout") || "Checkout"}</h1>
            <p className="text-muted-foreground mt-2">{t("shop.completeOrder") || "Complete your order."}</p>
          </div>

          <CheckoutForm cart={cart as any} addresses={addresses} config={config} />
        </Container>
      </Section>
    </div>
  )
}
