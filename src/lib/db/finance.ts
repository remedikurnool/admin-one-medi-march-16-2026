import { createClient } from '../supabase/server'

export async function getTransactions() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('transactions').select('*')
  if (error) throw error
  return data
}

export async function getInvoices() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('invoices').select('*')
  if (error) throw error
  return data
}
