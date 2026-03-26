import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  PartnerCommission,
  VendorSettlement,
  PartnerPayout,
  CommissionTransaction,
} from '@/types/database'

// ─── Partner Commissions ──────────────────────────────────────────────────

export async function getPartnerCommissions(
  options?: QueryOptions
): Promise<DbResponse<PartnerCommission>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('finance')
    .from('partner_commissions')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<PartnerCommission>('getPartnerCommissions', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Vendor Settlements ───────────────────────────────────────────────────

export async function getVendorSettlements(
  options?: QueryOptions
): Promise<DbResponse<VendorSettlement>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('finance')
    .from('vendor_settlements')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<VendorSettlement>('getVendorSettlements', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Partner Payouts ──────────────────────────────────────────────────────

export async function getPartnerPayouts(
  options?: QueryOptions
): Promise<DbResponse<PartnerPayout>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('finance')
    .from('partner_payouts')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<PartnerPayout>('getPartnerPayouts', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Commission Transactions ──────────────────────────────────────────────

export async function getCommissionTransactions(
  options?: QueryOptions
): Promise<DbResponse<CommissionTransaction>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('finance')
    .from('commission_transactions')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<CommissionTransaction>('getCommissionTransactions', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
