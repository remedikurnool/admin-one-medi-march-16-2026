import { createAdminClient } from '../supabase/admin'

export async function getCoupons() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('marketing')
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCampaigns() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('marketing')
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCustomerSegments() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('marketing')
    .from('customer_segments')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getAbandonedCarts() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('marketing')
    .from('abandoned_carts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getCouponRedemptions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('marketing')
    .from('coupon_redemptions')
    .select('*')
    .order('redeemed_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}
