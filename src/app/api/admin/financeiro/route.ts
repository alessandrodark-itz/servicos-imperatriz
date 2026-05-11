import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdmin()

  // Pagamentos registrados
  const { data: payments, error: paymentsErr } = await supabase
    .from('vip_payments')
    .select('*')
    .order('paid_at', { ascending: false })

  // Prestadores VIP ativos (plano vip/premium)
  const { data: vipProviders } = await (supabase.from('providers') as any)
    .select('id, name, slug, plan, plan_expires_at, vip_badge_type, user_id, created_at')
    .in('plan', ['vip', 'premium'])
    .order('plan_expires_at', { ascending: false })

  const tableExists = !paymentsErr || !paymentsErr.message.includes('does not exist')

  const paymentList = payments ?? []
  const totalCents  = paymentList.reduce((acc: number, p: any) => acc + (p.amount_cents ?? 799), 0)
  const totalBrl    = (totalCents / 100).toFixed(2)

  return NextResponse.json({
    tableExists,
    payments: paymentList,
    vipProviders: vipProviders ?? [],
    totalCents,
    totalBrl,
    totalTransactions: paymentList.length,
  })
}
