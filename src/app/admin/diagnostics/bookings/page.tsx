import { getLabBookings } from '@/lib/db/diagnostics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, TrendingUp } from 'lucide-react'
import BookingsClient from './bookings-client'

export default async function BookingsPage() {
  let bookings = []
  let fetchError = null

  try {
    bookings = (await getLabBookings()) ?? []
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  const statusCounts = bookings.reduce((acc: Record<string, number>, b) => {
    const status = b.booking_status || 'pending'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const totalAmount = bookings
    .filter(b => b.booking_status !== 'cancelled')
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0)

  const stats = [
    { label: 'Pending', value: statusCounts.pending || 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-500/10' },
    { label: 'Confirmed', value: statusCounts.confirmed || 0, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: statusCounts.completed || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Cancelled', value: statusCounts.cancelled || 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Lab Bookings
        </h1>
        <p className="text-muted-foreground text-sm">
          Monitor and manage lab test appointments and scheduling
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Total Bookings Value</h2>
            <p className="text-3xl font-bold">₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg border border-border">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-sm font-semibold">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchError ? (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              Error: {fetchError}
            </div>
          ) : (
            <BookingsClient data={bookings} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
