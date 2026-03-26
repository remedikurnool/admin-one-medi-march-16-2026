import { getNotificationTemplates } from '@/lib/db/notifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Mail } from 'lucide-react'

export default async function NotificationTemplatesPage() {
  const { data: templates, count, error } = await getNotificationTemplates()
  const active = templates.filter((t: any) => t.is_active).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Notification Templates
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage notification message templates</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Templates</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">{active}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
          <CardDescription>{count} templates configured</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {templates.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Mail className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No templates configured</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Channel</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Subject</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((tmpl: any) => (
                    <tr key={String(tmpl.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{String(tmpl.name ?? '—')}</td>
                      <td className="py-3 px-2"><Badge variant="secondary" className="text-xs">{String(tmpl.type ?? '—')}</Badge></td>
                      <td className="py-3 px-2 text-xs">{String(tmpl.channel ?? '—')}</td>
                      <td className="py-3 px-2 text-xs max-w-[200px] truncate">{String(tmpl.subject ?? '—')}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={tmpl.is_active ? 'text-green-600 bg-green-500/10' : 'text-gray-500 bg-gray-500/10'}>
                          {tmpl.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{tmpl.updated_at ? new Date(String(tmpl.updated_at)).toLocaleDateString('en-IN') : '—'}</td>
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
