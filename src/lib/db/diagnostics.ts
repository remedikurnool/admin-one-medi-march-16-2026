import { createAdminClient } from '../supabase/admin'

export async function getLabs() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('labs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getLabTests() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('lab_tests')
    .select('*, test_categories(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getLabBookings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('lab_bookings')
    .select('*, labs(name)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getLabReports() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('lab_reports')
    .select('*')
    .order('uploaded_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data
}

export async function getTestCategories() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('diagnostics')
    .from('test_categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}
