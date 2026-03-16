import { getNotificationLogs } from '@/lib/db/notifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, Smartphone, Mail, MessageSquare } from 'lucide-react'

const statusConfig: Record<string, string> = {
  sent: 'text-green-600 border-green-200 bg-green-500/10',
  failed: 'text-red-600 border-red-200 bg-red-500/10',
  pending: 'text-yellow-600 border-yellow-200 bg-yellow-500/10',
}

const typeIcons: Record<string, React.ElementType> = {
  email: Mail,
  push: Smartphone,
  sms: MessageSquare,
  in_app: Bell,
}

export default async function NotificationsPage() {
  let logs: Record<string, unknown>[] = []
  let fetchError = ''
  
  try {
    logs = (await getNotificationLogs()) ?? []
  } catch (e) {
    fetchError = String(e)
  }

  const successRate = logs.length > 0 
    ? Math.round((logs.filter(l => l.status === 'sent').length / logs.length) * 100) 
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          Notifications
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Message delivery logs and templates</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Bell className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{logs.length}</p>
                <p className="text-sm font-medium text-muted-foreground">Total Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Smartphone className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{successRate}%</p>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Delivery Logs</CardTitle>
          <CardDescription>Recent notification dispatches</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {logs.length === 0 && !fetchError ? (
            <EmptyState label="No notification logs" icon={Bell} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">To User ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Title/Subject</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const type = String(log.notification_type ?? 'in_app')
                    const Icon = typeIcons[type] || Bell
                    const statusKey = String(log.status ?? 'pending')
                    return (
                      <tr key={String(log.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="capitalize text-xs font-medium">{type.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{String(log.user_id ?? 'System').slice(0, 8)}…</td>
                        <td className="py-3 px-2 max-w-[300px] truncate">{String(log.title ?? '—')}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={`text-[10px] uppercase ${statusConfig[statusKey] ?? ''}`}>{statusKey}</Badge>
                        </td>
                        <td className="py-3 px-2 text-right text-muted-foreground text-[10px]">
                          {log.created_at ? new Date(String(log.created_at)).toLocaleString('en-IN') : '—'}
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
