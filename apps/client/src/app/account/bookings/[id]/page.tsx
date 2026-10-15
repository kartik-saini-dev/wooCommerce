import { getServerSession } from "next-auth/next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Wrench, XCircle } from "lucide-react"

import { authOptions } from "@repo/services/auth"
import { BookingRepository } from "@repo/services/repositories/booking"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { Button, buttonVariants } from "@repo/ui/components/ui/button"
import { OrderTimeline } from "@repo/ui/components/account/order-timeline"
import { cancelBooking } from "@repo/services/actions/booking"

interface BookingDetailsProps {
  params: { id: string }
}

export const metadata = { title: "Booking Details | My Account" }

export default async function BookingDetailsPage({ params }: BookingDetailsProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const booking = await BookingRepository.getById(params.id)

  if (!booking || booking.userId !== session.user.id) {
    notFound()
  }

  const formatCurrency = (val: any) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(val))
  const canCancel = booking.status === "PENDING" || booking.status === "CONFIRMED"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/account/bookings" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Booking Details</h2>
          <p className="text-muted-foreground">{booking.bookingNumber} • Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <OrderTimeline status={booking.status} type="booking" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5" /> Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground font-medium text-sm">Service</p>
                <p className="text-lg font-semibold">{booking.service.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground font-medium text-sm">Scheduled Date</p>
                  <p>{new Date(booking.scheduledDate).toLocaleDateString()} at {new Date(booking.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium text-sm">Estimated Price</p>
                  <p className="font-medium text-primary">
                    {booking.quotedPrice ? formatCurrency(booking.quotedPrice) : `Base ${formatCurrency(booking.service.basePrice)}`}
                  </p>
                </div>
              </div>
              {booking.notes && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground font-medium text-sm mb-1">Problem Description</p>
                  <p className="text-sm">{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {canCancel && (
            <div className="flex justify-end pt-4">
              <form action={async () => {
                "use server"
                await cancelBooking(booking.id)
              }}>
                <Button type="submit" variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                </Button>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Service Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">{booking.user.name}</p>
              <p>{booking.address.street}</p>
              <p>{booking.address.city}, {booking.address.state} {booking.address.postalCode}</p>
              <p>{booking.address.country}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
