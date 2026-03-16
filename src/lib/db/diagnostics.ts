import { createClient } from '../supabase/server'

export async function getDiagnosticTests() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('diagnostic_tests').select('*')
  if (error) throw error
  return data
}

export async function getLabReports() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('lab_reports').select('*')
  if (error) throw error
  return data
}
