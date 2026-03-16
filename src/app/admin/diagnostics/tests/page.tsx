import { getLabTests, getTestCategories } from '@/lib/db/diagnostics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Microscope, FlaskConical } from 'lucide-react'

export default async function LabTestsPage() {
  let tests: Record<string, unknown>[] = []
  let categories: Record<string, unknown>[] = []
  let fetchError = ''
  try {
    ;[tests, categories] = await Promise.all([getLabTests(), getTestCategories()])
    tests = tests ?? []
    categories = categories ?? []
  } catch (e) {
    fetchError = String(e)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-primary" />
          Lab Tests
        </h1>
        <p className="text-muted-foreground text-sm mt-1">All tests from diagnostics.lab_tests</p>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <Card className="glass-card">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">{tests.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Tests</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">{categories.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Test Categories</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Test Catalogue</CardTitle>
          <CardDescription>{tests.length} lab tests registered</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {tests.length === 0 && !fetchError ? (
            <EmptyState label="No lab tests registered" icon={Microscope} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Test Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Category</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Sample Type</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Fasting</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t) => {
                    const cat = t.test_categories as Record<string, unknown> | null
                    return (
                      <tr key={String(t.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-medium">{String(t.test_name ?? '—')}</td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className="text-xs">{cat ? String(cat.name ?? '—') : '—'}</Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">{String(t.sample_type ?? '—')}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={`text-xs ${t.fasting_required ? 'text-orange-600 border-orange-200 bg-orange-500/10' : 'text-green-600 border-green-200 bg-green-500/10'}`}>
                            {t.fasting_required ? 'Required' : 'Not Required'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs max-w-[200px] truncate">{String(t.description ?? '—')}</td>
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
