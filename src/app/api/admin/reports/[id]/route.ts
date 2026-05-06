import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

/* PATCH /api/admin/reports/[id]
   body: { action: 'ignore' | 'remove_content' | 'warn_user' | 'suspend_user', notes?: string, user_id?: string }
*/
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await Promise.resolve(context.params)
  const body = await req.json()
  const { action, notes, user_id, warn_message } = body

  if (!action) return NextResponse.json({ error: 'action obrigatório' }, { status: 400 })

  const db = createAdmin()

  const { data: report } = await db.from('review_reports').select('*').eq('id', id).single()
  if (!report) return NextResponse.json({ error: 'Denúncia não encontrada' }, { status: 404 })

  const now = new Date().toISOString()

  // Ação de remoção de conteúdo
  if (action === 'remove_content') {
    if (report.target_type === 'review') {
      await db.from('reviews').update({ status: 'removed' } as never).eq('id', report.target_id)
    } else {
      await db.from('review_replies').update({ status: 'removed' } as never).eq('id', report.target_id)
    }
  }

  // Advertência / suspensão — envia mensagem admin ao usuário
  if ((action === 'warn_user' || action === 'suspend_user') && user_id) {
    const msgBody = action === 'warn_user'
      ? (warn_message || 'Você recebeu uma advertência oficial da plataforma referente à sua conduta nas avaliações.')
      : (warn_message || 'Sua conta foi suspensa temporariamente pela administração da plataforma devido a violações das nossas políticas.')

    // cria mensagem admin
    const { data: msg } = await db.from('admin_messages').insert({
      title: action === 'warn_user' ? '⚠️ Advertência Oficial' : '🚫 Conta Suspensa',
      body: msgBody,
      type: action === 'warn_user' ? 'warning' : 'critical',
      priority: 'high',
      requires_acknowledgment: true,
      group_target: null,
      target_user_id: user_id,
    } as never).select('id').single()

    // cria receipt para o usuário
    if (msg) {
      await db.from('user_message_receipts').insert({
        message_id: msg.id,
        user_id,
        delivered_at: now,
      } as never)
    }
  }

  // Atualiza status do report
  await db.from('review_reports').update({
    status: action === 'ignore' ? 'resolved' : 'action_taken',
    admin_action: action,
    admin_notes: notes || null,
    resolved_at: now,
  } as never).eq('id', id)

  return NextResponse.json({ ok: true })
}
