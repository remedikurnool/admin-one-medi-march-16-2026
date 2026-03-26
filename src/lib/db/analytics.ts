import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  DailyRevenue,
  MonthlyRevenue,
  ModuleRevenue,
  VendorRevenueSummary,
  CustomerLtv,
  SalesFunnelEvent,
} from '@/types/database'

// ─── Sales Funnel Events ──────────────────────────────────────────────────

export async function getSalesFunnelEvents(
  options?: QueryOptions
): Promise<DbResponse<SalesFunnelEvent>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('analytics')
    .from('sales_funnel_events')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<SalesFunnelEvent>('getSalesFunnelEvents', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Daily Revenue ────────────────────────────────────────────────────────

export async function getDailyRevenue(days = 30): Promise<DailyRevenue[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('analytics')
    .from('daily_revenue')
    .select('*')
    .order('day', { ascending: false })
    .limit(days)
  if (error) {
    console.error('[DB Error] getDailyRevenue:', error.message)
    return []
  }
  return data?.reverse() ?? [] // Return chronological for charts
}

// ─── Monthly Revenue ──────────────────────────────────────────────────────

export async function getMonthlyRevenue(months = 12): Promise<MonthlyRevenue[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('analytics')
    .from('monthly_revenue')
    .select('*')
    .order('month', { ascending: false })
    .limit(months)
  if (error) {
    console.error('[DB Error] getMonthlyRevenue:', error.message)
    return []
  }
  return data?.reverse() ?? []
}

// ─── Module Revenue ───────────────────────────────────────────────────────

export async function getModuleRevenue(): Promise<ModuleRevenue[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('analytics')
    .from('module_revenue')
    .select('*')
  if (error) {
    console.error('[DB Error] getModuleRevenue:', error.message)
    return []
  }
  return data ?? []
}

// ─── Vendor Revenue Summary ───────────────────────────────────────────────

export async function getVendorRevenueSummary(
  limit = 10
): Promise<VendorRevenueSummary[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('analytics')
    .from('vendor_revenue_summary')
    .select(`
      vendor_id,
      total_transactions,
      total_revenue,
      vendor_earnings,
      platform_commission,
      users!vendor_revenue_summary_vendor_id_fkey(full_name, email)
    `)
    .order('total_revenue', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[DB Error] getVendorRevenueSummary:', error.message)
    // Try without the join
    const { data: rawData, error: rawError } = await supabase
      .schema('analytics')
      .from('vendor_revenue_summary')
      .select('*')
      .order('total_revenue', { ascending: false })
      .limit(limit)
    if (rawError) {
      console.error('[DB Error] getVendorRevenueSummary fallback:', rawError.message)
      return []
    }
    return rawData ?? []
  }
  return data ?? []
}

// ─── Customer LTV ─────────────────────────────────────────────────────────

export async function getCustomerLtv(
  options?: QueryOptions
): Promise<DbResponse<CustomerLtv>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('analytics')
    .from('customer_ltv')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('total_spent', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<CustomerLtv>('getCustomerLtv', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Dashboard Aggregates ─────────────────────────────────────────────────

export async function getActiveVendorsCount(): Promise<number> {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .schema('commerce')
    .from('medicines')
    .select('vendor_id', { count: 'exact', head: true })
  if (error) {
    console.error('[DB Error] getActiveVendorsCount:', error.message)
    return 0
  }
  return count ?? 0
}

export async function getPendingDeliveriesCount(): Promise<number> {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .schema('logistics')
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'assigned', 'picked_up'])
  if (error) {
    console.error('[DB Error] getPendingDeliveriesCount:', error.message)
    return 0
  }
  return count ?? 0
}

// ─── Revenue Metrics (generic) ────────────────────────────────────────────

export async function getRevenueMetrics() {
  const [daily, monthly, module] = await Promise.all([
    getDailyRevenue(),
    getMonthlyRevenue(),
    getModuleRevenue(),
  ])
  return { daily, monthly, module }
}
