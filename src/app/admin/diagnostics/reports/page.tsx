import { getLabReports } from '@/lib/db/diagnostics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, ClipboardCheck, Clock, ShieldCheck } from 'lucide-react'
import ReportsClient from './reports-client'

export default async function ReportsPage() {
  let reports = []
  let fetchError = null

  try {
    reports = (await getLabReports()) ?? []
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  const reportsWithFiles = reports.filter(r => r.file_url).length
  const recentReports = reports.filter(r => {
    const uploadedAt = new Date(r.uploaded_at)
    const now = new Date()
    return (now.getTime() - uploadedAt.getTime()) < 24 * 60 * 60 * 1000
  }).length

  const stats = [
    { label: 'Total Reports', value: reports.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Files Uploaded', value: reportsWithFiles, icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { label: 'Last 24 Hours', value: recentReports, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { label: 'Verified', value: reports.length, icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Lab Reports
        </h1>
        <p className="text-muted-foreground text-sm">
          Track and verify diagnostic test results uploaded by partner labs
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Result Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchError ? (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              Error: {fetchError}
            </div>
          ) : (
            <ReportsClient data={reports} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
