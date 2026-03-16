import { getInventoryItems, getStockAlerts } from '@/lib/db/inventory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Box, AlertTriangle, PackageSearch } from 'lucide-react'

export default async function InventoryPage() {
  let inventory: Record<string, unknown>[] = []
  let alerts: Record<string, unknown>[] = []
  let fetchError = ''
  
  try {
    ;[inventory, alerts] = await Promise.all([getInventoryItems(), getStockAlerts()])
    inventory = inventory ?? []
    alerts = alerts ?? []
  } catch (e) {
    fetchError = String(e)
  }

  const lowStockCount = inventory.filter(i => Number(i.stock_quantity ?? 0) <= Number(i.reorder_level ?? 10)).length
  const outOfStockCount = inventory.filter(i => Number(i.stock_quantity ?? 0) === 0).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Box className="w-6 h-6 text-primary" />
          Inventory Management
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Vendor stock levels and alerts</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Box className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">{inventory.length}</p>
                <p className="text-sm font-medium text-muted-foreground">Total SKUs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <PackageSearch className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
                <p className="text-sm font-medium text-muted-foreground">Low Stock SKUs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <Card className="glass-card xl:col-span-2">
          <CardHeader>
            <CardTitle>Vendor Inventory</CardTitle>
            <CardDescription>Current stock levels across all vendors</CardDescription>
          </CardHeader>
          <CardContent>
            {fetchError && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">Error: {fetchError}</div>
            )}
            {inventory.length === 0 && !fetchError ? (
              <EmptyState label="No inventory data found" icon={Box} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Product / SKU</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Vendor</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium">Stock</th>
                      <th className="text-right py-3 px-2 text-muted-foreground font-medium">Price</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => {
                      const qty = Number(item.stock_quantity ?? 0)
                      const reorder = Number(item.reorder_level ?? 10)
                      const isLow = qty <= reorder && qty > 0
                      const isOut = qty === 0
                      const ven = item.vendors as Record<string, unknown> | null
                      
                      return (
                        <tr key={String(item.id)} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="py-3 px-2">
                            <p className="font-medium text-sm">{String(item.product_name ?? 'Unknown')}</p>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">{String(item.sku ?? '—')}</p>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground text-sm">
                            {ven ? String(ven.name ?? '—') : '—'}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className={`font-semibold ${isOut ? 'text-red-500' : isLow ? 'text-orange-500' : 'text-green-600'}`}>
                              {qty}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right font-medium">
                            ₹{Number(item.price ?? 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-2">
                            {isOut ? (
                              <Badge variant="outline" className="text-[10px] text-red-600 border-red-200 bg-red-500/10">OUT OF STOCK</Badge>
                            ) : isLow ? (
                              <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-200 bg-orange-500/10">LOW STOCK</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-500/10">IN STOCK</Badge>
                            )}
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

        {/* Stock Alerts Widget */}
        <Card className="glass-card flex flex-col h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts
            </CardTitle>
            <CardDescription>Items requires immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2">
            {alerts.length === 0 && !fetchError ? (
              <EmptyState label="No stock alerts" icon={Box} />
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={String(alert.id)} className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold">{String(alert.alert_type ?? 'Stock Alert').toUpperCase()}</span>
                      <Badge variant="destructive" className="text-[10px]">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{String(alert.message ?? '')}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {alert.created_at ? new Date(String(alert.created_at)).toLocaleString('en-IN') : '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
