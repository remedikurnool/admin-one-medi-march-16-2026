/**
 * Base Query Builder for Supabase
 *
 * Provides reusable pagination, filtering, sorting, and search utilities
 * for all database service functions.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface QueryOptions {
  /** Page number (1-indexed). Default: 1 */
  page?: number
  /** Number of items per page. Default: 50 */
  pageSize?: number
  /** Column name to sort by */
  sortBy?: string
  /** Sort direction. Default: 'desc' */
  sortOrder?: 'asc' | 'desc'
  /** Search term for full-text search */
  search?: string
  /** Column to apply search against */
  searchColumn?: string
  /** Key-value filters applied as exact matches (`.eq`) */
  filters?: Record<string, string | number | boolean>
}

export interface DbResponse<T> {
  data: T[]
  count: number
  error: string | null
}

export interface DbSingleResponse<T> {
  data: T | null
  error: string | null
}

// ─── Defaults ───────────────────────────────────────────────────────────────

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 50
const MAX_PAGE_SIZE = 500

// ─── Query Helpers ──────────────────────────────────────────────────────────

/**
 * Applies pagination, sorting, filtering, and search to a Supabase query.
 * Works with any Supabase `PostgrestFilterBuilder`.
 *
 * @example
 * ```ts
 * const query = supabase.schema('commerce').from('medicines').select('*', { count: 'exact' })
 * const result = await applyQueryOptions(query, options)
 * ```
 */
export function applyQueryOptions<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  options?: QueryOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (!options) return query

  let q = query

  // Filters (exact match)
  if (options.filters) {
    for (const [column, value] of Object.entries(options.filters)) {
      if (value !== undefined && value !== null && value !== '') {
        q = q.eq(column, value)
      }
    }
  }

  // Search (case-insensitive partial match)
  if (options.search && options.searchColumn) {
    q = q.ilike(options.searchColumn, `%${options.search}%`)
  }

  // Sorting
  if (options.sortBy) {
    q = q.order(options.sortBy, {
      ascending: (options.sortOrder ?? 'desc') === 'asc',
    })
  }

  // Pagination
  const page = Math.max(options.page ?? DEFAULT_PAGE, 1)
  const pageSize = Math.min(
    Math.max(options.pageSize ?? DEFAULT_PAGE_SIZE, 1),
    MAX_PAGE_SIZE
  )
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  q = q.range(from, to)

  return q
}

// ─── Error Handling ─────────────────────────────────────────────────────────

/**
 * Logs a Supabase error and returns a standardized error response.
 */
export function handleDbError<T>(
  context: string,
  error: { message: string; code?: string; details?: string }
): DbResponse<T> {
  console.error(`[DB Error] ${context}:`, {
    message: error.message,
    code: error.code,
    details: error.details,
  })
  return {
    data: [],
    count: 0,
    error: error.message,
  }
}

/**
 * Logs a Supabase error and returns a standardized single-item error response.
 */
export function handleDbSingleError<T>(
  context: string,
  error: { message: string; code?: string; details?: string }
): DbSingleResponse<T> {
  console.error(`[DB Error] ${context}:`, {
    message: error.message,
    code: error.code,
    details: error.details,
  })
  return {
    data: null,
    error: error.message,
  }
}
