import { getServerSession } from "next-auth/next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Wrench } from "lucide-react"

import { adminAuthOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card"
import { buttonVariants } from "@repo/ui/components/ui/button"
import { AdminBookingStatusUpdater } from "@repo/ui/components/admin/admin-booking-updater"
import { prisma as db } from "@repo/db"

interface AdminBookingDetailsProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: "Booking Details | Admin" }

export default async function AdminBookingDetailsPage({ params }: AdminBookingDetailsProps) {
  const resolvedParams = await params
  const session = await getServerSession(adminAuthOptions)
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login")

  const booking = await db.booking.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: true,
      service: true,
      address: true
    }
  })

  if (!booking) notFound()

  const formatCurrency = (val: any) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(val))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/bookings" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Booking {booking.bookingNumber}</h2>
          <p className="text-muted-foreground">Booked on {new Date(booking.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminBookingStatusUpdater bookingId={booking.id} currentStatus={booking.status} />
              <p className="text-xs text-muted-foreground mt-2">Changing the status will automatically send an email notification to the customer.</p>
            </CardContent>
          </Card>

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
                  <p className="text-muted-foreground font-medium text-sm">Scheduled Date & Time</p>
                  <p>{new Date(booking.scheduledDate).toLocaleDateString()} at {new Date(booking.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium text-sm">Estimated Price</p>
                  <p className="font-medium text-primary">
                    {booking.quotedPrice ? formatCurrency(Number(booking.quotedPrice)) : `Base ${formatCurrency(Number(booking.service.basePrice))}`}
                  </p>
                </div>
              </div>
              {booking.notes && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground font-medium text-sm mb-1">Customer Problem Description & Links</p>
                  <p className="text-sm whitespace-pre-wrap">{booking.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Service Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <div>
                <p className="font-semibold text-foreground mb-1">Customer Details</p>
                <p>{booking.user.name}</p>
                <p>{booking.user.email}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="font-semibold text-foreground mb-1">Location</p>
                <p>{booking.address.street}</p>
                <p>{booking.address.city}, {booking.address.state} {booking.address.postalCode}</p>
                <p>{booking.address.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
