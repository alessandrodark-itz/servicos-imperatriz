import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

/* GET /api/reviews?slug=provider-slug */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const db = createAdmin()

  const { data: prov } = await db.from('providers').select('id').eq('slug', slug).single()
  if (!prov) return NextResponse.json({ reviews: [], providerId: null })

  const { data: reviews, error } = await db
    .from('reviews')
    .select('id, user_id, rating, comment, reviewer_name, created_at, status')
    .eq('provider_id', prov.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const active = (reviews ?? []).filter((r: { status?: string }) => !r.status || r.status === 'active')

  // Busca nome atual do perfil para cada reviewer — fonte de verdade
  const userIds = [...new Set(active.map((r: { user_id: string }) => r.user_id).filter(Boolean))]
  let profileNames: { id: string; full_name: string | null }[] = []
  if (userIds.length > 0) {
    const { data } = await db.from('profiles').select('id, full_name').in('id', userIds)
    profileNames = (data ?? []) as typeof profileNames
  }
  const profileMap = new Map(profileNames.map(p => [p.id, p.full_name]))

  // Busca respostas ativas
  const ids = active.map((r: { id: string }) => r.id)
  let replies: { id: string; review_id: string; reply_comment: string; created_at: string }[] = []
  if (ids.length > 0) {
    const { data } = await db
      .from('review_replies')
      .select('id, review_id, reply_comment, created_at')
      .in('review_id', ids)
      .eq('status', 'active')
    replies = (data ?? []) as typeof replies
  }

  const replyMap = new Map(replies.map(r => [r.review_id, r]))

  const enriched = active.map((r: { id: string; user_id: string; reviewer_name: string | null }) => ({
    ...r,
    // Nome atual do perfil tem prioridade absoluta sobre o snapshot armazenado
    reviewer_name: profileMap.get(r.user_id) || r.reviewer_name || 'Usuário',
    reply: replyMap.get(r.id) ?? null,
  }))

  return NextResponse.json({ reviews: enriched, providerId: prov.id })
}

/* POST /api/reviews */
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const db = createAdmin()
  const { data: { user }, error: authErr } = await db.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const { provider_slug, rating, comment } = body

  if (!provider_slug || !rating || rating < 1 || rating > 5)
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  const { data: prov } = await db.from('providers').select('id, user_id').eq('slug', provider_slug).single()
  if (!prov) return NextResponse.json({ error: 'Prestador não encontrado' }, { status: 404 })

  if (prov.user_id === user.id)
    return NextResponse.json({ error: 'Você não pode avaliar seu próprio perfil' }, { status: 400 })

  // duplicate check
  const { data: existing } = await db
    .from('reviews')
    .select('id')
    .eq('provider_id', prov.id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (existing) return NextResponse.json({ error: 'Você já avaliou este profissional' }, { status: 409 })

  // Busca o nome atual do perfil — nunca usa email
  const { data: profile } = await db.from('profiles').select('full_name').eq('id', user.id).single()
  const reviewerName = (profile as { full_name?: string } | null)?.full_name || 'Usuário'

  const { error: insertErr } = await db.from('reviews').insert({
    provider_id: prov.id,
    user_id: user.id,
    reviewer_name: reviewerName,
    rating,
    comment: comment?.trim() || null,
    status: 'active',
  } as never)

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 201 })
}
