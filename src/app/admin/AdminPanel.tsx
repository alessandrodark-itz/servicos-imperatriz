'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart2, Megaphone, Users, Tag, Star, Image as ImageIcon,
  MessageSquare, LogOut, Menu, X, Trash2, Edit3, Plus, Upload,
  Loader2, AlertCircle, Check, ChevronRight, Shield, Eye,
  ToggleLeft, ToggleRight, Send, Bell, Hash, Phone, Link as LinkIcon,
  FileText, Search, UserX, Flag, AlertTriangle, RefreshCw,
  CheckCircle, Info, Download, ScrollText, ExternalLink, Reply,
  MapPin, Calendar, Clock, Award, MessageCircle,
} from 'lucide-react'

/* ─────────────────── tipos ─────────────────── */
type Tab = 'dashboard' | 'ads' | 'users' | 'categories' | 'reviews' | 'gallery' | 'messages' | 'compliance' | 'reports' | 'demos' | 'financeiro'

type Ad = {
  id: string
  title: string
  description: string | null
  slogan: string | null
  brand_category: string | null
  image_url: string
  // backward compat for carousel (computed from active CTA on save)
  link_url: string | null
  phone: string | null
  link_type: string
  button_text: string | null
  badge_type: string | null
  plan_type: string
  is_active: boolean
  is_lifetime: boolean
  position: number
  starts_at: string | null
  expires_at: string | null
  views_count: number
  clicks_count: number
  // CTA independentes por plataforma
  cta_type_active: string | null
  cta_whatsapp_number: string | null
  cta_whatsapp_message: string | null
  cta_external_url: string | null
  cta_instagram_url: string | null
  cta_phone_number: string | null
  cta_location_url: string | null
  cta_coupon_code: string | null
  cta_coupon_url: string | null
}
type ComplianceRow = {
  id: string; user_id: string; name: string; slug: string
  terms_accepted: boolean; terms_version: string | null
  terms_accepted_at: string | null; needs_update: boolean
}
type UserRow = {
  id: string; email: string; full_name: string | null; user_type: string | null
  created_at: string; avatar_url: string | null; provider_name?: string | null
  plan?: string | null; plan_expires_at?: string | null; vip_badge_type?: string | null
}
type ReviewRow = {
  id: string; reviewer_name: string | null; rating: number; comment: string | null
  created_at: string; flagged: boolean; provider_name?: string | null
  user_id?: string | null; strike_count?: number
}
type CategoryRow = {
  id: string; name: string; slug: string; icon: string; description: string | null
  color: string | null; active: boolean
}
type GalleryImage = {
  name: string; url: string; bucket: string; created_at: string; size: number
}
type AdminMessage = {
  id: string; title: string; body: string; type: string
  priority: string; requires_acknowledgment: boolean
  group_target: string | null; target_user_id: string | null
  created_at: string; target_name?: string | null
  receipt_stats?: { total: number; acknowledged: number; overdue: number }
}

/* ─────────────────── helpers ─────────────────── */
function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'agora'
  if (s < 3600) return `${Math.floor(s / 60)}min`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}
function fmt(date: string) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
function generateUserId(user: UserRow, allUsers: UserRow[]) {
  const prefix = user.user_type === 'prestador' ? 'PRE' : 'CLI'
  const sameType = [...allUsers]
    .filter(u => u.user_type === user.user_type)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  const idx = sameType.findIndex(u => u.id === user.id) + 1
  return `${prefix}-${String(idx).padStart(4, '0')}`
}

