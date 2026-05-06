import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const supabase = createAdmin()

  // registra o strike
  const { error: strikeErr } = await supabase.from('strikes').insert({
    review_id:   body.review_id ?? null,
    user_id:     body.user_id ?? null,
    reason:      body.reason,
    observation: body.observation ?? null,
  })
  if (strikeErr) return NextResponse.json({ error: strikeErr.message }, { status: 500 })

  // sinaliza a avaliação
  if (body.review_id) {
    await supabase.from('reviews').update({ flagged: true }).eq('id', body.review_id)
  }

  // envia mensagem de aviso ao usuário (se houver user_id)
  if (body.user_id) {
    await supabase.from('admin_messages').insert({
      title:          'Advertência recebida',
      body:           `Seu comentário recebeu um strike. Motivo: ${body.reason}.${body.observation ? ` Observação: ${body.observation}` : ''} Evite conteúdo inadequado para manter o acesso à plataforma.`,
      type:           'strike',
      target_user_id: body.user_id,
    })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
