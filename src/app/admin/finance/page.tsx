import { getVendorSettlements, getPartnerCommissions, getPartnerPayouts } from '@/lib/db/finance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Banknote, Landmark, Percent, ArrowRightLeft } from 'lucide-react'

const settlementStatusConfig: Record<string, string> = {
  pending: 'text-yellow-600 border-yellow-200 bg-yellow-500/10',
  processed: 'text-blue-600 border-blue-200 bg-blue-500/10',
  completed: 'text-green-600 border-green-200 bg-green-500/10',
  failed: 'text-red-600 border-red-200 bg-red-500/10',
}

export default async function FinancePage() {
  let settlements: any[] = []
  let commissions: any[] = []
  let payouts: any[] = []
  let fetchError = ''
  
  try {
    const [settlementsRes, commissionsRes, payoutsRes] = await Promise.all([
      getVendorSettlements(),
      getPartnerCommissions(),
      getPartnerPayouts()
    ])
    settlements = settlementsRes.data ?? []
    commissions = commissionsRes.data ?? []
    payouts = payoutsRes.data ?? []
    fetchError = settlementsRes.error ?? commissionsRes.error ?? payoutsRes.error ?? ''
  } catch (e) {
    fetchError = String(e)
  }

  const pendingSettlementsAmount = settlements
    .filter(s => s.status === 'pending')
    .reduce((sum, s) => sum + Number(s.amount ?? 0), 0)

  const totalCommissions = commissions.reduce((sum, c) => sum + Number(c.commission_amount ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Banknote className="w-6 h-6 text-primary" />
          Finance Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Settlements, commissions, and payouts</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Landmark className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600">₹{pendingSettlementsAmount.toLocaleString()}</p>
                <p className="text-sm font-medium text-muted-foreground">Pending Settlements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Percent className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">₹{totalCommissions.toLocaleString()}</p>
                <p className="text-sm font-medium text-muted-foreground">Total Commissions Gen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <ArrowRightLeft className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{payouts.length}</p>
                <p className="text-sm font-medium text-muted-foreground">Partner Payouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Vendor Settlements</CardTitle>
            <CardDescription>{settlements.length} settlement records</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchError && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
            )}
            {settlements.length === 0 && !fetchError ? (
              <EmptyState label="No settlement data" icon={Landmark} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Tx ID</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlements.map((s) => {
                      const statusKey = String(s.status ?? 'pending')
                      return (
                        <tr key={String(s.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="py-3 px-2 font-mono text-xs">{String(s.id).slice(0, 8)}…</td>
                          <td className="py-3 px-2">
                            <Badge variant="secondary" className="text-[10px] uppercase">{String(s.vendor_type ?? '—')}</Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={`text-xs ${settlementStatusConfig[statusKey] ?? ''}`}>{statusKey}</Badge>
                          </td>
                          <td className="py-3 px-2 text-right font-semibold">₹{Number(s.amount ?? 0).toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Partner Payouts</CardTitle>
            <CardDescription>{payouts.length} payout records</CardDescription>
          </CardHeader>
          <CardContent>
            {payouts.length === 0 && !fetchError ? (
              <EmptyState label="No payout data" icon={ArrowRightLeft} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Payout ID</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Partner Type</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => {
                      const statusKey = String(p.status ?? 'pending')
                      return (
                        <tr key={String(p.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="py-3 px-2 font-mono text-xs">{String(p.id).slice(0, 8)}…</td>
                          <td className="py-3 px-2">
                            <Badge variant="secondary" className="text-[10px] uppercase">{String(p.partner_type ?? '—')}</Badge>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={`text-xs ${settlementStatusConfig[statusKey] ?? ''}`}>{statusKey}</Badge>
                          </td>
                          <td className="py-3 px-2 text-right font-semibold">₹{Number(p.amount ?? 0).toFixed(2)}</td>
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
