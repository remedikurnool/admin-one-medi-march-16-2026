import { createClient } from '../supabase/server'

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('products').select('*')
  if (error) throw error
  return data
}

export async function getOrders() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('orders').select('*')
  if (error) throw error
  return data
}

export async function getInventory() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('inventory').select('*')
  if (error) throw error
  return data
}
