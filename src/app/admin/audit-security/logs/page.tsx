import { getAuditLogs } from '@/lib/db/audit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollText, Database } from 'lucide-react'

const actionColors: Record<string, string> = {
  INSERT: 'text-green-600 bg-green-500/10',
  UPDATE: 'text-blue-600 bg-blue-500/10',
  DELETE: 'text-red-600 bg-red-500/10',
}

export default async function AuditLogsPage() {
  const { data: logs, count, error } = await getAuditLogs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-primary" />
          Audit Logs
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Complete audit trail of data changes</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Database Change Log</CardTitle>
          <CardDescription>{count} recorded changes</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {logs.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Database className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No audit logs recorded</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Table</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Action</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Record ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Performed By</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={String(log.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs font-semibold">{String(log.table_name ?? '—')}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={`text-xs ${actionColors[String(log.action)] ?? ''}`}>{String(log.action ?? '—')}</Badge>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{String(log.record_id ?? '—').slice(0, 8)}...</td>
                      <td className="py-3 px-2 font-mono text-xs">{log.performed_by ? String(log.performed_by).slice(0, 8) + '...' : '—'}</td>
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
