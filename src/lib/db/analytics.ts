import { createClient } from '../supabase/server'

export async function getAnalyticsMetrics() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('analytics_metrics').select('*')
  if (error) throw error
  return data
}

export async function getReports() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('reports').select('*')
  if (error) throw error
  return data
}
