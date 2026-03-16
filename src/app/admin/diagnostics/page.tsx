import { getLabs, getLabBookings } from '@/lib/db/diagnostics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Microscope, Building2, Download } from 'lucide-react'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 border-yellow-200 bg-yellow-500/10',
  confirmed: 'text-blue-600 border-blue-200 bg-blue-500/10',
  completed: 'text-green-600 border-green-200 bg-green-500/10',
  cancelled: 'text-red-600 border-red-200 bg-red-500/10',
}

export default async function DiagnosticsPage() {
  let labs: Record<string, unknown>[] = []
  let bookings: Record<string, unknown>[] = []
  let fetchError = ''
  try {
    ;[labs, bookings] = await Promise.all([getLabs(), getLabBookings()])
    labs = labs ?? []
    bookings = bookings ?? []
  } catch (e) {
    fetchError = String(e)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Microscope className="w-6 h-6 text-primary" />
            Diagnostics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Labs and bookings overview</p>
        </div>
        
        <div className="flex items-center gap-3">
          <DateRangePicker />
          <Button variant="outline" className="border-border/50 bg-background/50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Card className="glass-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-3xl font-bold">{labs.length}</p>
                <p className="text-xs text-muted-foreground">Partner Labs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <Microscope className="w-5 h-5 text-violet-500" />
              <div>
                <p className="text-3xl font-bold">{bookings.length}</p>
                <p className="text-xs text-muted-foreground">Lab Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Labs Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Registered Labs</CardTitle>
          <CardDescription>{labs.length} labs onboarded</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {labs.length === 0 && !fetchError ? (
            <EmptyState label="No labs registered" icon={Building2} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Lab Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Contact</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Address</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {labs.map((lab) => (
                    <tr key={String(lab.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 px-2 font-medium">{String(lab.name ?? '—')}</td>
                      <td className="py-3 px-2 text-muted-foreground text-xs">
                        {String(lab.contact_phone ?? lab.contact_email ?? '—')}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground text-xs max-w-[200px] truncate">
                        {String(lab.address ?? '—')}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className={`text-xs ${lab.is_active ? 'text-green-600 border-green-200 bg-green-500/10' : 'text-red-600 border-red-200 bg-red-500/10'}`}>
                          {lab.is_active ? 'Active' : 'Inactive'}
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

      {/* Bookings Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Lab Bookings</CardTitle>
          <CardDescription>{bookings.length} bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 && !fetchError ? (
            <EmptyState label="No lab bookings yet" icon={Microscope} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Booking ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Lab</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const lab = b.labs as Record<string, unknown> | null
                    const statusKey = String(b.booking_status ?? 'pending')
                    return (
                      <tr key={String(b.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{String(b.id).slice(0, 8)}…</td>
                        <td className="py-3 px-2 text-sm">{lab ? String(lab.name ?? '—') : '—'}</td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className="text-xs capitalize">{String(b.collection_type ?? '—')}</Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={`text-xs ${statusColors[statusKey] ?? ''}`}>{statusKey}</Badge>
                        </td>
                        <td className="py-3 px-2 text-right font-semibold">₹{Number(b.total_amount ?? 0).toFixed(2)}</td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">
                          {b.created_at ? new Date(String(b.created_at)).toLocaleDateString('en-IN') : '—'}
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
