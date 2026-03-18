import { createAdminClient } from '../supabase/admin'

// ─── Labs ──────────────────────────────────────────────────────────────────

export async function getLabs() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

// ─── Tests ─────────────────────────────────────────────────────────────────

export async function getLabTests() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('lab_tests')
    .select('*, test_categories(name)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function getTestCategories() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('test_categories')
    .select('*')
    .order('name')
  if (error) throw new Error(error.message)
  return data
}

// ─── Pricing ───────────────────────────────────────────────────────────────

export async function getLabPricing() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('lab_pricing')
    .select('*, labs(name), lab_tests(test_name)')
    .order('lab_id')
  if (error) throw new Error(error.message)
  return data
}

// ─── Bookings ──────────────────────────────────────────────────────────────

export async function getLabBookings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('lab_bookings')
    .select('*, labs(name), user_profiles:user_id(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw new Error(error.message)
  return data
}

// ─── Reports ───────────────────────────────────────────────────────────────

export async function getLabReports() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('lab_reports')
    .select('*, lab_bookings(id, user_id, labs(name))')
    .order('uploaded_at', { ascending: false })
    .limit(100)
  if (error) throw new Error(error.message)
  return data
}
