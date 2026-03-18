import { getPrescriptions } from '@/lib/db/commerce'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Upload, StickyNote } from 'lucide-react'
import { PrescriptionsClient } from './prescriptions-client'

export default async function PrescriptionsPage() {
  let prescriptions: Record<string, unknown>[] = []
  let fetchError = ''
  try {
    prescriptions = (await getPrescriptions()) ?? []
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  const withNotes = prescriptions.filter(p => p.notes && String(p.notes).trim().length > 0).length

  const stats = [
    { label: 'Total Uploads', value: prescriptions.length, icon: Upload, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'With Notes', value: withNotes, icon: StickyNote, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Prescriptions
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Review and manage uploaded prescriptions</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Prescription Records</CardTitle>
          <CardDescription>{prescriptions.length} prescriptions uploaded</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {!fetchError && <PrescriptionsClient data={prescriptions} />}
        </CardContent>
      </Card>
    </div>
  )
}
