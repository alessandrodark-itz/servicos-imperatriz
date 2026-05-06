import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

/* POST /api/reviews/replies/[id]/report */
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const db = createAdmin()
  const { data: { user }, error: authErr } = await db.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id: replyId } = await Promise.resolve(context.params)
  const { reason, details } = await req.json()
  if (!reason) return NextResponse.json({ error: 'Motivo obrigatório' }, { status: 400 })

  // duplicata
  const { data: dup } = await db
    .from('review_reports')
    .select('id')
    .eq('reporter_user_id', user.id)
    .eq('target_type', 'reply')
    .eq('target_id', replyId)
    .maybeSingle()
  if (dup) return NextResponse.json({ error: 'Você já denunciou esta resposta' }, { status: 409 })

  await db.from('review_reports').insert({
    reporter_user_id: user.id,
    target_type: 'reply',
    target_id: replyId,
    reason,
    details: details?.trim() || null,
    status: 'pending',
  } as never)

  return NextResponse.json({ ok: true })
}
