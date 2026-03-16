import { createClient } from '../supabase/server'

export async function getAuditLogs() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('audit_logs').select('*')
  if (error) throw error
  return data
}

export async function getSecurityEvents() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('security_events').select('*')
  if (error) throw error
  return data
}
