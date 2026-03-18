import { getLabs } from '@/lib/db/diagnostics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Beaker, Activity, ShieldCheck, MapPin } from 'lucide-react'
import LabsClient from './labs-client'

export default async function LabsPage() {
  let labs = []
  let fetchError = null

  try {
    labs = (await getLabs()) ?? []
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  const activeLabs = labs.filter(l => l.is_active === true).length
  const cities = new Set(labs.map(l => l.city_id).filter(Boolean)).size

  const stats = [
    { label: 'Total Labs', value: labs.length, icon: Beaker, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Active Labs', value: activeLabs, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Verified', value: labs.length, icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { label: 'Cities', value: cities, icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Beaker className="w-6 h-6 text-primary" />
          Diagnostic Labs
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage partner laboratories and their operations status
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
          <CardTitle className="text-lg">All Partner Labs</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchError ? (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              Error: {fetchError}
            </div>
          ) : (
            <LabsClient data={labs} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
