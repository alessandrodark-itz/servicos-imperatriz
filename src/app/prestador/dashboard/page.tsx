'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createBrowser } from '@/lib/supabase'
import { categories } from '@/lib/mock-data'
import {
  User, Phone, MapPin, FileText, Briefcase,
  Plus, X, Save, Loader2, CheckCircle, AlertCircle,
  ExternalLink, MessageCircle, Image as ImageIcon,
  LayoutDashboard, Eye, EyeOff, Star, Shield, Sparkles, CheckCircle2, ScrollText, Award, Camera,
} from 'lucide-react'
import TermsModal from '@/components/TermsModal'
import EmblemasSelector from '@/components/EmblemasSelector'
import ImageUpload from '@/components/ImageUpload'
import { CURRENT_TERMS_VERSION } from '@/lib/terms-config'

/* ── helpers ─────────────────────────────────────────── */
function formatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (!d.length)     return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}
function slug(name: string) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/* ── types ───────────────────────────────────────────── */
type Tab = 'perfil' | 'categorias' | 'servicos' | 'contato' | 'capa' | 'emblemas'
interface PData {
  name: string; description: string; location: string
  phone: string; whatsapp: string
  cover_url: string | null
  images: string[]
  services: string[]
  categories: string[]; slug: string
  cover_position: string
}

const POSITIONS: [string, string, string][] = [
  ['top left',    '↖', 'Topo Esq'],
  ['top center',  '↑', 'Topo'],
  ['top right',   '↗', 'Topo Dir'],
  ['center left', '←', 'Centro Esq'],
  ['center',      '·', 'Centro'],
  ['center right','→', 'Centro Dir'],
  ['bottom left', '↙', 'Base Esq'],
  ['bottom center','↓','Base'],
  ['bottom right','↘', 'Base Dir'],
]

/* ── styles ──────────────────────────────────────────── */
const inp  = 'w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/35 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none transition-colors'
const inpI = 'w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none transition-colors'

/* ── TABS ─────────────────────────────────────────────── */
const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'perfil',     label: 'Perfil',       Icon: User        },
  { id: 'categorias', label: 'Categorias',   Icon: Briefcase   },
  { id: 'servicos',   label: 'Serviços',     Icon: CheckCircle },
  { id: 'contato',    label: 'Contato',      Icon: Phone       },
  { id: 'capa',       label: 'Fotos',        Icon: ImageIcon   },
  { id: 'emblemas',   label: 'Emblemas',     Icon: Award       },
]

