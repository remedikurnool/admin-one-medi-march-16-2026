import { createAdminClient } from '../supabase/admin'

export async function getAuditLogs() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('audit')
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getAdminActivityLogs() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('audit')
    .from('admin_activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getSecurityEvents() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('audit')
    .from('security_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getLoginAttempts() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('audit')
    .from('login_attempts')
    .select('*')
    .order('attempted_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getSystemAlerts() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('audit')
    .from('system_alerts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
