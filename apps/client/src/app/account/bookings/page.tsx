import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Calendar } from "lucide-react"

import { authOptions } from "@repo/services/auth"
import { BookingRepository } from "@repo/services/repositories/booking"
import { getTranslation } from "@repo/services/i18n/server"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Button, buttonVariants } from "@repo/ui/components/ui/button"
import { Badge } from "@repo/ui/components/ui/badge"

export const metadata = { title: "My Service Bookings | My Account" }

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login?callbackUrl=/account/bookings")
  
  const { t } = await getTranslation()

  const bookings = await BookingRepository.getUserBookings(session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t("account.serviceBookings")}</h2>
        <p className="text-muted-foreground">{t("account.serviceBookingsDesc")}</p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b bg-muted/50">
                <div>
                  <CardTitle className="text-base">{t("account.bookingNum")}{booking.id.slice(-6).toUpperCase()}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t("account.scheduledFor")} {new Date(booking.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={booking.status === "COMPLETED" ? "default" : "secondary"}>
                  {booking.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">{t("account.service")}</p>
                  <p className="font-semibold text-lg">{booking.service.name}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {booking.address.city}, {booking.address.state}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{t("account.total")}</p>
                  <p className="font-bold text-lg">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(booking.service.basePrice))}
                  </p>
                  <Button render={<Link href={`/account/bookings/${booking.id}`} />} variant="outline" size="sm" className="mt-4">
                    {t("account.viewDetails") || "View Details"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">{t("account.noBookingsFound")}</h3>
          <p className="text-muted-foreground">{t("account.noBookingsYet")}</p>
          <Button render={<Link href="/services" />} className="mt-4">
            {t("shop.browseServices") || "Browse Services"}
          </Button>
        </div>
      )}
    </div>
  )
}