/* ══════════ PREVIEW CARD ══════════════════════════════ */
function Preview({ data, avatarUrl }: { data: PData; avatarUrl: string | null }) {
  const cover    = data.images[0] ?? null
  const catNames = data.categories.map(id => categories.find(c => c.id === id)).filter(Boolean)
  const initials = (data.name || 'P').charAt(0).toUpperCase()
  const waNum    = data.whatsapp.replace(/\D/g, '')
  const imgCount = data.images.filter(Boolean).length

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d1a] text-left shadow-2xl">
      {/* Banner */}
      <div className="relative h-32 w-full bg-gradient-to-br from-violet-900/70 to-fuchsia-900/40">
        {cover
          ? <img src={cover} alt="" className="h-full w-full object-cover opacity-80" style={{ objectPosition: data.cover_position }} />
          : <div className="flex h-full items-center justify-center"><Camera className="h-8 w-8 text-white/15" /></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-[#0d0d1a]/30 to-transparent" />
        {imgCount > 1 && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white/70 backdrop-blur-sm">
            <ImageIcon className="h-2.5 w-2.5" />{imgCount} fotos
          </div>
        )}
        <div className="absolute -bottom-7 left-4">
          <div className="h-14 w-14 overflow-hidden rounded-2xl border-2 border-[#0d0d1a] shadow-xl">
            {avatarUrl
              ? <img src={avatarUrl} alt={data.name} className="h-full w-full object-cover" />
              : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#7F77DD] to-fuchsia-500 text-xl font-bold text-white">{initials}</div>
            }
          </div>
        </div>
      </div>

      <div className="px-4 pb-5 pt-10">
        <h3 className="truncate text-base font-bold text-white">
          {data.name || <span className="italic text-white/30">Nome do negócio</span>}
        </h3>

        {catNames.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {catNames.slice(0,3).map(cat => (
              <span key={cat!.id} className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
                {cat!.icon} {cat!.name}
              </span>
            ))}
            {catNames.length > 3 && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/40">+{catNames.length - 3}</span>
            )}
          </div>
        ) : (
          <p className="mt-1 text-xs italic text-white/25">Selecione categorias →</p>
        )}

        {data.location && (
          <div className="mt-2 flex items-center gap-1 text-xs text-white/40">
            <MapPin className="h-3 w-3" />{data.location}
          </div>
        )}

        <div className="mt-3 flex gap-2">
          {data.phone
            ? <div className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-violet-600/80 py-2 text-xs font-semibold text-white"><Phone className="h-3.5 w-3.5" />Ligar</div>
            : null}
          {waNum
            ? <div className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-green-600/80 py-2 text-xs font-semibold text-white"><MessageCircle className="h-3.5 w-3.5" />WhatsApp</div>
            : null}
          {!data.phone && !waNum && (
            <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 py-2 text-xs text-white/25">
              Adicione contato na aba Contato
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-around rounded-xl bg-white/5 py-2.5">
          <div className="flex items-center gap-1 text-xs text-white/50"><Star className="h-3 w-3 text-yellow-400" />5.0</div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1 text-xs text-white/50"><Shield className="h-3 w-3 text-green-400" />Verificado</div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1 text-xs text-white/50"><Eye className="h-3 w-3 text-violet-400" />Ativo</div>
        </div>

        {data.description
          ? <p className="mt-3 text-xs leading-relaxed text-white/65 line-clamp-3">{data.description}</p>
          : <div className="mt-3 rounded-lg border border-dashed border-white/10 p-2.5 text-center text-xs italic text-white/25">Descrição aparece aqui</div>
        }

        {data.services.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/35">Serviços</p>
            <div className="space-y-1">
              {data.services.slice(0,5).map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/65">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#7F77DD]" />{s}
                </div>
              ))}
              {data.services.length > 5 && <p className="text-xs text-white/30">+{data.services.length - 5} serviços</p>}
            </div>
          </div>
        )}

        {(data.phone || data.whatsapp || data.location) && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 space-y-1.5">
            {data.phone    && <div className="flex items-center gap-2 text-xs text-white/60"><Phone className="h-3 w-3 text-violet-400" />{data.phone}</div>}
            {data.whatsapp && <div className="flex items-center gap-2 text-xs text-green-400"><MessageCircle className="h-3 w-3" />WhatsApp disponível</div>}
            {data.location && <div className="flex items-center gap-2 text-xs text-white/60"><MapPin className="h-3 w-3 text-fuchsia-400" />{data.location}</div>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════ COMPLETION BAR ════════════════════════════ */
function Completion({ data }: { data: PData }) {
  const hasImages = data.images.filter(Boolean).length > 0
  const checks = [
    !!data.name, data.categories.length > 0, !!data.location,
    !!data.description, !!data.phone || !!data.whatsapp,
    data.services.length > 0, hasImages,
  ]
  const done = checks.filter(Boolean).length
  const pct  = Math.round((done / checks.length) * 100)
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <Sparkles className="h-4 w-4 text-violet-400" />
          Completude do perfil
        </div>
        <span className={`text-sm font-bold ${pct === 100 ? 'text-green-400' : pct >= 75 ? 'text-yellow-400' : 'text-white/50'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ${pct < 40 ? 'bg-red-500' : pct < 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct < 100 && (
        <p className="mt-2 text-xs text-white/35">
          {!data.name                                && '· Nome '}
          {data.categories.length === 0             && '· Categorias '}
          {!hasImages                               && '· Foto de capa '}
          {!data.description                         && '· Descrição '}
          {data.services.length === 0               && '· Serviços '}
          {!data.phone && !data.whatsapp             && '· Contato '}
        </p>
      )}
    </div>
  )
}

/* ══════════ FIELD WRAPPER ═════════════════════════════ */
function Field({ label, tip, children }: { label: string; tip?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-white/80">{label}</label>
      {tip && <p className="mb-2 text-xs text-white/35">{tip}</p>}
      {children}
    </div>
  )
}

/* ══════════ MAIN PAGE ═════════════════════════════════ */
export default function PrestadorDashboard() {
  const router = useRouter()

  const [userId,        setUserId]        = useState<string | null>(null)
  const [avatarUrl,     setAvatarUrl]     = useState<string | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [success,       setSuccess]       = useState(false)
  const [error,         setError]         = useState('')
  const [tab,           setTab]           = useState<Tab>('perfil')
  const [newSvc,        setNewSvc]        = useState('')
  const [showPrev,      setShowPrev]      = useState(false)
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null)
  const [termsDeclined, setTermsDeclined] = useState(false)

  const [data, setData] = useState<PData>({
    name: '', description: '', location: '',
    phone: '', whatsapp: '', cover_url: null,
    images: [], services: [], categories: [], slug: '',
    cover_position: 'center',
  })

  /* ── load ── */
  const load = useCallback(async () => {
    try {
      const supabase = createBrowser()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUserId(session.user.id)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any

      // Busca perfil e registro de prestador em paralelo
      const [{ data: profileData }, { data: provider }] = await Promise.all([
        db.from('profiles').select('user_type, avatar_url').eq('id', session.user.id).single(),
        db.from('providers').select('*').eq('user_id', session.user.id).single(),
      ])

      setAvatarUrl(profileData?.avatar_url ?? null)
      const userType = profileData?.user_type ?? session.user.user_metadata?.user_type
      // Só redireciona para /perfil se for cliente E não tiver registro de prestador
      if (userType === 'cliente' && !provider) { router.push('/perfil'); return }

      if (provider) {
        const rawImgs: string[] = (provider.images ?? []).filter(Boolean)
        const savedImages: string[] = rawImgs.length > 0 ? rawImgs : (provider.cover_url ? [provider.cover_url] : [])
        setData({
          name:           provider.name           ?? '',
          description:    provider.description    ?? '',
          location:       provider.location       ?? '',
          phone:          provider.phone          ?? '',
          whatsapp:       provider.whatsapp       ?? '',
          cover_url:      provider.cover_url      ?? null,
          images:         savedImages,
          services:       provider.services       ?? [],
          categories:     provider.categories     ?? (provider.category_id ? [provider.category_id] : []),
          slug:           provider.slug           ?? '',
          cover_position: provider.cover_position ?? 'center',
        })
        const accepted         = provider.terms_accepted === true
        const legacyAcceptance = accepted && !provider.terms_version
        const versionMatch     = provider.terms_version === CURRENT_TERMS_VERSION

        if (legacyAcceptance) {
          // Silently stamp current version for legacy records
          await db.from('providers').update({
            terms_version: CURRENT_TERMS_VERSION,
          }).eq('user_id', session.user.id)
        }

        setTermsAccepted(accepted && (versionMatch || legacyAcceptance))
      } else {
        const name = session.user.user_metadata?.full_name ?? ''
        setData(d => ({ ...d, name }))
        setTermsAccepted(false)
      }
    } catch (err) {
      setError('Erro ao carregar painel. Verifique sua conexão e recarregue a página.')
      console.error('[dashboard] load error:', err)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { load() }, [load])

  /* ── terms handlers ── */
  async function handleAcceptTerms() {
    if (!userId) return
    try {
      const supabase = createBrowser()
      const db = supabase as any // eslint-disable-line @typescript-eslint/no-explicit-any
      const now = new Date().toISOString()
      const { data: existing } = await db.from('providers').select('id').eq('user_id', userId).single()
      if (existing) {
        await db.from('providers').update({
          terms_accepted: true, terms_accepted_at: now, terms_version: '1.0',
        }).eq('user_id', userId)
      }
    } catch { /* allow through */ }
    setTermsAccepted(true)
    setTermsDeclined(false)
  }

  function handleDeclineTerms() {
    setTermsDeclined(true)
  }

  /* ── category toggle ── */
  function toggleCat(id: string) {
    setData(d => ({
      ...d,
      categories: d.categories.includes(id)
        ? d.categories.filter(c => c !== id)
        : [...d.categories, id],
    }))
  }

  /* ── services ── */
  function addSvc() {
    const s = newSvc.trim()
    if (!s || data.services.includes(s)) return
    setData(d => ({ ...d, services: [...d.services, s] }))
    setNewSvc('')
  }
  function removeSvc(i: number) {
    setData(d => ({ ...d, services: d.services.filter((_, idx) => idx !== i) }))
  }

  /* ── save ── */
  async function handleSave() {
    if (!userId) return
    if (!data.name.trim()) { setError('Preencha o nome do negócio antes de salvar.'); setTab('perfil'); return }
    if (data.categories.length === 0) { setError('Selecione pelo menos uma categoria antes de salvar.'); setTab('categorias'); return }
    setSaving(true); setError(''); setSuccess(false)

    try {
      const supabase = createBrowser()

      const finalImages  = data.images.filter(Boolean)
      const providerSlug = data.slug || slug(data.name)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any
      const payload = {
        user_id:           userId,
        name:              data.name        || null,
        slug:              providerSlug,
        categories:        data.categories,
        description:       data.description || null,
        location:          data.location    || null,
        phone:             data.phone       || null,
        whatsapp:          data.whatsapp    || null,
        images:            finalImages,
        cover_url:         finalImages[0]   || null,
        cover_position:    data.cover_position || 'center',
        services:          data.services,
        active:            true,
        terms_accepted:    true,
        terms_accepted_at: new Date().toISOString(),
        terms_version:     '1.0',
      }

      const { data: existing } = await db.from('providers').select('id').eq('user_id', userId).single()
      const { error: uErr } = existing
        ? await db.from('providers').update(payload).eq('user_id', userId)
        : await db.from('providers').insert(payload)
      if (uErr) throw new Error(uErr.message)

      setData(d => ({ ...d, images: finalImages, cover_url: finalImages[0] || null, slug: providerSlug }))
      setSuccess(true)
      window.dispatchEvent(new Event('profileUpdated'))
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  /* ── loading ── */
  if (loading) return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          <p className="text-sm text-white/40">Carregando painel...</p>
        </div>
      </main>
      <Footer />
    </div>
  )

  /* ── Inactive (declined) ── */
  if (termsDeclined) return (
    <div className="flex min-h-screen flex-col" style={{ background: '#06001a' }}>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="relative overflow-hidden rounded-3xl border border-red-500/20 p-8"
            style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(10,2,28,0.9) 100%)' }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/10 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
                <Shield className="h-7 w-7 text-red-400" />
              </div>
              <h2 className="text-2xl font-black text-white">Conta Inativa</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Sua conta está inativa porque a aceitação dos Termos de Uso e Responsabilidade é uma{' '}
                <strong className="text-white/80">condição legal obrigatória</strong> para utilizar nossa plataforma.
              </p>
              <button
                onClick={() => setTermsDeclined(false)}
                className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold text-white transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #7b2ff7 0%, #8A5CFF 50%, #9b5cff 100%)',
                  boxShadow: '0 0 30px rgba(138,92,255,0.4)',
                }}
              >
                <ScrollText className="h-4 w-4" />
                Ler Termos e Ativar Conta
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Terms modal */}
      {termsAccepted === false && !termsDeclined && (
        <TermsModal userType="prestador" onAccept={handleAcceptTerms} onDecline={handleDeclineTerms} />
      )}

      {/* ── Gradient header ── */}
      <div className="relative overflow-hidden border-b border-white/10 bg-[#05010a]/70 px-4 py-7 backdrop-blur-sm">
        <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Painel do Prestador
            </div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">Gerencie seu perfil</h1>
            <p className="mt-1 text-sm text-white/45">Edite suas informações — a prévia ao vivo aparece ao lado</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setShowPrev(v => !v)}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/60 transition-all hover:bg-white/10 hover:text-white lg:hidden">
              {showPrev ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPrev ? 'Fechar' : 'Prévia'}
            </button>
            {data.slug && (
              <Link href={`/prestadores/${data.slug}`} target="_blank"
                className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/10 hover:text-white sm:flex">
                <ExternalLink className="h-4 w-4" />
                Ver perfil público
              </Link>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-6xl">

          {/* Mobile preview */}
          {showPrev && (
            <div className="mb-6 lg:hidden">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-violet-400">
                <Eye className="h-4 w-4" />Prévia ao vivo
              </p>
              <Preview data={data} avatarUrl={avatarUrl} />
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

            {/* ══ LEFT ══ */}
            <div className="space-y-5">

              <Completion data={data} />

              {/* Feedback */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-400">Perfil salvo e publicado!</p>
                    <p className="text-xs text-green-400/70">As alterações já estão visíveis no seu perfil público.</p>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 sm:grid-cols-6">
                {TABS.map(({ id, label, Icon }) => (
                  <button key={id} onClick={() => setTab(id)}
                    className={[
                      'flex flex-col items-center gap-1 rounded-xl px-1 py-3 text-[11px] font-medium transition-all',
                      tab === id
                        ? 'bg-[#7F77DD] text-white shadow-[0_0_20px_rgba(127,119,221,0.35)]'
                        : 'text-white/40 hover:text-white/70',
                    ].join(' ')}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="leading-tight">{label}</span>
                  </button>
                ))}
              </div>

              {/* Content card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-violet-600/12 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-fuchsia-600/8 blur-3xl" />
                <div className="relative space-y-5">

                  {/* ── PERFIL ── */}
                  {tab === 'perfil' && (<>
                    <Field label="Nome do negócio / Nome profissional"
                      tip="Este nome aparece em destaque. Ex: Salão da Maria, Eletricista João Silva...">
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input type="text" value={data.name}
                          onChange={e => setData(d => ({ ...d, name: e.target.value }))}
                          placeholder="Nome do seu negócio" className={inpI} />
                      </div>
                    </Field>

                    <Field label="Localização" tip="Bairro ou cidade onde você atende. Aparece no seu perfil.">
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input type="text" value={data.location}
                          onChange={e => setData(d => ({ ...d, location: e.target.value }))}
                          placeholder="Ex: Centro, Imperatriz" className={inpI} />
                      </div>
                    </Field>

                    <Field label="Descrição do negócio"
                      tip="Apresente seu trabalho em 2 a 4 frases. Destaque sua experiência e diferenciais.">
                      <div className="relative">
                        <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                        <textarea value={data.description}
                          onChange={e => setData(d => ({ ...d, description: e.target.value }))}
                          placeholder="Fale sobre seu negócio, sua experiência e o que te diferencia..."
                          rows={5}
                          className={`${inp} resize-none pl-11`} />
                      </div>
                      <p className="mt-1.5 text-right text-xs text-white/25">{data.description.length} caracteres</p>
                    </Field>
                  </>)}

                  {/* ── CATEGORIAS ── */}
                  {tab === 'categorias' && (<>
                    <div>
                      <p className="mb-1 text-sm font-medium text-white/80">Categorias de serviços</p>
                      <p className="mb-4 text-xs text-white/35">
                        Selecione todas as categorias em que você atua.
                      </p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {categories.map(cat => {
                          const sel = data.categories.includes(cat.id)
                          return (
                            <button key={cat.id} type="button" onClick={() => toggleCat(cat.id)}
                              className={[
                                'group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all',
                                sel
                                  ? 'border-violet-500/60 bg-violet-500/15 shadow-[0_0_16px_rgba(127,119,221,0.2)]'
                                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8',
                              ].join(' ')}>
                              <span className="text-xl">{cat.icon}</span>
                              <div className="min-w-0 flex-1">
                                <p className={`truncate text-sm font-medium ${sel ? 'text-violet-300' : 'text-white/70'}`}>
                                  {cat.name}
                                </p>
                              </div>
                              {sel && <CheckCircle className="h-4 w-4 shrink-0 text-violet-400" />}
                            </button>
                          )
                        })}
                      </div>

                      {data.categories.length > 0 && (
                        <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
                          <p className="mb-2 text-xs font-semibold text-violet-400">
                            {data.categories.length} categori{data.categories.length === 1 ? 'a' : 'as'} selecionada{data.categories.length === 1 ? '' : 's'}:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {data.categories.map(id => {
                              const cat = categories.find(c => c.id === id)
                              return cat ? (
                                <span key={id}
                                  className="flex items-center gap-1 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300">
                                  {cat.icon} {cat.name}
                                  <button type="button" onClick={() => toggleCat(id)}
                                    className="ml-0.5 text-violet-400/60 hover:text-violet-300">
                                    <X className="h-3 w-3" />
                                  </button>
                                </span>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </>)}

                  {/* ── SERVIÇOS ── */}
                  {tab === 'servicos' && (<>
                    <Field label="Adicionar serviço"
                      tip="Liste os serviços que você oferece. Cada item aparece no seu perfil público.">
                      <div className="flex gap-2">
                        <input type="text" value={newSvc}
                          onChange={e => setNewSvc(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSvc())}
                          placeholder="Ex: Corte feminino, Instalação elétrica..."
                          className={`${inp} flex-1`} />
                        <button type="button" onClick={addSvc} disabled={!newSvc.trim()}
                          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#7F77DD] px-4 text-sm font-semibold text-white transition-all hover:bg-[#9089e8] disabled:opacity-40">
                          <Plus className="h-4 w-4" />
                          <span className="hidden sm:inline">Add</span>
                        </button>
                      </div>
                      <p className="mt-1.5 text-xs text-white/30">Pressione Enter para adicionar rapidamente</p>
                    </Field>

                    {data.services.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 py-14">
                        <Briefcase className="h-10 w-10 text-white/15" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-white/40">Nenhum serviço ainda</p>
                          <p className="text-xs text-white/25">Adicione o que você oferece e apareça para mais clientes</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-white/35">{data.services.length} serviço{data.services.length > 1 ? 's' : ''}</p>
                        {data.services.map((s, i) => (
                          <div key={i}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                              <span className="text-sm text-white">{s}</span>
                            </div>
                            <button type="button" onClick={() => removeSvc(i)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/25 transition-colors hover:bg-red-500/10 hover:text-red-400">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>)}

                  {/* ── CONTATO ── */}
                  {tab === 'contato' && (<>
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                      <p className="text-xs font-semibold text-blue-400">💡 Dica importante</p>
                      <p className="mt-1 text-xs text-blue-300/70">
                        Adicione seu WhatsApp — é a forma mais rápida de clientes te contactarem.
                      </p>
                    </div>

                    <Field label="WhatsApp" tip="Clientes poderão te chamar diretamente. Altamente recomendado!">
                      <div className="relative">
                        <MessageCircle className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input type="tel" value={data.whatsapp}
                          onChange={e => setData(d => ({ ...d, whatsapp: formatPhone(e.target.value) }))}
                          placeholder="(99) 99999-9999" className={inpI} />
                      </div>
                      {data.whatsapp && (
                        <a href={`https://wa.me/55${data.whatsapp.replace(/\D/g, '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-1.5 text-xs text-green-400 hover:underline">
                          <ExternalLink className="h-3 w-3" />
                          Testar link WhatsApp
                        </a>
                      )}
                    </Field>

                    <Field label="Telefone" tip="Número de telefone para chamadas diretas.">
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input type="tel" value={data.phone}
                          onChange={e => setData(d => ({ ...d, phone: formatPhone(e.target.value) }))}
                          placeholder="(99) 99999-9999" className={inpI} />
                      </div>
                    </Field>
                  </>)}

                  {/* ── FOTOS / CAPA ── */}
                  {tab === 'capa' && (<>

                    {/* Info */}
                    <div className="flex items-start gap-3 rounded-xl border border-[#7F77DD]/25 bg-[#7F77DD]/8 p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7F77DD]/20">
                        <ImageIcon className="h-4 w-4 text-[#7F77DD]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Galeria de fotos — até 4 imagens</p>
                        <p className="mt-0.5 text-xs text-white/45">
                          Aparecem como <span className="font-semibold text-violet-300">carrossel automático</span> no seu perfil público.
                        </p>
                        <p className="mt-0.5 text-xs text-white/35">
                          Proporção ideal: <span className="font-mono text-violet-300">16:9 · 1280×720px</span> · máx 10 MB · JPG, PNG ou WEBP
                        </p>
                      </div>
                    </div>

                    <ImageUpload
                      images={data.images}
                      onChange={imgs => setData(d => ({ ...d, images: imgs, cover_url: imgs[0] || null }))}
                    />

                    {/* ── Ajustar posição ── */}
                    {data.images.some(Boolean) && (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="mb-0.5 text-sm font-semibold text-white">Ajustar posição das fotos</p>
                        <p className="mb-4 text-xs text-white/35">Aplica a todas as fotos do carrossel</p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                          {/* Mini preview */}
                          <div className="relative w-full overflow-hidden rounded-xl border border-white/10 sm:w-44 sm:shrink-0" style={{ aspectRatio: '16/9' }}>
                            {data.images[0] ? (
                              <img src={data.images[0]} alt="Preview"
                                className="h-full w-full object-cover transition-all duration-300"
                                style={{ objectPosition: data.cover_position }} />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-white/5">
                                <Camera className="h-6 w-6 text-white/20" />
                              </div>
                            )}
                            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-violet-500/40" />
                            <div className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 text-[8px] font-bold text-white/60">PRÉVIA</div>
                          </div>

                          {/* Grid 3×3 */}
                          <div className="flex-1">
                            <div className="grid grid-cols-3 gap-1.5">
                              {POSITIONS.map(([pos, icon, label]) => {
                                const active = data.cover_position === pos
                                return (
                                  <button key={pos} type="button" title={label}
                                    onClick={() => setData(d => ({ ...d, cover_position: pos }))}
                                    className={[
                                      'flex flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 px-1 text-center transition-all',
                                      active
                                        ? 'bg-[#7F77DD] text-white shadow-[0_0_16px_rgba(127,119,221,0.4)]'
                                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/80 border border-white/8',
                                    ].join(' ')}>
                                    <span className="text-base leading-none">{icon}</span>
                                    <span className="text-[9px] leading-tight font-medium">{label}</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Gallery tips */}
                        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {['Mostre seu trabalho', 'Antes e depois', 'Local de atendimento', 'Você em ação'].map((tip, i) => (
                            <div key={i} className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/3 px-2.5 py-2">
                              <CheckCircle2 className="h-3 w-3 shrink-0 text-violet-400/60" />
                              <span className="text-[10px] text-white/40">{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>)}

                  {/* ── EMBLEMAS ── */}
                  {tab === 'emblemas' && userId && (
                    <div className="flex flex-col gap-4">
                      {/* Prévia */}
                      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                        <p className="text-xs font-semibold text-violet-400">✦ Como funciona</p>
                        <p className="mt-1 text-xs text-violet-300/60 leading-relaxed">
                          Escolha até 4 emblemas que representam seu trabalho. Eles aparecem no seu perfil público
                          no bloco lateral, com animação e destaque colorido.
                        </p>
                      </div>
                      <EmblemasSelector prestadorId={userId} />
                    </div>
                  )}

                </div>
              </div>

              {/* ── Save ── */}
              <button onClick={handleSave} disabled={saving}
                className="group relative w-full overflow-hidden rounded-xl bg-[#7F77DD] py-4 text-base font-bold text-white shadow-[0_0_24px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8] hover:shadow-[0_0_40px_rgba(127,119,221,0.5)] disabled:cursor-not-allowed disabled:opacity-60">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {saving
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" />Salvando e publicando...</span>
                  : <span className="flex items-center justify-center gap-2"><Save className="h-5 w-5" />Salvar e publicar alterações</span>
                }
              </button>

            </div>

            {/* ══ RIGHT: sticky preview ══ */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/60">
                    <Eye className="h-4 w-4 text-violet-400" />
                    Prévia ao vivo
                  </div>
                  {data.slug && (
                    <Link href={`/prestadores/${data.slug}`} target="_blank"
                      className="flex items-center gap-1 text-xs text-violet-400 hover:underline">
                      Abrir <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
                <p className="text-xs text-white/25">Atualiza conforme você edita</p>
                <Preview data={data} avatarUrl={avatarUrl} />
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
