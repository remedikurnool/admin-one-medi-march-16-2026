import { getCities } from '@/lib/db/locations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building } from 'lucide-react'

export default async function CitiesPage() {
  const { data: cities, count, error } = await getCities()
  const active = cities.filter((c: any) => c.is_active).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Building className="w-6 h-6 text-primary" />
          Cities
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage serviceable cities</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Cities</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">{active}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-gray-500">{count - active}</p><p className="text-xs text-muted-foreground">Inactive</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Cities</CardTitle>
          <CardDescription>{count} cities registered</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {cities.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><MapPin className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No cities configured</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">City Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">State</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city: any) => (
                    <tr key={String(city.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{String(city.city_name ?? '—')}</td>
                      <td className="py-3 px-2 text-xs">{String(city.state ?? '—')}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={city.is_active ? 'text-green-600 bg-green-500/10' : 'text-gray-500 bg-gray-500/10'}>
                          {city.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{city.created_at ? new Date(String(city.created_at)).toLocaleDateString('en-IN') : '—'}</td>
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
