import { getDeliveryOrders } from '@/lib/db/logistics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, MapPin } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-500/10 border-yellow-200',
  assigned: 'text-blue-600 bg-blue-500/10 border-blue-200',
  picked_up: 'text-indigo-600 bg-indigo-500/10 border-indigo-200',
  in_transit: 'text-purple-600 bg-purple-500/10 border-purple-200',
  delivered: 'text-green-600 bg-green-500/10 border-green-200',
  failed: 'text-red-600 bg-red-500/10 border-red-200',
  cancelled: 'text-gray-600 bg-gray-500/10 border-gray-200',
}

export default async function DeliveryOrdersPage() {
  const { data: orders, count, error } = await getDeliveryOrders()

  const pending = orders.filter((o: any) => o.delivery_status === 'pending').length
  const inTransit = orders.filter((o: any) => ['assigned', 'picked_up', 'in_transit'].includes(o.delivery_status)).length
  const delivered = orders.filter((o: any) => o.delivery_status === 'delivered').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          Delivery Orders
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track and manage all delivery orders</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Orders</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-yellow-600">{pending}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-purple-600">{inTransit}</p><p className="text-xs text-muted-foreground">In Transit</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">{delivered}</p><p className="text-xs text-muted-foreground">Delivered</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Delivery Orders</CardTitle>
          <CardDescription>{count} total orders</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {orders.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Package className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No delivery orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Tracking #</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Pickup</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Delivery</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Est. Delivery</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => {
                    const status = String(order.delivery_status ?? order.status ?? 'pending')
                    return (
                      <tr key={String(order.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-mono text-xs font-semibold">{String(order.tracking_number ?? '—')}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={`text-xs ${statusColors[status] ?? ''}`}>{status}</Badge>
                        </td>
                        <td className="py-3 px-2 text-xs max-w-[160px] truncate">{String(order.pickup_address ?? '—')}</td>
                        <td className="py-3 px-2 text-xs max-w-[160px] truncate">{String(order.delivery_address ?? '—')}</td>
                        <td className="py-3 px-2 text-xs text-muted-foreground">{order.estimated_delivery ? new Date(String(order.estimated_delivery)).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="py-3 px-2 text-xs text-muted-foreground">{order.created_at ? new Date(String(order.created_at)).toLocaleDateString('en-IN') : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
