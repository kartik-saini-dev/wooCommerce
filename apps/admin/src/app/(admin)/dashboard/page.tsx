import { PageHeader } from "@repo/ui/components/admin/ui/page-header"
import { StatCard } from "@repo/ui/components/admin/dashboard/stat-card"
import { 
  IndianRupee, 
  Package, 
  ShoppingCart, 
  Users 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card"

import { AnalyticsService } from "@repo/services/services/analytics.service"

export default async function AdminDashboard() {
  const result = await AnalyticsService.getDashboardStats()
  const stats = result.success && result.data ? result.data : null

  return (
    <div className="flex-1 space-y-4">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your store's performance."
      />
      
      {!stats ? (
        <div className="p-8 text-center text-muted-foreground border rounded-lg">
          Failed to load analytics data.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
              icon={IndianRupee}
              trend="neutral"
              trendValue=""
              description="Lifetime revenue"
            />
            <StatCard
              title="Orders"
              value={stats.totalOrders.toString()}
              icon={ShoppingCart}
              trend="neutral"
              trendValue=""
              description="Total orders placed"
            />
            <StatCard
              title="Products & Services"
              value={(stats.totalProducts + stats.totalServices).toString()}
              icon={Package}
              trend="neutral"
              trendValue=""
              description="Active offerings"
            />
            <StatCard
              title="Customers"
              value={stats.totalCustomers.toString()}
              icon={Users}
              trend="neutral"
              trendValue=""
              description="Registered users"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 flex flex-col">
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>
                  Products running low on inventory.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center items-center">
                 <div className="text-4xl font-bold text-destructive">
                   {stats.lowStockProducts}
                 </div>
                 <p className="text-muted-foreground mt-2">Products need restock</p>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Latest service bookings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="space-y-4">
                    {stats.recentBookings.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No recent bookings found.</p>
                    ) : stats.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {booking.user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{booking.user.name}</p>
                          <p className="text-sm text-muted-foreground truncate w-[150px]">
                            {booking.service.name}
                          </p>
                        </div>
                        <div className="ml-auto font-medium text-sm text-muted-foreground whitespace-nowrap">
                          {booking.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                 </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

