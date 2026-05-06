import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

interface Body {
  client_email: string
  client_name: string
  rating: number
  comment?: string
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json()
    const supabase = createAdmin()

    // pega o token de auth do header
    const auth = request.headers.get('authorization') ?? ''
    const token = auth.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    // identifica o prestador logado
    const { data: { user: providerUser }, error: authErr } = await supabase.auth.getUser(token)
    if (authErr || !providerUser) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    // busca o provider pelo user_id do prestador logado
    const { data: provider } = await supabase
      .from('providers')
      .select('id, name')
      .eq('user_id', providerUser.id)
      .single()

    if (!provider) return NextResponse.json({ error: 'Perfil de prestador não encontrado' }, { status: 403 })

    // busca o cliente pelo email na tabela users
    const { data: clientUsers } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('email', body.client_email.toLowerCase().trim())
      .limit(1)

    const client = clientUsers?.[0]
    if (!client) return NextResponse.json({ error: 'Cliente não encontrado na plataforma' }, { status: 404 })

    // verifica se já avaliou esse cliente
    const { data: existing } = await supabase
      .from('client_reviews')
      .select('id')
      .eq('provider_id', provider.id)
      .eq('user_id', client.id)
      .single()

    if (existing) return NextResponse.json({ error: 'Você já avaliou este cliente' }, { status: 409 })

    // insere a avaliação
    const { data, error } = await supabase
      .from('client_reviews')
      .insert({
        provider_id: provider.id,
        provider_name: provider.name,
        user_id: client.id,
        client_name: client.full_name ?? body.client_name,
        rating: body.rating,
        comment: body.comment?.trim() || null,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json([], { status: 200 })

  const supabase = createAdmin()
  const { data } = await supabase
    .from('client_reviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}
