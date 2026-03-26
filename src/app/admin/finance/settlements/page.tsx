import { getVendorSettlements } from '@/lib/db/finance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Landmark, DollarSign } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-500/10',
  processing: 'text-blue-600 bg-blue-500/10',
  completed: 'text-green-600 bg-green-500/10',
  failed: 'text-red-600 bg-red-500/10',
}

export default async function SettlementsPage() {
  const { data: settlements, count, error } = await getVendorSettlements()
  const totalAmount = settlements.reduce((sum: number, s: any) => sum + Number(s.amount || 0), 0)
  const completedAmount = settlements.filter((s: any) => s.settlement_status === 'completed').reduce((sum: number, s: any) => sum + Number(s.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Landmark className="w-6 h-6 text-primary" />
          Vendor Settlements
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage vendor payment settlements</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Settlements</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-emerald-600">₹{totalAmount.toLocaleString('en-IN')}</p><p className="text-xs text-muted-foreground">Total Amount</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">₹{completedAmount.toLocaleString('en-IN')}</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Settlements</CardTitle>
          <CardDescription>{count} settlement records</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {settlements.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><DollarSign className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No settlements found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Vendor ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Reference</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Settlement Date</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {settlements.map((s: any) => (
                    <tr key={String(s.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-mono text-xs">{String(s.vendor_id ?? '—').slice(0, 8)}...</td>
                      <td className="py-3 px-2 font-semibold text-emerald-600">₹{Number(s.amount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={`text-xs ${statusColors[String(s.settlement_status ?? s.status)] ?? ''}`}>
                          {String(s.settlement_status ?? s.status ?? 'pending')}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{String(s.reference_number ?? '—')}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{s.settlement_date ? new Date(String(s.settlement_date)).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="py-3 px-2 text-xs max-w-[160px] truncate text-muted-foreground">{String(s.notes ?? '—')}</td>
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
