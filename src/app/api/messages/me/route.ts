import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdmin()
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = supabase as any
  const { data, error } = await db
    .from('user_message_receipts')
    .select(`
      id,
      message_id,
      delivered_at,
      viewed_at,
      acknowledged_at,
      acknowledgment_deadline,
      admin_messages (
        id, title, body, type, priority, requires_acknowledgment, created_at
      )
    `)
    .eq('user_id', user.id)
    .is('acknowledged_at', null)
    .order('delivered_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}
