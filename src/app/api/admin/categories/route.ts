import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function GET() {
  const supabase = createAdmin()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const body = await req.json()
  const supabase = createAdmin()

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name:        body.name,
      slug:        body.slug,
      icon:        body.icon ?? '🔧',
      description: body.description ?? null,
      color:       body.color ?? null,
      active:      body.active ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
