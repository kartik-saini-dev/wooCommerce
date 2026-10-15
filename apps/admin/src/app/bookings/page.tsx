import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"

import { adminAuthOptions } from "@/lib/auth"
import { BookingRepository } from "@repo/services/repositories/booking"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table"
import { Badge } from "@repo/ui/components/ui/badge"

export const metadata = { title: "Manage Bookings | Admin" }

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: any }>
}) {
  const resolvedSearchParams = await searchParams
  const session = await getServerSession(adminAuthOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  let bookings: any[] = []
  try {
    bookings = await BookingRepository.getAllBookings(resolvedSearchParams.status)
  } catch (error) {
    console.error("Failed to load admin bookings:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Service Bookings</h2>
          <p className="text-muted-foreground">View and manage customer service requests.</p>
        </div>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        <Link href="/admin/bookings">
          <Badge variant={!resolvedSearchParams.status ? "default" : "outline"} className="cursor-pointer">All</Badge>
        </Link>
        {["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
          <Link key={status} href={`/admin/bookings?status=${status}`}>
            <Badge variant={resolvedSearchParams.status === status ? "default" : "outline"} className="cursor-pointer">
              {status}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking #</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.bookingNumber}</TableCell>
                  <TableCell>
                    <div>{new Date(booking.scheduledDate).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">{new Date(booking.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </TableCell>
                  <TableCell>{booking.service.name}</TableCell>
                  <TableCell>
                    <div>{booking.user.name}</div>
                    <div className="text-xs text-muted-foreground">{booking.user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{booking.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/bookings/${booking.id}`} className="text-primary hover:underline font-medium text-sm">
                      Manage
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

