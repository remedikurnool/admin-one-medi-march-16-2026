import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart, Microscope, Stethoscope, Truck, Users, Package,
  TrendingUp, AlertCircle, Activity, DollarSign
} from 'lucide-react'

async function getDashboardStats() {
  const supabase = createAdminClient()

  const [
    { count: medicineOrdersCount },
    { count: labBookingsCount },
    { count: consultationBookingsCount },
    { count: deliveryOrdersCount },
    { data: medicines },
    { data: doctors },
    { data: labs },
    { data: systemAlerts },
  ] = await Promise.all([
    supabase.schema('commerce').from('medicine_orders').select('*', { count: 'exact', head: true }),
    supabase.schema('diagnostics').from('lab_bookings').select('*', { count: 'exact', head: true }),
    supabase.schema('consultations').from('consultation_bookings').select('*', { count: 'exact', head: true }),
    supabase.schema('logistics').from('delivery_orders').select('*', { count: 'exact', head: true }),
    supabase.schema('commerce').from('medicines').select('id', { count: 'exact', head: false }),
    supabase.schema('consultations').from('doctors').select('id', { count: 'exact', head: false }),
    supabase.schema('diagnostics').from('labs').select('id', { count: 'exact', head: false }),
    supabase.schema('audit').from('system_alerts').select('*').eq('is_resolved', false).limit(5),
  ])

  return {
    medicineOrdersCount: medicineOrdersCount ?? 0,
    labBookingsCount: labBookingsCount ?? 0,
    consultationBookingsCount: consultationBookingsCount ?? 0,
    deliveryOrdersCount: deliveryOrdersCount ?? 0,
    medicinesCount: medicines?.length ?? 0,
    doctorsCount: doctors?.length ?? 0,
    labsCount: labs?.length ?? 0,
    systemAlerts: systemAlerts ?? [],
  }
}

const kpiCards = [
  {
    title: 'Medicine Orders',
    key: 'medicineOrdersCount',
    icon: ShoppingCart,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    description: 'Total orders placed',
  },
  {
    title: 'Lab Bookings',
    key: 'labBookingsCount',
    icon: Microscope,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    description: 'Diagnostic bookings',
  },
  {
    title: 'Consultations',
    key: 'consultationBookingsCount',
    icon: Stethoscope,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    description: 'Doctor consultations',
  },
  {
    title: 'Delivery Orders',
    key: 'deliveryOrdersCount',
    icon: Truck,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    description: 'Active deliveries',
  },
]

const moduleCards = [
  { title: 'Medicines', key: 'medicinesCount', icon: Package, href: '/admin/commerce/medicines', color: 'text-sky-500' },
  { title: 'Doctors', key: 'doctorsCount', icon: Users, href: '/admin/consultations/doctors', color: 'text-emerald-500' },
  { title: 'Labs', key: 'labsCount', icon: Activity, href: '/admin/diagnostics/labs', color: 'text-violet-500' },
]

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Operations Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here&apos;s an overview of your ONE MEDI platform.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon
          const value = stats[card.key as keyof typeof stats]
          return (
            <Card key={card.title} className="glass-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{typeof value === 'number' ? value.toLocaleString() : '—'}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* System Alerts + Module Summary */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* System Alerts */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-base">System Alerts</CardTitle>
            </div>
            <CardDescription>Active unresolved system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.systemAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">All systems operational</p>
                <p className="text-xs text-muted-foreground">No unresolved alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.systemAlerts.map((alert: Record<string, unknown>) => (
                  <div key={String(alert.id)} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{String(alert.title ?? 'System Alert')}</p>
                      <p className="text-xs text-muted-foreground">{String(alert.message ?? '')}</p>
                    </div>
                    <Badge variant="destructive" className="ml-auto shrink-0 text-xs">
                      {String(alert.severity ?? 'high')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Module Summary */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Platform Summary</CardTitle>
            </div>
            <CardDescription>Key entity counts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moduleCards.map((card) => {
                const Icon = card.icon
                const value = stats[card.key as keyof typeof stats]
                return (
                  <a key={card.title} href={card.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group">
                    <Icon className={`w-5 h-5 ${card.color}`} />
                    <span className="text-sm font-medium flex-1 group-hover:text-primary transition-colors">{card.title}</span>
                    <span className="text-lg font-bold">{typeof value === 'number' ? value : '—'}</span>
                  </a>
                )
              })}
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                <DollarSign className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium flex-1">Finance</span>
                <a href="/admin/finance" className="text-xs text-primary hover:underline">View →</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Quick Access */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-muted-foreground uppercase tracking-wider text-xs">Quick Access</h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: 'Orders', href: '/admin/commerce/orders', icon: ShoppingCart, color: 'bg-blue-500' },
            { label: 'Lab Tests', href: '/admin/diagnostics/tests', icon: Microscope, color: 'bg-purple-500' },
            { label: 'Doctors', href: '/admin/consultations/doctors', icon: Users, color: 'bg-green-500' },
            { label: 'Logistics', href: '/admin/logistics', icon: Truck, color: 'bg-orange-500' },
            { label: 'Marketing', href: '/admin/marketing/coupons', icon: TrendingUp, color: 'bg-pink-500' },
            { label: 'Audit', href: '/admin/audit-security', icon: AlertCircle, color: 'bg-red-500' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.label}
                href={item.href}
                className="glass-card flex flex-col items-center gap-3 p-5 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-center group-hover:text-primary transition-colors">{item.label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
