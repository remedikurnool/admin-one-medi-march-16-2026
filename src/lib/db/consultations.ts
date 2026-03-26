import { createAdminClient } from '@/lib/supabase/server'
import { applyQueryOptions, handleDbError, type QueryOptions, type DbResponse } from './queryBuilder'
import type {
  Doctor,
  Speciality,
  ConsultationBooking,
  DoctorSlot,
} from '@/types/database'

// ─── Doctors ──────────────────────────────────────────────────────────────

export async function getDoctors(
  options?: QueryOptions
): Promise<DbResponse<Doctor>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('consultations')
    .from('doctors')
    .select('*, specialities(name)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<Doctor>('getDoctors', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Bookings ─────────────────────────────────────────────────────────────

export async function getConsultationBookings(
  options?: QueryOptions
): Promise<DbResponse<ConsultationBooking>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('consultations')
    .from('consultation_bookings')
    .select('*, doctors(full_name)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('created_at', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<ConsultationBooking>('getConsultationBookings', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Slots ────────────────────────────────────────────────────────────────

export async function getDoctorSlots(
  options?: QueryOptions
): Promise<DbResponse<DoctorSlot>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('consultations')
    .from('doctor_slots')
    .select('*, doctors(full_name)', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('slot_time', { ascending: false })
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<DoctorSlot>('getDoctorSlots', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}

// ─── Specialities ─────────────────────────────────────────────────────────

export async function getSpecialities(
  options?: QueryOptions
): Promise<DbResponse<Speciality>> {
  const supabase = createAdminClient()
  let query = supabase
    .schema('consultations')
    .from('specialities')
    .select('*', { count: 'exact' })

  if (!options?.sortBy) {
    query = query.order('name')
  }

  query = applyQueryOptions(query, options)

  const { data, count, error } = await query
  if (error) return handleDbError<Speciality>('getSpecialities', error)
  return { data: data ?? [], count: count ?? 0, error: null }
}
