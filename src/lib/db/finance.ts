import { createAdminClient } from '../supabase/admin'

export async function getPartnerCommissions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('finance')
    .from('partner_commissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getVendorSettlements() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('finance')
    .from('vendor_settlements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getPartnerPayouts() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('finance')
    .from('partner_payouts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getCommissionTransactions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('finance')
    .from('commission_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}
