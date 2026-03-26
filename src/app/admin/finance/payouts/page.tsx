import { getPartnerPayouts } from '@/lib/db/finance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Banknote, Wallet } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-500/10',
  processing: 'text-blue-600 bg-blue-500/10',
  completed: 'text-green-600 bg-green-500/10',
  failed: 'text-red-600 bg-red-500/10',
}

export default async function PayoutsPage() {
  const { data: payouts, count, error } = await getPartnerPayouts()
  const totalPaid = payouts.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Banknote className="w-6 h-6 text-primary" />
          Partner Payouts
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track payment disbursements to partners</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Payouts</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">₹{totalPaid.toLocaleString('en-IN')}</p><p className="text-xs text-muted-foreground">Total Disbursed</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-yellow-600">{payouts.filter((p: any) => p.status === 'pending').length}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Payouts</CardTitle>
          <CardDescription>{count} payout records</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {payouts.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Wallet className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No payouts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Partner ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Reference</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Payout Date</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout: any) => (
                    <tr key={String(payout.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs">{String(payout.partner_id ?? '—').slice(0, 8)}...</td>
                      <td className="py-3 px-2 font-semibold text-emerald-600">₹{Number(payout.amount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={`text-xs ${statusColors[String(payout.status)] ?? ''}`}>{String(payout.status ?? 'pending')}</Badge>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{String(payout.reference_number ?? '—')}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{payout.payout_date ? new Date(String(payout.payout_date)).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{payout.created_at ? new Date(String(payout.created_at)).toLocaleDateString('en-IN') : '—'}</td>
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
