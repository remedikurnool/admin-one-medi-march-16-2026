import { getStockAlerts } from '@/lib/db/inventory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Bell } from 'lucide-react'

export default async function StockAlertsPage() {
  const { data: alerts, count, error } = await getStockAlerts()
  const unresolved = alerts.filter((a: any) => !a.is_resolved).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-primary" />
          Stock Alerts
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Critical inventory alerts and reorder notifications</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Alerts</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-red-600">{unresolved}</p><p className="text-xs text-muted-foreground">Unresolved</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">{count - unresolved}</p><p className="text-xs text-muted-foreground">Resolved</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>{count} alerts total</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {alerts.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Bell className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No stock alerts — all clear!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert: any) => {
                const inv = alert.inventory as Record<string, unknown> | null
                return (
                  <div key={String(alert.id)} className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/30 transition-colors">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${alert.is_resolved ? 'text-muted-foreground' : 'text-red-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{String(alert.alert_type ?? 'Stock Alert')}</p>
                      <p className="text-xs text-muted-foreground mt-1">{String(alert.message ?? '—')}</p>
                      {inv && <p className="text-xs text-muted-foreground mt-1 font-mono">Vendor: {String(inv.vendor_id ?? '—').slice(0, 8)}...</p>}
                    </div>
                    <Badge variant="outline" className={alert.is_resolved ? 'text-green-600 bg-green-500/10' : 'text-red-600 bg-red-500/10'}>
                      {alert.is_resolved ? 'Resolved' : 'Active'}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{alert.created_at ? new Date(String(alert.created_at)).toLocaleDateString('en-IN') : ''}</span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
