import { getMedicineInventory } from '@/lib/db/commerce'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Box, Package, AlertTriangle, DollarSign } from 'lucide-react'
import { InventoryClient } from './inventory-client'

export default async function InventoryPage() {
  let inventory: any[] = []
  let fetchError = ''
  try {
    const response = await getMedicineInventory()
    inventory = response.data ?? []
    fetchError = response.error ?? ''
  } catch (e) {
    fetchError = e instanceof Error ? e.message : String(e)
  }

  const activeCount = inventory.filter(i => i.is_active === true).length
  const lowStockCount = inventory.filter(i => Number(i.stock_quantity ?? 0) < 10).length
  const totalValue = inventory.reduce((sum, i) => {
    return sum + (Number(i.price ?? 0) * Number(i.stock_quantity ?? 0))
  }, 0)

  const stats = [
    { label: 'Total SKUs', value: inventory.length, icon: Box, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Active Items', value: activeCount, icon: Package, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Low Stock Alerts', value: lowStockCount, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-500/10', highlight: lowStockCount > 0 },
    { label: 'Total Value', value: `₹${totalValue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-500/10' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Box className="w-6 h-6 text-primary" />
          Medicine Inventory
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Monitor stock levels and manage pricing</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
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

      {/* Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>{inventory.length} inventory records</CardDescription>
        </CardHeader>
        <CardContent>
          {fetchError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
          )}
          {!fetchError && <InventoryClient data={inventory} />}
        </CardContent>
      </Card>
    </div>
  )
}
