import { getConsultationBookings, getSpecialities } from '@/lib/db/consultations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stethoscope, Calendar } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'text-yellow-600 border-yellow-200 bg-yellow-500/10',
  confirmed: 'text-blue-600 border-blue-200 bg-blue-500/10',
  completed: 'text-green-600 border-green-200 bg-green-500/10',
  cancelled: 'text-red-600 border-red-200 bg-red-500/10',
}

export default async function ConsultationBookingsPage() {
  let bookings: Record<string, unknown>[] = []
  let specialities: Record<string, unknown>[] = []
  let fetchError = ''
  try {
    ;[bookings, specialities] = await Promise.all([getConsultationBookings(), getSpecialities()])
    bookings = bookings ?? []
    specialities = specialities ?? []
  } catch (e) {
    fetchError = String(e)
  }

  const modeGroups = bookings.reduce((acc: Record<string, number>, b) => {
    const mode = String(b.consultation_mode ?? 'unknown')
    acc[mode] = (acc[mode] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Consultation Bookings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">All bookings from consultations.consultation_bookings</p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        <Card className="glass-card">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">{bookings.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">{modeGroups['online'] ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Online</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">{specialities.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Specialities</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>{bookings.length} consultation bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {bookings.length === 0 && !fetchError ? (
            <EmptyState label="No consultation bookings yet" icon={Stethoscope} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Booking ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Doctor</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Mode</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const doctor = b.doctors as Record<string, unknown> | null
                    const statusKey = String(b.booking_status ?? 'pending')
                    return (
                      <tr key={String(b.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{String(b.id).slice(0, 8)}…</td>
                        <td className="py-3 px-2 font-medium">{doctor ? String(doctor.full_name ?? '—') : 'Unknown'}</td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className="text-xs capitalize">{String(b.consultation_mode ?? '—')}</Badge>
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
