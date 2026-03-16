import { getCities, getPincodes, getServiceModules } from '@/lib/db/locations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Map, Navigation, Layers } from 'lucide-react'

export default async function LocationsPage() {
  let cities: Record<string, unknown>[] = []
  let pincodes: Record<string, unknown>[] = []
  let modules: Record<string, unknown>[] = []
  let fetchError = ''
  
  try {
    ;[cities, pincodes, modules] = await Promise.all([getCities(), getPincodes(), getServiceModules()])
    cities = cities ?? []
    pincodes = pincodes ?? []
    modules = modules ?? []
  } catch (e) {
    fetchError = String(e)
  }

  const activeCities = cities.filter(c => !!c.is_active).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Locations & Coverage
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage operational areas and service limits</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Map className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{activeCities} / {cities.length}</p>
                <p className="text-sm font-medium text-muted-foreground">Active Cities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <Navigation className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600">{pincodes.length}</p>
                <p className="text-sm font-medium text-muted-foreground">Serviceable Pincodes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <Layers className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{modules.length}</p>
                <p className="text-sm font-medium text-muted-foreground">Service Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Cities
            </CardTitle>
            <CardDescription>Operational cities</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchError && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
            )}
            {cities.length === 0 && !fetchError ? (
              <EmptyState label="No cities found" icon={Map} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">City Name</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">State</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((city) => (
                      <tr key={String(city.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-medium">{String(city.city_name ?? '—')}</td>
                        <td className="py-3 px-2 text-muted-foreground">{String(city.state ?? '—')}</td>
                        <td className="py-3 px-2 text-right">
                          <Badge variant="outline" className={`text-[10px] ${!!city.is_active ? 'text-green-600 border-green-200 bg-green-500/10' : 'text-red-600 border-red-200 bg-red-500/10'}`}>
                            {!!city.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Pincodes Coverage
            </CardTitle>
            <CardDescription>Top 100 serviceable areas</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto pr-2">
            {pincodes.length === 0 && !fetchError ? (
              <EmptyState label="No pincodes found" icon={Navigation} />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {pincodes.slice(0, 100).map((pin) => {
                  const city = pin.cities as Record<string, unknown> | null;
                  return (
                    <div key={String(pin.id)} className={`p-2 rounded border flex flex-col gap-1 ${!!pin.is_active ? 'bg-background/50 border-border' : 'bg-muted/50 border-destructive/20 opacity-60'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold tracking-widest text-sm">{String(pin.pincode ?? '—')}</span>
                        {!!pin.is_active && <div className="w-2 h-2 rounded-full bg-green-500" />}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{city ? String(city.city_name ?? '—') : '—'}</span>
                    </div>
                  )
                })}
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
