import { createAdminClient } from '../supabase/admin'

export async function getDeliveryPartners() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('logistics')
    .from('delivery_partners')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getDeliveryAgents() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('logistics')
    .from('delivery_agents')
    .select('*, delivery_partners(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getDeliveryOrders() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('logistics')
    .from('delivery_orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getDeliveryTracking() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('logistics')
    .from('delivery_tracking')
    .select('*, delivery_orders(tracking_number)')
    .order('updated_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}
