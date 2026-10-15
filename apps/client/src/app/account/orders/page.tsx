import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package } from "lucide-react"

import { authOptions } from "@repo/services/auth"
import { OrderRepository } from "@repo/services/repositories/order"
import { getTranslation } from "@repo/services/i18n/server"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Button, buttonVariants } from "@repo/ui/components/ui/button"
import { Badge } from "@repo/ui/components/ui/badge"

export const metadata = { title: "My Orders | My Account" }

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login?callbackUrl=/account/orders")
  
  const { t } = await getTranslation()

  const orders = await OrderRepository.getUserOrders(session.user.id)
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("account.myOrders")}</h2>
        <p className="text-muted-foreground">{t("account.myOrdersDesc")}</p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{t("account.orderNum")}{order.orderNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t("account.orderPlaced")} {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="text-sm">
                        <span className="font-medium">{item.quantity}x</span> {item.product.name}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        + {order.items.length - 2} {t("account.moreItems")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{t("account.total")}</p>
                    <p className="font-bold text-lg">
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(order.totalAmount))}
                    </p>
                    <Button render={<Link href={`/account/orders/${order.id}`} />} variant="outline" size="sm" className="mt-4">
                      {t("account.viewDetails") || "View Details"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">{t("account.noOrdersFound")}</h3>
          <p className="text-muted-foreground">{t("account.noOrdersYet")}</p>
          <Button render={<Link href="/products" />} className="mt-4">
            {t("shop.continueShopping") || "Continue Shopping"}
          </Button>
        </div>
      )}
    </div>
  )
}
