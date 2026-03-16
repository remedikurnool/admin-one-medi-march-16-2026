import { createClient } from '../supabase/server'

export async function getUsers() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data
}

export async function getUserById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
  if (error) throw error
  return data
}
