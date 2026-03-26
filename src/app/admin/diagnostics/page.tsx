import { getLabs, getLabTests, getLabPricing, getLabBookings, getLabReports } from '@/lib/db/diagnostics'
import { Card, CardContent } from '@/components/ui/card'
import { Activity, Beaker, FlaskConical, Banknote, Calendar, FileText, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const moduleLinks = [
  {
    title: 'Labs',
    description: 'Manage partner laboratories',
    href: '/admin/diagnostics/labs',
    icon: Beaker,
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Tests',
    description: 'Management diagnostic test catalog',
    href: '/admin/diagnostics/tests',
    icon: FlaskConical,
    color: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Pricing',
    description: 'Lab test pricing configuration',
    href: '/admin/diagnostics/pricing',
    icon: Banknote,
    color: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Bookings',
    description: 'Monitor lab test appointments',
    href: '/admin/diagnostics/bookings',
    icon: Calendar,
    color: 'from-orange-500/20 to-orange-600/5',
    iconColor: 'text-orange-600',
  },
  {
    title: 'Reports',
    description: 'Track diagnostic report uploads',
    href: '/admin/diagnostics/reports',
    icon: FileText,
    color: 'from-pink-500/20 to-pink-600/5',
    iconColor: 'text-pink-600',
  },
]

export default async function DiagnosticsPage() {
  let stats = { labs: 0, tests: 0, pricing: 0, bookings: 0, reports: 0 }

  try {
    const [labsRes, testsRes, pricingRes, bookingsRes, reportsRes] = await Promise.all([
      getLabs().catch(() => ({ data: [], count: 0, error: null })),
      getLabTests().catch(() => ({ data: [], count: 0, error: null })),
      getLabPricing().catch(() => ({ data: [], count: 0, error: null })),
      getLabBookings().catch(() => ({ data: [], count: 0, error: null })),
      getLabReports().catch(() => ({ data: [], count: 0, error: null })),
    ])
    stats = {
      labs: labsRes.data?.length ?? 0,
      tests: testsRes.data?.length ?? 0,
      pricing: pricingRes.data?.length ?? 0,
      bookings: bookingsRes.data?.length ?? 0,
      reports: reportsRes.data?.length ?? 0,
    }
  } catch {
    // silently fail
  }

  const summaryCards = [
    { label: 'Total Labs', value: stats.labs, icon: Beaker, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Active Tests', value: stats.tests, icon: FlaskConical, color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { label: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-500/10' },
    { label: 'Reports Ready', value: stats.reports, icon: FileText, color: 'text-pink-600', bg: 'bg-pink-500/10' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Diagnostics
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Diagnostics network management and clinical operations tracking
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((s) => (
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

      {/* Module Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-muted-foreground" />
          Modules
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {moduleLinks.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <Card className="glass-card group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer h-full">
                <CardContent className="pt-6 pb-5 h-full">
                  <div className="flex items-start justify-between h-full">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${mod.color} flex-shrink-0`}>
                        <mod.icon className={`w-5 h-5 ${mod.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{mod.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mod.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
