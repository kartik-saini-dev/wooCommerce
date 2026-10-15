"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { adminUpdateOrderStatus } from "@repo/services/actions/admin-orders"
import { Button } from "@repo/ui/components/ui/button"

export function AdminOrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  const handleUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    startTransition(async () => {
      const result = await adminUpdateOrderStatus(orderId, newStatus)
      if (result.success) {
        toast.success(`Order status updated to ${newStatus}`)
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
        <option value="PROCESSING">Processing</option>
        <option value="SHIPPED">Shipped</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="RETURNED">Returned</option>
      </select>
      {isPending && <span className="text-xs text-muted-foreground animate-pulse">Updating...</span>}
    </div>
  )
}
