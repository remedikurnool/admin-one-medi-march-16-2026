import { getMedicines, getMedicineCategories } from '@/lib/db/commerce'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Pill, Package, Layers, FlaskConical } from 'lucide-react'
import { MedicinesClient } from './medicines-client'

export default async function MedicinesPage() {
  let medicines: any[] = []
  let categories: any[] = []
  let fetchError = ''
  try {
    const [medicinesRes, categoriesRes] = await Promise.all([
      getMedicines(),
      getMedicineCategories(),
    ])
    medicines = medicinesRes.data ?? []
    categories = categoriesRes.data ?? []
    fetchError = medicinesRes.error ?? categoriesRes.error ?? ''
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  const rxCount = medicines.filter(m => m.requires_prescription === true).length
  const otcCount = medicines.filter(m => m.requires_prescription !== true).length
  const lowStockCount = medicines.filter(m => {
    const inv = Array.isArray(m.medicine_inventory) ? m.medicine_inventory[0] : null
    return inv ? Number((inv as Record<string, unknown>).stock_quantity ?? 0) < 10 : false
  }).length

  const stats = [
    { label: 'Total Medicines', value: medicines.length, icon: Pill, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Rx Required', value: rxCount, icon: FlaskConical, color: 'text-orange-600', bg: 'bg-orange-500/10' },
    { label: 'OTC Available', value: otcCount, icon: Package, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Categories', value: categories.length, icon: Layers, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Pill className="w-6 h-6 text-primary" />
          Medicines Catalogue
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your complete medicine catalog</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <Package className="w-4 h-4" />
          {lowStockCount} medicine{lowStockCount > 1 ? 's' : ''} with low stock (below 10 units)
        </div>
      )}

      {/* Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>All Medicines</CardTitle>
          <CardDescription>{medicines.length} medicines in catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {!fetchError && <MedicinesClient data={medicines} />}
        </CardContent>
      </Card>
    </div>
  )
}
