import { getServerSession } from "next-auth/next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, MapPin, CreditCard, Banknote, FileText } from "lucide-react"

import { authOptions } from "@repo/services/auth"
import { OrderRepository } from "@repo/services/repositories/order"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Button, buttonVariants } from "@repo/ui/components/ui/button"
import { Separator } from "@repo/ui/components/ui/separator"
import { OrderTimeline } from "@repo/ui/components/account/order-timeline"
import { PrintInvoiceButton } from "@repo/ui/components/account/print-invoice-button"
import { ReviewDialog } from "@repo/ui/components/shop/review-dialog"

interface OrderDetailsProps {
  params: { id: string }
}

export const metadata = { title: "Order Details | My Account" }

export default async function OrderDetailsPage({ params }: OrderDetailsProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const order = await OrderRepository.getOrderDetails(params.id, session.user.id)

  if (!order) {
    notFound()
  }

  const formatCurrency = (val: any) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(val))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/account/orders" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Order Details</h2>
            <p className="text-muted-foreground">{order.orderNumber} • Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {order.deliveryMethod === "HOME_DELIVERY" && order.status === "SHIPPED" && (
            <Button render={<Link href={`/account/orders/${order.id}/track`} />} variant="default">
              Track Order
            </Button>
          )}
          {order.status === "DELIVERED" && !order.reviewed && (
            <ReviewDialog orderId={order.id} />
          )}
          {order.reviewed && (
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-md font-medium text-sm">
              Review Submitted
            </div>
          )}
        </div>
      </div>

      <OrderTimeline status={order.status} type="order" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Items in your order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link href={`/products/${item.product.slug}`} className="font-semibold hover:underline line-clamp-2">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" /> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(Number(order.totalAmount) - Number(order.taxAmount) - Number(order.shippingAmount))}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shippingAmount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>{formatCurrency(order.taxAmount)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base text-foreground">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" /> 
                {order.deliveryMethod === "PICKUP" ? "Pickup Details" : "Shipping Address"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              {order.deliveryMethod === "PICKUP" ? (
                <>
                  <p className="font-semibold text-foreground">Store Pickup</p>
                  {order.pickupSlotStart && order.pickupSlotEnd ? (
                    <div className="mt-2 p-3 bg-muted/30 rounded-md">
                      <p className="font-medium text-foreground">Reserved Slot:</p>
                      <p>{new Date(order.pickupSlotStart).toLocaleString()} - {new Date(order.pickupSlotEnd).toLocaleTimeString()}</p>
                      {order.pickupExpired && <p className="text-red-500 font-medium mt-1">Pickup Window Expired</p>}
                    </div>
                  ) : (
                    <p>Pickup slot pending.</p>
                  )}
                </>
              ) : (
                <>
                  <p className="font-semibold text-foreground">{session.user.name}</p>
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {order.payment?.method === "COD" ? (
                  <Banknote className="h-5 w-5" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p><strong className="text-foreground">Method:</strong> {order.payment?.method === "UPI" ? "Manual UPI" : "Cash on Delivery"}</p>
              <p><strong className="text-foreground">Status:</strong> {order.payment?.status}</p>
              {order.payment?.transactionId && (
                <p><strong className="text-foreground">Txn ID:</strong> {order.payment.transactionId}</p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <PrintInvoiceButton />
          </div>
        </div>
      </div>
    </div>
  )
}
