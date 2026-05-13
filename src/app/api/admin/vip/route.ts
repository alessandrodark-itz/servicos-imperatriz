import { NextResponse, NextRequest } from 'next/server'
import { createAdmin } from '@/lib/supabase'
import { requireAdmin, logAdminAction } from '@/lib/require-admin'

export async function POST(request: NextRequest) {
  const deny = requireAdmin(request)
  if (deny) return deny

  const body = await request.json()
  const { userId, action, days = 30, badgeType = 'vip' } = body

  if (!userId || !action) {
    return NextResponse.json({ error: 'userId e action são obrigatórios' }, { status: 400 })
  }

  const supabase = createAdmin()

  if (action === 'activate' || action === 'renew') {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)

    const { error } = await supabase
      .from('providers')
      .update({
        plan: 'vip',
        plan_expires_at: expiresAt.toISOString(),
        vip_badge_type: badgeType,
      } as any)
      .eq('user_id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await logAdminAction('vip_activate', { userId, days, badgeType, expiresAt: expiresAt.toISOString() }, request)

    return NextResponse.json({ ok: true, plan: 'vip', plan_expires_at: expiresAt.toISOString() })
  }

  if (action === 'deactivate') {
    const { error } = await supabase
      .from('providers')
      .update({ plan: 'free', plan_expires_at: null } as any)
      .eq('user_id', userId)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await logAdminAction('vip_deactivate', { userId }, request)

    return NextResponse.json({ ok: true, plan: 'free' })
  }

  return NextResponse.json({ error: 'action inválida' }, { status: 400 })
}
