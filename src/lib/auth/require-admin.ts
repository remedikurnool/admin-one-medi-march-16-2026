import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function isAdminUser(user: {
  app_metadata?: Record<string, unknown> | null
  user_metadata?: Record<string, unknown> | null
}) {
  const role = String(user.app_metadata?.role ?? user.user_metadata?.role ?? '').toLowerCase()
  return role === 'admin' || role === 'super_admin' || user.user_metadata?.is_admin === true
}

export async function requireAdminUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !isAdminUser(user)) {
    redirect('/')
  }

  return user
}
