import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const appUrl = import.meta.env.VITE_APP_URL ?? window.location.origin

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
)

export function getSignUpVerifyUrl() {
  return `${appUrl}/signup/verify`
}

export function getSupabaseConfigError() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return 'Create web/.env from web/.env.example. Vite only reads .env, not .env.example.'
  }

  if (supabaseAnonKey.startsWith('sb_secret_')) {
    return 'VITE_SUPABASE_ANON_KEY must be the publishable key (sb_publishable_...), not the secret key.'
  }

  if (
    supabaseAnonKey.includes('your-') ||
    supabaseAnonKey.includes('REPLACE_') ||
    supabaseUrl.includes('your-project-ref')
  ) {
    return 'Replace placeholder values in web/.env with your Supabase project URL and publishable key.'
  }

  return null
}
