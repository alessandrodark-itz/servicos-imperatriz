import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Formato inválido. Use JPG, PNG ou WEBP' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const supabase = createAdmin()
    const BUCKET = 'ads-images'

    // Cria o bucket se não existir
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((b: { name: string }) => b.name === BUCKET)
    if (!bucketExists) {
      const { error: createErr } = await supabase.storage.createBucket(BUCKET, { public: true })
      if (createErr && createErr.message !== 'Bucket already exists') {
        return NextResponse.json({ error: `Erro ao criar bucket: ${createErr.message}` }, { status: 500 })
      }
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: file.type, upsert: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })
  } catch {
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
