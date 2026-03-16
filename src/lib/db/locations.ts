import { createAdminClient } from '@/lib/supabase/admin'

export async function getCities() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('locations')
    .from('cities')
    .select('*')
    .order('city_name')
  if (error) throw error
  return data
}

export async function getPincodes() {
  const supabase = createAdminClient()
  const { data, error } = await (supabase
    .schema('locations')
    .from('pincodes')
    .select('*, cities(city_name)')
    .order('pincode')
    .limit(500) as any)
  if (error) throw error
  return data
}

export async function getServiceModules() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('locations')
    .from('service_modules')
    .select('*')
    .order('module_name')
  if (error) throw error
  return data
}