/* ═══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════ */
export default function AdminPanel() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard',  label: 'Visão Geral',   icon: BarChart2 },
    { id: 'ads',        label: 'Patrocinadores', icon: Megaphone },
    { id: 'users',      label: 'Usuários',       icon: Users },
    { id: 'categories', label: 'Categorias',     icon: Tag },
    { id: 'reviews',    label: 'Avaliações',     icon: Star },
    { id: 'gallery',    label: 'Galeria',        icon: ImageIcon },
    { id: 'messages',    label: 'Mensagens',      icon: MessageSquare },
    { id: 'compliance',  label: 'Conformidade',   icon: ScrollText },
    { id: 'reports',     label: 'Denúncias',      icon: Flag },
    { id: 'demos',       label: 'Perfis Demo',    icon: Eye },
    { id: 'financeiro',  label: 'Financeiro',     icon: BarChart2 },
  ]

  function Sidebar({ mobile }: { mobile?: boolean }) {
    return (
      <aside className={mobile
        ? 'fixed inset-0 z-50 flex'
        : 'hidden lg:flex w-60 flex-shrink-0 flex-col border-r border-white/10 bg-[#07030f]'
      }>
        {mobile && (
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
        )}
        <div className={`relative flex flex-col h-full bg-[#07030f] border-r border-white/10 ${mobile ? 'w-64' : 'w-full'}`}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">Admin</p>
              <p className="text-sm font-bold text-white leading-none">Serviços Imperatriz</p>
            </div>
            {mobile && (
              <button onClick={() => setSidebarOpen(false)} className="ml-auto text-white/40 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
            {tabs.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setSidebarOpen(false) }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-violet-600/30 to-fuchsia-600/20 text-white border border-violet-500/30'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-violet-400' : ''}`} />
                  {t.label}
                  {active && <ChevronRight className="ml-auto h-3 w-3 text-violet-400" />}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/70 transition-all hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" /> Sair do Painel
            </button>
          </div>
        </div>
      </aside>
    )
  }

  const currentTab = tabs.find(t => t.id === tab)!

  return (
    <div className="flex h-screen bg-[#05010a] text-white overflow-hidden">
      <Sidebar />
      {sidebarOpen && <Sidebar mobile />}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 border-b border-white/10 bg-[#05010a]/80 backdrop-blur-xl px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white">{currentTab.label}</h1>
            <p className="text-xs text-white/40">Painel de Administração</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/40">Online</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {tab === 'dashboard'  && <DashboardTab />}
          {tab === 'ads'        && <AdsTab />}
          {tab === 'users'      && <UsersTab />}
          {tab === 'categories' && <CategoriesTab />}
          {tab === 'reviews'    && <ReviewsTab />}
          {tab === 'gallery'    && <GalleryTab />}
          {tab === 'messages'   && <MessagesTab />}
          {tab === 'compliance' && <ComplianceTab />}
          {tab === 'reports'    && <ReportsTab />}
          {tab === 'demos'      && <DemosTab />}
          {tab === 'financeiro' && <FinanceiroTab />}
        </main>
      </div>
    </div>
  )
}

/* ─────────────────── reutilizável ─────────────────── */
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t) }, [onClose])
  const cfg = {
    success: { icon: Check, cls: 'border-green-500/30 bg-green-500/10 text-green-300' },
    error:   { icon: AlertCircle, cls: 'border-red-500/30 bg-red-500/10 text-red-300' },
    info:    { icon: Info, cls: 'border-violet-500/30 bg-violet-500/10 text-violet-300' },
  }[type]
  const Icon = cfg.icon
  return (
    <div className={`mb-4 flex items-center gap-3 rounded-xl border px-4 py-3 ${cfg.cls}`}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm">{msg}</span>
      <button onClick={onClose} className="ml-auto opacity-50 hover:opacity-100"><X className="h-4 w-4" /></button>
    </div>
  )
}

const STRIKE_REASONS = [
  'Linguagem ofensiva',
  'Conteúdo inapropriado',
  'Informação falsa',
  'Assédio',
  'Spam',
  'Outro',
]

function StrikeReasonSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-colors ${
          value ? 'border-violet-500/40 bg-violet-500/10 text-white' : 'border-white/10 bg-white/5 text-white/40'
        } focus:outline-none`}
      >
        {value || 'Motivo do strike...'}
        <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/10 bg-[#0f0918] shadow-2xl overflow-hidden">
          {STRIKE_REASONS.map(r => (
            <button
              key={r}
              type="button"
              onClick={() => { onChange(r); setOpen(false) }}
              className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors hover:bg-violet-500/20 hover:text-white ${
                value === r ? 'bg-violet-500/15 text-violet-300' : 'text-white/70'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-white/50">{label}</p>
      <p className={`mt-1 text-3xl font-black ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-white/30">{sub}</p>}
    </div>
  )
}

/* ─────────────────── UserPicker ─────────────────── */
function UserPicker({
  users, selectedId, onChange,
}: {
  users: UserRow[]
  selectedId: string
  onChange: (id: string) => void
}) {
  const [open,       setOpen]       = useState(false)
  const [search,     setSearch]     = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'prestador' | 'cliente'>('all')

  const selected = users.find(u => u.id === selectedId)

  const filtered = users.filter(u => {
    const matchType = typeFilter === 'all' || u.user_type === typeFilter
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (u.full_name ?? '').toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    return matchType && matchSearch
  })

  function pick(id: string) { onChange(id); setOpen(false); setSearch('') }

  return (
    <div className="relative">
      {/* Trigger */}
      <button type="button" onClick={() => setOpen(v => !v)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-white/10 bg-[#0B0613] px-4 py-2.5 text-sm transition-all hover:border-violet-500/30">
        {selected ? (
          <>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-[10px] font-bold text-white overflow-hidden">
              {selected.avatar_url
                ? <img src={selected.avatar_url} alt="" className="h-full w-full object-cover" />
                : (selected.full_name ?? selected.email ?? '?').charAt(0).toUpperCase()}
            </div>
            <span className="flex-1 truncate text-left font-mono text-[11px] text-violet-400">{generateUserId(selected, users)}</span>
            <span className="flex-1 truncate text-left text-white">{selected.full_name ?? selected.email}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${selected.user_type === 'prestador' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-white/50'}`}>
              {selected.user_type === 'prestador' ? 'PRE' : 'CLI'}
            </span>
          </>
        ) : (
          <span className="flex-1 text-left text-white/55">📢 Todos os usuários</span>
        )}
        <ChevronRight className="h-4 w-4 shrink-0 rotate-90 text-white/30" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch('') }} />
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
            style={{ background: '#0B0613' }}>
            {/* Search */}
            <div className="border-b border-white/8 p-2">
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/40" />
            </div>
            {/* Type filter */}
            <div className="flex gap-1 border-b border-white/8 p-2">
              {([['all', 'Todos'], ['prestador', 'Prestadores'], ['cliente', 'Clientes']] as const).map(([t, l]) => (
                <button key={t} type="button" onClick={() => setTypeFilter(t)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${typeFilter === t ? 'bg-violet-600 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  {l}
                </button>
              ))}
            </div>
            {/* List */}
            <div className="max-h-64 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(127,119,221,0.4) transparent' }}>
              {/* All users option */}
              <button type="button" onClick={() => pick('')}
                className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-violet-500/10 ${!selectedId ? 'bg-violet-500/8' : ''}`}>
                <Bell className="h-4 w-4 shrink-0 text-white/40" />
                <span className="text-white/60">📢 Todos os usuários</span>
              </button>
              {/* Users */}
              {filtered.map(u => {
                const uid = generateUserId(u, users)
                return (
                  <button key={u.id} type="button" onClick={() => pick(u.id)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-all hover:bg-violet-500/10 ${u.id === selectedId ? 'bg-violet-500/10' : ''}`}>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs font-bold text-white overflow-hidden">
                      {u.avatar_url
                        ? <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                        : (u.full_name ?? u.email ?? '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-violet-400/80">{uid}</span>
                        <span className="truncate font-medium text-white">{u.full_name ?? 'Sem nome'}</span>
                      </div>
                      <p className="truncate text-xs text-white/35">{u.email}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.user_type === 'prestador' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-white/50'}`}>
                      {u.user_type === 'prestador' ? 'PRE' : 'CLI'}
                    </span>
                  </button>
                )
              })}
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-white/30">Nenhum usuário encontrado</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ABA: VISÃO GERAL
═══════════════════════════════════════════════════ */
function DashboardTab() {
  const [stats, setStats] = useState({ users: 0, providers: 0, reviews: 0, ads: 0, flagged: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/admin/reviews').then(r => r.json()),
      fetch('/api/admin/ads').then(r => r.json()),
    ]).then(([users, reviews, ads]) => {
      const u = Array.isArray(users) ? users : []
      const r = Array.isArray(reviews) ? reviews : []
      const a = Array.isArray(ads) ? ads : []
      setStats({
        users: u.length,
        providers: u.filter((x: UserRow) => x.user_type === 'prestador').length,
        reviews: r.length,
        ads: a.filter((x: Ad) => x.is_active).length,
        flagged: r.filter((x: ReviewRow) => x.flagged).length,
      })
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-violet-400" /></div>

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Usuários Cadastrados"  value={stats.users}     sub="total na plataforma"          color="text-violet-400" />
        <StatCard label="Prestadores Ativos"    value={stats.providers} sub="com perfil profissional"      color="text-fuchsia-400" />
        <StatCard label="Avaliações Publicadas" value={stats.reviews}   sub="de clientes"                  color="text-yellow-400" />
        <StatCard label="Patrocinadores Ativos" value={stats.ads}       sub="no carrossel da home"         color="text-green-400" />
      </div>

      {stats.flagged > 0 && (
        <div className="flex items-start gap-4 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5">
          <AlertTriangle className="h-6 w-6 flex-shrink-0 text-orange-400 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-300">{stats.flagged} avaliação(ões) sinalizada(s)</p>
            <p className="mt-1 text-sm text-orange-400/70">Acesse a aba Avaliações para revisar e tomar ação.</p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="font-semibold text-white mb-4">Acesso Rápido</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'Gerenciar Usuários',   desc: 'Remover ou enviar mensagem',     icon: Users,       color: 'text-violet-400',  bg: 'bg-violet-500/10' },
            { label: 'Moderar Avaliações',   desc: 'Strikes e comentários ofensivos', icon: Flag,        color: 'text-orange-400',  bg: 'bg-orange-500/10' },
            { label: 'Adicionar Categoria',  desc: 'Nova categoria de serviço',       icon: Tag,         color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
            { label: 'Enviar Aviso',         desc: 'Mensagem para todos os usuários', icon: Bell,        color: 'text-yellow-400',  bg: 'bg-yellow-500/10' },
            { label: 'Galeria de Imagens',   desc: 'Visualizar uploads dos usuários', icon: ImageIcon,   color: 'text-blue-400',    bg: 'bg-blue-500/10' },
            { label: 'Novo Patrocinador',    desc: 'Adicionar ao carrossel da home',  icon: Megaphone,   color: 'text-green-400',   bg: 'bg-green-500/10' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all cursor-default">
                <div className={`rounded-xl p-2.5 ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-white/40">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CONSTANTES — ADS PREMIUM
═══════════════════════════════════════════════════ */
const LINK_TYPES = [
  { id: 'whatsapp',  label: 'WhatsApp',    Icon: MessageCircle, color: 'text-green-400',  border: 'border-green-500/30',  bg: 'bg-green-500/10' },
  { id: 'external',  label: 'Link Externo', Icon: ExternalLink,  color: 'text-sky-400',    border: 'border-sky-500/30',    bg: 'bg-sky-500/10' },
  { id: 'instagram', label: 'Instagram',   Icon: LinkIcon,      color: 'text-pink-400',   border: 'border-pink-500/30',   bg: 'bg-pink-500/10' },
  { id: 'phone',     label: 'Telefone',    Icon: Phone,         color: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/10' },
  { id: 'location',  label: 'Localização', Icon: MapPin,        color: 'text-amber-400',  border: 'border-amber-500/30',  bg: 'bg-amber-500/10' },
  { id: 'coupon',    label: 'Cupom',       Icon: Tag,           color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
]

const AD_PLANS = [
  { id: 'teste',     label: 'Teste',     color: 'text-white/50',   bg: 'bg-white/5',          border: 'border-white/15' },
  { id: 'bronze',    label: 'Bronze',    color: 'text-amber-400',  bg: 'bg-amber-500/15',     border: 'border-amber-500/30' },
  { id: 'prata',     label: 'Prata',     color: 'text-slate-300',  bg: 'bg-slate-500/15',     border: 'border-slate-400/30' },
  { id: 'ouro',      label: 'Ouro ✦',   color: 'text-yellow-400', bg: 'bg-yellow-500/15',    border: 'border-yellow-500/40' },
  { id: 'diamante',  label: 'Diamante',  color: 'text-cyan-400',   bg: 'bg-cyan-500/15',      border: 'border-cyan-500/30' },
  { id: 'vitalicio', label: 'Vitalício', color: 'text-violet-400', bg: 'bg-violet-500/15',    border: 'border-violet-500/30' },
]

const AD_BADGES = [
  { id: 'patrocinado', label: 'Patrocinado' },
  { id: 'premium',     label: 'Premium' },
  { id: 'parceiro',    label: 'Parceiro Oficial' },
  { id: 'oferta',      label: 'Oferta' },
]

const AD_DURATIONS = [
  { label: '1 dia',   days: 1 },
  { label: '3 dias',  days: 3 },
  { label: '7 dias',  days: 7 },
  { label: '15 dias', days: 15 },
  { label: '30 dias', days: 30 },
  { label: '60 dias', days: 60 },
  { label: '90 dias', days: 90 },
  { label: 'Vitalício', days: -1 },
]

const CTA_SUGGESTIONS = [
  'Fale no WhatsApp', 'Saiba Mais', 'Pedir Agora', 'Solicitar Orçamento',
  'Comprar', 'Reservar', 'Conheça', 'Promoção Especial', 'Ver Cardápio', 'Agendar',
]

const BRAND_CATEGORIES = ['Restaurante', 'Delivery', 'Loja', 'Clínica', 'Serviços', 'Evento', 'Outro']

function adPlanCfg(plan_type: string) {
  return AD_PLANS.find(p => p.id === plan_type) ?? AD_PLANS[1]
}

function adDaysRemaining(expires_at: string | null, is_lifetime: boolean): number | null | 'lifetime' {
  if (is_lifetime) return 'lifetime'
  if (!expires_at) return null
  return Math.ceil((new Date(expires_at).getTime() - Date.now()) / 86_400_000)
}

/* ═══════════════════════════════════════════════════
   ABA: PATROCINADORES
═══════════════════════════════════════════════════ */
function AdsTab() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [ads, setAds]             = useState<Ad[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast]         = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [editId, setEditId]       = useState<string | null>(null)
  const [preview, setPreview]     = useState('')
  const [dragOver, setDragOver]   = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [filter, setFilter]       = useState<'all' | 'active' | 'expiring' | 'expired'>('all')
  const [ctaTab, setCtaTab]       = useState('whatsapp')

  const emptyForm: Omit<Ad, 'id'> = {
    title: '', description: '', slogan: '', brand_category: '',
    image_url: '', link_type: 'whatsapp', link_url: '', phone: '',
    button_text: 'Fale no WhatsApp', badge_type: 'patrocinado', plan_type: 'bronze',
    is_active: true, is_lifetime: false, position: 0,
    starts_at: '', expires_at: '', views_count: 0, clicks_count: 0,
    // CTA por plataforma
    cta_type_active: 'whatsapp',
    cta_whatsapp_number: '', cta_whatsapp_message: '',
    cta_external_url: '', cta_instagram_url: '',
    cta_phone_number: '', cta_location_url: '',
    cta_coupon_code: '', cta_coupon_url: '',
  }
  const [form, setForm] = useState<Omit<Ad, 'id'>>(emptyForm)

  const F = (key: keyof Omit<Ad, 'id'>, val: string | boolean | number) =>
    setForm(f => ({ ...f, [key]: val }))

  const fetchAds = useCallback(async () => {
    setLoading(true)
    try { setAds(await fetch('/api/admin/ads').then(r => r.json())) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAds() }, [fetchAds])

  async function handleUpload(file: File) {
    if (file.size > 5_000_000) { setToast({ msg: 'Imagem muito grande (máx 5MB)', type: 'error' }); return }
    // Preview local instantâneo — o usuário vê a imagem antes do upload terminar
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await r.json()
      if (r.ok) {
        F('image_url', d.url)
        setPreview(d.url) // troca blob: pela URL permanente do Supabase
      } else {
        setToast({ msg: d.error ?? 'Erro no upload — tente novamente', type: 'error' })
        setPreview('')        // reverte preview se o upload falhou
        F('image_url', '')
      }
    } catch {
      setToast({ msg: 'Falha de conexão ao enviar imagem', type: 'error' })
      setPreview('')
      F('image_url', '')
    }
    setUploading(false)
  }

  function applyDuration(days: number) {
    if (days === -1) { F('is_lifetime', true); F('expires_at', '') }
    else {
      const exp = new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 16)
      F('is_lifetime', false); F('expires_at', exp)
      if (!form.starts_at) F('starts_at', new Date().toISOString().slice(0, 16))
    }
  }

  function ctaHasData(f: Omit<Ad, 'id'>, type: string): boolean {
    switch (type) {
      case 'whatsapp': return !!(f.cta_whatsapp_number?.trim())
      case 'external': return !!(f.cta_external_url?.trim())
      case 'instagram': return !!(f.cta_instagram_url?.trim())
      case 'phone':    return !!(f.cta_phone_number?.trim())
      case 'location': return !!(f.cta_location_url?.trim())
      case 'coupon':   return !!(f.cta_coupon_code?.trim())
      default: return false
    }
  }

  function resolveActiveLink(f: Omit<Ad, 'id'>): string {
    switch (f.cta_type_active ?? f.link_type) {
      case 'whatsapp': {
        const num = (f.cta_whatsapp_number ?? '').replace(/\D/g, '')
        const msg = f.cta_whatsapp_message?.trim()
        return `https://wa.me/55${num}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`
      }
      case 'external': return f.cta_external_url ?? ''
      case 'instagram': {
        const v = (f.cta_instagram_url ?? '').trim()
        return v.startsWith('@') ? `https://instagram.com/${v.slice(1)}` : v
      }
      case 'phone':    return `tel:${(f.cta_phone_number ?? '').replace(/\D/g, '')}`
      case 'location': return f.cta_location_url ?? ''
      case 'coupon':   return f.cta_coupon_url?.trim() || f.cta_coupon_code?.trim() || ''
      default: return ''
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.image_url) { setToast({ msg: 'Adicione o banner 16:9 do patrocinador', type: 'error' }); return }
    if (!form.title.trim()) { setToast({ msg: 'Nome da marca é obrigatório', type: 'error' }); return }
    setSaving(true)
    const activePlatform = form.cta_type_active ?? 'whatsapp'
    const activeLink     = resolveActiveLink(form)
    const payload = {
      ...form,
      // backward compat: preenche campos legados usados pelo carrossel
      link_type: activePlatform,
      link_url:  activeLink,
      phone:     form.cta_whatsapp_number || form.cta_phone_number || null,
      starts_at: form.starts_at || null,
      expires_at: form.is_lifetime ? null : (form.expires_at || null),
    }
    const url = editId ? `/api/admin/ads/${editId}` : '/api/admin/ads'
    const r = await fetch(url, {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const platformLabel = LINK_TYPES.find(l => l.id === activePlatform)?.label ?? activePlatform
    if (r.ok) {
      setToast({
        msg: editId
          ? `Patrocinador atualizado! CTA principal: ${platformLabel}`
          : `Patrocinador adicionado com CTA configurado para ${platformLabel}!`,
        type: 'success',
      })
      closeForm(); fetchAds()
    } else {
      const d = await r.json(); setToast({ msg: d.error ?? 'Erro ao salvar', type: 'error' })
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' })
    setAds(prev => prev.filter(a => a.id !== id))
    setDeleteConfirm(null)
    setToast({ msg: 'Patrocinador removido', type: 'success' })
  }

  async function toggleActive(ad: Ad) {
    const updated = { ...ad, is_active: !ad.is_active }
    setAds(prev => prev.map(a => a.id === ad.id ? updated : a))
    await fetch(`/api/admin/ads/${ad.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
  }

  function openEdit(ad: Ad) {
    const activeType = ad.cta_type_active ?? ad.link_type ?? 'whatsapp'
    setEditId(ad.id)
    setForm({
      title: ad.title, description: ad.description ?? '', slogan: ad.slogan ?? '',
      brand_category: ad.brand_category ?? '', image_url: ad.image_url,
      link_type: ad.link_type ?? 'whatsapp', link_url: ad.link_url ?? '',
      phone: ad.phone ?? '', button_text: ad.button_text ?? 'Saiba Mais',
      badge_type: ad.badge_type ?? 'patrocinado', plan_type: ad.plan_type ?? 'bronze',
      is_active: ad.is_active, is_lifetime: ad.is_lifetime ?? false, position: ad.position,
      starts_at: ad.starts_at ? ad.starts_at.slice(0, 16) : '',
      expires_at: ad.expires_at ? ad.expires_at.slice(0, 16) : '',
      views_count: ad.views_count ?? 0, clicks_count: ad.clicks_count ?? 0,
      cta_type_active:      activeType,
      cta_whatsapp_number:  ad.cta_whatsapp_number  ?? '',
      cta_whatsapp_message: ad.cta_whatsapp_message ?? '',
      cta_external_url:     ad.cta_external_url     ?? '',
      cta_instagram_url:    ad.cta_instagram_url    ?? '',
      cta_phone_number:     ad.cta_phone_number     ?? '',
      cta_location_url:     ad.cta_location_url     ?? '',
      cta_coupon_code:      ad.cta_coupon_code      ?? '',
      cta_coupon_url:       ad.cta_coupon_url       ?? '',
    })
    setCtaTab(activeType)
    setPreview(ad.image_url)
    setShowForm(true)
  }

  function closeForm() { setShowForm(false); setEditId(null); setForm(emptyForm); setPreview('') }

  const nowMs = Date.now()
  const filtered = ads.filter(a => {
    if (filter === 'active')   return a.is_active && (a.is_lifetime || !a.expires_at || new Date(a.expires_at).getTime() > nowMs)
    if (filter === 'expiring') {
      if (!a.is_active || a.is_lifetime || !a.expires_at) return false
      const d = adDaysRemaining(a.expires_at, false)
      return typeof d === 'number' && d > 0 && d <= 7
    }
    if (filter === 'expired') return !!a.expires_at && !a.is_lifetime && new Date(a.expires_at).getTime() <= nowMs
    return true
  })

  const stats = {
    total:    ads.length,
    active:   ads.filter(a => a.is_active && (a.is_lifetime || !a.expires_at || new Date(a.expires_at).getTime() > nowMs)).length,
    expiring: ads.filter(a => {
      if (!a.is_active || a.is_lifetime || !a.expires_at) return false
      const d = adDaysRemaining(a.expires_at, false)
      return typeof d === 'number' && d > 0 && d <= 7
    }).length,
    expired:  ads.filter(a => !!a.expires_at && !a.is_lifetime && new Date(a.expires_at).getTime() <= nowMs).length,
  }

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Stats */}
      <div className="mb-6 grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { label: 'Total',      value: stats.total,    color: 'text-white/70' },
          { label: 'Ativos',     value: stats.active,   color: 'text-green-400' },
          { label: 'Expirando',  value: stats.expiring, color: 'text-amber-400' },
          { label: 'Expirados',  value: stats.expired,  color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── FORMULÁRIO PREMIUM ── */}
      {showForm && (
        <div className="mb-6 rounded-3xl border border-violet-500/25 bg-[#07030f] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/8 bg-gradient-to-r from-violet-900/30 to-fuchsia-900/20 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-lg shadow-violet-500/30">
                <Megaphone className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white">{editId ? 'Editar Patrocinador' : 'Novo Patrocinador Premium'}</h2>
                <p className="text-xs text-white/40">Configure o anúncio exibido na página principal</p>
              </div>
            </div>
            <button onClick={closeForm} className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="divide-y divide-white/5">

            {/* ── Banner 16:9 ── */}
            <div className="p-6">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-violet-400">
                <ImageIcon className="h-3.5 w-3.5" /> Banner do Patrocinador
              </p>
              <div
                onClick={() => !uploading && fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleUpload(f) }}
                className={`relative w-full cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${
                  dragOver ? 'border-violet-400 bg-violet-500/10' :
                  preview  ? 'border-violet-500/30' :
                  'border-white/10 bg-white/3 hover:border-violet-500/40'
                }`}
                style={{ aspectRatio: '16/9' }}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    {uploading ? (
                      /* Upload em andamento — overlay sobre a imagem */
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/65">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                        <p className="text-sm font-semibold text-white">Enviando para o servidor...</p>
                      </div>
                    ) : (
                      /* Hover para trocar */
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-white" />
                          <p className="mt-2 text-sm font-bold text-white">Trocar banner</p>
                          <p className="text-xs text-white/50 mt-0.5">Recomendado: 1920×1080</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : uploading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-9 w-9 animate-spin text-violet-400" />
                    <p className="text-sm text-white/50">Enviando banner...</p>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
                      <Upload className="h-9 w-9 text-violet-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-white">Banner do Patrocinador (16:9)</p>
                      <p className="mt-1 text-xs text-white/40">Recomendado: 1920×1080 para máxima qualidade</p>
                      <p className="text-[11px] text-white/25 mt-0.5">JPG · PNG · WEBP · máx 5MB</p>
                    </div>
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-400">
                      Arraste aqui ou clique para selecionar
                    </span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} className="hidden" />
            </div>

            {/* ── Identidade da Marca ── */}
            <div className="p-6">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-violet-400">
                <FileText className="h-3.5 w-3.5" /> Identidade da Marca
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-white/60">Nome da Marca *</label>
                  <input value={form.title} onChange={e => F('title', e.target.value)} placeholder="Ex: Horto Pizzaria" required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/60">Slogan</label>
                  <input value={form.slogan ?? ''} onChange={e => F('slogan', e.target.value)} placeholder="Ex: O sabor que você merece"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/60">Categoria</label>
                  <div className="relative">
                    <select value={form.brand_category ?? ''} onChange={e => F('brand_category', e.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-[#0f0918] px-4 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none">
                      <option value="">Selecione...</option>
                      {BRAND_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-white/30" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-white/60">Descrição</label>
                  <textarea value={form.description ?? ''} onChange={e => F('description', e.target.value)} placeholder="Breve descrição do patrocinador (opcional)" rows={2}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
                </div>
              </div>
            </div>

            {/* ── CTA & Link (abas independentes por plataforma) ── */}
            <div className="p-6">
              <p className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-violet-400">
                <ExternalLink className="h-3.5 w-3.5" /> Chamada para Ação (CTA)
              </p>
              <p className="mb-4 text-[11px] text-white/35">
                Configure cada plataforma de forma independente — trocar de aba não apaga os dados das outras.
              </p>

              {/* Abas das plataformas */}
              <div className="flex flex-wrap gap-2">
                {LINK_TYPES.map(lt => {
                  const hasData   = ctaHasData(form, lt.id)
                  const isPrimary = form.cta_type_active === lt.id
                  const isTab     = ctaTab === lt.id
                  return (
                    <button key={lt.id} type="button" onClick={() => setCtaTab(lt.id)}
                      className={`relative flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                        isTab
                          ? `${lt.border} ${lt.bg} ${lt.color}`
                          : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80'
                      }`}>
                      <lt.Icon className="h-3.5 w-3.5" />
                      {lt.label}
                      <span className={hasData ? 'text-green-400' : 'text-white/20'}>
                        {hasData ? '✓' : '○'}
                      </span>
                      {isPrimary && (
                        <span className="absolute -right-1 -top-1.5 rounded-full bg-violet-600 px-1 py-px text-[8px] font-black leading-tight text-white">
                          ATIVO
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Painel da aba atual */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/3 p-4">
                {ctaTab === 'whatsapp' && (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">Número WhatsApp</label>
                      <input value={form.cta_whatsapp_number ?? ''} onChange={e => F('cta_whatsapp_number', e.target.value)}
                        placeholder="(99) 99999-9999"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-green-500/40 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Mensagem pré-definida <span className="text-white/30">(opcional)</span>
                      </label>
                      <input value={form.cta_whatsapp_message ?? ''} onChange={e => F('cta_whatsapp_message', e.target.value)}
                        placeholder="Olá! Vi vocês no Serviços Imperatriz..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-green-500/40 focus:outline-none" />
                    </div>
                  </div>
                )}
                {ctaTab === 'external' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">URL Externa</label>
                    <input value={form.cta_external_url ?? ''} onChange={e => F('cta_external_url', e.target.value)}
                      placeholder="https://seusite.com.br"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-sky-500/40 focus:outline-none" />
                  </div>
                )}
                {ctaTab === 'instagram' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">Perfil Instagram</label>
                    <input value={form.cta_instagram_url ?? ''} onChange={e => F('cta_instagram_url', e.target.value)}
                      placeholder="@sua.marca ou https://instagram.com/..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-pink-500/40 focus:outline-none" />
                  </div>
                )}
                {ctaTab === 'phone' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">Número de Ligação</label>
                    <input value={form.cta_phone_number ?? ''} onChange={e => F('cta_phone_number', e.target.value)}
                      placeholder="(99) 9999-9999"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/40 focus:outline-none" />
                  </div>
                )}
                {ctaTab === 'location' && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/60">Link do Google Maps</label>
                    <input value={form.cta_location_url ?? ''} onChange={e => F('cta_location_url', e.target.value)}
                      placeholder="https://maps.google.com/..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-amber-500/40 focus:outline-none" />
                  </div>
                )}
                {ctaTab === 'coupon' && (
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">Código do Cupom</label>
                      <input value={form.cta_coupon_code ?? ''} onChange={e => F('cta_coupon_code', e.target.value)}
                        placeholder="EX: PROMO10"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm uppercase text-orange-300 placeholder:normal-case placeholder:font-sans placeholder:text-white/30 focus:border-orange-500/40 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-white/60">
                        Link da promoção <span className="text-white/30">(opcional)</span>
                      </label>
                      <input value={form.cta_coupon_url ?? ''} onChange={e => F('cta_coupon_url', e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-orange-500/40 focus:outline-none" />
                    </div>
                  </div>
                )}

                {/* Botão "Definir como principal" */}
                {ctaTab !== form.cta_type_active && (
                  <button type="button"
                    onClick={() => F('cta_type_active', ctaTab)}
                    disabled={!ctaHasData(form, ctaTab)}
                    className={`mt-4 w-full rounded-xl border py-2 text-xs font-semibold transition-all ${
                      ctaHasData(form, ctaTab)
                        ? 'border-violet-500/40 bg-violet-500/15 text-violet-400 hover:bg-violet-500/25'
                        : 'cursor-not-allowed border-white/8 bg-white/3 text-white/25'
                    }`}>
                    {ctaHasData(form, ctaTab)
                      ? `★ Usar ${LINK_TYPES.find(l => l.id === ctaTab)?.label} como CTA Principal`
                      : `Preencha os campos acima para ativar ${LINK_TYPES.find(l => l.id === ctaTab)?.label}`}
                  </button>
                )}
              </div>

              {/* Preview do CTA principal */}
              <div className="mt-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                {(() => {
                  const active  = LINK_TYPES.find(l => l.id === (form.cta_type_active ?? 'whatsapp'))
                  const hasIt   = active ? ctaHasData(form, active.id) : false
                  const preview = hasIt ? resolveActiveLink(form) : ''
                  return (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30">CTA Principal</p>
                        {active && (
                          <p className={`mt-0.5 flex items-center gap-1.5 text-xs font-medium ${active.color}`}>
                            <active.Icon className="h-3.5 w-3.5" />
                            {active.label}
                            {hasIt
                              ? <span className="text-green-400">✓ Configurado</span>
                              : <span className="text-amber-400">⚠ Não configurado</span>}
                          </p>
                        )}
                      </div>
                      {preview && (
                        <p className="max-w-[45%] truncate font-mono text-[10px] text-white/30">{preview}</p>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Texto do botão */}
              <div className="mt-4">
                <label className="mb-1.5 block text-xs font-medium text-white/60">Texto do Botão (CTA)</label>
                <input value={form.button_text ?? ''} onChange={e => F('button_text', e.target.value)}
                  placeholder="Ex: Fale no WhatsApp"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {CTA_SUGGESTIONS.map(s => (
                    <button key={s} type="button" onClick={() => F('button_text', s)}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/50 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Plano & Validade ── */}
            <div className="p-6">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-violet-400">
                <Award className="h-3.5 w-3.5" /> Plano & Validade
              </p>
              {/* Plan pills */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-white/60">Plano Contratado</label>
                <div className="flex flex-wrap gap-2">
                  {AD_PLANS.map(p => (
                    <button key={p.id} type="button" onClick={() => F('plan_type', p.id)}
                      className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                        form.plan_type === p.id
                          ? `${p.border} ${p.bg} ${p.color}`
                          : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/70'
                      }`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Duration presets */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-white/60">Duração Rápida</label>
                <div className="flex flex-wrap gap-2">
                  {AD_DURATIONS.map(d => (
                    <button key={d.label} type="button" onClick={() => applyDuration(d.days)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/50 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all">
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Manual date pickers (hidden when lifetime) */}
              {!form.is_lifetime && (
                <div className="mb-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/60">
                      <Calendar className="h-3 w-3" /> Data de Início
                    </label>
                    <input type="datetime-local" value={form.starts_at ?? ''} onChange={e => F('starts_at', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0f0918] px-4 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/60">
                      <Clock className="h-3 w-3" /> Data de Expiração
                    </label>
                    <input type="datetime-local" value={form.expires_at ?? ''} onChange={e => F('expires_at', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0f0918] px-4 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none [color-scheme:dark]" />
                  </div>
                </div>
              )}
              {/* Preview da validade */}
              {(form.is_lifetime || form.expires_at) && (
                <div className={`rounded-xl border px-4 py-3 ${form.is_lifetime ? 'border-violet-500/20 bg-violet-500/8' : 'border-white/8 bg-white/5'}`}>
                  {form.is_lifetime ? (
                    <p className="text-xs text-violet-400">∞ Patrocinador vitalício — nunca expira automaticamente</p>
                  ) : (
                    <p className="text-xs text-white/60">
                      Este patrocinador ficará ativo até{' '}
                      <span className="font-semibold text-white">
                        {new Date(form.expires_at!).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── Exibição & Configurações ── */}
            <div className="p-6">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-violet-400">
                <Shield className="h-3.5 w-3.5" /> Exibição & Configurações
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-white/60">Selo de Destaque</label>
                  <div className="flex flex-wrap gap-1.5">
                    {AD_BADGES.map(b => (
                      <button key={b.id} type="button" onClick={() => F('badge_type', b.id)}
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-all ${
                          form.badge_type === b.id
                            ? 'border-violet-500/50 bg-violet-500/20 text-violet-300'
                            : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/70'
                        }`}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/60">
                      <Hash className="h-3 w-3" /> Posição
                    </label>
                    <input type="number" value={form.position} onChange={e => F('position', +e.target.value)} min={0}
                      className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center text-sm text-white focus:border-violet-500/50 focus:outline-none" />
                  </div>
                  <button type="button" onClick={() => F('is_active', !form.is_active)}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      form.is_active
                        ? 'border-green-500/30 bg-green-500/10 text-green-400'
                        : 'border-white/10 bg-white/5 text-white/40'
                    }`}>
                    {form.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    {form.is_active ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Botões ── */}
            <div className="flex gap-3 p-6">
              <button type="button" onClick={closeForm}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/60 hover:bg-white/5 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={saving || uploading}
                className="flex-[2] rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 disabled:opacity-60">
                {saving
                  ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</span>
                  : editId ? 'Salvar Alterações' : 'Adicionar Patrocinador'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Header com filtros */}
      {!showForm && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-white">Patrocinadores Premium</h2>
            <p className="text-sm text-white/40">Central de controle de anúncios da página principal</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { id: 'all',      label: 'Todos' },
              { id: 'active',   label: 'Ativos' },
              { id: 'expiring', label: `⚠ Expirando${stats.expiring > 0 ? ` (${stats.expiring})` : ''}` },
              { id: 'expired',  label: 'Expirados' },
            ] as const).map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${filter === f.id ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}>
                {f.label}
              </button>
            ))}
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20">
              <Plus className="h-4 w-4" /> Novo Patrocinador
            </button>
          </div>
        </div>
      )}

      {/* Lista de cards */}
      {!showForm && (
        loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/10 py-20 text-center">
            <Megaphone className="h-10 w-10 text-white/20" />
            <p className="text-white/40">Nenhum patrocinador {filter !== 'all' ? 'nesta categoria' : ''}.</p>
            {filter === 'all' && (
              <button onClick={() => setShowForm(true)} className="mt-1 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white">
                Adicionar primeiro patrocinador
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(ad => {
              const days     = adDaysRemaining(ad.expires_at, ad.is_lifetime)
              const plan     = adPlanCfg(ad.plan_type)
              const isExpired  = typeof days === 'number' && days <= 0
              const isExpiring = typeof days === 'number' && days > 0 && days <= 7
              const lt = LINK_TYPES.find(l => l.id === ad.link_type)
              const badge = AD_BADGES.find(b => b.id === ad.badge_type)

              return (
                <div key={ad.id} className={`group relative overflow-hidden rounded-2xl border transition-all ${
                  isExpired  ? 'border-red-500/20 opacity-60' :
                  isExpiring ? `${plan.border} ring-1 ring-amber-500/20` :
                  ad.is_active ? plan.border : 'border-white/5 opacity-50'
                } bg-[#07030f]`}>
                  {/* 16:9 Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <img src={ad.image_url} alt={ad.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    {/* Top: position + badges */}
                    <div className="absolute left-2 right-2 top-2 flex items-center justify-between">
                      <span className="rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/60">#{ad.position}</span>
                      <div className="flex items-center gap-1.5">
                        {badge && (
                          <span className="rounded-full border border-white/20 bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/80">
                            {badge.label}
                          </span>
                        )}
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${plan.border} ${plan.bg} ${plan.color}`}>
                          {plan.label}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          isExpired  ? 'bg-red-500/90 text-white' :
                          isExpiring ? 'bg-amber-500/90 text-white' :
                          ad.is_active ? 'bg-green-500/90 text-white' : 'bg-white/20 text-white/60'
                        }`}>
                          {isExpired ? 'Expirado' : isExpiring ? `⚠ ${days}d` : ad.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    {/* Bottom: title + slogan */}
                    <div className="absolute bottom-2 left-3 right-3">
                      <p className="truncate text-sm font-bold text-white">{ad.title}</p>
                      {ad.slogan && <p className="mt-0.5 truncate text-[11px] text-white/55">{ad.slogan}</p>}
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px] text-white/40">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {ad.views_count ?? 0}</span>
                        <span className="flex items-center gap-1"><ExternalLink className="h-3 w-3" /> {ad.clicks_count ?? 0}</span>
                        {lt && <span className={`flex items-center gap-1 ${lt.color}`}><lt.Icon className="h-3 w-3" />{lt.label}</span>}
                      </div>
                      <span className={`text-[10px] font-medium ${
                        days === 'lifetime'  ? 'text-violet-400' :
                        isExpired  ? 'text-red-400' :
                        isExpiring ? 'text-amber-400' : 'text-white/30'
                      }`}>
                        {days === 'lifetime' ? '∞ Vitalício' :
                         isExpired  ? 'Expirado' :
                         typeof days === 'number' && days > 0 ? `${days}d restantes` :
                         ad.expires_at ? fmt(ad.expires_at) : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(ad)} className={`rounded-lg p-2 transition-all ${ad.is_active && !isExpired ? 'text-green-400 hover:bg-green-500/10' : 'text-white/30 hover:bg-white/10'}`}>
                        {ad.is_active && !isExpired ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                      </button>
                      <button onClick={() => openEdit(ad)} className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs font-medium text-white/60 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400 transition-all">
                        <span className="flex items-center justify-center gap-1"><Edit3 className="h-3.5 w-3.5" /> Editar</span>
                      </button>
                      {deleteConfirm === ad.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(ad.id)} className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/30">Confirmar</button>
                          <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/40"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(ad.id)} className="rounded-lg p-2 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ABA: USUÁRIOS
═══════════════════════════════════════════════════ */
function UsersTab() {
  const [users,         setUsers]         = useState<UserRow[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [typeFilter,    setTypeFilter]    = useState<'all' | 'prestador' | 'cliente'>('all')
  const [vipFilter,     setVipFilter]     = useState<'all' | 'vip' | 'free' | 'expired'>('all')
  const [toast,         setToast]         = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [msgTarget,     setMsgTarget]     = useState<UserRow | null>(null)
  const [msgForm,       setMsgForm]       = useState({ title: '', body: '', type: 'info' })
  const [sendingMsg,    setSendingMsg]    = useState(false)
  const [detailUser,    setDetailUser]    = useState<UserRow | null>(null)
  const [vipTarget,     setVipTarget]     = useState<UserRow | null>(null)
  const [vipForm,       setVipForm]       = useState({ days: 30, badgeType: 'vip' })
  const [vipLoading,    setVipLoading]    = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try { setUsers(await fetch('/api/admin/users').then(r => r.json())) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { fetchUsers() }, [fetchUsers])

  async function handleDelete(id: string) {
    const r = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (r.ok) { setUsers(prev => prev.filter(u => u.id !== id)); setDeleteConfirm(null); setToast({ msg: 'Usuário removido.', type: 'success' }) }
    else setToast({ msg: 'Erro ao remover usuário.', type: 'error' })
  }

  async function handleSendMsg(e: React.FormEvent) {
    e.preventDefault()
    if (!msgTarget) return
    setSendingMsg(true)
    const r = await fetch('/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...msgForm, target_user_id: msgTarget.id }),
    })
    if (r.ok) { setToast({ msg: `Mensagem enviada para ${msgTarget.full_name ?? msgTarget.email}`, type: 'success' }); setMsgTarget(null); setMsgForm({ title: '', body: '', type: 'info' }) }
    else setToast({ msg: 'Erro ao enviar mensagem.', type: 'error' })
    setSendingMsg(false)
  }

  function isUserVipActive(u: UserRow) {
    if (u.plan !== 'vip' && u.plan !== 'premium') return false
    if (!u.plan_expires_at) return true
    return new Date(u.plan_expires_at) > new Date()
  }

  async function handleVipAction(userId: string, action: 'activate' | 'deactivate' | 'renew') {
    setVipLoading(true)
    const r = await fetch('/api/admin/vip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action, days: vipForm.days, badgeType: vipForm.badgeType }),
    })
    if (r.ok) {
      const updated = await r.json()
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: updated.plan, plan_expires_at: updated.plan_expires_at ?? null } : u))
      setToast({ msg: action === 'deactivate' ? 'VIP removido.' : 'VIP ativado com sucesso!', type: 'success' })
      setVipTarget(null)
    } else {
      setToast({ msg: 'Erro ao atualizar plano VIP.', type: 'error' })
    }
    setVipLoading(false)
  }

  const filtered = users.filter(u => {
    const matchType = typeFilter === 'all' || u.user_type === typeFilter
    const vipActive = isUserVipActive(u)
    const vipExpired = (u.plan === 'vip' || u.plan === 'premium') && !vipActive
    const matchVip = vipFilter === 'all' ||
      (vipFilter === 'vip'     && vipActive) ||
      (vipFilter === 'free'    && !vipActive && !vipExpired) ||
      (vipFilter === 'expired' && vipExpired)
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (u.email?.toLowerCase().includes(q) ||
      (u.full_name ?? '').toLowerCase().includes(q))
    return matchType && matchVip && matchSearch
  })

  const stats = {
    total:      users.length,
    prestador:  users.filter(u => u.user_type === 'prestador').length,
    cliente:    users.filter(u => u.user_type === 'cliente').length,
    vip:        users.filter(u => isUserVipActive(u)).length,
  }

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* VIP modal */}
      {vipTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75" onClick={() => setVipTarget(null)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-amber-500/20 shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
            style={{ background: '#0e0625' }}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
              <h3 className="font-bold text-white">Gerenciar VIP</h3>
              <button onClick={() => setVipTarget(null)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-white/60">
                <span className="font-semibold text-white">{vipTarget.full_name ?? vipTarget.email}</span>
                {' — '}plano atual: <span className={`font-semibold ${isUserVipActive(vipTarget) ? 'text-amber-400' : 'text-white/40'}`}>
                  {isUserVipActive(vipTarget) ? 'VIP ativo' : 'Gratuito'}
                </span>
                {vipTarget.plan_expires_at && (
                  <span className="ml-1 text-xs text-white/30">(expira {fmt(vipTarget.plan_expires_at)})</span>
                )}
              </p>
              <div>
                <label className="mb-1 block text-xs text-white/50">Tipo de selo</label>
                <select value={vipForm.badgeType} onChange={e => setVipForm(f => ({ ...f, badgeType: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-500/50 focus:outline-none">
                  <option value="vip">👑 VIP</option>
                  <option value="premium">⭐ Premium</option>
                  <option value="destaque">🔵 Em Destaque</option>
                  <option value="top_regional">🏆 Top Regional</option>
                  <option value="perfil_premium">✦ Perfil Premium</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Duração (dias)</label>
                <input type="number" min={1} max={3650} value={vipForm.days}
                  onChange={e => setVipForm(f => ({ ...f, days: parseInt(e.target.value) || 30 }))}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-amber-500/50 focus:outline-none" />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => handleVipAction(vipTarget.id, isUserVipActive(vipTarget) ? 'renew' : 'activate')} disabled={vipLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 py-2.5 text-xs font-bold text-black disabled:opacity-60">
                  {vipLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '👑'}
                  {isUserVipActive(vipTarget) ? 'Renovar VIP' : 'Ativar VIP'}
                </button>
                {isUserVipActive(vipTarget) && (
                  <button onClick={() => handleVipAction(vipTarget.id, 'deactivate')} disabled={vipLoading}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 disabled:opacity-60">
                    Remover VIP
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalhe usuário */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75" onClick={() => setDetailUser(null)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
            style={{ background: '#0e0625' }}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/8 px-6 py-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg font-bold text-white overflow-hidden">
                {detailUser.avatar_url
                  ? <img src={detailUser.avatar_url} alt="" className="h-full w-full object-cover" />
                  : (detailUser.full_name ?? detailUser.email ?? '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{detailUser.full_name ?? 'Sem nome'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-violet-400">{generateUserId(detailUser, users)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${detailUser.user_type === 'prestador' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-white/50'}`}>
                    {detailUser.user_type === 'prestador' ? 'Prestador' : 'Cliente'}
                  </span>
                </div>
              </div>
              <button onClick={() => setDetailUser(null)} className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Info */}
            <div className="space-y-3 px-6 py-5">
              {[
                { label: 'ID único',     value: generateUserId(detailUser, users), mono: true },
                { label: 'E-mail',       value: detailUser.email },
                { label: 'Cadastro',     value: fmt(detailUser.created_at) },
                { label: 'Tipo',         value: detailUser.user_type === 'prestador' ? 'Prestador de serviço' : 'Cliente' },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-white/40">{label}</span>
                  <span className={`text-sm text-white/80 truncate ${mono ? 'font-mono text-violet-400' : ''}`}>{value}</span>
                </div>
              ))}
              {detailUser.user_type === 'prestador' && (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/15 bg-amber-500/5 px-3 py-2">
                  <span className="text-xs text-white/40">Plano VIP</span>
                  <span className={`text-sm font-semibold ${isUserVipActive(detailUser) ? 'text-amber-400' : 'text-white/30'}`}>
                    {isUserVipActive(detailUser)
                      ? `Ativo${detailUser.plan_expires_at ? ` até ${fmt(detailUser.plan_expires_at)}` : ''}`
                      : 'Gratuito'}
                  </span>
                </div>
              )}
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2 border-t border-white/8 px-6 py-4">
              {detailUser.user_type === 'prestador' && (
                <button
                  onClick={() => { setVipTarget(detailUser); setVipForm({ days: 30, badgeType: detailUser.vip_badge_type ?? 'vip' }); setDetailUser(null) }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-yellow-500/20 border border-amber-500/30 py-2.5 text-xs font-semibold text-amber-300 hover:from-amber-600/40 transition-all">
                  <Award className="h-3.5 w-3.5" /> {isUserVipActive(detailUser) ? 'Gerenciar VIP' : 'Tornar VIP'}
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => { setMsgTarget(detailUser); setDetailUser(null) }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-500/15 border border-violet-500/25 py-2.5 text-xs font-semibold text-violet-400 hover:bg-violet-500/25 transition-all">
                  <MessageSquare className="h-3.5 w-3.5" /> Mensagem
                </button>
                <button
                  onClick={() => { setDeleteConfirm(detailUser.id); setDetailUser(null) }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all">
                  <UserX className="h-3.5 w-3.5" /> Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal mensagem */}
      {msgTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMsgTarget(null)} />
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0f0918] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">Mensagem para {msgTarget.full_name ?? msgTarget.email}</h3>
              <button onClick={() => setMsgTarget(null)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSendMsg} className="space-y-3">
              <select value={msgForm.type} onChange={e => setMsgForm(f => ({ ...f, type: e.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none">
                <option value="info">ℹ️ Informativo</option>
                <option value="warning">⚠️ Aviso</option>
                <option value="strike">🚫 Strike / Advertência</option>
              </select>
              <input value={msgForm.title} onChange={e => setMsgForm(f => ({ ...f, title: e.target.value }))} placeholder="Título da mensagem" required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
              <textarea value={msgForm.body} onChange={e => setMsgForm(f => ({ ...f, body: e.target.value }))} placeholder="Mensagem..." rows={4} required
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
              <button type="submit" disabled={sendingMsg}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {sendingMsg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total de Usuários" value={stats.total}     color="text-white" />
        <StatCard label="Prestadores"       value={stats.prestador} color="text-violet-400" />
        <StatCard label="Clientes"          value={stats.cliente}   color="text-fuchsia-400" />
        <StatCard label="VIP Ativos"        value={stats.vip}       color="text-amber-400" />
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou e-mail..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
        </div>
        <div className="flex gap-1">
          {(['all', 'prestador', 'cliente'] as const).map(t => {
            const labels = { all: 'Todos', prestador: 'Prestadores', cliente: 'Clientes' }
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${typeFilter === t ? 'bg-violet-600 text-white' : 'border border-white/10 text-white/40 hover:bg-white/5 hover:text-white'}`}>
                {labels[t]}
              </button>
            )
          })}
        </div>
        <div className="flex gap-1">
          {([['all','Todos'],['vip','👑 VIP'],['free','Gratuito'],['expired','Expirado']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setVipFilter(val as typeof vipFilter)}
              className={`rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${vipFilter === val ? 'bg-amber-600/80 text-white' : 'border border-white/10 text-white/40 hover:bg-white/5 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={fetchUsers} className="rounded-xl border border-white/10 p-2.5 text-white/50 hover:bg-white/5 hover:text-white">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>
        : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40">Usuário</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40 sm:table-cell">Tipo</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40 md:table-cell">Cadastro</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-white/40">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(u => (
                  <tr key={u.id} onClick={() => setDetailUser(u)} className="cursor-pointer hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs font-bold text-white overflow-hidden">
                          {u.avatar_url
                            ? <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />
                            : (u.full_name ?? u.email ?? '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-violet-400">{generateUserId(u, users)}</span>
                            <p className="font-medium text-white">{u.full_name ?? 'Sem nome'}</p>
                          </div>
                          <p className="text-xs text-white/40">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${u.user_type === 'prestador' ? 'bg-violet-500/20 text-violet-300' : 'bg-white/10 text-white/50'}`}>
                          {u.user_type === 'prestador' ? 'Prestador' : 'Cliente'}
                        </span>
                        {isUserVipActive(u) && (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }}>
                            👑 VIP
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-white/40 md:table-cell">{fmt(u.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {u.user_type === 'prestador' && (
                          <button onClick={e => { e.stopPropagation(); setVipTarget(u); setVipForm({ days: 30, badgeType: u.vip_badge_type ?? 'vip' }) }} title="Gerenciar VIP"
                            className={`rounded-lg p-1.5 transition-colors ${isUserVipActive(u) ? 'text-amber-400 hover:bg-amber-500/10' : 'text-white/40 hover:bg-amber-500/10 hover:text-amber-400'}`}>
                            <Award className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={e => { e.stopPropagation(); setMsgTarget(u) }} title="Enviar mensagem"
                          className="rounded-lg p-1.5 text-white/40 hover:bg-violet-500/10 hover:text-violet-400 transition-colors">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        {deleteConfirm === u.id ? (
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleDelete(u.id)} className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-400 hover:bg-red-500/30">Confirmar</button>
                            <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-white/10 px-2 py-1 text-xs text-white/40"><X className="h-3 w-3" /></button>
                          </div>
                        ) : (
                          <button onClick={e => { e.stopPropagation(); setDeleteConfirm(u.id) }} title="Remover usuário"
                            className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                            <UserX className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-white/40">Nenhum usuário encontrado.</div>
            )}
          </div>
        )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ABA: CATEGORIAS
═══════════════════════════════════════════════════ */
const ICONS = ['🔧','🏠','🎓','💈','🍔','🚗','💻','📦','🎉','💊','🌿','🐾','🎨','🔌','🏋️','📸','🧹','🪛','🚿','🌍']
const COLORS = ['#7F77DD','#e879f9','#22d3ee','#fb923c','#4ade80','#f87171','#facc15','#a78bfa','#34d399','#60a5fa']

function CategoriesTab() {
  const [cats, setCats] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', icon: '🔧', description: '', color: '#7F77DD', active: true })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchCats = useCallback(async () => {
    setLoading(true)
    try { setCats(await fetch('/api/admin/categories').then(r => r.json())) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { fetchCats() }, [fetchCats])

  function slugify(str: string) { return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const url = editId ? `/api/admin/categories/${editId}` : '/api/admin/categories'
    const r = await fetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) { setToast({ msg: editId ? 'Categoria atualizada!' : 'Categoria criada!', type: 'success' }); setShowForm(false); setEditId(null); setForm({ name: '', slug: '', icon: '🔧', description: '', color: '#7F77DD', active: true }); fetchCats() }
    else { const d = await r.json(); setToast({ msg: d.error ?? 'Erro ao salvar', type: 'error' }) }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    const r = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (r.ok) { setCats(prev => prev.filter(c => c.id !== id)); setDeleteConfirm(null); setToast({ msg: 'Removida!', type: 'success' }) }
    else setToast({ msg: 'Erro ao remover categoria.', type: 'error' })
  }

  function openEdit(c: CategoryRow) {
    setEditId(c.id); setForm({ name: c.name, slug: c.slug, icon: c.icon, description: c.description ?? '', color: c.color ?? '#7F77DD', active: c.active }); setShowForm(true)
  }

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {showForm ? (
        <div className="mb-6 rounded-3xl border border-violet-500/20 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold text-white">{editId ? 'Editar Categoria' : 'Nova Categoria'}</h2>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/60">Nome *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} placeholder="Ex: Manutenção" required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/60">Slug *</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="manutencao" required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Descrição</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descrição curta da categoria"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">Ícone</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(ic => (
                  <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                    className={`rounded-xl p-2.5 text-xl transition-all ${form.icon === ic ? 'bg-violet-600 ring-2 ring-violet-400' : 'bg-white/5 hover:bg-white/10'}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">Cor</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    style={{ background: c }}
                    className={`h-8 w-8 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#05010a]' : ''}`} />
                ))}
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="h-8 w-8 cursor-pointer rounded-full border border-white/20 bg-transparent" />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null) }} className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/60 hover:bg-white/5">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</span> : editId ? 'Salvar' : 'Criar Categoria'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white">Categorias de Serviço</h2>
            <p className="text-sm text-white/40">{cats.length} categoria(s) cadastrada(s)</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> Nova Categoria
          </button>
        </div>
      )}

      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>
        : cats.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/10 py-20 text-center">
            <Tag className="h-10 w-10 text-white/20" /><p className="text-white/40">Nenhuma categoria cadastrada no banco.</p>
            <p className="text-xs text-white/25">As categorias são usadas pelos prestadores em seus perfis.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map(c => (
              <div key={c.id} className={`rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 ${!c.active ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl" style={{ background: `${c.color ?? '#7F77DD'}22` }}>
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{c.name}</p>
                    <p className="text-xs text-white/40 truncate">/{c.slug}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.active ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'}`}>
                    {c.active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                {c.description && <p className="mt-2 text-xs text-white/40 line-clamp-1">{c.description}</p>}
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => openEdit(c)} className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs text-white/60 hover:border-violet-500/30 hover:text-violet-400">
                    <span className="flex items-center justify-center gap-1"><Edit3 className="h-3 w-3" /> Editar</span>
                  </button>
                  {deleteConfirm === c.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(c.id)} className="rounded-lg bg-red-500/20 px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/30">Sim</button>
                      <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/40">Não</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(c.id)} className="rounded-lg p-1.5 text-white/30 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ABA: AVALIAÇÕES
═══════════════════════════════════════════════════ */
function ReviewsTab() {
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'flagged'>('all')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [strikeTarget, setStrikeTarget] = useState<ReviewRow | null>(null)
  const [strikeForm, setStrikeForm] = useState({ reason: '', observation: '' })
  const [sendingStrike, setSendingStrike] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try { const d = await fetch('/api/admin/reviews').then(r => r.json()); setReviews(Array.isArray(d) ? d : []) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { fetchReviews() }, [fetchReviews])

  async function handleFlag(id: string, flagged: boolean) {
    const r = await fetch(`/api/admin/reviews/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ flagged }) })
    if (r.ok) { setReviews(prev => prev.map(rv => rv.id === id ? { ...rv, flagged } : rv)); setToast({ msg: flagged ? 'Avaliação sinalizada.' : 'Sinalização removida.', type: 'info' }) }
  }

  async function handleDelete(id: string) {
    const r = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    if (r.ok) { setReviews(prev => prev.filter(rv => rv.id !== id)); setDeleteConfirm(null); setToast({ msg: 'Avaliação removida.', type: 'success' }) }
  }

  async function handleStrike(e: React.FormEvent) {
    e.preventDefault()
    if (!strikeTarget) return
    setSendingStrike(true)
    const r = await fetch('/api/admin/strikes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id: strikeTarget.id, user_id: strikeTarget.user_id, ...strikeForm }),
    })
    if (r.ok) {
      setToast({ msg: 'Strike aplicado e aviso enviado ao usuário.', type: 'success' })
      setStrikeTarget(null); setStrikeForm({ reason: '', observation: '' }); fetchReviews()
    } else setToast({ msg: 'Erro ao aplicar strike.', type: 'error' })
    setSendingStrike(false)
  }

  const displayed = filter === 'flagged' ? reviews.filter(r => r.flagged) : reviews

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modal strike */}
      {strikeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setStrikeTarget(null)} />
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0f0918] p-6">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-semibold text-white">Aplicar Strike</h3>
              <button onClick={() => setStrikeTarget(null)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <p className="mb-4 text-xs text-white/40">O usuário receberá uma notificação de advertência.</p>
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs text-white/50 mb-1">Comentário</p>
              <p className="text-sm text-white">{strikeTarget.comment ?? '(sem comentário)'}</p>
            </div>
            <form onSubmit={handleStrike} className="space-y-3">
              <StrikeReasonSelect
                value={strikeForm.reason}
                onChange={v => setStrikeForm(f => ({ ...f, reason: v }))}
              />
              <textarea value={strikeForm.observation} onChange={e => setStrikeForm(f => ({ ...f, observation: e.target.value }))}
                placeholder="Observação para o usuário (opcional)..." rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
              <button type="submit" disabled={sendingStrike}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-500 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {sendingStrike ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />} Aplicar Strike
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mb-5 flex items-center gap-3">
        <div className="flex rounded-xl border border-white/10 overflow-hidden">
          {(['all', 'flagged'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-all ${filter === f ? 'bg-violet-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              {f === 'all' ? 'Todas' : `Sinalizadas (${reviews.filter(r => r.flagged).length})`}
            </button>
          ))}
        </div>
        <button onClick={fetchReviews} className="ml-auto rounded-xl border border-white/10 p-2.5 text-white/50 hover:bg-white/5 hover:text-white">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>
        : displayed.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/10 py-20 text-center">
            <Star className="h-10 w-10 text-white/20" /><p className="text-white/40">Nenhuma avaliação {filter === 'flagged' ? 'sinalizada' : 'encontrada'}.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(rv => (
              <div key={rv.id} className={`rounded-2xl border p-4 transition-all ${rv.flagged ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/10 bg-white/5'}`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white">
                    {(rv.reviewer_name ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white">{rv.reviewer_name ?? 'Anônimo'}</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rv.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                        ))}
                      </div>
                      {rv.flagged && <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold text-orange-400">Sinalizado</span>}
                      <span className="ml-auto text-xs text-white/30">{timeAgo(rv.created_at)}</span>
                    </div>
                    {rv.provider_name && <p className="mt-0.5 text-xs text-violet-400">Prestador: {rv.provider_name}</p>}
                    {rv.comment && <p className="mt-2 text-sm text-white/70">{rv.comment}</p>}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 justify-end">
                  <button onClick={() => handleFlag(rv.id, !rv.flagged)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${rv.flagged ? 'bg-white/10 text-white/50 hover:bg-white/15' : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'}`}>
                    <Flag className="h-3.5 w-3.5" /> {rv.flagged ? 'Remover sinalização' : 'Sinalizar'}
                  </button>
                  <button onClick={() => { setStrikeTarget(rv); setStrikeForm({ reason: '', observation: '' }) }}
                    className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all">
                    <AlertTriangle className="h-3.5 w-3.5" /> Strike
                  </button>
                  {deleteConfirm === rv.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(rv.id)} className="rounded-lg bg-red-500/20 px-2 py-1.5 text-xs text-red-400 hover:bg-red-500/30">Apagar</button>
                      <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/40">Não</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(rv.id)} className="rounded-lg p-1.5 text-white/30 hover:bg-red-500/10 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ABA: GALERIA
═══════════════════════════════════════════════════ */
function GalleryTab() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [bucket, setBucket] = useState<'all' | 'covers' | 'avatars'>('all')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [selected, setSelected] = useState<GalleryImage | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const fetchImages = useCallback(async () => {
    setLoading(true)
    try { setImages(await fetch('/api/admin/gallery').then(r => r.json())) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { fetchImages() }, [fetchImages])

  async function handleUpload(file: File) {
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const d = await r.json()
    if (r.ok) { setToast({ msg: 'Imagem enviada!', type: 'success' }); fetchImages() }
    else setToast({ msg: d.error ?? 'Erro no upload', type: 'error' })
    setUploading(false)
  }

  const filtered = images.filter(img => bucket === 'all' || img.bucket === bucket)

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modal preview */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelected(null)} />
          <div className="relative max-w-2xl w-full">
            <button onClick={() => setSelected(null)} className="absolute -top-10 right-0 text-white/50 hover:text-white"><X className="h-6 w-6" /></button>
            <img src={selected.url} alt="" className="w-full rounded-2xl object-contain max-h-[80vh]" />
            <div className="mt-3 flex items-center gap-3">
              <p className="flex-1 truncate text-sm text-white/50">{selected.name}</p>
              <a href={selected.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/20">
                <Download className="h-3.5 w-3.5" /> Abrir
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="mb-5 flex items-center gap-3 flex-wrap">
        <div className="flex rounded-xl border border-white/10 overflow-hidden">
          {(['all', 'covers', 'avatars'] as const).map(b => (
            <button key={b} onClick={() => setBucket(b)}
              className={`px-4 py-2 text-sm font-medium transition-all ${bucket === b ? 'bg-violet-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              {b === 'all' ? 'Todas' : b === 'covers' ? 'Capas' : 'Avatars'}
            </button>
          ))}
        </div>
        <button onClick={() => !uploading && fileRef.current?.click()} disabled={uploading}
          className="ml-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} className="hidden" />
        <button onClick={fetchImages} className="rounded-xl border border-white/10 p-2.5 text-white/50 hover:bg-white/5 hover:text-white"><RefreshCw className="h-4 w-4" /></button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>
        : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/10 py-20 text-center">
            <ImageIcon className="h-10 w-10 text-white/20" /><p className="text-white/40">Nenhuma imagem encontrada.</p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map(img => (
              <div key={img.name + img.bucket} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 aspect-square cursor-pointer"
                onClick={() => setSelected(img)}>
                <img src={img.url} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="truncate text-[10px] text-white/70">{img.name.split('/').pop()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold ${img.bucket === 'covers' ? 'bg-violet-600 text-white' : 'bg-fuchsia-600 text-white'}`}>
                      {img.bucket}
                    </span>
                    <button onClick={e => { e.stopPropagation() }}
                      className="ml-auto rounded p-1 text-red-400 hover:bg-red-500/20">
                      <Eye className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ABA: MENSAGENS
═══════════════════════════════════════════════════ */
const MSG_TYPE_CFG = {
  info:      { icon: Info,          cls: 'bg-blue-500/20 text-blue-400',      label: 'Informativo' },
  warning:   { icon: AlertTriangle, cls: 'bg-orange-500/20 text-orange-400',  label: 'Aviso' },
  legal:     { icon: FileText,      cls: 'bg-violet-500/20 text-violet-400',  label: 'Legal' },
  strike:    { icon: AlertCircle,   cls: 'bg-red-500/20 text-red-400',        label: 'Advertência' },
  emergency: { icon: Bell,          cls: 'bg-red-600/30 text-red-300',        label: 'Emergencial' },
  financial: { icon: Hash,          cls: 'bg-green-500/20 text-green-400',    label: 'Financeiro' },
  security:  { icon: Shield,        cls: 'bg-yellow-500/20 text-yellow-400',  label: 'Segurança' },
  success:   { icon: CheckCircle,   cls: 'bg-emerald-500/20 text-emerald-400', label: 'Notícia' },
} as const

const PRIO_CFG = {
  low:      { label: 'Baixa',   cls: 'bg-white/10 text-white/40' },
  medium:   { label: 'Média',   cls: 'bg-violet-500/20 text-violet-300' },
  high:     { label: 'Alta',    cls: 'bg-orange-500/20 text-orange-300' },
  critical: { label: 'Crítica', cls: 'bg-red-500/20 text-red-300' },
} as const

function MessagesTab() {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [users,    setUsers]    = useState<UserRow[]>([])
  const [loading,  setLoading]  = useState(true)
  const [toast,    setToast]    = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [sending,  setSending]  = useState(false)
  const [showForm, setShowForm] = useState(false)

  type DestMode = 'all' | 'group' | 'individual'
  const [destMode, setDestMode] = useState<DestMode>('all')
  const [form, setForm] = useState({
    title: '', body: '', type: 'info', priority: 'medium',
    requires_acknowledgment: false, target_user_id: '', group_target: '',
    acknowledgment_deadline_hours: '' as string, // '' = sem prazo, '0' = imediato, '24', '48', '72'
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [msgs, usrs] = await Promise.all([
      fetch('/api/admin/messages').then(r => r.json()),
      fetch('/api/admin/users').then(r => r.json()),
    ])
    setMessages(Array.isArray(msgs) ? msgs : [])
    setUsers(Array.isArray(usrs) ? usrs : [])
    setLoading(false)
  }, [])
  useEffect(() => { fetchData() }, [fetchData])

  function resetForm() {
    setForm({ title: '', body: '', type: 'info', priority: 'medium', requires_acknowledgment: false, target_user_id: '', group_target: '', acknowledgment_deadline_hours: '' })
    setDestMode('all')
    setShowForm(false)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault(); setSending(true)
    const payload: Record<string, unknown> = {
      title: form.title, body: form.body, type: form.type,
      priority: form.priority, requires_acknowledgment: form.requires_acknowledgment,
    }
    if (form.requires_acknowledgment && form.acknowledgment_deadline_hours !== '')
      payload.acknowledgment_deadline_hours = Number(form.acknowledgment_deadline_hours)
    if (destMode === 'individual' && form.target_user_id) payload.target_user_id = form.target_user_id
    if (destMode === 'group' && form.group_target)        payload.group_target   = form.group_target

    const r = await fetch('/api/admin/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    if (r.ok) {
      const dest =
        destMode === 'individual' ? (users.find(u => u.id === form.target_user_id)?.full_name ?? 'usuário')
        : destMode === 'group'    ? (form.group_target === 'prestador' ? 'todos os prestadores' : 'todos os clientes')
        : 'todos os usuários'
      setToast({ msg: `Mensagem enviada para ${dest}!`, type: 'success' })
      resetForm(); fetchData()
    } else setToast({ msg: 'Erro ao enviar mensagem.', type: 'error' })
    setSending(false)
  }

  // Summary stats
  const totalSent = messages.length
  const totalReceipts  = messages.reduce((s, m) => s + (m.receipt_stats?.total ?? 0), 0)
  const totalConfirmed = messages.reduce((s, m) => s + (m.receipt_stats?.acknowledged ?? 0), 0)
  const confRate = totalReceipts > 0 ? Math.round((totalConfirmed / totalReceipts) * 100) : 0

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Mensagens Enviadas" value={totalSent}      color="text-violet-400" />
        <StatCard label="Entregas Geradas"   value={totalReceipts}  color="text-blue-400" />
        <StatCard label="Confirmações"       value={totalConfirmed} color="text-green-400" />
        <StatCard label="Taxa Confirmação"   value={`${confRate}%`} color={confRate >= 80 ? 'text-green-400' : confRate >= 50 ? 'text-yellow-400' : 'text-red-400'} />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white">Central de Comunicação</h2>
          <p className="text-sm text-white/40">Mensagens com entrega rastreada e confirmação obrigatória</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white">
          {showForm ? <X className="h-4 w-4" /> : <><Bell className="h-4 w-4" /> Nova Mensagem</>}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 overflow-hidden rounded-3xl border border-violet-500/20 bg-white/5">
          <div className="border-b border-white/8 px-6 py-4">
            <h3 className="font-semibold text-white">Compor Mensagem</h3>
          </div>
          <form onSubmit={handleSend} className="space-y-5 p-6">

            {/* Tipo + Prioridade */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/60">Tipo</label>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(MSG_TYPE_CFG) as (keyof typeof MSG_TYPE_CFG)[]).map(t => (
                    <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                      className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${form.type === t ? MSG_TYPE_CFG[t].cls + ' ring-1 ring-current' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}>
                      {MSG_TYPE_CFG[t].label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/60">Prioridade</label>
                <div className="flex gap-1.5">
                  {(Object.keys(PRIO_CFG) as (keyof typeof PRIO_CFG)[]).map(p => (
                    <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                      className={`flex-1 rounded-xl py-2 text-xs font-medium transition-all ${form.priority === p ? PRIO_CFG[p].cls + ' ring-1 ring-current' : 'bg-white/5 text-white/30 hover:bg-white/10'}`}>
                      {PRIO_CFG[p].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Destinatário */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">Destinatário</label>
              <div className="mb-3 flex gap-1.5">
                {(['all', 'group', 'individual'] as const).map(m => {
                  const labels = { all: '📢 Todos', group: '👥 Grupo', individual: '👤 Individual' }
                  return (
                    <button key={m} type="button" onClick={() => { setDestMode(m); setForm(f => ({ ...f, target_user_id: '', group_target: '' })) }}
                      className={`flex-1 rounded-xl py-2 text-xs font-medium transition-all ${destMode === m ? 'bg-violet-600 text-white' : 'border border-white/10 text-white/40 hover:bg-white/5 hover:text-white'}`}>
                      {labels[m]}
                    </button>
                  )
                })}
              </div>
              {destMode === 'group' && (
                <div className="flex gap-2">
                  {['prestador', 'cliente'].map(g => (
                    <button key={g} type="button" onClick={() => setForm(f => ({ ...f, group_target: g }))}
                      className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all capitalize ${form.group_target === g ? 'border-violet-500/50 bg-violet-500/15 text-violet-300' : 'border-white/10 text-white/50 hover:bg-white/5'}`}>
                      {g === 'prestador' ? 'Prestadores' : 'Clientes'}
                    </button>
                  ))}
                </div>
              )}
              {destMode === 'individual' && (
                <UserPicker users={users} selectedId={form.target_user_id}
                  onChange={id => setForm(f => ({ ...f, target_user_id: id }))} />
              )}
            </div>

            {/* Título + Corpo */}
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Título da mensagem" required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Texto completo da mensagem..." rows={4} required
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />

            {/* Confirmação obrigatória */}
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/8">
              <input type="checkbox" checked={form.requires_acknowledgment}
                onChange={e => setForm(f => ({ ...f, requires_acknowledgment: e.target.checked, acknowledgment_deadline_hours: '' }))}
                className="h-4 w-4 rounded border-white/20 accent-violet-500" />
              <div>
                <p className="text-sm font-medium text-white">Exigir confirmação de recebimento</p>
                <p className="text-xs text-white/40">Usuário verá modal obrigatório e deve clicar &ldquo;Confirmar Recebimento&rdquo;</p>
              </div>
            </label>

            {/* Prazo de confirmação — só aparece se confirmação obrigatória ativada */}
            {form.requires_acknowledgment && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/6 p-4">
                <p className="mb-3 text-xs font-semibold text-amber-300">
                  ⏱ Prazo para confirmação
                </p>
                <p className="mb-3 text-[11px] text-amber-300/60">
                  Se o usuário não confirmar dentro do prazo, a conta será automaticamente suspensa até a confirmação.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {([
                    { label: 'Sem prazo', value: '' },
                    { label: 'Imediato', value: '0' },
                    { label: '24 horas', value: '24' },
                    { label: '48 horas', value: '48' },
                    { label: '72 horas', value: '72' },
                    { label: '7 dias',   value: '168' },
                  ] as const).map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setForm(f => ({ ...f, acknowledgment_deadline_hours: opt.value }))}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                        form.acknowledgment_deadline_hours === opt.value
                          ? 'border-amber-500/50 bg-amber-500/20 text-amber-200'
                          : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {form.acknowledgment_deadline_hours !== '' && (
                  <p className="mt-2 text-[11px] text-amber-300/50">
                    {form.acknowledgment_deadline_hours === '0'
                      ? '⚠️ Suspensão imediata se não confirmado em 1 minuto.'
                      : `⚠️ Conta suspensa após ${form.acknowledgment_deadline_hours}h sem confirmação.`}
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={resetForm}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/60 hover:bg-white/5">
                Cancelar
              </button>
              <button type="submit" disabled={sending || (destMode === 'individual' && !form.target_user_id) || (destMode === 'group' && !form.group_target)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>
        : messages.length === 0
        ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/10 py-20 text-center">
            <MessageSquare className="h-10 w-10 text-white/20" />
            <p className="text-white/40">Nenhuma mensagem enviada ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => {
              const tcfg = MSG_TYPE_CFG[msg.type as keyof typeof MSG_TYPE_CFG] ?? MSG_TYPE_CFG.info
              const pcfg = PRIO_CFG[msg.priority as keyof typeof PRIO_CFG] ?? PRIO_CFG.medium
              const Icon = tcfg.icon
              const stats = msg.receipt_stats ?? { total: 0, acknowledged: 0, overdue: 0 }
              const pct = stats.total > 0 ? Math.round((stats.acknowledged / stats.total) * 100) : null
              return (
                <div key={msg.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <div className="flex items-start gap-4 p-4">
                    <div className={`shrink-0 rounded-xl p-2.5 ${tcfg.cls}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white">{msg.title}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tcfg.cls}`}>{tcfg.label}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${pcfg.cls}`}>{pcfg.label}</span>
                        {msg.requires_acknowledgment && (
                          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">Confirmação</span>
                        )}
                        {stats.overdue > 0 && (
                          <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                            {stats.overdue} suspenso{stats.overdue > 1 ? 's' : ''}
                          </span>
                        )}
                        <span className="ml-auto text-xs text-white/30">{fmt(msg.created_at)}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/60 line-clamp-2">{msg.body}</p>
                      <p className="mt-1.5 text-xs text-white/30">
                        Para: {
                          msg.target_user_id ? (msg.target_name ?? 'Usuário específico')
                          : msg.group_target === 'prestador' ? '👥 Prestadores'
                          : msg.group_target === 'cliente'   ? '👥 Clientes'
                          : '📢 Todos os usuários'
                        }
                      </p>
                    </div>
                  </div>
                  {stats.total > 0 && (
                    <div className="border-t border-white/8 px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="shrink-0 text-xs text-white/40">
                          {stats.acknowledged}/{stats.total} confirmaram ({pct}%)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ABA: CONFORMIDADE LEGAL
═══════════════════════════════════════════════════ */
function ComplianceTab() {
  const [rows,    setRows]    = useState<ComplianceRow[]>([])
  const [stats,   setStats]   = useState({ total: 0, accepted: 0, pending: 0, version: '1.0' })
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all' | 'pending' | 'accepted'>('all')
  const [toast,   setToast]   = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [sending, setSending] = useState(false)

  const fetchCompliance = useCallback(async () => {
    setLoading(true)
    try {
      const d = await fetch('/api/admin/compliance').then(r => r.json())
      setRows(d.rows ?? [])
      setStats(d.stats ?? { total: 0, accepted: 0, pending: 0, version: '1.0' })
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchCompliance() }, [fetchCompliance])

  async function notifyPending() {
    const pending = rows.filter(r => !r.terms_accepted)
    if (pending.length === 0) return
    setSending(true)
    try {
      for (const row of pending) {
        await fetch('/api/admin/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title:          'Atualização Legal Obrigatória',
            body:           'Para continuar usando a plataforma, acesse seu painel e aceite os Termos de Uso e Responsabilidade. Contas não conformes serão limitadas.',
            type:           'warning',
            target_user_id: row.user_id,
          }),
        })
      }
      setToast({ msg: `Aviso enviado para ${pending.length} prestador(es) pendente(s).`, type: 'success' })
    } catch {
      setToast({ msg: 'Erro ao enviar avisos.', type: 'error' })
    } finally { setSending(false) }
  }

  const displayed = filter === 'pending'  ? rows.filter(r => !r.terms_accepted)
                  : filter === 'accepted' ? rows.filter(r => r.terms_accepted)
                  : rows

  const pct = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-bold text-white">Conformidade Legal — Termos de Uso</h2>
          <p className="mt-0.5 text-sm text-white/40">
            Versão atual dos termos: <span className="font-mono text-violet-400">v{stats.version}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCompliance} className="rounded-xl border border-white/10 p-2.5 text-white/50 hover:bg-white/5 hover:text-white">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={notifyPending}
            disabled={sending || stats.pending === 0}
            className="flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-2.5 text-sm font-semibold text-amber-400 transition-all hover:bg-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
            Notificar Pendentes ({stats.pending})
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/50">Total Prestadores</p>
          <p className="mt-1 text-3xl font-black text-violet-400">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <p className="text-sm text-white/50">Aceitaram</p>
          <p className="mt-1 text-3xl font-black text-emerald-400">{stats.accepted}</p>
          <p className="mt-0.5 text-xs text-white/30">{pct}% de conformidade</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <p className="text-sm text-white/50">Pendentes</p>
          <p className="mt-1 text-3xl font-black text-amber-400">{stats.pending}</p>
          <p className="mt-0.5 text-xs text-white/30">aguardando aceite</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-white/60">Taxa de conformidade</span>
          <span className={`text-sm font-bold ${pct >= 75 ? 'text-emerald-400' : pct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{pct}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-700 ${pct >= 75 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Filter */}
      <div className="mb-5 flex items-center gap-2 flex-wrap">
        <div className="flex overflow-hidden rounded-xl border border-white/10">
          {([['all', 'Todos'], ['accepted', 'Aceitos'], ['pending', 'Pendentes']] as const).map(([f, label]) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-all ${filter === f ? 'bg-violet-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-white/10 py-20 text-center">
          <ScrollText className="h-10 w-10 text-white/20" />
          <p className="text-white/40">Nenhum prestador nesta categoria.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40">Prestador</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40 sm:table-cell">Status</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40 md:table-cell">Versão</th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/40 lg:table-cell">Data aceite</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-white/40">Perfil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayed.map(row => (
                <tr key={row.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs font-bold text-white">
                        {row.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-white">{row.name}</p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {row.terms_accepted ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle className="h-3 w-3" /> Aceito
                      </span>
                    ) : row.needs_update ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/25 px-2.5 py-1 text-xs font-semibold text-blue-400">
                        <RefreshCw className="h-3 w-3" /> Atualização Pendente
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 px-2.5 py-1 text-xs font-semibold text-amber-400">
                        <AlertTriangle className="h-3 w-3" /> Pendente
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-white/40 md:table-cell">
                    {row.terms_version ? <span className="font-mono">v{row.terms_version}</span> : '—'}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-white/40 lg:table-cell">
                    {row.terms_accepted_at ? fmt(row.terms_accepted_at) : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.slug ? (
                      <a href={`/prestadores/${row.slug}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg p-1.5 text-white/30 hover:bg-violet-500/10 hover:text-violet-400 transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   REPORTS TAB — Central de Denúncias
═══════════════════════════════════════════════════ */
type ReportRow = {
  id: string
  // who filed the report
  reporter_user_id: string
  reporter_name: string | null
  reporter_user_type: string | null
  // author of the flagged content
  reported_user_id: string | null
  reported_name: string | null
  reported_user_type: string | null
  // flagged content
  target_type: 'review' | 'reply'
  target_id: string
  target_content: string | null
  target_rating: number | null
  provider_name: string | null
  reason: string
  details: string | null
  status: string
  created_at: string
  admin_action: string | null
  admin_notes: string | null
  resolved_at: string | null
}

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  pending:      { label: 'Pendente',       cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  in_review:    { label: 'Em análise',     cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  resolved:     { label: 'Resolvido',      cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
  action_taken: { label: 'Ação aplicada',  cls: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
}

const ACTION_LABELS: Record<string, string> = {
  ignore:         'Ignorado',
  remove_content: 'Conteúdo removido',
  warn_user:      'Advertência enviada',
  suspend_user:   'Suspensão aplicada',
}

function UserTypeBadge({ type }: { type: string | null }) {
  if (!type) return null
  const isPre = type === 'prestador'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
      isPre ? 'bg-violet-500/20 text-violet-300' : 'bg-sky-500/20 text-sky-300'
    }`}>
      {isPre ? 'PRE' : 'CLI'}
    </span>
  )
}

function ReportsTab() {
  const [reports, setReports]   = useState<ReportRow[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<ReportRow | null>(null)
  const [toast, setToast]       = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [filter, setFilter]     = useState<'all' | 'pending' | 'resolved'>('pending')
  const [acting, setActing]     = useState(false)
  const [warnMsg, setWarnMsg]   = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/reports')
    if (res.ok) setReports(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function takeAction(action: string, targetUserId: string | null) {
    if (!selected) return
    setActing(true)
    const res = await fetch(`/api/admin/reports/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        notes: warnMsg || null,
        user_id: targetUserId,
        warn_message: warnMsg || null,
      }),
    })
    const data = await res.json()
    setActing(false)
    if (!res.ok) { setToast({ msg: data.error || 'Erro ao executar ação', type: 'error' }); return }
    setToast({ msg: 'Ação executada com sucesso!', type: 'success' })
    setSelected(null)
    setWarnMsg('')
    load()
  }

  function closeModal() { setSelected(null); setWarnMsg('') }

  const filtered = reports.filter(r => {
    if (filter === 'pending') return r.status === 'pending' || r.status === 'in_review'
    if (filter === 'resolved') return r.status === 'resolved' || r.status === 'action_taken'
    return true
  })

  const pendingCount = reports.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Central de Denúncias</h2>
          <p className="text-sm text-white/40">
            {pendingCount > 0 ? `${pendingCount} denúncia${pendingCount > 1 ? 's' : ''} pendente${pendingCount > 1 ? 's' : ''}` : 'Nenhuma denúncia pendente'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['pending', 'resolved', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${filter === f ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}>
              {f === 'pending' ? 'Pendentes' : f === 'resolved' ? 'Resolvidas' : 'Todas'}
            </button>
          ))}
          <button onClick={load} className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Flag className="h-10 w-10 text-white/15" />
          <p className="text-white/40">Nenhuma denúncia {filter === 'pending' ? 'pendente' : filter === 'resolved' ? 'resolvida' : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const cfg = STATUS_CFG[r.status] ?? STATUS_CFG.pending
            return (
              <div key={r.id}
                onClick={() => setSelected(r)}
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-violet-500/30 hover:bg-white/[0.08]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border ${r.target_type === 'review' ? 'border-yellow-500/30 bg-yellow-500/15' : 'border-violet-500/30 bg-violet-500/15'}`}>
                      {r.target_type === 'review' ? <Star className="h-4 w-4 text-yellow-400" /> : <Reply className="h-4 w-4 text-violet-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-white/60">
                          {r.target_type === 'review' ? 'Avaliação' : 'Resposta'}
                          {r.provider_name ? ` — ${r.provider_name}` : ''}
                        </span>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-white/80 italic">
                        &quot;{r.target_content || '(sem texto)'}&quot;
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
                        <span>Motivo: <span className="text-white/60">{r.reason}</span></span>
                        <span className="flex items-center gap-1">
                          Denunciante: <span className="text-white/70">{r.reporter_name ?? 'usuário'}</span>
                          <UserTypeBadge type={r.reporter_user_type} />
                        </span>
                        <span className="flex items-center gap-1">
                          Denunciado: <span className="text-white/70">{r.reported_name ?? '—'}</span>
                          <UserTypeBadge type={r.reported_user_type} />
                        </span>
                        <span>{timeAgo(r.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  {r.admin_action && (
                    <span className="flex-shrink-0 rounded-lg bg-white/5 px-2 py-1 text-xs text-white/40">
                      {ACTION_LABELS[r.admin_action] ?? r.admin_action}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de ação */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={closeModal}>
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d0618] p-6 shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>

            {/* Cabeçalho */}
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white">Ação administrativa</h3>
                <p className="mt-1 text-xs text-white/40">
                  Denúncia de {selected.target_type === 'review' ? 'avaliação' : 'resposta'}
                  {selected.provider_name ? ` em ${selected.provider_name}` : ''} · {selected.reason}
                </p>
              </div>
              <button onClick={closeModal} className="text-white/30 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            {/* Conteúdo denunciado */}
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold text-white/40 mb-2">
                {selected.target_type === 'review' ? 'Avaliação denunciada' : 'Resposta denunciada'}
                {selected.target_rating ? ` · ${selected.target_rating}★` : ''}
              </p>
              <p className="text-sm text-white/80 italic">&quot;{selected.target_content || '(sem texto)'}&quot;</p>
              {selected.details && (
                <p className="mt-2 text-xs text-amber-400/70">Detalhes do denunciante: {selected.details}</p>
              )}
            </div>

            {/* Cards: Denunciante vs Denunciado */}
            <div className="mb-5 grid grid-cols-2 gap-3">
              {/* Denunciante */}
              <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-sky-400">Denunciante</p>
                <p className="text-sm font-medium text-white truncate">{selected.reporter_name ?? 'Desconhecido'}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <UserTypeBadge type={selected.reporter_user_type} />
                  <span className="text-[10px] text-white/30 font-mono truncate">{selected.reporter_user_id.slice(0, 8)}…</span>
                </div>
              </div>
              {/* Denunciado */}
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-red-400">Denunciado</p>
                <p className="text-sm font-medium text-white truncate">{selected.reported_name ?? 'Desconhecido'}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <UserTypeBadge type={selected.reported_user_type} />
                  {selected.reported_user_id && (
                    <span className="text-[10px] text-white/30 font-mono truncate">{selected.reported_user_id.slice(0, 8)}…</span>
                  )}
                </div>
              </div>
            </div>

            {/* Mensagem ao usuário */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium text-white/60">
                Mensagem ao usuário <span className="text-white/30">(usada em advertência/suspensão)</span>
              </label>
              <textarea
                value={warnMsg}
                onChange={e => setWarnMsg(e.target.value)}
                placeholder="Ex: Seu conteúdo foi sinalizado por linguagem inadequada..."
                rows={2}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
              />
            </div>

            {/* Ações sobre o DENUNCIADO (autor do conteúdo) */}
            <div className="mb-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-red-400">
                Ações sobre o Denunciado ({selected.reported_name ?? '?'})
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button disabled={acting} onClick={() => takeAction('remove_content', null)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20 disabled:opacity-50 transition-all">
                  <Trash2 className="h-3.5 w-3.5" /> Remover conteúdo
                </button>
                <button disabled={acting || !selected.reported_user_id}
                  onClick={() => takeAction('warn_user', selected.reported_user_id)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 transition-all">
                  <AlertTriangle className="h-3.5 w-3.5" /> Advertir
                </button>
                <button disabled={acting || !selected.reported_user_id}
                  onClick={() => takeAction('suspend_user', selected.reported_user_id)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 py-2 text-xs font-medium text-orange-300 hover:bg-orange-500/20 disabled:opacity-50 transition-all">
                  <UserX className="h-3.5 w-3.5" /> Suspender
                </button>
              </div>
            </div>

            {/* Divisor */}
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-xs text-white/30">ou</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Ações sobre o DENUNCIANTE */}
            <div className="mb-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-sky-400">
                Ações sobre o Denunciante ({selected.reporter_name ?? '?'})
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button disabled={acting} onClick={() => takeAction('ignore', null)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50 transition-all">
                  <Eye className="h-3.5 w-3.5" /> Ignorar
                </button>
                <button disabled={acting}
                  onClick={() => takeAction('warn_user', selected.reporter_user_id)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/20 disabled:opacity-50 transition-all">
                  <AlertTriangle className="h-3.5 w-3.5" /> Advertir
                </button>
                <button disabled={acting}
                  onClick={() => takeAction('suspend_user', selected.reporter_user_id)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 py-2 text-xs font-medium text-orange-300 hover:bg-orange-500/20 disabled:opacity-50 transition-all">
                  <UserX className="h-3.5 w-3.5" /> Suspender
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-white/25">Use estas ações se a denúncia for abusiva ou de má-fé.</p>
            </div>

            {acting && (
              <div className="mt-2 flex items-center justify-center gap-2 text-sm text-white/50">
                <Loader2 className="h-4 w-4 animate-spin" /> Aplicando ação...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   DEMOS TAB
═══════════════════════════════════════════════════ */

type DemoRow = {
  id: string; name: string; slug: string; category: string; category_slug: string
  rating: number; reviews: number; description: string; image: string
  avatar_image?: string | null
  carousel_images?: string[]
  phone: string; whatsapp: string; location: string; vip_badge_type: string; vip_theme_id?: string | null; active: boolean
}

const DEMO_VIP_THEMES = [
  { id: null,        name: 'Original',      emoji: '⚙️',  primary: '#8A5CFF' },
  { id: 'galaxy',    name: 'Galaxy Neon',   emoji: '🌌',  primary: '#818cf8' },
  { id: 'cyberpunk', name: 'Cyberpunk',     emoji: '⚡',  primary: '#fbbf24' },
  { id: 'gold',      name: 'Gold Prestige', emoji: '👑',  primary: '#f59e0b' },
  { id: 'sakura',    name: 'Sakura Pink',   emoji: '🌸',  primary: '#f472b6' },
  { id: 'lava',      name: 'Lava Inferno',  emoji: '🔥',  primary: '#f97316' },
  { id: 'ocean',     name: 'Ocean Blue',    emoji: '🌊',  primary: '#22d3ee' },
  { id: 'aurora',    name: 'Aurora Boreal', emoji: '🌌',  primary: '#00d4aa' },
  { id: 'diamond',   name: 'Diamond Ice',   emoji: '💎',  primary: '#a8d8ea' },
  { id: 'emerald',   name: 'Emerald Lux',   emoji: '💚',  primary: '#10b981' },
  { id: 'sunset',    name: 'Sunset Glow',   emoji: '🌅',  primary: '#fb923c' },
  { id: 'royal',     name: 'Royal Purple',  emoji: '🔮',  primary: '#7c3aed' },
  { id: 'rainbow',   name: 'Neon Rainbow',  emoji: '🌈',  primary: '#f0abfc' },
  { id: 'dark',      name: 'Dark Elite',    emoji: '🖤',  primary: '#f1f5f9' },
  { id: 'obsidian',  name: 'Obsidian Red',  emoji: '🔴',  primary: '#dc2626' },
  { id: 'heaven',    name: 'Heaven Light',  emoji: '✨',  primary: '#fde68a' },
  { id: 'phantom',   name: 'Phantom Blue',  emoji: '👻',  primary: '#3b82f6' },
]

const DEMO_BADGE_OPTIONS = [
  { value: 'vip',            label: '👑 VIP',            border: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  { value: 'premium',        label: '⭐ Premium',        border: '#c4b5fd', bg: 'rgba(139,92,246,0.15)' },
  { value: 'destaque',       label: '🔵 Em Destaque',    border: '#93c5fd', bg: 'rgba(59,130,246,0.15)' },
  { value: 'top_regional',   label: '🏆 Top Regional',   border: '#fda4af', bg: 'rgba(239,68,68,0.15)'  },
  { value: 'perfil_premium', label: '✦ Perfil Premium',  border: '#6ee7b7', bg: 'rgba(16,185,129,0.15)' },
]

const SQL_CREATE = `-- Execute no Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS demo_providers (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT '',
  category_slug text NOT NULL DEFAULT '',
  rating numeric(2,1) DEFAULT 5.0,
  reviews int DEFAULT 0,
  description text DEFAULT '',
  image text DEFAULT '',
  phone text DEFAULT '',
  whatsapp text DEFAULT '',
  location text DEFAULT '',
  vip_badge_type text DEFAULT 'vip',
  updated_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);`

function DemosTab() {
  const [demos, setDemos] = useState<DemoRow[]>([])
  const [loading, setLoading] = useState(true)
  const [tableExists, setTableExists] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<DemoRow>>({})
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCarousel, setUploadingCarousel] = useState(false)
  const [carouselDragIdx, setCarouselDragIdx] = useState<number | null>(null)
  const [carouselDragOver, setCarouselDragOver] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [showSql, setShowSql] = useState(false)
  const imgInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const carouselInputRef = useRef<HTMLInputElement>(null)

  const fetchDemos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/demos')
      const json = await res.json()
      setTableExists(json.tableExists ?? false)
      setDemos(json.data ?? [])
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchDemos() }, [fetchDemos])

  function openEdit(d: DemoRow) {
    setEditId(d.id)
    setForm({ ...d, carousel_images: d.carousel_images ?? [] })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editId) return
    setSaving(true)
    const r = await fetch(`/api/admin/demos/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (r.ok) {
      setToast({ msg: 'Perfil demo atualizado!', type: 'success' })
      setEditId(null)
      fetchDemos()
    } else {
      const d = await r.json()
      setToast({ msg: d.error ?? 'Erro ao salvar', type: 'error' })
    }
    setSaving(false)
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData()
    fd.append('file', file)
    const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const json = await r.json()
    if (json.url) return json.url
    setToast({ msg: json.error ?? 'Erro ao enviar imagem', type: 'error' })
    return null
  }

  async function handleImageUpload(file: File) {
    setUploadingImg(true)
    try {
      const url = await uploadFile(file)
      if (url) { setForm(f => ({ ...f, image: url })); setToast({ msg: 'Imagem de capa enviada!', type: 'success' }) }
    } catch { setToast({ msg: 'Erro ao enviar imagem', type: 'error' }) }
    finally { setUploadingImg(false) }
  }

  async function handleAvatarUpload(file: File) {
    setUploadingAvatar(true)
    try {
      const url = await uploadFile(file)
      if (url) { setForm(f => ({ ...f, avatar_image: url })); setToast({ msg: 'Foto de perfil enviada!', type: 'success' }) }
    } catch { setToast({ msg: 'Erro ao enviar foto', type: 'error' }) }
    finally { setUploadingAvatar(false) }
  }

  async function handleCarouselUpload(files: FileList) {
    const current = form.carousel_images ?? []
    const remaining = 10 - current.length
    if (remaining <= 0) { setToast({ msg: 'Máximo de 10 imagens atingido', type: 'error' }); return }
    setUploadingCarousel(true)
    const uploaded: string[] = []
    for (const file of Array.from(files).slice(0, remaining)) {
      const url = await uploadFile(file)
      if (url) uploaded.push(url)
    }
    if (uploaded.length > 0) {
      setForm(f => ({ ...f, carousel_images: [...(f.carousel_images ?? []), ...uploaded] }))
      setToast({ msg: `${uploaded.length} foto(s) adicionada(s) ao carrossel!`, type: 'success' })
    }
    setUploadingCarousel(false)
  }

  function carouselRemove(url: string) {
    setForm(f => {
      const imgs = (f.carousel_images ?? []).filter(u => u !== url)
      const image = f.image === url ? (imgs[0] ?? '') : f.image
      return { ...f, carousel_images: imgs, image }
    })
  }

  function carouselSetPrimary(url: string) {
    setForm(f => ({ ...f, image: url }))
    setToast({ msg: 'Imagem definida como capa principal!', type: 'success' })
  }

  function onCarouselDragStart(i: number) { setCarouselDragIdx(i) }
  function onCarouselDragOver(e: React.DragEvent, i: number) { e.preventDefault(); setCarouselDragOver(i) }
  function onCarouselDrop(i: number) {
    if (carouselDragIdx === null || carouselDragIdx === i) { setCarouselDragIdx(null); setCarouselDragOver(null); return }
    const imgs = [...(form.carousel_images ?? [])]
    const [moved] = imgs.splice(carouselDragIdx, 1)
    imgs.splice(i, 0, moved)
    setForm(f => ({ ...f, carousel_images: imgs }))
    setCarouselDragIdx(null); setCarouselDragOver(null)
  }

  const badgeColor: Record<string, string> = {
    vip: '#fbbf24', premium: '#c4b5fd', destaque: '#93c5fd', top_regional: '#fda4af', perfil_premium: '#6ee7b7',
  }

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>

  if (!tableExists) return (
    <div className="space-y-4">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white">Tabela não encontrada</h3>
            <p className="mt-1 text-sm text-white/60">
              A tabela <code className="rounded bg-white/10 px-1 py-0.5 text-amber-300">demo_providers</code> ainda não existe no Supabase.
              Execute o SQL abaixo no <strong className="text-white">SQL Editor</strong> do Supabase e recarregue.
            </p>
            <button
              onClick={() => setShowSql(!showSql)}
              className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-500/25 transition-all"
            >
              <FileText className="h-4 w-4" /> {showSql ? 'Ocultar SQL' : 'Ver SQL para criar tabela'}
            </button>
            {showSql && (
              <pre className="mt-3 overflow-x-auto rounded-2xl bg-black/40 p-4 text-xs text-green-300 leading-relaxed border border-white/10">
                {SQL_CREATE}
              </pre>
            )}
          </div>
        </div>
      </div>
      <button onClick={fetchDemos} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all">
        <RefreshCw className="h-4 w-4" /> Verificar novamente
      </button>
    </div>
  )

  /* ── EDIT FORM ── */
  if (editId) {
    const d = demos.find(x => x.id === editId)!
    return (
      <div>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => setEditId(null)} className="rounded-xl border border-white/10 p-2 text-white/40 hover:bg-white/5 hover:text-white">
            <X className="h-4 w-4" />
          </button>
          <div>
            <h2 className="font-bold text-white">Editar: {d.name}</h2>
            <p className="text-xs text-white/40">Slug: <span className="text-violet-300">{d.slug}</span></p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 rounded-3xl border border-violet-500/20 bg-white/5 p-6">

          {/* Preview da imagem */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {form.image
                ? <img src={form.image} alt="" className="h-full w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                : <div className="flex h-full items-center justify-center text-white/20 text-2xl">🖼</div>
              }
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-white/60">Imagem de Capa</label>
              <div className="flex gap-2">
                <input
                  value={form.image ?? ''}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://... ou clique em Fazer Upload"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => imgInputRef.current?.click()}
                  disabled={uploadingImg}
                  className="flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/20 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  {uploadingImg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {uploadingImg ? 'Enviando…' : 'Upload'}
                </button>
              </div>
              <input
                ref={imgInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = '' }}
              />
              <p className="text-[11px] text-white/25">Cole uma URL pública ou faça upload de JPG/PNG/WEBP (máx 5 MB).</p>
            </div>
          </div>

          {/* Foto de Perfil (avatar retrato) */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5" style={{ aspectRatio: '9/16' }}>
              {form.avatar_image
                ? <img src={form.avatar_image} alt="" className="h-full w-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                : <div className="flex h-full items-center justify-center text-white/20 text-xl">👤</div>
              }
            </div>
            <div className="flex-1 space-y-2">
              <label className="block text-sm font-medium text-white/60">Foto de Perfil <span className="text-white/30">(retrato 9:16 — aparece no card principal)</span></label>
              <div className="flex gap-2">
                <input
                  value={form.avatar_image ?? ''}
                  onChange={e => setForm(f => ({ ...f, avatar_image: e.target.value }))}
                  placeholder="https://... ou clique em Fazer Upload"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="flex items-center gap-1.5 rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-2 text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/20 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  {uploadingAvatar ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {uploadingAvatar ? 'Enviando…' : 'Upload'}
                </button>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); e.target.value = '' }}
              />
              <p className="text-[11px] text-white/25">Ideal: foto vertical (retrato). Deixe vazio para exibir a inicial do nome.</p>
            </div>
          </div>

          {/* ── Galeria / Carrossel ── */}
          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Galeria / Carrossel</p>
                <p className="text-[11px] text-white/35">
                  {(form.carousel_images ?? []).length}/10 imagens · arraste para reordenar · primeira = capa
                </p>
              </div>
              <button
                type="button"
                onClick={() => carouselInputRef.current?.click()}
                disabled={uploadingCarousel || (form.carousel_images ?? []).length >= 10}
                className="flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/15 px-3 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/25 transition-all disabled:opacity-40"
              >
                {uploadingCarousel
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Enviando…</>
                  : <><Plus className="h-3.5 w-3.5" /> Adicionar fotos</>}
              </button>
              <input
                ref={carouselInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => { if (e.target.files?.length) handleCarouselUpload(e.target.files); e.target.value = '' }}
              />
            </div>

            {(form.carousel_images ?? []).length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(form.carousel_images ?? []).map((url, i) => {
                  const isPrimary = form.image === url || (i === 0 && !form.image)
                  const isDragTarget = carouselDragOver === i
                  return (
                    <div
                      key={url + i}
                      draggable
                      onDragStart={() => onCarouselDragStart(i)}
                      onDragOver={e => onCarouselDragOver(e, i)}
                      onDrop={() => onCarouselDrop(i)}
                      onDragEnd={() => { setCarouselDragIdx(null); setCarouselDragOver(null) }}
                      className="group relative overflow-hidden rounded-xl transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
                      style={{
                        aspectRatio: '1',
                        border: isPrimary
                          ? '2px solid rgba(167,139,250,0.85)'
                          : isDragTarget
                          ? '2px solid rgba(139,92,246,0.6)'
                          : '1.5px solid rgba(255,255,255,0.07)',
                        boxShadow: isPrimary ? '0 0 18px rgba(139,92,246,0.35)' : 'none',
                        opacity: carouselDragIdx === i ? 0.35 : 1,
                        transform: isDragTarget ? 'scale(1.05)' : 'none',
                      }}
                    >
                      <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />

                      {isPrimary && (
                        <div className="absolute left-1.5 top-1.5 rounded-full bg-violet-600 px-1.5 py-0.5 text-[8px] font-bold text-white shadow-lg">
                          Capa
                        </div>
                      )}

                      {/* ordem */}
                      <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[9px] font-bold text-white/70">
                        {i + 1}
                      </div>

                      {/* hover actions */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => carouselSetPrimary(url)}
                            className="rounded-lg bg-violet-600 px-2 py-1 text-[9px] font-bold text-white hover:bg-violet-500 transition-colors shadow"
                          >
                            ★ Definir capa
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => carouselRemove(url)}
                          className="rounded-lg bg-red-600/90 px-2 py-1 text-[9px] font-bold text-white hover:bg-red-500 transition-colors shadow"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* add more slot */}
                {(form.carousel_images ?? []).length < 10 && (
                  <button
                    type="button"
                    onClick={() => carouselInputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/12 bg-transparent text-white/25 hover:border-violet-500/40 hover:text-violet-400 transition-all"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="text-[9px]">Adicionar</span>
                  </button>
                )}
              </div>
            ) : (
              /* empty state */
              <button
                type="button"
                onClick={() => carouselInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/12 bg-transparent py-8 text-white/25 hover:border-violet-500/35 hover:bg-violet-500/5 hover:text-violet-400 transition-all"
              >
                <ImageIcon className="h-9 w-9" />
                <div className="text-center">
                  <p className="text-sm font-semibold">Carrossel vazio</p>
                  <p className="mt-0.5 text-xs">Clique ou solte até 10 fotos aqui</p>
                </div>
              </button>
            )}
          </div>

          {/* Nome + Categoria */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Nome do Perfil</label>
              <input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Categoria (exibição)</label>
              <input value={form.category ?? ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="Ex: Salão de Beleza"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/60">Descrição</label>
            <textarea value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              placeholder="Descreva o perfil — inclua vantagens do VIP para atrair prestadores."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
          </div>

          {/* Localização + Avaliações + Nota */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Localização</label>
              <input value={form.location ?? ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Bairro, Imperatriz"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Nota (estrelas)</label>
              <input type="number" min={1} max={5} step={0.1} value={form.rating ?? 5} onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Nº de avaliações</label>
              <input type="number" min={0} value={form.reviews ?? 0} onChange={e => setForm(f => ({ ...f, reviews: parseInt(e.target.value) }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none" />
            </div>
          </div>

          {/* Contato */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">Telefone</label>
              <input value={form.phone ?? ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(99) 99999-0000"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/60">WhatsApp (com DDI, ex: 5599…)</label>
              <input value={form.whatsapp ?? ''} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="5599999990000"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none" />
            </div>
          </div>

          {/* Tema visual VIP */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Tema Visual do Perfil — 16 temas premium</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {DEMO_VIP_THEMES.map(t => {
                const sel = (form.vip_theme_id ?? null) === t.id
                return (
                  <button
                    key={String(t.id)}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, vip_theme_id: t.id }))}
                    title={t.name}
                    className="flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all"
                    style={{
                      background: sel ? `${t.primary}22` : 'rgba(255,255,255,0.04)',
                      border: `1.5px solid ${sel ? t.primary : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: sel ? `0 0 10px ${t.primary}55` : 'none',
                    }}
                  >
                    <span className="text-xl leading-none">{t.emoji}</span>
                    <span className="text-[9px] font-semibold leading-tight" style={{ color: sel ? t.primary : 'rgba(255,255,255,0.4)' }}>
                      {t.name.split(' ')[0]}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-white/25">
              Tema selecionado: <span className="font-semibold text-white/50">{DEMO_VIP_THEMES.find(t => t.id === (form.vip_theme_id ?? null))?.name ?? 'Original'}</span>
            </p>
          </div>

          {/* Badge VIP (tema) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/60">Badge do Perfil</label>
            <div className="flex flex-wrap gap-2">
              {DEMO_BADGE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, vip_badge_type: opt.value }))}
                  className="rounded-xl px-3.5 py-2 text-xs font-bold transition-all"
                  style={{
                    background: form.vip_badge_type === opt.value ? opt.bg : 'rgba(255,255,255,0.05)',
                    border: `1.5px solid ${form.vip_badge_type === opt.value ? opt.border : 'rgba(255,255,255,0.1)'}`,
                    color: form.vip_badge_type === opt.value ? opt.border : 'rgba(255,255,255,0.4)',
                    boxShadow: form.vip_badge_type === opt.value ? `0 0 12px ${opt.border}40` : 'none',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ativo toggle */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
              {form.active
                ? <ToggleRight className="h-6 w-6 text-green-400" />
                : <ToggleLeft className="h-6 w-6 text-white/30" />}
              {form.active ? 'Perfil visível no site' : 'Perfil oculto'}
            </button>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setEditId(null)}
              className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/60 hover:bg-white/5 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-semibold text-white disabled:opacity-60 transition-all">
              {saving
                ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</span>
                : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  /* ── LISTA ── */
  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white">Perfis Demonstrativos</h2>
          <p className="text-sm text-white/40">{demos.filter(d => d.active).length} perfil(s) visíveis • funcionam como vitrine VIP do site</p>
        </div>
        <button onClick={fetchDemos} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white transition-all">
          <RefreshCw className="h-3.5 w-3.5" /> Atualizar
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {demos.map(d => {
          const color = badgeColor[d.vip_badge_type] ?? '#fbbf24'
          return (
            <div
              key={d.id}
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white/5 transition-all hover:bg-white/8 ${!d.active ? 'opacity-40' : ''}`}
              style={{ borderColor: `${color}40` }}
            >
              {/* Thumbnail */}
              <div className="relative h-28 overflow-hidden bg-black/30">
                {d.image
                  ? <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                  : <div className="flex h-full items-center justify-center text-4xl text-white/10">{d.name[0]}</div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Badge indicator */}
                <span
                  className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: `${color}25`, border: `1px solid ${color}60`, color }}
                >
                  {DEMO_BADGE_OPTIONS.find(o => o.value === d.vip_badge_type)?.label ?? d.vip_badge_type}
                </span>
                {!d.active && (
                  <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white/50">
                    Oculto
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-1.5 p-3">
                <p className="font-semibold text-white text-sm leading-snug">{d.name}</p>
                <p className="text-xs font-medium" style={{ color }}>{d.category}</p>
                <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">{d.description}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-white/30">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-[11px]">{d.rating}</span>
                  <span>({d.reviews} aval.)</span>
                  {d.location && <><span>·</span><span>{d.location}</span></>}
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => openEdit(d)}
                className="flex w-full items-center justify-center gap-2 border-t py-2.5 text-xs font-semibold transition-all hover:bg-white/5"
                style={{ borderColor: `${color}25`, color }}
              >
                <Edit3 className="h-3.5 w-3.5" /> Editar Perfil
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-white/8 bg-white/3 p-4">
        <p className="text-xs text-white/35 leading-relaxed">
          <strong className="text-white/55">Como funciona:</strong> estes perfis servem como vitrine VIP do site para atrair novos prestadores.
          Cada um tem um tema de cor diferente baseado no badge selecionado. As alterações são salvas no banco e aparecem imediatamente no site.
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   FINANCEIRO TAB
═══════════════════════════════════════════════════ */

type PaymentRow = {
  id: string; user_id: string; provider_name: string | null; provider_slug: string | null
  amount_cents: number; reference_id: string | null; paid_at: string; plan_expires_at: string | null
}

type VipProviderRow = {
  id: string; name: string; slug: string; plan: string
  plan_expires_at: string | null; vip_badge_type: string | null; user_id: string; created_at: string
}

const SQL_PAYMENTS = `-- Execute no Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS vip_payments (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id text NOT NULL,
  provider_name text,
  provider_slug text,
  amount_cents int DEFAULT 799,
  reference_id text,
  paid_at timestamptz DEFAULT now(),
  plan_expires_at timestamptz
);

-- Adiciona colunas extras ao demo_providers (se ainda não tiver):
ALTER TABLE demo_providers ADD COLUMN IF NOT EXISTS vip_theme_id text DEFAULT NULL;
ALTER TABLE demo_providers ADD COLUMN IF NOT EXISTS avatar_image text DEFAULT NULL;
ALTER TABLE demo_providers ADD COLUMN IF NOT EXISTS carousel_images jsonb DEFAULT '[]'::jsonb;`

function FinanceiroTab() {
  const [data, setData]       = useState<{ payments: PaymentRow[]; vipProviders: VipProviderRow[]; totalBrl: string; totalTransactions: number; tableExists: boolean } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSql, setShowSql] = useState(false)
  const [toast, setToast]     = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/financeiro')
      const json = await res.json()
      setData(json)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function fmtBrl(cents: number) {
    return `R$ ${(cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  }

  function isExpired(expiresAt: string | null) {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="h-7 w-7 animate-spin text-violet-400" /></div>
  if (!data)   return null

  return (
    <div className="space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── KPI cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Receita Total</p>
          <p className="mt-2 text-3xl font-black text-white">R$ {parseFloat(data.totalBrl).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="mt-1 text-xs text-white/40">{data.totalTransactions} pagamento(s) confirmado(s)</p>
        </div>
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">VIP Ativos</p>
          <p className="mt-2 text-3xl font-black text-white">
            {data.vipProviders.filter(p => !isExpired(p.plan_expires_at)).length}
          </p>
          <p className="mt-1 text-xs text-white/40">prestadores com plano ativo</p>
        </div>
        <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Ticket Médio</p>
          <p className="mt-2 text-3xl font-black text-white">
            {data.totalTransactions > 0 ? fmtBrl(Math.round(parseFloat(data.totalBrl) * 100 / data.totalTransactions)) : 'R$ 0,00'}
          </p>
          <p className="mt-1 text-xs text-white/40">por assinatura</p>
        </div>
      </div>

      {/* ── SQL alert se tabela não existe ── */}
      {!data.tableExists && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">Tabela de pagamentos não encontrada</p>
              <p className="mt-1 text-xs text-white/55">Crie a tabela <code className="rounded bg-white/10 px-1 text-amber-300">vip_payments</code> no Supabase para registrar os pagamentos automaticamente.</p>
              <button onClick={() => setShowSql(!showSql)} className="mt-2 text-xs text-amber-400 underline hover:text-amber-300">
                {showSql ? 'Ocultar SQL' : 'Ver SQL →'}
              </button>
              {showSql && <pre className="mt-2 overflow-x-auto rounded-xl bg-black/40 p-3 text-xs text-green-300 border border-white/10">{SQL_PAYMENTS}</pre>}
            </div>
          </div>
        </div>
      )}

      {/* ── Histórico de Pagamentos ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-white">Histórico de Pagamentos VIP</h2>
          <button onClick={load} className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:bg-white/5 hover:text-white">
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </button>
        </div>
        {data.payments.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 py-14 text-center">
            <Award className="h-8 w-8 text-white/15" />
            <p className="text-sm text-white/35">Nenhum pagamento registrado ainda.</p>
            <p className="text-xs text-white/20">Os pagamentos aparecerão aqui após o PagBank confirmar via webhook.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40">Prestador</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40">User ID</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40">Pago em</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40">VIP até</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40">Ref. PagBank</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p, i) => (
                  <tr key={p.id} className={`border-b border-white/5 transition-colors hover:bg-white/4 ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{p.provider_name ?? '—'}</p>
                      {p.provider_slug && <p className="text-xs text-white/30">/{p.provider_slug}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-white/8 px-1.5 py-0.5 text-xs text-violet-300">{p.user_id.slice(0, 8)}…</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-emerald-400">{fmtBrl(p.amount_cents)}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/50">{fmt(p.paid_at)}</td>
                    <td className="px-4 py-3">
                      {p.plan_expires_at
                        ? <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isExpired(p.plan_expires_at) ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                            {isExpired(p.plan_expires_at) ? 'Expirado' : fmt(p.plan_expires_at)}
                          </span>
                        : <span className="text-white/25 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs text-white/25">{p.reference_id?.slice(0, 20) ?? '—'}…</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Prestadores VIP ── */}
      <div>
        <h2 className="mb-3 font-bold text-white">Prestadores com Plano VIP/Premium</h2>
        {data.vipProviders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 py-10 text-center">
            <Users className="h-8 w-8 text-white/15" />
            <p className="text-sm text-white/35">Nenhum prestador VIP encontrado.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.vipProviders.map(p => {
              const expired = isExpired(p.plan_expires_at)
              return (
                <div key={p.id} className={`rounded-2xl border p-4 ${expired ? 'border-red-500/20 bg-red-500/5 opacity-60' : 'border-amber-500/25 bg-amber-500/5'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-xs text-white/40">/{p.slug}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${expired ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                      {expired ? 'Expirado' : p.plan.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <Users className="h-3 w-3" />
                      <code className="text-violet-300">{p.user_id.slice(0, 12)}…</code>
                    </div>
                    {p.plan_expires_at && (
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <Calendar className="h-3 w-3" />
                        VIP até: <span className={expired ? 'text-red-400' : 'text-emerald-400'}>{fmt(p.plan_expires_at)}</span>
                      </div>
                    )}
                    {!p.plan_expires_at && (
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <Award className="h-3 w-3" /> VIP Vitalício
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

