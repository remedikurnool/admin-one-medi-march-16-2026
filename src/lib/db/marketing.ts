import { createClient } from '../supabase/server'

export async function getCampaigns() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('campaigns').select('*')
  if (error) throw error
  return data
}

export async function getPromotions() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('promotions').select('*')
  if (error) throw error
  return data
}
