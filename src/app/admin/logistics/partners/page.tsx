import { getDeliveryPartners } from '@/lib/db/logistics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, Building2 } from 'lucide-react'
import { AddPartnerDialog } from '@/components/admin/logistics/add-partner-dialog'

export default async function DeliveryPartnersPage() {
  const { data: partners, count, error } = await getDeliveryPartners()
  const active = partners.filter((p: any) => p.is_active).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Delivery Partners
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage delivery partner companies</p>
        </div>
        <AddPartnerDialog />
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Total Partners</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-green-600">{active}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-gray-500">{count - active}</p><p className="text-xs text-muted-foreground">Inactive</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Delivery Partners</CardTitle>
          <CardDescription>{count} registered partners</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {partners.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Truck className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No delivery partners registered</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Contact</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Phone</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner: any) => (
                    <tr key={String(partner.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{String(partner.name ?? '—')}</td>
                      <td className="py-3 px-2 text-xs">{String(partner.contact_person ?? '—')}</td>
                      <td className="py-3 px-2 text-xs">{String(partner.phone ?? '—')}</td>
                      <td className="py-3 px-2 text-xs">{String(partner.email ?? '—')}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={partner.is_active ? 'text-green-600 bg-green-500/10' : 'text-gray-500 bg-gray-500/10'}>
                          {partner.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{partner.created_at ? new Date(String(partner.created_at)).toLocaleDateString('en-IN') : '—'}</td>
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
