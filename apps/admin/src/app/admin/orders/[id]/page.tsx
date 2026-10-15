import { getServerSession } from "next-auth/next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CreditCard, Banknote, MapPin, ReceiptText } from "lucide-react"

import { adminAuthOptions } from "@/lib/auth"
import { OrderRepository } from "@repo/services/repositories/order"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { buttonVariants } from "@repo/ui/components/ui/button"
import { Badge } from "@repo/ui/components/ui/badge"
import { AdminOrderStatusUpdater } from "@repo/ui/components/admin/admin-order-updater"
import { prisma as db } from "@repo/db"

interface AdminOrderDetailsProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: "Order Details | Admin" }

export default async function AdminOrderDetailsPage({ params }: AdminOrderDetailsProps) {
  const resolvedParams = await params
  const session = await getServerSession(adminAuthOptions)
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login")

  // We bypass the generic OrderRepository because it expects userId. 
  // We write a quick query for Admin here.
  const order = await db.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: true,
      items: {
        include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } }
      },
      shippingAddress: true,
      payment: { include: { proofs: true } }
    }
  })

  if (!order) notFound()

  const formatCurrency = (val: any) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(val))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Order {order.orderNumber}</h2>
          <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminOrderStatusUpdater orderId={order.id} currentStatus={order.status} />
              <p className="text-xs text-muted-foreground mt-2">Changing the status will automatically send an email notification to the customer.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border bg-muted">
                    {item.product.images[0] ? (
                      <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No img</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-sm">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4 space-y-2 text-sm">
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
                <div className="flex justify-between font-bold text-base text-foreground pt-2">
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
                <MapPin className="h-5 w-5" /> Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <div>
                <p className="font-semibold text-foreground">{order.user.name}</p>
                <p>{order.user.email}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="font-semibold text-foreground mb-1">Shipping Address</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
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
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Method</span>
                <span>{order.payment?.method === "UPI" ? "Manual UPI" : "Cash on Delivery"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Status</span>
                <Badge variant={order.payment?.status === "COMPLETED" ? "default" : "secondary"}>
                  {order.payment?.status}
                </Badge>
              </div>
              {order.payment?.transactionId && (
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-medium text-foreground">Transaction ID</span>
                  <span className="font-mono text-xs">{order.payment.transactionId}</span>
                </div>
              )}
              {order.payment?.proofs && order.payment.proofs.length > 0 && (
                <div className="border-t pt-2 mt-2">
                  <span className="font-medium text-foreground block mb-2">Payment Proof</span>
                  <div className="relative h-40 w-full rounded overflow-hidden border">
                    <Image src={order.payment.proofs[0].url} alt="Payment proof" fill className="object-cover" />
                  </div>
                  <a href={order.payment.proofs[0].url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "link", className: "p-0 h-auto mt-2 text-xs" })}>
                    View Full Size
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
