import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  AuditLog,
  AdminActivityLog,
  SecurityEvent,
  LoginAttempt,
  SystemAlert,
} from '@/types/database'

// ─── Audit Logs ───────────────────────────────────────────────────────────

export async function getAuditLogs(
  options?: QueryOptions
): Promise<DbResponse<AuditLog>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('audit')
    .from('audit_logs')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<AuditLog>('getAuditLogs', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Admin Activity Logs ──────────────────────────────────────────────────

export async function getAdminActivityLogs(
  options?: QueryOptions
): Promise<DbResponse<AdminActivityLog>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('audit')
    .from('admin_activity_logs')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<AdminActivityLog>('getAdminActivityLogs', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Security Events ─────────────────────────────────────────────────────

export async function getSecurityEvents(
  options?: QueryOptions
): Promise<DbResponse<SecurityEvent>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('audit')
    .from('security_events')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<SecurityEvent>('getSecurityEvents', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Login Attempts ───────────────────────────────────────────────────────

export async function getLoginAttempts(
  options?: QueryOptions
): Promise<DbResponse<LoginAttempt>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('audit')
    .from('login_attempts')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('attempted_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<LoginAttempt>('getLoginAttempts', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── System Alerts ────────────────────────────────────────────────────────

export async function getSystemAlerts(
  options?: QueryOptions
): Promise<DbResponse<SystemAlert>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('audit')
    .from('system_alerts')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<SystemAlert>('getSystemAlerts', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
