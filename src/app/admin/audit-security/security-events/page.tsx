import { getSecurityEvents } from '@/lib/db/audit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, ShieldAlert } from 'lucide-react'

const severityColors: Record<string, string> = {
  low: 'text-blue-600 bg-blue-500/10',
  medium: 'text-yellow-600 bg-yellow-500/10',
  high: 'text-orange-600 bg-orange-500/10',
  critical: 'text-red-600 bg-red-500/10',
}

export default async function SecurityEventsPage() {
  const { data: events, count, error } = await getSecurityEvents()
  const critical = events.filter((e: any) => e.severity === 'critical' || e.severity === 'high').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-primary" />
          Security Events
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Security-related events and threat detection</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Events</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-red-600">{critical}</p><p className="text-xs text-muted-foreground">High/Critical</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Security Event Log</CardTitle>
          <CardDescription>{count} events detected</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {events.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Shield className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No security events — system secure</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Event Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Severity</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">User</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">IP Address</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Details</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event: any) => (
                    <tr key={String(event.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-medium text-xs">{String(event.event_type ?? '—')}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={`text-xs ${severityColors[String(event.severity)] ?? ''}`}>{String(event.severity ?? '—')}</Badge>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{event.user_id ? String(event.user_id).slice(0, 8) + '...' : '—'}</td>
                      <td className="py-3 px-2 text-xs font-mono">{String(event.ip_address ?? '—')}</td>
                      <td className="py-3 px-2 text-xs max-w-[200px] truncate text-muted-foreground">{String(event.details ?? '—')}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{event.created_at ? new Date(String(event.created_at)).toLocaleString('en-IN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
