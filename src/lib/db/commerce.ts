import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  Medicine,
  MedicineCategory,
  MedicineInventory,
  MedicineOrder,
  MedicineOrderItem,
  Prescription,
} from '@/types/database'

// ─── Medicines ────────────────────────────────────────────────────────────────

export async function getMedicines(
  options?: QueryOptions
): Promise<DbResponse<Medicine>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('commerce')
    .from('medicines')
    .select(
      '*, medicine_categories(name), medicine_inventory(stock_quantity, price, sku, is_active)',
      { count: 'exact' }
    )

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<Medicine>('getMedicines', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getMedicineCategories(
  options?: QueryOptions
): Promise<DbResponse<MedicineCategory>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('commerce')
    .from('medicine_categories')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('name')
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<MedicineCategory>('getMedicineCategories', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export async function getMedicineInventory(
  options?: QueryOptions
): Promise<DbResponse<MedicineInventory>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('commerce')
    .from('medicine_inventory')
    .select('*, medicines(name, brand, generic_name)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('updated_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<MedicineInventory>('getMedicineInventory', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getMedicineOrders(
  options?: QueryOptions
): Promise<DbResponse<MedicineOrder>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('commerce')
    .from('medicine_orders')
    .select(
      '*, medicine_order_items(id, quantity, unit_price, total_price, medicines(name))',
      { count: 'exact' }
    )

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<MedicineOrder>('getMedicineOrders', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

export async function getMedicineOrdersCount(): Promise<number> {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .schema('commerce')
    .from('medicine_orders')
    .select('*', { count: 'exact', head: true })
  if (error) {
    console.error('[DB Error] getMedicineOrdersCount:', error.message)
    return 0
  }
  return count ?? 0
}

export async function getMedicineOrderItems(
  orderId: string
): Promise<DbResponse<MedicineOrderItem>> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('commerce')
    .from('medicine_order_items')
    .select('*, medicines(name, brand)')
    .eq('order_id', orderId)
  if (error) return handleDbError<MedicineOrderItem>('getMedicineOrderItems', error)
  return { data: data ?? [], count: data?.length ?? 0, error: null }
}

// ─── Prescriptions ────────────────────────────────────────────────────────────

export async function getPrescriptions(
  options?: QueryOptions
): Promise<DbResponse<Prescription>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('commerce')
    .from('prescriptions')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<Prescription>('getPrescriptions', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
