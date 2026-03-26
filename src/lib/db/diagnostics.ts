import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  Lab,
  LabTest,
  TestCategory,
  LabPricing,
  LabBooking,
  LabReport,
} from '@/types/database'

// ─── Labs ──────────────────────────────────────────────────────────────────

export async function getLabs(
  options?: QueryOptions
): Promise<DbResponse<Lab>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('diagnostics')
    .from('labs')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<Lab>('getLabs', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Tests ─────────────────────────────────────────────────────────────────

export async function getLabTests(
  options?: QueryOptions
): Promise<DbResponse<LabTest>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('diagnostics')
    .from('lab_tests')
    .select('*, test_categories(name)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<LabTest>('getLabTests', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

export async function getTestCategories(
  options?: QueryOptions
): Promise<DbResponse<TestCategory>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('diagnostics')
    .from('test_categories')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('name')
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<TestCategory>('getTestCategories', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Pricing ───────────────────────────────────────────────────────────────

export async function getLabPricing(
  options?: QueryOptions
): Promise<DbResponse<LabPricing>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('diagnostics')
    .from('lab_pricing')
    .select('*, labs(name), lab_tests(test_name)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('lab_id')
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<LabPricing>('getLabPricing', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Bookings ──────────────────────────────────────────────────────────────

export async function getLabBookings(
  options?: QueryOptions
): Promise<DbResponse<LabBooking>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('diagnostics')
    .from('lab_bookings')
    .select('*, labs(name), user_profiles:user_id(full_name, email)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<LabBooking>('getLabBookings', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Reports ───────────────────────────────────────────────────────────────

export async function getLabReports(
  options?: QueryOptions
): Promise<DbResponse<LabReport>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('diagnostics')
    .from('lab_reports')
    .select('*, lab_bookings(id, user_id, labs(name))', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('uploaded_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<LabReport>('getLabReports', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
