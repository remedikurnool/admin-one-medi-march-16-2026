import { getPrescriptions } from '@/lib/db/commerce'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { color: string, icon: React.ElementType }> = {
  pending_verification: { color: 'text-yellow-600 border-yellow-200 bg-yellow-500/10', icon: Clock },
  verified: { color: 'text-green-600 border-green-200 bg-green-500/10', icon: CheckCircle2 },
  rejected: { color: 'text-red-600 border-red-200 bg-red-500/10', icon: XCircle },
}

export default async function PrescriptionsPage() {
  let prescriptions: Record<string, unknown>[] = []
  let fetchError = ''
  
  try {
    prescriptions = (await getPrescriptions()) ?? []
  } catch (e) {
    fetchError = String(e)
  }

  const pendingCount = prescriptions.filter(p => p.status === 'pending_verification').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Prescriptions
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Review and manage uploaded prescriptions</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <FileText className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-3xl font-bold">{prescriptions.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Total Uploads</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <Clock className="w-5 h-5 text-orange-500 mb-2" />
              <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
              <p className="text-xs text-muted-foreground font-medium">Pending Review</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Prescription Reviews</CardTitle>
          <CardDescription>Most recent uploads</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {prescriptions.length === 0 && !fetchError ? (
            <EmptyState label="No prescriptions uploaded" icon={FileText} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Rx ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Patient / User</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Doctor Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Upload Date</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((rx) => {
                    const statusKey = String(rx.status ?? 'pending_verification')
                    const conf = statusConfig[statusKey] || statusConfig.pending_verification
                    const StatusIcon = conf.icon
                    
                    return (
                      <tr key={String(rx.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-mono text-xs font-semibold">{String(rx.id).slice(0,8).toUpperCase()}</td>
                        <td className="py-3 px-2">
                          <p className="font-medium text-sm">{String(rx.patient_name ?? '—')}</p>
                          <p className="text-xs font-mono text-muted-foreground">{String(rx.user_id ?? '—').slice(0, 8)}</p>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">{String(rx.doctor_name ?? '—')}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={`text-xs gap-1 pr-2.5 ${conf.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusKey.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {rx.created_at ? new Date(String(rx.created_at)).toLocaleString('en-IN') : '—'}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <a 
                            href={String(rx.file_url ?? '#')} 
                            target="_blank" 
                            rel="noreferrer"
                            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 shadow-none")}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Rx
                          </a>
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
