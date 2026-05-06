import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

let _browser: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createBrowser() {
  if (!_browser) {
    _browser = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _browser
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createAdmin() {
  return createSupabaseClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Do not call createBrowser() at module level — it breaks when
// NODE_ENV=production is set globally (e.g., Windows machine env var),
// which causes Next.js to skip .env.local on startup.
// Always use createBrowser() lazily inside components/hooks.
