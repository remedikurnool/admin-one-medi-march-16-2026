import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart, Truck, Users,
  AlertCircle, Activity, DollarSign
} from 'lucide-react'
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart'
import { ModuleRevenueChart } from '@/components/admin/dashboard/ModuleRevenueChart'
import { 
  getDailyRevenue, 
  getMonthlyRevenue, 
  getModuleRevenue, 
  getVendorRevenueSummary, 
  getActiveVendorsCount, 
  getPendingDeliveriesCount 
} from '@/lib/db/analytics'
import { formatDistanceToNow } from 'date-fns'

function getDisplayName(users: unknown) {
  if (Array.isArray(users) && users.length > 0) {
    return String((users[0] as { full_name?: unknown }).full_name ?? 'Anonymous')
  }
  return 'Anonymous'
}

async function getDashboardData() {
  const supabase = createAdminClient()

  const [
    dailyRevenue,
    monthlyRevenue,
    moduleRevenue,
    vendorRevenue,
    activeVendorsCount,
    pendingDeliveriesCount,
    { data: recentOrders },
    { data: recentBookings },
    { data: systemAlerts }
  ] = await Promise.all([
    getDailyRevenue(),
    getMonthlyRevenue(),
    getModuleRevenue(),
    getVendorRevenueSummary(),
    getActiveVendorsCount(),
    getPendingDeliveriesCount(),
    supabase.schema('commerce').from('medicine_orders').select('id, user_id, total_amount, status, created_at, users(full_name)').order('created_at', { ascending: false }).limit(5),
    supabase.schema('diagnostics').from('lab_bookings').select('id, user_id, total_amount, status, created_at, users(full_name)').order('created_at', { ascending: false }).limit(5),
    supabase.schema('audit').from('system_alerts').select('*').eq('is_resolved', false).limit(5),
  ])

  // Calculate "Today" stats
  const todayRevenueData = dailyRevenue[dailyRevenue.length - 1] || { revenue: 0, transactions: 0 }
  const revenueToday = Number(todayRevenueData.revenue) || 0
  const ordersToday = Number(todayRevenueData.transactions) || 0

  // We don't have a split for bookings today from the aggregate easily, so let's just make a quick query 
  // or proxy it from the total transactions if we assume the bulk are orders.
  // Actually, we can just query today's bookings directly:
  const todayStr = new Date().toISOString().split('T')[0]
  const { count: bookingsTodayCount } = await supabase
    .schema('consultations')
    .from('consultation_bookings')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStr)

  const { count: labBookingsTodayCount } = await supabase
    .schema('diagnostics')
    .from('lab_bookings')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayStr)

  return {
    widgets: {
      revenueToday,
      ordersToday,
      bookingsToday: (bookingsTodayCount || 0) + (labBookingsTodayCount || 0),
      activeVendors: activeVendorsCount,
      pendingDeliveries: pendingDeliveriesCount,
    },
    charts: {
      dailyRevenue,
      monthlyRevenue,
      moduleRevenue,
    },
    tables: {
      recentOrders: recentOrders || [],
      recentBookings: recentBookings || [],
      topVendors: vendorRevenue || [],
    },
    systemAlerts: systemAlerts || []
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Operations Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here&apos;s a quick overview of platform performance.
        </p>
      </div>

      {/* KPI Widgets */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <Card className="glass-card hover:-translate-y-0.5 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Today</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10"><DollarSign className="w-4 h-4 text-emerald-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${data.widgets.revenueToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total revenue today</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-0.5 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders Today</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10"><ShoppingCart className="w-4 h-4 text-blue-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.widgets.ordersToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Commerce orders</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-0.5 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bookings Today</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10"><Activity className="w-4 h-4 text-purple-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.widgets.bookingsToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Consults & Labs</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-0.5 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Vendors</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/10"><Users className="w-4 h-4 text-orange-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.widgets.activeVendors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Sellers on platform</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-0.5 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wait Deliveries</CardTitle>
            <div className="p-2 rounded-lg bg-red-500/10"><Truck className="w-4 h-4 text-red-500" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data.widgets.pendingDeliveries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending dispatch</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <RevenueChart 
          title="Daily Revenue Trend (30 Days)" 
          description="Gross revenue over the last 30 days"
          data={data.charts.dailyRevenue} 
          dateKey="day" 
          revenueKey="revenue" 
          type="area" 
        />
        <ModuleRevenueChart data={data.charts.moduleRevenue} />
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <RevenueChart 
          title="Monthly Orders Trend (12 Months)" 
          description="Order volume over the last year"
          data={data.charts.monthlyRevenue} 
          dateKey="month" 
          revenueKey="revenue" 
          type="bar" 
        />
        
        {/* System Alerts */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-base">System Alerts</CardTitle>
            </div>
            <CardDescription>Active unresolved system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {data.systemAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">All systems operational</p>
                <p className="text-xs text-muted-foreground">No unresolved alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.systemAlerts.map((alert) => (
                  <div key={String(alert.id)} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{String(alert.title ?? 'System Alert')}</p>
                      <p className="text-xs text-muted-foreground">{String(alert.message ?? '')}</p>
                    </div>
                    <Badge variant="destructive" className="ml-auto shrink-0 text-xs">
                      {String(alert.severity ?? 'high')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <CardDescription>Latest commerce transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.tables.recentOrders.length === 0 ? (
                 <p className="text-sm flex h-24 items-center justify-center text-muted-foreground">No recent orders</p>
              ) : data.tables.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium truncate w-32">{getDisplayName(order.users)}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(String(order.created_at)), { addSuffix: true })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${Number(order.total_amount).toFixed(2)}</p>
                    <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="text-[10px]">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <CardDescription>Latest lab tests & consults</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.tables.recentBookings.length === 0 ? (
                 <p className="text-sm flex h-24 items-center justify-center text-muted-foreground">No recent bookings</p>
              ) : data.tables.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium truncate w-32">{getDisplayName(booking.users)}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(String(booking.created_at)), { addSuffix: true })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${Number(booking.total_amount).toFixed(2)}</p>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-[10px] bg-purple-500/10 text-purple-600 hover:bg-purple-500/20">
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Top Vendors</CardTitle>
            <CardDescription>By total revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.tables.topVendors.length === 0 ? (
                 <p className="text-sm flex h-24 items-center justify-center text-muted-foreground">No vendor data</p>
              ) : data.tables.topVendors.map((vendor) => (
                <div key={vendor.vendor_id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate w-24">
                        {vendor.users?.full_name || 'Vendor'}
                      </p>
                      <p className="text-xs text-muted-foreground">{vendor.total_transactions} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">
                      ${Number(vendor.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Comm: ${Number(vendor.platform_commission).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
