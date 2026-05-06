import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

/* POST /api/account/compliance
   Verifica se o usuário tem comunicados vencidos não confirmados.
   Se sim, marca a conta como suspensa.
   Retorna: { suspended, overdue_receipt }
*/
export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ suspended: false })

  const db = createAdmin()
  const { data: { user }, error: authError } = await db.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ suspended: false })

  const now = new Date().toISOString()

  // Busca receipts vencidos (prazo expirou, não confirmado, mensagem exige confirmação)
  const { data: overdueReceipts } = await (db as any)
    .from('user_message_receipts')
    .select(`
      id,
      message_id,
      acknowledgment_deadline,
      acknowledged_at,
      admin_messages (
        id, title, body, type, priority, requires_acknowledgment, created_at
      )
    `)
    .eq('user_id', user.id)
    .is('acknowledged_at', null)
    .lt('acknowledgment_deadline', now)
    .not('acknowledgment_deadline', 'is', null)

  const overdue = (overdueReceipts ?? []).filter(
    (r: any) => r.admin_messages?.requires_acknowledgment
  )

  if (overdue.length === 0) {
    // Garante que a conta não está suspensa (pode ter sido resolvida)
    await (db as any)
      .from('profiles')
      .update({ suspended_pending_ack: false } as never)
      .eq('id', user.id)
    return NextResponse.json({ suspended: false })
  }

  // Marca conta como suspensa
  await (db as any)
    .from('profiles')
    .update({ suspended_pending_ack: true } as never)
    .eq('id', user.id)

  return NextResponse.json({
    suspended: true,
    overdue_count: overdue.length,
    overdue_receipt: overdue[0], // o mais urgente para mostrar ao usuário
  })
}
