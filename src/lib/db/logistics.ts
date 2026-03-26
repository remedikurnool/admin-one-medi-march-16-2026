import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  DeliveryPartner,
  DeliveryAgent,
  DeliveryOrder,
  DeliveryTracking,
} from '@/types/database'

// ─── Partners ─────────────────────────────────────────────────────────────

export async function getDeliveryPartners(
  options?: QueryOptions
): Promise<DbResponse<DeliveryPartner>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('logistics')
    .from('delivery_partners')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<DeliveryPartner>('getDeliveryPartners', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Agents ───────────────────────────────────────────────────────────────

export async function getDeliveryAgents(
  options?: QueryOptions
): Promise<DbResponse<DeliveryAgent>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('logistics')
    .from('delivery_agents')
    .select('*, delivery_partners(name)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<DeliveryAgent>('getDeliveryAgents', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Orders ───────────────────────────────────────────────────────────────

export async function getDeliveryOrders(
  options?: QueryOptions
): Promise<DbResponse<DeliveryOrder>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('logistics')
    .from('delivery_orders')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<DeliveryOrder>('getDeliveryOrders', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Tracking ─────────────────────────────────────────────────────────────

export async function getDeliveryTracking(
  options?: QueryOptions
): Promise<DbResponse<DeliveryTracking>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('logistics')
    .from('delivery_tracking')
    .select('*, delivery_orders(tracking_number)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('updated_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<DeliveryTracking>('getDeliveryTracking', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
