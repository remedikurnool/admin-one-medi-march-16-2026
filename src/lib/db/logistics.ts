import { createClient } from '../supabase/server'

export async function getShipments() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('shipments').select('*')
  if (error) throw error
  return data
}

export async function getProviders() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('providers').select('*')
  if (error) throw error
  return data
}
