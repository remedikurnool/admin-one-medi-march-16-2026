import { createAdminClient } from '@/lib/supabase/admin'

export async function getInventoryItems() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('inventory')
    .from('vendor_inventory')
    .select('*, vendors:partners.vendors(name)')
    .order('updated_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getStockAlerts() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('inventory')
    .from('stock_alerts')
    .select('*, inventory:vendor_inventory(vendor_id, product_id)')
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
