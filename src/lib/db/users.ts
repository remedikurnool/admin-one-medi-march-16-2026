import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'

// ─── Users ────────────────────────────────────────────────────────────────

export async function getUsers(
  options?: QueryOptions
): Promise<DbResponse<Record<string, unknown>>> {
  const supabase = createAdminClient()
  let query = supabase
    .from('users')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError('getUsers', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

export async function getUserById(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
  if (error) {
    console.error('[DB Error] getUserById:', error.message)
    return null
  }
  return data
}
