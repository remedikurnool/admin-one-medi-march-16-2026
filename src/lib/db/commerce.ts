import { createAdminClient } from '../supabase/admin'

export async function getMedicines() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicines')
    .select('*, medicine_categories(name), medicine_inventory(stock_quantity, price)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getMedicineOrders() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicine_orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getMedicineOrdersCount() {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .schema('commerce')
    .from('medicine_orders')
    .select('*', { count: 'exact', head: true })
  if (error) throw error
  return count ?? 0
}

export async function getPrescriptions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('prescriptions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data
}

export async function getMedicineCategories() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicine_categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function getMedicineInventory() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicine_inventory')
    .select('*, medicines(name, brand)')
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data
}
