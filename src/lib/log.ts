import { createClient } from '@supabase/supabase-js'

type TipoLog =
  | 'login_sucesso'
  | 'login_falha'
  | 'login_bloqueado'
  | 'acesso_negado'
  | 'alteracao_pagamento'
  | 'acao_admin'
  | 'auto_confirm_bloqueado'

export async function registrarLog(
  tipo: TipoLog,
  descricao: string,
  opcoes?: { usuario_id?: string; ip?: string; dados?: Record<string, unknown> },
): Promise<void> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    await supabase.from('logs_seguranca').insert({
      tipo,
      descricao,
      usuario_id: opcoes?.usuario_id ?? null,
      ip:         opcoes?.ip         ?? null,
      dados:      opcoes?.dados      ?? null,
    })
  } catch {
    // log nunca deve quebrar a aplicação
  }
}
