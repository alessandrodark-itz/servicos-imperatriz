'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createBrowser } from '@/lib/supabase'
import {
  Camera, User, Phone, AlertCircle, CheckCircle,
  Loader2, ArrowLeft, Save, Calendar, MessageCircle, Shield, ScrollText,
} from 'lucide-react'
import TermsModal from '@/components/TermsModal'
import { CURRENT_TERMS_VERSION } from '@/lib/terms-config'

/* Comprime imagem no browser via Canvas (max 1200px, jpeg 85%) */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const blobUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(blobUrl)
      const MAX = 1200
      let { naturalWidth: w, naturalHeight: h } = img
      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX }
      if (h > MAX) { w = Math.round(w * MAX / h); h = MAX }
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], 'avatar.jpg', { type: 'image/jpeg' }) : file),
        'image/jpeg', 0.85,
      )
    }
    img.src = blobUrl
  })
}

function formatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (!d.length)     return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white ' +
  'placeholder:text-white/40 focus:border-[#7F77DD]/50 focus:bg-white/10 focus:outline-none transition-colors'

const inputIconCls =
  'w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white ' +
  'placeholder:text-white/40 focus:border-[#7F77DD]/50 focus:bg-white/10 focus:outline-none transition-colors'

export default function PerfilPage() {
  const router  = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [userId,        setUserId]        = useState<string | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [success,       setSuccess]       = useState(false)
  const [error,         setError]         = useState('')
  const [avatarUrl,     setAvatarUrl]     = useState<string | null>(null)
  const [avatarFile,    setAvatarFile]    = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null)
  const [termsDeclined, setTermsDeclined] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    age:       '',
    whatsapp:  '',
    phone:     '',
  })

  /* ── carregar perfil ── */
  useEffect(() => {
    async function load() {
      const supabase = createBrowser()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const uid = session.user.id
      setUserId(uid)

      // localStorage guard — survives page reloads, independent of DB columns
      const storageKey = `terms_cliente_${uid}_${CURRENT_TERMS_VERSION}`
      if (localStorage.getItem(storageKey) === 'true') {
        setTermsAccepted(true)
        // Still load profile data but skip the terms check
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase.from('profiles') as any)
          .select('full_name, phone, avatar_url, age, whatsapp')
          .eq('id', uid).single()
        if (data) {
          setForm({ full_name: data.full_name ?? '', age: data.age?.toString() ?? '', whatsapp: data.whatsapp ?? '', phone: data.phone ?? '' })
          setAvatarUrl(data.avatar_url ?? null)
        }
        setLoading(false)
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from('profiles') as any)
        .select('full_name, phone, avatar_url, age, whatsapp, terms_accepted, terms_version')
        .eq('id', uid)
        .single()

      if (data) {
        setForm({
          full_name: data.full_name  ?? '',
          age:       data.age?.toString() ?? '',
          whatsapp:  data.whatsapp   ?? '',
          phone:     data.phone      ?? '',
        })
        setAvatarUrl(data.avatar_url ?? null)

        const accepted        = data.terms_accepted === true
        const versionMatch    = data.terms_version === CURRENT_TERMS_VERSION
        const legacyAcceptance = accepted && !data.terms_version
        const fullyAccepted   = accepted && (versionMatch || legacyAcceptance)

        if (fullyAccepted) localStorage.setItem(storageKey, 'true')
        setTermsAccepted(fullyAccepted)
      } else {
        setTermsAccepted(false)
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleAcceptTerms() {
    if (!userId) return
    const storageKey = `terms_cliente_${userId}_${CURRENT_TERMS_VERSION}`
    localStorage.setItem(storageKey, 'true')
    try {
      const supabase = createBrowser()
      const now = new Date().toISOString()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('profiles') as any).update({
        terms_accepted: true, terms_accepted_at: now, terms_version: CURRENT_TERMS_VERSION,
      }).eq('id', userId)
    } catch { /* allow through */ }
    setTermsAccepted(true)
    setTermsDeclined(false)
  }

  function handleDeclineTerms() {
    setTermsDeclined(true)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.files?.[0]
    if (!raw) return
    if (!raw.type.startsWith('image/')) { setError('Selecione uma imagem válida.'); return }
    setError('')
    const file = raw.size > 1.5 * 1024 * 1024 ? await compressImage(raw) : raw
    if (file.size > 2 * 1024 * 1024) { setError('A imagem deve ter no máximo 2MB.'); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setError('')
    setSuccess(false)

    try {
      // Verifica unicidade do nome antes de salvar
      const nomeTrimmed = form.full_name.trim()
      if (nomeTrimmed) {
        const checkRes = await fetch(`/api/check-name?name=${encodeURIComponent(nomeTrimmed)}&exclude_id=${userId}`)
        const checkData = await checkRes.json()
        if (!checkData.available) {
          setError(checkData.reason || 'Este nome já está em uso por outro usuário.')
          setSaving(false)
          return
        }
      }

      const supabase = createBrowser()
      let newAvatarUrl = avatarUrl

      if (avatarFile) {
        const ext  = avatarFile.name.split('.').pop() ?? 'jpg'
        const path = `${userId}/avatar.${ext}`

        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true })

        if (uploadErr) throw new Error('Erro ao enviar foto: ' + uploadErr.message)

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(path)

        newAvatarUrl = publicUrl + '?t=' + Date.now()
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateErr } = await (supabase.from('profiles') as any)
        .upsert({
          id:         userId,
          full_name:  form.full_name  || null,
          phone:      form.phone      || null,
          age:        form.age        ? parseInt(form.age) : null,
          whatsapp:   form.whatsapp   || null,
          avatar_url: newAvatarUrl,
        })

      if (updateErr) throw new Error(updateErr.message)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: fresh } = await (supabase.from('profiles') as any)
        .select('full_name, phone, avatar_url, age, whatsapp')
        .eq('id', userId)
        .single()

      if (fresh) {
        setForm({
          full_name: fresh.full_name  ?? '',
          age:       fresh.age?.toString() ?? '',
          whatsapp:  fresh.whatsapp   ?? '',
          phone:     fresh.phone      ?? '',
        })
        setAvatarUrl(fresh.avatar_url ?? null)
      } else {
        setAvatarUrl(newAvatarUrl)
      }

      setAvatarFile(null)
      window.dispatchEvent(new Event('profileUpdated'))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil.')
    } finally {
      setSaving(false)
    }
  }

  const avatarSrc = avatarPreview ?? avatarUrl
  const initials  = (form.full_name || 'U').charAt(0).toUpperCase()

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#7F77DD]" />
        </main>
        <Footer />
      </div>
    )
  }

  if (termsDeclined) return (
    <div className="flex min-h-screen flex-col" style={{ background: '#06001a' }}>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="relative overflow-hidden rounded-3xl border border-red-500/20 p-8"
            style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(10,2,28,0.9) 100%)' }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
              <Shield className="h-7 w-7 text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-white">Conta Inativa</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Seu acesso foi temporariamente limitado porque a aceitação dos Termos Legais é obrigatória para continuar utilizando nossa plataforma.
            </p>
            <button
              onClick={() => setTermsDeclined(false)}
              className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7b2ff7 0%, #8A5CFF 50%, #9b5cff 100%)', boxShadow: '0 0 30px rgba(138,92,255,0.4)' }}
            >
              <ScrollText className="h-4 w-4" />
              Revisar e Aceitar Termos
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Terms modal for clients */}
      {termsAccepted === false && !termsDeclined && (
        <TermsModal userType="cliente" onAccept={handleAcceptTerms} onDecline={handleDeclineTerms} />
      )}

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />

            <div className="relative">
              <h1 className="mb-8 text-2xl font-bold text-white">Meu Perfil</h1>

              {/* Avatar */}
              <div className="mb-8 flex flex-col items-center">
                <div className="relative">
                  <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-[#7F77DD]/50 shadow-[0_0_24px_rgba(127,119,221,0.25)]">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="Foto de perfil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#7F77DD] to-fuchsia-500 text-4xl font-bold text-white">
                        {initials}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#7F77DD] shadow-lg transition-all hover:bg-[#9089e8] hover:scale-110"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <p className="mt-3 text-xs text-white/40">
                  Clique na câmera · JPG, PNG ou WEBP · máx 2MB
                </p>
              </div>

              {/* Feedback */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              {success && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-400" />
                  <p className="text-sm text-green-400">Perfil atualizado com sucesso!</p>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">

                {/* Nome */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                      placeholder="Seu nome completo"
                      className={inputIconCls}
                    />
                  </div>
                </div>

                {/* Idade */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    Idade
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={form.age}
                      onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                      placeholder="Sua idade"
                      className={inputIconCls}
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    WhatsApp
                    <span className="ml-1.5 text-xs font-normal text-green-400">
                      aparece no perfil público
                    </span>
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={e => setForm(f => ({ ...f, whatsapp: formatPhone(e.target.value) }))}
                      placeholder="(99) 99999-9999"
                      className={inputIconCls}
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    Telefone{' '}
                    <span className="font-normal text-white/40">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: formatPhone(e.target.value) }))}
                      placeholder="(99) 99999-9999"
                      className={inputIconCls}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-2 w-full rounded-xl bg-[#7F77DD] py-3.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8] hover:shadow-[0_0_30px_rgba(127,119,221,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? <span key="saving" className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />Salvando...</span>
                    : <span key="idle"   className="flex items-center justify-center gap-2"><Save className="h-5 w-5" />Salvar perfil</span>
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
