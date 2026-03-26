import { getSalesFunnelEvents } from '@/lib/db/analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Users, Presentation, MousePointerClick } from 'lucide-react'

export default async function AnalyticsPage() {
  let events: any[] = []
  let fetchError = ''
  
  try {
    const response = await getSalesFunnelEvents()
    events = response.data ?? []
    fetchError = response.error ?? ''
  } catch (e) {
    fetchError = String(e)
  }

  const uniqueUsers = new Set(events.map(e => String(e.user_id))).size
  const pageViews = events.filter(e => e.event_name === 'page_view').length
  const clicks = events.filter(e => e.event_name === 'click').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Platform usage and sales funnel metrics</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <Presentation className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-3xl font-bold">{events.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Total Tracked Events</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <Users className="w-5 h-5 text-indigo-500 mb-2" />
              <p className="text-3xl font-bold text-indigo-600">{uniqueUsers}</p>
              <p className="text-xs text-muted-foreground font-medium">Unique Users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
              <p className="text-3xl font-bold text-emerald-600">{pageViews}</p>
              <p className="text-xs text-muted-foreground font-medium">Page Views</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <MousePointerClick className="w-5 h-5 text-orange-500 mb-2" />
              <p className="text-3xl font-bold text-orange-600">{clicks}</p>
              <p className="text-xs text-muted-foreground font-medium">Interactions/Clicks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Events Trail</CardTitle>
          <CardDescription>Latest user interactions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {events.length === 0 && !fetchError ? (
            <EmptyState label="No analytics data available" icon={BarChart3} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Event Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">User ID / Session</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Page / Location</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={String(e.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2">
                        <Badge variant="secondary" className="text-xs font-mono lowercase">
                          {String(e.event_name ?? 'unknown_event')}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs text-muted-foreground">
                        {String(e.user_id ?? e.session_id ?? 'Anonymous').slice(0, 12)}…
                      </td>
                      <td className="py-3 px-2 text-muted-foreground max-w-[250px] truncate">
                        {String(e.page_url ?? '—')}
                      </td>
                      <td className="py-3 px-2 text-right text-xs text-muted-foreground">
                        {e.created_at ? new Date(String(e.created_at)).toLocaleString('en-IN') : '—'}
                      </td>
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
