import { getDoctors } from '@/lib/db/consultations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stethoscope, UserCheck, UserX } from 'lucide-react'

export default async function DoctorsPage() {
  let doctors: Record<string, unknown>[] = []
  let fetchError = ''
  try {
    doctors = (await getDoctors()) ?? []
  } catch (e) {
    fetchError = String(e)
  }

  const active = doctors.filter((d) => d.is_active).length
  const inactive = doctors.length - active

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-primary" />
          Doctors
        </h1>
        <p className="text-muted-foreground text-sm mt-1">All doctors from consultations.doctors</p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        <Card className="glass-card">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold">{doctors.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Doctors</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-500" />
              <p className="text-3xl font-bold text-green-600">{active}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4 text-destructive" />
              <p className="text-3xl font-bold text-destructive">{inactive}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Inactive</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
          <CardDescription>{doctors.length} doctors registered</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {doctors.length === 0 && !fetchError ? (
            <EmptyState label="No doctors registered" icon={Stethoscope} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Speciality</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Qualification</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Experience</th>
                    <th className="text-right py-3 px-2 text-muted-foreground font-medium">Fee</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Contact</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc) => {
                    const spec = doc.specialities as Record<string, unknown> | null
                    return (
                      <tr key={String(doc.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-medium">{String(doc.full_name ?? '—')}</td>
                        <td className="py-3 px-2">
                          <Badge variant="secondary" className="text-xs">{spec ? String(spec.name ?? '—') : '—'}</Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">{String(doc.qualification ?? '—')}</td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {doc.experience_years ? `${doc.experience_years} yrs` : '—'}
                        </td>
                        <td className="py-3 px-2 text-right font-semibold">
                          {doc.consultation_fee ? `₹${Number(doc.consultation_fee).toFixed(0)}` : '—'}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs">{String(doc.phone ?? doc.email ?? '—')}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={`text-xs ${doc.is_active ? 'text-green-600 border-green-200 bg-green-500/10' : 'text-red-600 border-red-200 bg-red-500/10'}`}>
                            {doc.is_active ? 'Active' : 'Inactive'}
                          </Badge>
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
