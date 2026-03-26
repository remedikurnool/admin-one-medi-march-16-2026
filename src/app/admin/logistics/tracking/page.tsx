import { getDeliveryTracking } from '@/lib/db/logistics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation } from 'lucide-react'

const trackingColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-500/10',
  picked_up: 'text-blue-600 bg-blue-500/10',
  in_transit: 'text-purple-600 bg-purple-500/10',
  out_for_delivery: 'text-indigo-600 bg-indigo-500/10',
  delivered: 'text-green-600 bg-green-500/10',
  failed: 'text-red-600 bg-red-500/10',
}

export default async function DeliveryTrackingPage() {
  const { data: tracking, count, error } = await getDeliveryTracking()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Navigation className="w-6 h-6 text-primary" />
          Delivery Tracking
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time delivery tracking events</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Tracking Events</CardTitle>
          <CardDescription>{count} tracking updates</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {tracking.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><MapPin className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No tracking events</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Order #</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Location</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Notes</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {tracking.map((t: any) => {
                    const order = t.delivery_orders as Record<string, unknown> | null
                    return (
                      <tr key={String(t.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-mono text-xs font-semibold">{order ? String(order.tracking_number ?? '—') : '—'}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={`text-xs ${trackingColors[String(t.status)] ?? ''}`}>{String(t.status ?? '—')}</Badge>
                        </td>
                        <td className="py-3 px-2 text-xs max-w-[180px] truncate">{String(t.location ?? '—')}</td>
                        <td className="py-3 px-2 text-xs max-w-[200px] truncate text-muted-foreground">{String(t.notes ?? '—')}</td>
                        <td className="py-3 px-2 text-xs text-muted-foreground">{t.updated_at ? new Date(String(t.updated_at)).toLocaleString('en-IN') : '—'}</td>
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
