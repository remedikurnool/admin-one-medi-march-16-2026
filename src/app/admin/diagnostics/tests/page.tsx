import { getLabTests } from '@/lib/db/diagnostics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FlaskConical, Beaker, FileText, Tags } from 'lucide-react'
import TestsClient from './tests-client'

export default async function TestsPage() {
  let tests: any[] = []
  let fetchError = null

  try {
    const response = await getLabTests()
    tests = response.data ?? []
    fetchError = response.error
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  const fastingCount = tests.filter(t => t.fasting_required === true).length
  const sampleTypes = new Set(tests.map(t => t.sample_type).filter(Boolean)).size
  const categories = new Set(tests.map(t => t.test_categories?.name).filter(Boolean)).size

  const stats = [
    { label: 'Total Tests', value: tests.length, icon: FlaskConical, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Fasting Required', value: fastingCount, icon: Beaker, color: 'text-orange-600', bg: 'bg-orange-500/10' },
    { label: 'Sample Types', value: sampleTypes, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { label: 'Categories', value: categories, icon: Tags, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-primary" />
          Diagnostic Tests
        </h1>
        <p className="text-muted-foreground text-sm">
          Management of available diagnostic tests and their clinical requirements
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
          <CardTitle className="text-lg">Tests Catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchError ? (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              Error: {fetchError}
            </div>
          ) : (
            <TestsClient data={tests} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
