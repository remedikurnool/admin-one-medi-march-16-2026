import { createAdminClient } from '@/lib/supabase/admin'

export async function getNotificationLogs() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('notifications')
    .from('notification_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getNotificationTemplates() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('notifications')
    .from('notification_templates')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}
