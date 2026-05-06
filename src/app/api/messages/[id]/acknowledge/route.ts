import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } },
) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Support both Next.js 14 (sync params) and 15 (async params)
  const { id: messageId } = await Promise.resolve(context.params)
  if (!messageId) return NextResponse.json({ error: 'Missing message id' }, { status: 400 })

  const supabase = createAdmin()
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date().toISOString()
  const db = supabase as any

  const { data, error } = await db
    .from('user_message_receipts')
    .update({ acknowledged_at: now, viewed_at: now })
    .eq('message_id', messageId)
    .eq('user_id', user.id)
    .select('id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If no row was updated, the receipt doesn't exist — create it
  if (!data || data.length === 0) {
    await db.from('user_message_receipts').insert({
      message_id:      messageId,
      user_id:         user.id,
      delivered_at:    now,
      viewed_at:       now,
      acknowledged_at: now,
    })
  }

  return NextResponse.json({ ok: true })
}
