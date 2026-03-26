import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  NotificationLog,
  NotificationTemplate,
} from '@/types/database'

// ─── Notification Logs ────────────────────────────────────────────────────

export async function getNotificationLogs(
  options?: QueryOptions
): Promise<DbResponse<NotificationLog>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('notifications')
    .from('notification_logs')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<NotificationLog>('getNotificationLogs', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Notification Templates ───────────────────────────────────────────────

export async function getNotificationTemplates(
  options?: QueryOptions
): Promise<DbResponse<NotificationTemplate>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('notifications')
    .from('notification_templates')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('name')
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<NotificationTemplate>('getNotificationTemplates', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
