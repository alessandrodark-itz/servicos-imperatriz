import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'
import { uploadBuffer } from '@/lib/cloudinary'

const ALLOWED = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { data: { user }, error: authErr } = await createAdmin().auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })

  let form: FormData
  try { form = await req.formData() }
  catch { return NextResponse.json({ error: 'Payload inválido' }, { status: 400 }) }

  const file = form.get('file') as File | null
  if (!file)                  return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'Formato inválido. Use JPG, PNG ou WEBP' }, { status: 400 })
  if (file.size > MAX_BYTES)  return NextResponse.json({ error: 'Arquivo muito grande. Máximo 10 MB' }, { status: 400 })

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadBuffer(buffer, `providers/${user.id}`)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[upload-image]', err)
    return NextResponse.json({ error: 'Falha no upload. Tente novamente.' }, { status: 500 })
  }
}
