"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { adminUpdateBookingStatus } from "@repo/services/actions/admin-bookings"
import { Button } from "@repo/ui/components/ui/button"

export function AdminBookingStatusUpdater({ bookingId, currentStatus }: { bookingId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  const handleUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    startTransition(async () => {
      const result = await adminUpdateBookingStatus(bookingId, newStatus)
      if (result.success) {
        toast.success(`Booking status updated to ${newStatus}`)
      } else {
        toast.error(result.error || "Failed to update status")
      }
    })
  }

  return (
    <div className="flex items-center gap-4">
      <span className="font-medium text-sm">Update Status:</span>
      <select 
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={currentStatus}
        onChange={handleUpdate}
        disabled={isPending}
      >
        <option value="PENDING">Pending</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      {isPending && <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>}
    </div>
  )
}
