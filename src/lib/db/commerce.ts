import { createAdminClient } from '../supabase/admin'

// ─── Medicines ────────────────────────────────────────────────────────────────

export async function getMedicines() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicines')
    .select('*, medicine_categories(name), medicine_inventory(stock_quantity, price, sku, is_active)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function getMedicineCategories() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicine_categories')
    .select('*')
    .order('name')
  if (error) throw new Error(error.message)
  return data
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export async function getMedicineInventory() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicine_inventory')
    .select('*, medicines(name, brand, generic_name)')
    .order('updated_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getMedicineOrders() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicine_orders')
    .select('*, medicine_order_items(id, quantity, unit_price, total_price, medicines(name))')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw new Error(error.message)
  return data
}

export async function getMedicineOrdersCount() {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .schema('commerce')
    .from('medicine_orders')
    .select('*', { count: 'exact', head: true })
  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function getMedicineOrderItems(orderId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicine_order_items')
    .select('*, medicines(name, brand)')
    .eq('order_id', orderId)
  if (error) throw new Error(error.message)
  return data
}

// ─── Prescriptions ────────────────────────────────────────────────────────────

export async function getPrescriptions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('prescriptions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw new Error(error.message)
  return data
}
