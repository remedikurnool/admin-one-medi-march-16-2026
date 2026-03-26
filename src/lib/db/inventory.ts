import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  VendorInventory,
  StockAlert,
} from '@/types/database'

// ─── Inventory Items ──────────────────────────────────────────────────────

export async function getInventoryItems(
  options?: QueryOptions
): Promise<DbResponse<VendorInventory>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('inventory')
    .from('vendor_inventory')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('updated_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await (query as any)
  if (error) return handleDbError<VendorInventory>('getInventoryItems', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Stock Alerts ─────────────────────────────────────────────────────────

export async function getStockAlerts(
  options?: QueryOptions
): Promise<DbResponse<StockAlert>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('inventory')
    .from('stock_alerts')
    .select('*, inventory:vendor_inventory(vendor_id, product_id)', { count: 'exact' })

  // Default: only unresolved
  if (!options?.filters?.is_resolved) {
    query = query.eq('is_resolved', false)
  }

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await (query as any)
  if (error) return handleDbError<StockAlert>('getStockAlerts', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
