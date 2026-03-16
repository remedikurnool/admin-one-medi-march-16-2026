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
