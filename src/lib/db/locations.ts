import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  City,
  Pincode,
  ServiceModule,
} from '@/types/database'

// ─── Cities ───────────────────────────────────────────────────────────────

export async function getCities(
  options?: QueryOptions
): Promise<DbResponse<City>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('locations')
    .from('cities')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('city_name')
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<City>('getCities', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Pincodes ─────────────────────────────────────────────────────────────

export async function getPincodes(
  options?: QueryOptions
): Promise<DbResponse<Pincode>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('locations')
    .from('pincodes')
    .select('*, cities(city_name)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('pincode')
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await (query as any)
  if (error) return handleDbError<Pincode>('getPincodes', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Service Modules ──────────────────────────────────────────────────────

export async function getServiceModules(
  options?: QueryOptions
): Promise<DbResponse<ServiceModule>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('locations')
    .from('service_modules')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('module_name')
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<ServiceModule>('getServiceModules', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
