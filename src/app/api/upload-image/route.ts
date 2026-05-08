import { NextRequest, NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

const ALLOWED = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const BUCKET = 'provider-gallery'

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const supabase = createAdmin()
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })

  let form: FormData
  try { form = await req.formData() }
  catch { return NextResponse.json({ error: 'Payload inválido' }, { status: 400 }) }

  const file = form.get('file') as File | null
  if (!file)                   return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'Formato inválido. Use JPG, PNG ou WEBP' }, { status: 400 })
  if (file.size > MAX_BYTES)   return NextResponse.json({ error: 'Arquivo muito grande. Máximo 10 MB' }, { status: 400 })

  try {
    // Auto-cria o bucket se ainda não existir
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some((b: { name: string }) => b.name === BUCKET)
    if (!exists) {
      const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: true })
      if (createErr && createErr.message !== 'Bucket already exists') {
        throw new Error(`Erro ao criar bucket: ${createErr.message}`)
      }
    }

    const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (uploadErr) throw new Error(uploadErr.message)

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(path)

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    console.error('[upload-image]', err)
    return NextResponse.json({ error: 'Falha no upload. Tente novamente.' }, { status: 500 })
  }
}
