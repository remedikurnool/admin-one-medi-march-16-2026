import { getNotificationLogs } from '@/lib/db/notifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Send } from 'lucide-react'

const statusColors: Record<string, string> = {
  sent: 'text-green-600 bg-green-500/10',
  delivered: 'text-emerald-600 bg-emerald-500/10',
  failed: 'text-red-600 bg-red-500/10',
  pending: 'text-yellow-600 bg-yellow-500/10',
  queued: 'text-blue-600 bg-blue-500/10',
}

export default async function NotificationLogsPage() {
  const { data: logs, count, error } = await getNotificationLogs()
  const delivered = logs.filter((l: any) => l.status === 'delivered' || l.status === 'sent').length
  const failed = logs.filter((l: any) => l.status === 'failed').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Send className="w-6 h-6 text-primary" />
          Notification Logs
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track sent notifications and delivery status</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Sent</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">{delivered}</p><p className="text-xs text-muted-foreground">Delivered</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-red-600">{failed}</p><p className="text-xs text-muted-foreground">Failed</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-blue-600">{count - delivered - failed}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Notification Logs</CardTitle>
          <CardDescription>{count} notifications sent</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {logs.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Bell className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No notifications sent yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Title</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Channel</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">User</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={String(log.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-medium text-xs max-w-[180px] truncate">{String(log.title ?? '—')}</td>
                      <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{String(log.type ?? '—')}</Badge></td>
                      <td className="py-3 px-2 text-xs">{String(log.channel ?? '—')}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={`text-xs ${statusColors[String(log.status ?? log.delivery_status)] ?? ''}`}>
                          {String(log.status ?? log.delivery_status ?? '—')}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{log.user_id ? String(log.user_id).slice(0, 8) + '...' : '—'}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{log.sent_at ? new Date(String(log.sent_at)).toLocaleString('en-IN') : '—'}</td>
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
