function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function getSupabaseUrl() {
  return required('NEXT_PUBLIC_SUPABASE_URL')
}

export function getSupabaseAnonKey() {
  return required('NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export function getSupabasePublishableKey() {
  // Allow compatibility with either variable naming convention.
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    required('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY')
  )
}

export function getSupabaseServiceRoleKey() {
  return required('SUPABASE_SERVICE_ROLE_KEY')
}
