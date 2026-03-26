import { getPincodes } from '@/lib/db/locations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Hash, MapPinned } from 'lucide-react'

export default async function PincodesPage() {
  const { data: pincodes, count, error } = await getPincodes()
  const serviceable = pincodes.filter((p: any) => p.is_serviceable).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Hash className="w-6 h-6 text-primary" />
          Pincodes
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage delivery pincodes and areas</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Pincodes</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">{serviceable}</p><p className="text-xs text-muted-foreground">Serviceable</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-gray-500">{count - serviceable}</p><p className="text-xs text-muted-foreground">Not Serviceable</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Pincodes</CardTitle>
          <CardDescription>{count} pincodes registered</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {pincodes.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><MapPinned className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No pincodes configured</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Pincode</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Area</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">City</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Serviceable</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {pincodes.map((pin: any) => {
                    const city = pin.cities as Record<string, unknown> | null
                    return (
                      <tr key={String(pin.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-mono font-semibold">{String(pin.pincode ?? '—')}</td>
                        <td className="py-3 px-2 text-xs">{String(pin.area_name ?? '—')}</td>
                        <td className="py-3 px-2 text-xs">{city ? String(city.city_name ?? '—') : '—'}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={pin.is_serviceable ? 'text-green-600 bg-green-500/10' : 'text-red-600 bg-red-500/10'}>
                            {pin.is_serviceable ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-xs text-muted-foreground">{pin.created_at ? new Date(String(pin.created_at)).toLocaleDateString('en-IN') : '—'}</td>
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
