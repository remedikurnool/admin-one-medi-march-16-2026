import { getLoginAttempts } from '@/lib/db/audit'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KeyRound, ShieldCheck } from 'lucide-react'

export default async function LoginAttemptsPage() {
  const { data: attempts, count, error } = await getLoginAttempts()
  const failures = attempts.filter((a: any) => !a.success).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-primary" />
          Login Attempts
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor authentication attempts</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Attempts</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">{count - failures}</p><p className="text-xs text-muted-foreground">Successful</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-red-600">{failures}</p><p className="text-xs text-muted-foreground">Failed</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Login History</CardTitle>
          <CardDescription>{count} login attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {attempts.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><ShieldCheck className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No login attempts recorded</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">IP Address</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Failure Reason</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt: any) => (
                    <tr key={String(attempt.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 text-xs">{String(attempt.email ?? '—')}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={`text-xs ${attempt.success ? 'text-green-600 bg-green-500/10' : 'text-red-600 bg-red-500/10'}`}>
                          {attempt.success ? 'Success' : 'Failed'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{String(attempt.ip_address ?? '—')}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{String(attempt.failure_reason ?? '—')}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{attempt.attempted_at ? new Date(String(attempt.attempted_at)).toLocaleString('en-IN') : '—'}</td>
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
