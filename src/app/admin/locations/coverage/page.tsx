import { getServiceModules } from '@/lib/db/locations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe, Layers } from 'lucide-react'

export default async function ServiceCoveragePage() {
  const { data: modules, count, error } = await getServiceModules()
  const active = modules.filter((m: any) => m.is_active).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          Service Coverage
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage service modules and coverage areas</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Service Modules</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">{active}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Service Modules</CardTitle>
          <CardDescription>{count} modules configured</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {modules.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Layers className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No service modules configured</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((mod: any) => (
                <Card key={String(mod.id)} className="border border-border/50 hover:bg-accent/30 transition-colors">
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{String(mod.module_name ?? '—')}</h3>
                      <Badge variant="outline" className={mod.is_active ? 'text-green-600 bg-green-500/10' : 'text-gray-500 bg-gray-500/10'}>
                        {mod.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{String(mod.description ?? 'No description')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
