import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log('[PagBank webhook]', JSON.stringify(data))

    const { reference_id, charges } = data

    // Só processa pedidos VIP gerados por este sistema
    if (!reference_id?.startsWith('VIP_')) {
      return NextResponse.json({ ok: true })
    }

    // Verifica se alguma cobrança foi paga
    const paidCharge = (charges ?? []).find(
      (c: { status: string }) => c.status === 'PAID',
    )
    if (!paidCharge) {
      return NextResponse.json({ ok: true })
    }

    // Extrai userId: "VIP_{userId}_{timestamp}"
    // UUID usa "-" internamente, portanto split("_") retorna exatamente 3 partes
    const parts = (reference_id as string).split('_')
    const userId = parts[1]
    if (!userId) {
      console.error('[webhook] userId não encontrado em reference_id:', reference_id)
      return NextResponse.json({ ok: true })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    // Busca dados do prestador para registrar no histórico
    const { data: providerData } = await supabase
      .from('providers')
      .select('name, slug')
      .eq('user_id', userId)
      .single()

    // Ativa VIP no prestador
    const { error } = await supabase
      .from('providers')
      .update({ plan: 'vip', plan_expires_at: planExpiresAt })
      .eq('user_id', userId)

    if (error) {
      console.error('[webhook] Supabase update error:', error)
    } else {
      console.log(`[webhook] VIP ativado para userId=${userId} até ${planExpiresAt}`)

      // Registra no histórico financeiro (ignora erro se tabela não existir)
      const amountCents = paidCharge?.amount?.value ?? paidCharge?.amount?.summary?.paid ?? 799
      await supabase.from('vip_payments').insert({
        user_id:        userId,
        provider_name:  providerData?.name ?? null,
        provider_slug:  providerData?.slug ?? null,
        amount_cents:   amountCents,
        reference_id:   reference_id,
        paid_at:        new Date().toISOString(),
        plan_expires_at: planExpiresAt,
      }).then(({ error: pe }) => {
        if (pe) console.warn('[webhook] vip_payments insert skipped:', pe.message)
      })
    }

    return NextResponse.json({ ok: true })

  } catch (err) {
    // Sempre retorna 200 para o PagBank não reenviar indefinidamente
    console.error('[webhook] erro:', err)
    return NextResponse.json({ ok: true })
  }
}
