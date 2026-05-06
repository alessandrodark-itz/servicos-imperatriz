import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

/* POST /api/reviews/[id]/report */
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const db = createAdmin()
  const { data: { user }, error: authErr } = await db.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id: reviewId } = await Promise.resolve(context.params)
  const { reason, details } = await req.json()
  if (!reason) return NextResponse.json({ error: 'Motivo obrigatório' }, { status: 400 })

  // não pode denunciar a própria avaliação
  const { data: review } = await db.from('reviews').select('user_id').eq('id', reviewId).single()
  if (!review) return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 })
  if (review.user_id === user.id)
    return NextResponse.json({ error: 'Você não pode denunciar sua própria avaliação' }, { status: 400 })

  // duplicata
  const { data: dup } = await db
    .from('review_reports')
    .select('id')
    .eq('reporter_user_id', user.id)
    .eq('target_type', 'review')
    .eq('target_id', reviewId)
    .maybeSingle()
  if (dup) return NextResponse.json({ error: 'Você já denunciou esta avaliação' }, { status: 409 })

  await db.from('review_reports').insert({
    reporter_user_id: user.id,
    target_type: 'review',
    target_id: reviewId,
    reason,
    details: details?.trim() || null,
    status: 'pending',
  } as never)

  return NextResponse.json({ ok: true })
}
