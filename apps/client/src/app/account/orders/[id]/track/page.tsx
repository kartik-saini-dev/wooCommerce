import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@repo/services/auth"
import { OrderRepository } from "@repo/services/repositories/order"
import { Container } from "@repo/ui/components/ui/container"
import { Section } from "@repo/ui/components/ui/section"
import { Breadcrumbs } from "@repo/ui/components/shop/breadcrumbs"
import { LiveTracker } from "@repo/ui/components/shop/live-tracker"
import { Button } from "@repo/ui/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Track Order",
}

export default async function TrackOrderPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/login?callbackUrl=/account/orders/${params.id}/track`)
  }

  const order = await OrderRepository.getOrderDetails(params.id, session.user.id)
  
  if (!order) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="text-muted-foreground mt-2">This order does not exist or you do not have permission to view it.</p>
        <Button render={<Link href="/account/orders" />} className="mt-4">
          Back to Orders
        </Button>
      </Container>
    )
  }

  return (
    <div className="bg-muted/10 dark:bg-background min-h-screen pb-12">
      <Container className="py-6">
        <Breadcrumbs items={[
          { title: "My Account", href: "/account" },
          { title: "Orders", href: "/account/orders" },
          { title: `Order ${order.orderNumber}`, href: `/account/orders/${order.id}` },
          { title: "Track" }
        ]} />
      </Container>
      
      <Section className="pt-0">
        <Container>
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" render={<Link href={`/account/orders/${order.id}`} />}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Live Tracking</h1>
              <p className="text-muted-foreground">Order #{order.orderNumber}</p>
            </div>
          </div>

          <LiveTracker 
            orderId={order.id} 
            status={order.status} 
            deliveryMethod={order.deliveryMethod}
          />
        </Container>
      </Section>
    </div>
  )
}
