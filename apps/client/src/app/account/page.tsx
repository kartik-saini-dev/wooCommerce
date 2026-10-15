import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, Calendar, MapPin, Settings } from "lucide-react"

import { authOptions } from "@repo/services/auth"
import { OrderRepository } from "@repo/services/repositories/order"
import { BookingRepository } from "@repo/services/repositories/booking"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Button } from "@repo/ui/components/ui/button"
import { getTranslation } from "@repo/services/i18n/server"

export const metadata = { title: "Dashboard | My Account" }

export default async function AccountDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login?callbackUrl=/account")
  
  const { t } = await getTranslation()

  const [orders, bookings] = await Promise.all([
    OrderRepository.getUserOrders(session.user.id),
    BookingRepository.getUserBookings(session.user.id)
  ])

  const recentOrders = orders.slice(0, 3)
  const recentBookings = bookings.slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("account.welcome")}, {session.user.name || "Customer"}!</h2>
        <p className="text-muted-foreground">{t("account.dashboardDesc")}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("account.totalOrders")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("account.serviceBookings")}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("account.addresses")}</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold hover:underline cursor-pointer">
              <Link href="/account/addresses">{t("account.manage")}</Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("account.profile")}</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold hover:underline cursor-pointer">
              <Link href="/account/profile">{t("account.edit")}</Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{t("account.recentOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.status}</p>
                      <Link href={`/account/orders/${order.id}`} className="text-sm text-primary hover:underline">{t("account.viewDetails")}</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t("account.noOrders")}</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{t("account.recentBookings")}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.service.name}</p>
                      <p className="text-sm text-muted-foreground">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{booking.status}</p>
                      <Link href={`/account/bookings/${booking.id}`} className="text-sm text-primary hover:underline">{t("account.viewDetails")}</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">{t("account.noBookings")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
