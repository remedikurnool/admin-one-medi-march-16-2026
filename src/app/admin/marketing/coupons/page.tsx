import { getCoupons, getCouponRedemptions } from '@/lib/db/marketing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tag, Ticket, CircleSlash } from 'lucide-react'

export default async function CouponsPage() {
  let coupons: Record<string, unknown>[] = []
  let redemptions: Record<string, unknown>[] = []
  let fetchError = ''
  
  try {
    ;[coupons, redemptions] = await Promise.all([getCoupons(), getCouponRedemptions()])
    coupons = coupons ?? []
    redemptions = redemptions ?? []
  } catch (e) {
    fetchError = String(e)
  }

  const activeCoupons = coupons.filter(c => c.is_active).length
  const totalDiscountGiven = redemptions.reduce((sum, r) => sum + Number(r.discount_amount ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Tag className="w-6 h-6 text-primary" />
          Promo Coupons
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage marketing coupons and discounts</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-pink-500/10">
                <Ticket className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-pink-600">{activeCoupons} / {coupons.length}</p>
                <p className="text-sm font-medium text-muted-foreground">Active Coupons</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-500/10">
                <Tag className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">₹{totalDiscountGiven.toLocaleString()}</p>
                <p className="text-sm font-medium text-muted-foreground">Total Discount Given</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>Available promo codes</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {coupons.length === 0 && !fetchError ? (
            <EmptyState label="No coupons created" icon={CircleSlash} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Code</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Value</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Module</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Usage Limit</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => {
                    return (
                      <tr key={String(c.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold tracking-wider">{String(c.code ?? '—')}</td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className="text-[10px] uppercase">{String(c.discount_type ?? '—')}</Badge>
                        </td>
                        <td className="py-3 px-2 font-semibold">
                          {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">{String(c.applicable_module ?? 'All')}</td>
                        <td className="py-3 px-2 text-muted-foreground">{c.usage_limit ? `${c.times_used || 0} / ${c.usage_limit}` : 'Unlimited'}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={`text-xs ${c.is_active ? 'text-green-600 border-green-200 bg-green-500/10' : 'text-red-600 border-red-200 bg-red-500/10'}`}>
                            {c.is_active ? 'Active' : 'Inactive'}
                          </Badge>
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
