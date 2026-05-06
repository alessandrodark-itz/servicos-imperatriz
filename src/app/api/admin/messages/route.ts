import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdmin()
  const db = supabase as any

  const { data, error } = await db
    .from('admin_messages')
    .select('id, title, body, type, priority, requires_acknowledgment, group_target, target_user_id, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = data ?? []

  const userIds = [...new Set(rows.filter((m: any) => m.target_user_id).map((m: any) => m.target_user_id as string))]
  let nameMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await db.from('profiles').select('id, full_name').in('id', userIds)
    nameMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p.full_name ?? '']))
  }

  const messageIds = rows.map((m: any) => m.id)
  let receiptStats: Record<string, { total: number; acknowledged: number; overdue: number }> = {}
  if (messageIds.length > 0) {
    const { data: receipts } = await db
      .from('user_message_receipts')
      .select('message_id, acknowledged_at, acknowledgment_deadline')
      .in('message_id', messageIds)
    const now = new Date()
    for (const r of receipts ?? []) {
      if (!receiptStats[r.message_id]) receiptStats[r.message_id] = { total: 0, acknowledged: 0, overdue: 0 }
      receiptStats[r.message_id].total++
      if (r.acknowledged_at) receiptStats[r.message_id].acknowledged++
      if (!r.acknowledged_at && r.acknowledgment_deadline && new Date(r.acknowledgment_deadline) < now) {
        receiptStats[r.message_id].overdue++
      }
    }
  }

  const enriched = rows.map((m: any) => ({
    ...m,
    target_name: m.target_user_id ? (nameMap[m.target_user_id] ?? null) : null,
    receipt_stats: receiptStats[m.id] ?? { total: 0, acknowledged: 0, overdue: 0 },
  }))

  return NextResponse.json(enriched)
}

export async function POST(req: Request) {
  const body = await req.json()
  const supabase = createAdmin()
  const db = supabase as any

  const { data: message, error } = await db
    .from('admin_messages')
    .insert({
      title:                   body.title,
      body:                    body.body,
      type:                    body.type ?? 'info',
      priority:                body.priority ?? 'medium',
      requires_acknowledgment: body.requires_acknowledgment ?? false,
      target_user_id:          body.target_user_id || null,
      group_target:            body.group_target || null,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Calcula o deadline se informado em horas (0 = imediato = 1 min)
  let deadline: string | null = null
  if (body.requires_acknowledgment && body.acknowledgment_deadline_hours != null) {
    const hours = Number(body.acknowledgment_deadline_hours)
    const ms = hours === 0 ? 60_000 : hours * 3_600_000
    deadline = new Date(Date.now() + ms).toISOString()
  }

  // Resolve destinatários
  let targetUserIds: string[] = []
  if (body.target_user_id) {
    targetUserIds = [body.target_user_id]
  } else {
    let q = db.from('profiles').select('id')
    if (body.group_target === 'prestador' || body.group_target === 'cliente') {
      q = q.eq('user_type', body.group_target)
    }
    const { data: users } = await q
    targetUserIds = (users ?? []).map((u: any) => u.id)
  }

  let receiptError: string | null = null
  if (targetUserIds.length > 0) {
    const receipts = targetUserIds.map((uid: string) => ({
      message_id:              message.id,
      user_id:                 uid,
      delivered_at:            new Date().toISOString(),
      acknowledgment_deadline: deadline,
    }))
    const { error: rErr } = await db.from('user_message_receipts').insert(receipts)
    if (rErr) receiptError = rErr.message
  }

  return NextResponse.json({
    ok: true,
    id: message.id,
    recipients: targetUserIds.length,
    deadline,
    receipt_error: receiptError,
  }, { status: 201 })
}
