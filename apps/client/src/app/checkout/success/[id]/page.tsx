import { notFound } from "next/navigation"
import Link from "next/link"
import { Truck } from "lucide-react"
import { prisma as db } from "@repo/db"
import { Container } from "@repo/ui/components/ui/container"
import { Button } from "@repo/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@repo/ui/components/ui/card"
import { Separator } from "@repo/ui/components/ui/separator"
import { OrderSuccessAnimation } from "@repo/ui/components/shop/order-success-animation"

export default async function CheckoutSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  
  const order = await db.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: { include: { product: true } },
      payment: true,
      shippingAddress: true,
    }
  })

  if (!order) {
    notFound()
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val)

  return (
    <div className="bg-muted/10 min-h-screen py-12">
      <Container className="max-w-3xl">
        {/* Animated success hero */}
        <OrderSuccessAnimation 
          orderNumber={order.orderNumber}
          totalAmount={formatCurrency(Number(order.totalAmount))}
          paymentMethod={order.payment?.method || "COD"}
          deliveryMethod={order.deliveryMethod}
        />

        <Card className="mb-8 overflow-hidden shadow-lg border-primary/20 border-t-4">
          <CardHeader className="bg-muted/30">
            <CardTitle className="flex justify-between items-center text-xl">
              <span>Order #{order.orderNumber}</span>
              <span className="text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full text-sm font-semibold">
                ✓ Confirmed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">💳 Payment Info</h3>
                <div className="space-y-1 text-sm bg-muted/20 p-4 rounded-xl border">
                  <p><strong>Method:</strong> {order.payment?.method || "N/A"}</p>
                  <p><strong>Status:</strong> <span className="text-green-600 font-bold">{order.payment?.status || "COMPLETED"}</span></p>
                  <p><strong>Transaction ID:</strong> {order.payment?.transactionId}</p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">🚚 Delivery Details</h3>
                <div className="space-y-1 text-sm bg-muted/20 p-4 rounded-xl border">
                  {order.deliveryMethod === "HOME_DELIVERY" && order.shippingAddress ? (
                    <>
                      <p><strong>Address:</strong> {order.shippingAddress.street}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                      <p><strong>Method:</strong> Home Delivery</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Method:</strong> Store Pickup</p>
                      {order.pickupSlotStart && <p><strong>Time:</strong> {order.pickupSlotStart.toLocaleString()}</p>}
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-4">📦 Order Items</h3>
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm p-2 hover:bg-muted/30 rounded-lg transition-colors">
                    <div className="flex gap-4 items-center">
                      <span className="bg-muted px-2 py-1 rounded text-xs font-semibold">{item.quantity}x</span>
                      <span>{item.product.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(Number(item.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />
            
            <div className="space-y-2 text-sm text-right max-w-xs ml-auto">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(Number(order.totalAmount) - Number(order.taxAmount) - Number(order.shippingAmount))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{formatCurrency(Number(order.shippingAmount))}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>{formatCurrency(Number(order.taxAmount))}</span>
              </div>
              <Separator className="my-2"/>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(Number(order.totalAmount))}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 p-6 flex flex-col sm:flex-row gap-4 justify-end">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full">Continue Shopping</Button>
            </Link>
            {order.deliveryMethod === "HOME_DELIVERY" && (
              <Link href={`/orders/${order.id}/tracking`} className="w-full sm:w-auto">
                <Button className="w-full flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Track Delivery
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </Container>
    </div>
  )
}
