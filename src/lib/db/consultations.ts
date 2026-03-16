import { createAdminClient } from '../supabase/admin'

export async function getDoctors() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('consultations')
    .from('doctors')
    .select('*, specialities(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getConsultationBookings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('consultations')
    .from('consultation_bookings')
    .select('*, doctors(full_name)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getDoctorSlots() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('consultations')
    .from('doctor_slots')
    .select('*, doctors(full_name)')
    .order('slot_time', { ascending: false })
    .limit(100)
  if (error) throw error
  return data
}

export async function getSpecialities() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .schema('consultations')
    .from('specialities')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}
