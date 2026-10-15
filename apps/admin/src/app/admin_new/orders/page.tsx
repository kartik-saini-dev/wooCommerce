import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"

import { adminAuthOptions } from "@/lib/auth"
import { OrderRepository } from "@repo/services/repositories/order"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table"
import { Badge } from "@repo/ui/components/ui/badge"

export const metadata = { title: "Manage Orders | Admin" }

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const session = await getServerSession(adminAuthOptions)
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  let orders: any[] = []
  try {
    orders = await OrderRepository.getAllOrders(resolvedSearchParams.status)
  } catch (error) {
    console.error("Failed to load admin orders:", error)
  }
  
  const formatCurrency = (val: any) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(val))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">View and manage customer orders.</p>
        </div>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto">
        <Link href="/admin/orders">
          <Badge variant={!resolvedSearchParams.status ? "default" : "outline"} className="cursor-pointer">All</Badge>
        </Link>
        {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].map((status) => (
          <Link key={status} href={`/admin/orders?status=${status}`}>
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
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div>{order.user.name}</div>
                    <div className="text-xs text-muted-foreground">{order.user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline font-medium text-sm">
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

