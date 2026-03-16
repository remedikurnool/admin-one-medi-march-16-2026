import { createClient } from '../supabase/server'

export async function getConsultations() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('consultations').select('*')
  if (error) throw error
  return data
}

export async function getAppointments() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('appointments').select('*')
  if (error) throw error
  return data
}
