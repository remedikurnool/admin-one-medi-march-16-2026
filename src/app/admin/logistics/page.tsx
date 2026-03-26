import { getDeliveryOrders, getDeliveryAgents } from '@/lib/db/logistics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, MapPin, Package, Clock } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 border-yellow-200 bg-yellow-500/10',
  assigned: 'text-blue-600 border-blue-200 bg-blue-500/10',
  picked_up: 'text-indigo-600 border-indigo-200 bg-indigo-500/10',
  in_transit: 'text-purple-600 border-purple-200 bg-purple-500/10',
  delivered: 'text-green-600 border-green-200 bg-green-500/10',
  failed: 'text-red-600 border-red-200 bg-red-500/10',
}

export default async function LogisticsPage() {
  let orders: any[] = []
  let agents: any[] = []
  let fetchError = ''
  try {
    const [ordersRes, agentsRes] = await Promise.all([getDeliveryOrders(), getDeliveryAgents()])
    orders = ordersRes.data ?? []
    agents = agentsRes.data ?? []
    fetchError = ordersRes.error ?? agentsRes.error ?? ''
  } catch (e) {
    fetchError = String(e)
  }

  const activeAgents = agents.filter(a => a.is_online).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Truck className="w-6 h-6 text-primary" />
          Logistics Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Delivery fleet and orders overview</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-3xl font-bold">{orders.length}</p>
                <p className="text-xs text-muted-foreground">Active Deliveries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-3xl font-bold">{agents.length}</p>
                <p className="text-xs text-muted-foreground">Total Fleet</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-3xl font-bold">{activeAgents}</p>
                <p className="text-xs text-muted-foreground">Online Agents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Delivery Orders */}
        <Card className="glass-card xl:col-span-2">
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>{orders.length} ongoing orders</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchError && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
            )}
            {orders.length === 0 && !fetchError ? (
              <EmptyState label="No active deliveries" icon={Package} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Tracking #</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Entity Type</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => {
                      const statusKey = String(o.delivery_status ?? 'pending')
                      return (
                        <tr key={String(o.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="py-3 px-2 font-mono text-xs font-semibold">{String(o.tracking_number ?? '—')}</td>
                          <td className="py-3 px-2">
                            <Badge variant="secondary" className="text-xs uppercase">{String(o.entity_type ?? '—')}</Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={`text-xs ${statusColors[statusKey] ?? ''}`}>{statusKey}</Badge>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground text-xs">
                            {o.created_at ? new Date(String(o.created_at)).toLocaleString('en-IN') : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fleet Status */}
        <Card className="glass-card flex flex-col">
          <CardHeader>
            <CardTitle>Fleet Agents</CardTitle>
            <CardDescription>Status overview</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {agents.slice(0, 10).map((agent) => {
                const partner = agent.delivery_partners as Record<string, unknown> | null
                return (
                  <div key={String(agent.id)} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${agent.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{String(agent.user_id ?? 'Agent')}</p>
                      <p className="text-xs text-muted-foreground truncate">{partner ? String(partner.name ?? 'Independent') : 'Independent'}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {String(agent.vehicle_type ?? 'Unknown')}
                      </Badge>
                    </div>
                  </div>
                )
              })}
              {agents.length === 0 && !fetchError && (
                <div className="py-10 text-center text-muted-foreground text-sm">No agents registered</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function EmptyState({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
        <Icon className="w-8 h-8" />
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
