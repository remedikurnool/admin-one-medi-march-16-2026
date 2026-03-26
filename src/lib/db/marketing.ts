import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  Coupon,
  Campaign,
  CustomerSegment,
  AbandonedCart,
  CouponRedemption,
} from '@/types/database'

// ─── Coupons ──────────────────────────────────────────────────────────────

export async function getCoupons(
  options?: QueryOptions
): Promise<DbResponse<Coupon>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('marketing')
    .from('coupons')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<Coupon>('getCoupons', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Campaigns ────────────────────────────────────────────────────────────

export async function getCampaigns(
  options?: QueryOptions
): Promise<DbResponse<Campaign>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('marketing')
    .from('campaigns')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<Campaign>('getCampaigns', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Customer Segments ────────────────────────────────────────────────────

export async function getCustomerSegments(
  options?: QueryOptions
): Promise<DbResponse<CustomerSegment>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('marketing')
    .from('customer_segments')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<CustomerSegment>('getCustomerSegments', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Abandoned Carts ──────────────────────────────────────────────────────

export async function getAbandonedCarts(
  options?: QueryOptions
): Promise<DbResponse<AbandonedCart>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('marketing')
    .from('abandoned_carts')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<AbandonedCart>('getAbandonedCarts', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Coupon Redemptions ───────────────────────────────────────────────────

export async function getCouponRedemptions(
  options?: QueryOptions
): Promise<DbResponse<CouponRedemption>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('marketing')
    .from('coupon_redemptions')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('redeemed_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<CouponRedemption>('getCouponRedemptions', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
