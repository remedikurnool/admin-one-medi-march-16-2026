import { getMedicineOrders } from '@/lib/db/commerce'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Clock, CheckCircle, XCircle, Package } from 'lucide-react'
import { OrdersClient } from './orders-client'

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: 'bg-yellow-500/10 text-yellow-600', icon: Clock },
  confirmed: { color: 'bg-blue-500/10 text-blue-600', icon: Package },
  delivered: { color: 'bg-green-500/10 text-green-600', icon: CheckCircle },
  cancelled: { color: 'bg-red-500/10 text-red-600', icon: XCircle },
}

export default async function MedicineOrdersPage() {
  let orders: Record<string, unknown>[] = []
  let fetchError = ''
  try {
    orders = (await getMedicineOrders()) ?? []
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
    const s = String(o.order_status ?? 'pending')
    acc[s] = (acc[s] ?? 0) + 1
    return acc
  }, {})

  const totalRevenue = orders
    .filter(o => o.order_status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          Medicine Orders
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track and manage all medicine orders</p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {Object.entries(statusConfig).map(([status, cfg]) => {
          const Icon = cfg.icon
          return (
            <Card key={status} className="glass-card">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{statusCounts[status] ?? 0}</p>
                    <p className="text-xs text-muted-foreground capitalize font-medium">{status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue Banner */}
      {totalRevenue > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Total Revenue (excl. cancelled): ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
      )}

      {/* Orders Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>{orders.length} orders total</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {!fetchError && <OrdersClient data={orders} />}
        </CardContent>
      </Card>
    </div>
  )
}
