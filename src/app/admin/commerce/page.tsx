import { getMedicines, getMedicineOrders, getPrescriptions, getMedicineInventory } from '@/lib/db/commerce'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Pill, Box, ClipboardList, FileText, ArrowRight, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const moduleLinks = [
  {
    title: 'Medicines',
    description: 'Manage your complete medicine catalog',
    href: '/admin/commerce/medicines',
    icon: Pill,
    color: 'from-blue-500/20 to-blue-600/5',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Inventory',
    description: 'Monitor stock levels and pricing',
    href: '/admin/commerce/inventory',
    icon: Box,
    color: 'from-emerald-500/20 to-emerald-600/5',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Orders',
    description: 'Track and manage medicine orders',
    href: '/admin/commerce/orders',
    icon: ClipboardList,
    color: 'from-orange-500/20 to-orange-600/5',
    iconColor: 'text-orange-600',
  },
  {
    title: 'Prescriptions',
    description: 'Review uploaded prescriptions',
    href: '/admin/commerce/prescriptions',
    icon: FileText,
    color: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-600',
  },
]

export default async function CommercePage() {
  let stats = { medicines: 0, orders: 0, prescriptions: 0, lowStock: 0 }

  try {
    const [medicines, orders, prescriptions, inventory] = await Promise.all([
      getMedicines().catch(() => []),
      getMedicineOrders().catch(() => []),
      getPrescriptions().catch(() => []),
      getMedicineInventory().catch(() => []),
    ])
    stats = {
      medicines: medicines?.length ?? 0,
      orders: orders?.length ?? 0,
      prescriptions: prescriptions?.length ?? 0,
      lowStock: (inventory ?? []).filter((i: Record<string, unknown>) => Number(i.stock_quantity ?? 0) < 10).length,
    }
  } catch {
    // silently fail, show 0s
  }

  const summaryCards = [
    { label: 'Medicines', value: stats.medicines, icon: Pill, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Orders', value: stats.orders, icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-500/10' },
    { label: 'Prescriptions', value: stats.prescriptions, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-500/10' },
    { label: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-500/10', highlight: stats.lowStock > 0 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-primary" />
          Commerce
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          End-to-end management of the ONE MEDI medicine marketplace
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((s) => (
          <Card key={s.label} className={`glass-card ${s.highlight ? 'border-red-500/30' : ''}`}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.highlight ? 'text-red-600' : ''}`}>{s.value}</p>
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
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {moduleLinks.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <Card className="glass-card group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer">
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${mod.color}`}>
                        <mod.icon className={`w-5 h-5 ${mod.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{mod.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{mod.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
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
