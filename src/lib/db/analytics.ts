import { createAdminClient } from '@/lib/supabase/admin'

export async function getSalesFunnelEvents() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('analytics')
    .from('sales_funnel_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error
  return data
}

export async function getDailyRevenue() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('analytics')
    .from('daily_revenue')
    .select('*')
    .order('day', { ascending: false })
    .limit(30)
  if (error) {
    console.error('Error fetching daily revenue:', error)
    return []
  }
  return data?.reverse() ?? [] // Return chronological for charts
}

export async function getMonthlyRevenue() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('analytics')
    .from('monthly_revenue')
    .select('*')
    .order('month', { ascending: false })
    .limit(12)
  if (error) {
    console.error('Error fetching monthly revenue:', error)
    return []
  }
  return data?.reverse() ?? []
}

export async function getModuleRevenue() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('analytics')
    .from('module_revenue')
    .select('*')
  if (error) {
    console.error('Error fetching module revenue:', error)
    return []
  }
  return data ?? []
}

export async function getVendorRevenueSummary() {
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
    .limit(10)
  // Ignoring the users join error if it happens due to cross-schema mapping missing. We will fallback in the UI.
  if (error) {
    console.error('Error fetching vendor revenue summary:', error)
    // Try without the join
    const { data: rawData, error: rawError } = await supabase
      .schema('analytics')
      .from('vendor_revenue_summary')
      .select('*')
      .order('total_revenue', { ascending: false })
      .limit(10)
    if (rawError) return []
    return rawData ?? []
  }
  return data ?? []
}

export async function getCustomerLtv() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('analytics')
    .from('customer_ltv')
    .select('*')
    .order('total_spent', { ascending: false })
    .limit(10)
  if (error) {
    console.error('Error fetching customer ltv:', error)
    return []
  }
  return data ?? []
}

export async function getActiveVendorsCount() {
  const supabase = createAdminClient()
  // Assuming 'users' table has a role or vendor flag, or we just count unique vendors in commerce. 
  // We'll approximate by counting vendors with products or recent orders.
  const { count, error } = await supabase
    .schema('commerce')
    .from('medicines')
    .select('vendor_id', { count: 'exact', head: true })
  
  if (error) return 0
  return count ?? 0
}

export async function getPendingDeliveriesCount() {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .schema('logistics')
    .from('delivery_orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'assigned', 'picked_up'])
  
  if (error) return 0
  return count ?? 0
}
