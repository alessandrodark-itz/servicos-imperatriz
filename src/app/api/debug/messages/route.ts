import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

// Diagnóstico: GET /api/debug/messages?token=Bearer_xxx
// Retorna o estado atual das tabelas para depuração
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? req.headers.get('authorization')?.replace('Bearer ', '')
  const supabase = createAdmin()
  const db = supabase as any
  const result: Record<string, unknown> = {}

  // 1. Verifica se a tabela existe
  const { error: tableErr } = await db
    .from('user_message_receipts')
    .select('id')
    .limit(1)
  result.table_exists = !tableErr
  result.table_error  = tableErr?.message ?? null

  // 2. Total de mensagens
  const { count: msgCount } = await db
    .from('admin_messages')
    .select('*', { count: 'exact', head: true })
  result.total_messages = msgCount

  // 3. Total de recibos
  const { count: recCount } = await db
    .from('user_message_receipts')
    .select('*', { count: 'exact', head: true })
  result.total_receipts = recCount

  // 4. Se token fornecido, verifica recibos do usuário
  if (token) {
    const { data: { user } } = await supabase.auth.getUser(token)
    result.user_id = user?.id ?? null
    if (user) {
      const { data: receipts, error: rErr } = await db
        .from('user_message_receipts')
        .select('id, message_id, delivered_at, acknowledged_at')
        .eq('user_id', user.id)
      result.user_receipts = receipts
      result.user_receipts_error = rErr?.message ?? null
    }
  }

  return NextResponse.json(result, { status: 200 })
}
