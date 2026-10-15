import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@repo/services/auth"
import { prisma as db } from "@repo/db"
import { Container } from "@repo/ui/components/ui/container"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { DeliveryMapAnimation } from "@repo/ui/components/shop/delivery-map-animation"

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login")
  }

  const resolvedParams = await params
  const order = await db.order.findUnique({
    where: { id: resolvedParams.id },
  })

  if (!order || order.userId !== session.user.id) {
    notFound()
  }

  if (order.deliveryMethod !== "HOME_DELIVERY") {
    return (
      <div className="bg-muted/10 min-h-screen py-12">
        <Container>
          <div className="bg-card p-6 rounded-2xl border text-center">
            Tracking is only available for Home Delivery orders.
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="bg-muted/10 min-h-screen pb-12">
      <Container className="py-6">
        <Breadcrumbs 
          items={[
            { title: "My Orders", href: "/account" },
            { title: `Order #${order.orderNumber}` },
            { title: "Track Delivery" }
          ]} 
        />
      </Container>
      
      <Container className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Live Delivery Tracking</h1>
          <p className="text-muted-foreground mt-2">Order #{order.orderNumber}</p>
        </div>
        <DeliveryMapAnimation orderNumber={order.orderNumber} orderId={order.id} />
      </Container>
    </div>
  )
}
