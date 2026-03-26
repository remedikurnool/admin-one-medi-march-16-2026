import { getAdminActivityLogs } from '@/lib/db/audit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UserCog, Activity } from 'lucide-react'

export default async function AdminActivityPage() {
  const { data: logs, count, error } = await getAdminActivityLogs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <UserCog className="w-6 h-6 text-primary" />
          Admin Activity
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track all admin user actions</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>{count} admin actions recorded</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {logs.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Activity className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No admin activity recorded</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Admin</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Action</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Resource</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Details</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">IP</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={String(log.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs">{log.admin_id ? String(log.admin_id).slice(0, 8) + '...' : '—'}</td>
                      <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{String(log.action ?? '—')}</Badge></td>
                      <td className="py-3 px-2 text-xs">{String(log.resource_type ?? '—')}</td>
                      <td className="py-3 px-2 text-xs max-w-[200px] truncate text-muted-foreground">{String(log.details ?? '—')}</td>
                      <td className="py-3 px-2 text-xs font-mono">{String(log.ip_address ?? '—')}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{log.created_at ? new Date(String(log.created_at)).toLocaleString('en-IN') : '—'}</td>
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
