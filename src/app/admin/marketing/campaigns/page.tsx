import { getCampaigns } from '@/lib/db/marketing'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Megaphone, Users, Target, Activity } from 'lucide-react'

const statusConfig: Record<string, string> = {
  draft: 'text-gray-600 border-gray-200 bg-gray-500/10',
  scheduled: 'text-blue-600 border-blue-200 bg-blue-500/10',
  active: 'text-green-600 border-green-200 bg-green-500/10',
  completed: 'text-purple-600 border-purple-200 bg-purple-500/10',
  paused: 'text-yellow-600 border-yellow-200 bg-yellow-500/10',
  cancelled: 'text-red-600 border-red-200 bg-red-500/10',
}

export default async function CampaignsPage() {
  let campaigns: any[] = []
  let fetchError = ''
  
  try {
    const response = await getCampaigns()
    campaigns = response.data ?? []
    fetchError = response.error ?? ''
  } catch (e) {
    fetchError = String(e)
  }

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-primary" />
          Marketing Campaigns
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage email, push, and SMS campaigns</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <Megaphone className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-3xl font-bold">{campaigns.length}</p>
              <p className="text-xs text-muted-foreground font-medium">Total Campaigns</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <Activity className="w-5 h-5 text-green-500 mb-2" />
              <p className="text-3xl font-bold text-green-600">{activeCampaigns}</p>
              <p className="text-xs text-muted-foreground font-medium">Active Now</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <Users className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-3xl font-bold text-purple-600">
                {campaigns.reduce((sum, c) => sum + Number((c.metrics as Record<string, unknown>)?.sent ?? 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Total Reach</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-1">
              <Target className="w-5 h-5 text-orange-500 mb-2" />
              <p className="text-3xl font-bold text-orange-600">
                {campaigns.reduce((sum, c) => sum + Number((c.metrics as Record<string, unknown>)?.converted ?? 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Total Conversions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Campaign List</CardTitle>
          <CardDescription>All marketing campaign details</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {campaigns.length === 0 && !fetchError ? (
            <EmptyState label="No campaigns found" icon={Megaphone} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Campaign Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Sent</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Opened</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Clicked</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => {
                    const statusKey = String(c.status ?? 'draft')
                    const metrics = (c.metrics as Record<string, unknown>) || {}
                    return (
                      <tr key={String(c.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-medium">{String(c.name ?? '—')}</td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className="text-[10px] uppercase">{String(c.campaign_type ?? '—')}</Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={`text-xs ${statusConfig[statusKey] ?? ''}`}>{statusKey}</Badge>
                        </td>
                        <td className="py-3 px-2 text-right font-medium">{Number(metrics.sent ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-2 text-right text-muted-foreground">{Number(metrics.opened ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-2 text-right text-muted-foreground">{Number(metrics.clicked ?? 0).toLocaleString()}</td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {c.scheduled_for ? new Date(String(c.scheduled_for)).toLocaleDateString('en-IN') : 'Manual'}
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
