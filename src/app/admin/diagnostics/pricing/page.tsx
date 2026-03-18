import { getLabPricing } from '@/lib/db/diagnostics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Banknote, Home, FlaskConical, TrendingUp } from 'lucide-react'
import PricingClient from './pricing-client'

export default async function PricingPage() {
  let pricing = []
  let fetchError = null

  try {
    pricing = (await getLabPricing()) ?? []
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  const avgPrice = pricing.length > 0 
    ? pricing.reduce((acc, p) => acc + Number(p.price || 0), 0) / pricing.length 
    : 0
  const homeCollectionCount = pricing.filter(p => p.home_collection_available === true).length
  const activePricing = pricing.filter(p => p.is_active === true).length

  const stats = [
    { label: 'Total Mappings', value: pricing.length, icon: Banknote, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Avg Test Price', value: `₹${Math.round(avgPrice)}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Home Collection', value: homeCollectionCount, icon: Home, color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { label: 'Active Rates', value: activePricing, icon: FlaskConical, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Banknote className="w-6 h-6 text-primary" />
          Lab Pricing
        </h1>
        <p className="text-muted-foreground text-sm">
          Coordinate test costs and home collection availability across partner labs
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Pricing Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchError ? (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              Error: {fetchError}
            </div>
          ) : (
            <PricingClient data={pricing} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
