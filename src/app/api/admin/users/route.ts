import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdmin()

  // lista auth.users via admin SDK
  const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // busca perfis
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, user_type')

  // busca IDs de quem tem registro na tabela providers (são prestadores com certeza)
  const { data: providers } = await supabase
    .from('providers')
    .select('user_id')

  const profileMap = new Map(
    (profiles ?? []).map((p: { id: string; full_name: string | null; avatar_url: string | null; user_type: string | null }) => [p.id, p])
  )
  const providerIds = new Set((providers ?? []).map((p: { user_id: string }) => p.user_id))

  const rows = users.map((u) => {
    const profile = profileMap.get(u.id) as { full_name: string | null; avatar_url: string | null; user_type: string | null } | undefined

    // Resolução de tipo em cascata:
    // 1. providers table (fonte mais confiável para prestadores)
    // 2. profiles.user_type (se preenchida pelo trigger)
    // 3. user_metadata (gravado no signup)
    // 4. fallback 'cliente'
    const resolvedType = providerIds.has(u.id)
      ? 'prestador'
      : (profile?.user_type ?? u.user_metadata?.user_type ?? 'cliente')

    return {
      id:         u.id,
      email:      u.email ?? '',
      full_name:  profile?.full_name ?? u.user_metadata?.full_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
      user_type:  resolvedType,
      created_at: u.created_at,
    }
  })

  return NextResponse.json(rows)
}
