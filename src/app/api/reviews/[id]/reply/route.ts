import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

/* POST /api/reviews/[id]/reply — prestador responde uma avaliação */
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const db = createAdmin()
  const { data: { user }, error: authErr } = await db.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id: reviewId } = await Promise.resolve(context.params)
  const body = await req.json()
  const reply_comment: string = (body.reply_comment ?? '').trim()

  if (!reply_comment) return NextResponse.json({ error: 'Resposta obrigatória' }, { status: 400 })
  if (reply_comment.length > 1000) return NextResponse.json({ error: 'Resposta muito longa (máx 1000)' }, { status: 400 })

  // busca a avaliação para verificar se o user é o prestador
  const { data: review } = await db.from('reviews').select('provider_id').eq('id', reviewId).single()
  if (!review) return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 })

  const { data: prov } = await db.from('providers').select('user_id').eq('id', review.provider_id).single()
  if (prov?.user_id !== user.id)
    return NextResponse.json({ error: 'Apenas o prestador pode responder esta avaliação' }, { status: 403 })

  // upsert — uma resposta por avaliação
  const { data: existing } = await db
    .from('review_replies')
    .select('id')
    .eq('review_id', reviewId)
    .maybeSingle()

  if (existing) {
    await db.from('review_replies')
      .update({ reply_comment, updated_at: new Date().toISOString() } as never)
      .eq('id', existing.id)
  } else {
    await db.from('review_replies').insert({
      review_id: reviewId,
      provider_user_id: user.id,
      reply_comment,
      status: 'active',
    } as never)
  }

  return NextResponse.json({ ok: true })
}

/* DELETE /api/reviews/[id]/reply — remove resposta */
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const db = createAdmin()
  const { data: { user }, error: authErr } = await db.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id: reviewId } = await Promise.resolve(context.params)

  const { data: reply } = await db
    .from('review_replies')
    .select('id, provider_user_id')
    .eq('review_id', reviewId)
    .maybeSingle()

  if (!reply) return NextResponse.json({ error: 'Resposta não encontrada' }, { status: 404 })
  if (reply.provider_user_id !== user.id)
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  await db.from('review_replies').delete().eq('id', reply.id)
  return NextResponse.json({ ok: true })
}
