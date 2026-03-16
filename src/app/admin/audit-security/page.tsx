import { getAuditLogs, getSystemAlerts } from '@/lib/db/audit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, AlertTriangle, Fingerprint, History } from 'lucide-react'

const severityColors: Record<string, string> = {
  low: 'text-blue-600 border-blue-200 bg-blue-500/10',
  medium: 'text-yellow-600 border-yellow-200 bg-yellow-500/10',
  high: 'text-orange-600 border-orange-200 bg-orange-500/10',
  critical: 'text-red-600 border-red-200 bg-red-500/10',
}

export default async function AuditPage() {
  let logs: Record<string, unknown>[] = []
  let alerts: Record<string, unknown>[] = []
  let fetchError = ''
  
  try {
    ;[logs, alerts] = await Promise.all([getAuditLogs(), getSystemAlerts()])
    logs = logs ?? []
    alerts = alerts ?? []
  } catch (e) {
    fetchError = String(e)
  }

  const unresolvedAlerts = alerts.filter(a => !a.is_resolved).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          Audit & Security
        </h1>
        <p className="text-muted-foreground text-sm mt-1">System alerts, access logs, and security monitoring</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">{unresolvedAlerts}</p>
                <p className="text-sm font-medium text-muted-foreground">Unresolved Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10">
                <History className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-indigo-600">{logs.length}</p>
                <p className="text-sm font-medium text-muted-foreground">Events Logged (24h)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {/* System Alerts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              System Alerts
            </CardTitle>
            <CardDescription>Critical system events and errors</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchError && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
            )}
            {alerts.length === 0 && !fetchError ? (
              <EmptyState label="No system alerts" icon={ShieldCheck} />
            ) : (
              <div className="space-y-3">
                {alerts.map((a) => {
                  const sev = String(a.severity ?? 'low')
                  return (
                    <div key={String(a.id)} className={`flex flex-col gap-2 p-3 rounded-lg border ${a.is_resolved ? 'border-border/50 bg-background/30 opacity-70' : 'border-destructive/30 bg-destructive/5'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{String(a.title ?? '(No Title)')}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-[10px] uppercase ${severityColors[sev] ?? ''}`}>{sev}</Badge>
                          {!a.is_resolved && <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{String(a.message ?? '')}</p>
                      <p className="text-[10px] text-muted-foreground/70">{a.created_at ? new Date(String(a.created_at)).toLocaleString('en-IN') : '—'}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <Card className="glass-card xl:h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5" />
              Audit Trail
            </CardTitle>
            <CardDescription>Recent system activities</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {logs.length === 0 && !fetchError ? (
              <EmptyState label="No audit logs" icon={History} />
            ) : (
             <div className="relative pl-4 border-l-2 border-border/30 space-y-6 before:absolute before:inset-y-0 before:-left-[1px] before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:to-transparent">
                {logs.map((log) => {
                  return (
                    <div key={String(log.id)} className="relative">
                      <div className="absolute -left-[21px] mt-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-background" />
                      <div className="text-sm font-medium mb-1">
                        <span className="uppercase text-[10px] tracking-wider text-muted-foreground font-mono mr-2 bg-muted px-1.5 py-0.5 rounded">
                          {String(log.action ?? 'Unknown')}
                        </span>
                        {String(log.entity_type ?? 'System')}
                      </div>
                      <p className="text-xs text-muted-foreground break-all bg-card/50 p-2 rounded-md border border-border/30 font-mono">
                        {String(log.details ?? JSON.stringify(log.metadata) ?? '{}')}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        {log.created_at ? new Date(String(log.created_at)).toLocaleString('en-IN') : '—'} • User ID: {String(log.user_id ?? 'System')}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
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
