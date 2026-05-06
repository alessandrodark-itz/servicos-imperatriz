import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'
import { CURRENT_TERMS_VERSION } from '@/lib/terms-config'

export async function GET() {
  const supabase = createAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: providers, error } = await (supabase.from('providers') as any)
    .select('id, user_id, name, slug, terms_accepted, terms_version, terms_accepted_at')
    .order('terms_accepted', { ascending: true })
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (providers ?? []).map((p: {
    id: string; user_id: string; name: string | null; slug: string | null
    terms_accepted: boolean | null; terms_version: string | null; terms_accepted_at: string | null
  }) => ({
    id:               p.id,
    user_id:          p.user_id,
    name:             p.name ?? 'Sem nome',
    slug:             p.slug ?? '',
    terms_accepted:   p.terms_accepted === true && p.terms_version === CURRENT_TERMS_VERSION,
    terms_version:    p.terms_version  ?? null,
    terms_accepted_at: p.terms_accepted_at ?? null,
    needs_update:     p.terms_accepted === true && p.terms_version !== CURRENT_TERMS_VERSION,
  }))

  const total    = rows.length
  const accepted = rows.filter((r: { terms_accepted: boolean }) => r.terms_accepted).length
  const pending  = total - accepted

  return NextResponse.json({
    rows,
    stats: { total, accepted, pending, version: CURRENT_TERMS_VERSION },
  })
}
