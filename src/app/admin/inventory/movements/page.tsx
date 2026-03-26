import { getInventoryItems } from '@/lib/db/inventory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, Package } from 'lucide-react'

export default async function InventoryMovementsPage() {
  const { data: items, count, error } = await getInventoryItems()
  const lowStock = items.filter((i: any) => i.reorder_level && Number(i.quantity || i.stock_quantity || 0) <= Number(i.reorder_level)).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ArrowUpDown className="w-6 h-6 text-primary" />
          Inventory Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Vendor inventory across all warehouses</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold">{count}</p><p className="text-xs text-muted-foreground">Inventory Items</p></CardContent></Card>
        <Card className="glass-card"><CardContent className="pt-5"><p className="text-3xl font-bold text-red-600">{lowStock}</p><p className="text-xs text-muted-foreground">Low Stock</p></CardContent></Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Vendor Inventory</CardTitle>
          <CardDescription>{count} items tracked</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {error}</div>}
          {items.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"><Package className="w-8 h-8" /></div>
              <p className="text-sm font-medium">No inventory items found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Vendor ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Product ID</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Quantity</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Reorder Level</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-2 text-muted-foreground font-medium">Last Restocked</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => {
                    const qty = Number(item.quantity || item.stock_quantity || 0)
                    const reorder = Number(item.reorder_level || 0)
                    const isLow = reorder > 0 && qty <= reorder
                    return (
                      <tr key={String(item.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                        <td className="py-3 px-2 font-mono text-xs">{String(item.vendor_id ?? '—').slice(0, 8)}...</td>
                        <td className="py-3 px-2 font-mono text-xs">{String(item.product_id ?? '—').slice(0, 8)}...</td>
                        <td className={`py-3 px-2 font-semibold ${isLow ? 'text-red-600' : ''}`}>{qty}</td>
                        <td className="py-3 px-2 text-muted-foreground">{reorder || '—'}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={isLow ? 'text-red-600 bg-red-500/10' : 'text-green-600 bg-green-500/10'}>
                            {isLow ? 'Low Stock' : 'In Stock'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-xs text-muted-foreground">{item.last_restocked ? new Date(String(item.last_restocked)).toLocaleDateString('en-IN') : '—'}</td>
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
