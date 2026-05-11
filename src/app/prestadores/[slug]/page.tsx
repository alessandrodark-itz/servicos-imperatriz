import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import { createAdmin } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReviewSection from '@/components/ReviewSection'
import ProfileCarousel from '@/components/ProfileCarousel'
import { ShareButton, FloatingWhatsApp } from '@/components/ProviderActions'
import EmblemasDisplay from '@/components/EmblemasDisplay'
import WhatsAppLink from '@/components/WhatsAppLink'
import PlanBadge from '@/components/PlanBadge'
import OnlineStatus from '@/components/OnlineStatus'
import CatalogSection from '@/components/CatalogSection'
import { getProviderBySlug, categories } from '@/lib/mock-data'
import { isVip, getOnlineStatus } from '@/lib/plans'
import {
  VIP_THEMES, DEFAULT_VIP_CONFIG, generateVipCSS, getVipConic, withAlpha,
  type VipThemeConfig, type VipThemeId,
} from '@/lib/vip-themes'
import {
  MapPin, Phone, MessageCircle, ChevronRight,
  Shield, Zap, CheckCircle2, Award,
} from 'lucide-react'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }

/* ─── Fetch com cache entre generateMetadata e page ─── */
const getCachedProvider = cache(async function getDbProvider(slug: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data } = await db
      .from('providers')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (!data) return null
    const { data: profile } = await db
      .from('profiles')
      .select('avatar_url')
      .eq('id', data.user_id)
      .single()
    return { ...data, avatar_url: profile?.avatar_url ?? null }
  } catch { return null }
})

/* ─── Demo provider: todos os campos de demo_providers ─── */
const getCachedDemoProvider = cache(async function getDemoProvider(slug: string) {
  try {
    const { data } = await (createAdmin() as any)
      .from('demo_providers')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    return data ?? null
  } catch { return null }
})

/* ─── OG copy pool — neutro para homens, mulheres e empresas ─── */
function pickOgCopy(slug: string, name: string, catName?: string) {
  const hash = slug.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

  const titles = [
    `${name} está online agora`,
    `${name} responde no WhatsApp`,
    `Agenda aberta • fale com ${name}`,
    `${name}${catName ? ` • ${catName}` : ''} disponível agora`,
    `Você ainda não viu esse perfil`,
    `Esse perfil está fazendo sucesso`,
    `Confira antes que a agenda encha`,
    `${name} • perfil verificado aqui`,
  ]

  const descriptions = [
    `Agenda aberta, responde rápido. Poucas pessoas chegaram antes de você — veja o perfil.`,
    `Perfil verificado em Imperatriz. Contato direto no WhatsApp, sem complicação.`,
    `Online agora com agenda disponível. Veja os serviços e chame direto.`,
    `Todo mundo está mandando esse perfil. Veja por que antes de perguntar.`,
    `Encontrou. Não deixa escapar — agenda aberta e resposta rápida garantida.`,
    `Serviço top em Imperatriz. Perfil verificado, agenda aberta — chame agora.`,
    `Esse perfil está circulando por aqui. Dê uma olhada antes que a agenda encha.`,
    `Avaliações ótimas, resposta rápida. Contato direto pelo WhatsApp.`,
  ]

  const t = titles[hash % titles.length]
  const d = descriptions[(hash + 3) % descriptions.length]
  return { ogTitle: t, ogDesc: d }
}

/* ─── OG / SEO ─── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const provider  = await getCachedProvider(slug)
  if (!provider) return { title: 'Prestador não encontrado — Serviços Imperatriz' }
  const name   = provider.name ?? 'Prestador'
  const catId  = provider.categories?.[0] ?? provider.category_id
  const cat    = catId ? categories.find(c => c.id === catId || c.slug === catId) : null
  const imgs: string[] = (provider.images ?? []).filter(Boolean)
  const ogImg  = provider.avatar_url ?? imgs[0] ?? null

  const { ogTitle, ogDesc } = pickOgCopy(slug, name, cat?.name)

  return {
    title: `${name}${cat ? ` • ${cat.name}` : ''} — Serviços Imperatriz`,
    description: ogDesc,
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      type: 'profile',
      ...(ogImg ? { images: [{ url: ogImg, width: 1200, height: 630, alt: name }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDesc,
      ...(ogImg ? { images: [ogImg] } : {}),
    },
  }
}

/* ══════════════════════════════════════════════════════════
   CSS DAS ANIMAÇÕES
══════════════════════════════════════════════════════════ */
const CSS = `
  @keyframes heroGlow {
    0%,100% {
      box-shadow:
        0 30px 90px rgba(109,40,217,0.45),
        0 0 0 1px rgba(139,92,246,0.25),
        0 60px 160px rgba(0,0,0,0.7);
    }
    38% {
      box-shadow:
        0 30px 90px rgba(219,39,119,0.4),
        0 0 0 1px rgba(236,72,153,0.25),
        0 60px 160px rgba(0,0,0,0.7);
    }
    70% {
      box-shadow:
        0 30px 90px rgba(6,182,212,0.35),
        0 0 0 1px rgba(6,182,212,0.2),
        0 60px 160px rgba(0,0,0,0.7);
    }
  }
  @keyframes neonSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes photoAura {
    0%,100% { filter: drop-shadow(0 0 22px rgba(139,92,246,0.9)); }
    38%     { filter: drop-shadow(0 0 22px rgba(236,72,153,0.9)); }
    70%     { filter: drop-shadow(0 0 22px rgba(6,182,212,0.9));  }
  }
  @keyframes dotBlink {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.45; transform:scale(.78); }
  }
  @keyframes waGlow {
    0%,100% { box-shadow: 0 0 28px rgba(16,185,129,0.55); }
    50%      { box-shadow: 0 0 50px rgba(16,185,129,0.95), 0 0 0 6px rgba(16,185,129,0.1); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .hero-glow   { animation: heroGlow  5.5s ease-in-out infinite; }
  .neon-spin   { animation: neonSpin  3.5s linear infinite; }
  .photo-aura  { animation: photoAura 5.5s ease-in-out infinite; }
  .dot-blink   { animation: dotBlink  2s ease-in-out infinite; }
  .wa-glow     { animation: waGlow    2.5s ease-in-out infinite; }
  .fu1 { animation: fadeUp .55s ease both; }
  .fu2 { animation: fadeUp .55s ease .09s both; }
  .fu3 { animation: fadeUp .55s ease .18s both; }
  .fu4 { animation: fadeUp .55s ease .27s both; }
  .fu5 { animation: fadeUp .55s ease .36s both; }

  .info-card {
    background: linear-gradient(145deg, rgba(14,5,36,0.9) 0%, rgba(9,3,24,0.95) 100%);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    transition: transform .25s ease, border-color .25s ease;
  }
  .info-card:hover { transform: translateY(-2px); border-color: rgba(139,92,246,0.18); }
  .info-card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.35) 50%, transparent);
  }
  .service-row {
    transition: background .2s ease, transform .2s ease;
    border-radius: 14px;
  }
  .service-row:hover {
    background: rgba(139,92,246,0.07);
    transform: translateX(5px);
  }
  .wa-btn { transition: transform .2s ease, filter .2s ease; }
  .wa-btn:hover { transform: scale(1.04) !important; filter: brightness(1.1); }
  .cat-link { transition: border-color .2s ease, background .2s ease, color .2s ease, transform .2s ease; }
  .cat-link:hover {
    border-color: rgba(139,92,246,0.42) !important;
    background: rgba(139,92,246,0.12) !important;
    color: #c4b5fd !important;
    transform: scale(1.03);
  }
  .contact-row { transition: border-color .2s ease, background .2s ease, color .2s ease; }
  .contact-row:hover { border-color: rgba(139,92,246,0.3) !important; background: rgba(139,92,246,0.08) !important; color: #fff !important; }

  @keyframes floatGlobal {
    0%   { transform: translate3d(0, 20px, 0) scale(1);                      opacity: 0; }
    8%   { opacity: var(--op, 0.4); }
    92%  { opacity: calc(var(--op, 0.4) * 0.55); }
    100% { transform: translate3d(var(--tx, 18px), -110vh, 0) scale(0.22);   opacity: 0; }
  }
  .atm-particle {
    position: absolute;
    width: var(--sz, 3px); height: var(--sz, 3px); border-radius: 50%;
    will-change: transform, opacity;
    animation: floatGlobal var(--dur, 12s) ease-in-out var(--delay, 0s) infinite;
    pointer-events: none;
  }
`

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default async function ProviderDetailPage({ params }: Props) {
  const { slug }       = await params
  const dbProvider     = await getCachedProvider(slug)
  const demoProvider   = !dbProvider ? await getCachedDemoProvider(slug) : null
  const mockProvider   = !dbProvider && !demoProvider ? getProviderBySlug(slug) : null
  if (!dbProvider && !demoProvider && !mockProvider) notFound()

  const p = dbProvider ? {
    name:          dbProvider.name          ?? 'Prestador',
    description:   dbProvider.description   ?? '',
    location:      dbProvider.location      ?? '',
    phone:         dbProvider.phone         ?? '',
    whatsapp:      dbProvider.whatsapp      ?? '',
    images: (() => {
      const imgs = (dbProvider.images ?? []).filter(Boolean)
      return imgs.length > 0 ? imgs : (dbProvider.cover_url ? [dbProvider.cover_url] : [])
    })() as string[],
    coverPosition: dbProvider.cover_position ?? 'center',
    services:      (dbProvider.services     ?? []) as string[],
    categories:    (dbProvider.categories   ?? (dbProvider.category_id ? [dbProvider.category_id] : [])) as string[],
    slug:          dbProvider.slug          ?? slug,
    avatarUrl:     dbProvider.avatar_url    ?? null,
    userId:        dbProvider.user_id       ?? null,
    featured:      false,
    rating:        5.0,
    reviews:       0,
    plan:          dbProvider.plan          ?? 'free',
    planExpiresAt: dbProvider.plan_expires_at ?? null,
    vipBadgeType:  dbProvider.vip_badge_type ?? null,
    updatedAt:     dbProvider.updated_at     ?? null,
  } : demoProvider ? {
    /* ── Perfil demo: dados ao vivo do Supabase demo_providers ── */
    name:          demoProvider.name         ?? 'Demo',
    description:   demoProvider.description  ?? '',
    location:      demoProvider.location     ?? '',
    phone:         demoProvider.phone        ?? '',
    whatsapp:      demoProvider.whatsapp     ?? '',
    images: (() => {
      const carousel = (demoProvider.carousel_images ?? []).filter(Boolean)
      if (carousel.length > 0) return carousel
      return demoProvider.image ? [demoProvider.image] : []
    })(),
    coverPosition: 'center',
    services:      ['Orçamento gratuito', 'Garantia de serviço', 'Atendimento personalizado'],
    categories:    [demoProvider.category_slug ?? 'servicos'],
    slug:          demoProvider.slug         ?? slug,
    avatarUrl:     demoProvider.avatar_image ?? null,
    userId:        null,
    featured:      true,
    rating:        demoProvider.rating       ?? 5.0,
    reviews:       demoProvider.reviews      ?? 0,
    plan:          'vip',
    planExpiresAt: null,
    vipBadgeType:  demoProvider.vip_badge_type ?? 'vip',
    updatedAt:     demoProvider.updated_at   ?? null,
  } : {
    /* ── Fallback estático (mock-data.ts) ── */
    name:          mockProvider!.name,
    description:   mockProvider!.description,
    location:      mockProvider!.location  ?? '',
    phone:         mockProvider!.phone     ?? '',
    whatsapp:      mockProvider!.whatsapp  ?? '',
    images:        mockProvider!.image ? [mockProvider!.image] : [],
    coverPosition: 'center',
    services:      ['Orçamento gratuito', 'Garantia de serviço', 'Atendimento personalizado'],
    categories:    [mockProvider!.categorySlug],
    slug:          mockProvider!.slug,
    avatarUrl:     null,
    userId:        null,
    featured:      mockProvider!.featured ?? false,
    rating:        mockProvider!.rating,
    reviews:       mockProvider!.reviews,
    plan:          mockProvider!.plan ?? 'vip',
    planExpiresAt: mockProvider!.planExpiresAt ?? null,
    vipBadgeType:  mockProvider!.vipBadgeType ?? 'vip',
    updatedAt:     mockProvider!.updatedAt ?? null,
  }

  const vip = isVip(p.plan, p.planExpiresAt)
  const onlineStatus = vip ? getOnlineStatus(p.updatedAt) : null

  // VIP Theme — vip_theme_id vem de demo_providers ou providers
  const vipThemeId = demoProvider?.vip_theme_id ?? (dbProvider as any)?.vip_theme_id ?? null
  const vipCfg: VipThemeConfig = vip && vipThemeId
    ? { themeId: vipThemeId as VipThemeId, borderStyle: 'animated', glowIntensity: 'strong', particles: false }
    : DEFAULT_VIP_CONFIG
  const vipColors      = vip && vipCfg.themeId ? VIP_THEMES[vipCfg.themeId].colors : null
  const vipCSS         = vip ? generateVipCSS(vipCfg) : ''
  const heroBackground = vip && vipColors
    ? vipColors.cardBg
    : 'linear-gradient(145deg, #0d0328 0%, #09021c 55%, #060118 100%)'
  const blobAColor     = vip && vipColors ? vipColors.blobA : 'rgba(124,58,237,0.1)'
  const blobBColor     = vip && vipColors ? vipColors.blobB : 'rgba(219,39,119,0.07)'
  const topNeonLine    = vip && vipColors
    ? `linear-gradient(90deg, transparent, ${vipColors.neonLine} 50%, transparent)`
    : 'linear-gradient(90deg, transparent, rgba(168,85,247,0.8) 50%, transparent)'
  const bottomNeonLine = vip && vipColors
    ? `linear-gradient(90deg, transparent, ${vipColors.border} 50%, transparent)`
    : 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3) 50%, transparent)'
  const photoConic     = vip
    ? getVipConic(vipCfg.themeId)
    : 'conic-gradient(from 0deg, #7b2ff7 0%, #a855f7 14%, #ec4899 28%, #f43f5e 40%, #fb923c 52%, #facc15 60%, #06b6d4 70%, #3b82f6 82%, #8b5cf6 92%, #7b2ff7 100%)'
  const pageBg               = vip && vipColors ? vipColors.pageBg : '#04000f'
  const sectionBarGrad       = vip && vipColors ? vipColors.sectionBar : 'linear-gradient(180deg, #a855f7, #ec4899)'
  const galleryGlowShadow    = vip && vipColors
    ? `0 16px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07), 0 0 40px ${withAlpha(vipColors.glow, 0.15)}`
    : '0 16px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07), 0 0 40px rgba(109,40,217,0.12)'
  const breadcrumbActive     = vip && vipColors ? vipColors.textAccent : '#a78bfa'
  const vipCoverBg           = vip && vipColors ? vipColors.coverBg : null
  const vipThemeImage        = vip && vipCfg.themeId ? VIP_THEMES[vipCfg.themeId].image : null

  const catNames = p.categories
    .map(id => categories.find(c => c.id === id || c.slug === id))
    .filter(Boolean)

  const initials = p.name.charAt(0).toUpperCase()
  const waLink   = p.whatsapp ? `https://wa.me/55${p.whatsapp.replace(/\D/g, '')}` : ''

  /* ─── Bloco de estilo para info-card (reutilizável) ─── */
  const sectionTitle = (label: string) => (
    <div className="mb-5 flex items-center gap-3">
      <div style={{
        width: '4px', height: '22px', borderRadius: '4px',
        background: sectionBarGrad,
        flexShrink: 0,
      }} />
      <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', margin: 0 }}>{label}</h2>
    </div>
  )

  return (
    <>

    {/* ══ VIP FIXED ATMOSPHERIC SYSTEM — cobre viewport inteiro, independente do scroll ══ */}
    {vip && vipThemeImage && vipColors && (
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>

        {/* Layer A — imagem do tema: blur + saturação alta para textura atmosférica vibrante */}
        <div style={{
          position: 'absolute', inset: '-6%',
          backgroundImage: `url(${vipThemeImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(48px) brightness(0.24) saturate(2.2)',
          willChange: 'transform',
        }} />

        {/* Layer B — radiais de glow: intensidade alta para contaminar toda a viewport */}
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            `radial-gradient(ellipse 100% 72% at 18% 15%, ${withAlpha(vipColors.glow, 0.50)} 0%, transparent 62%)`,
            `radial-gradient(ellipse 85% 95% at 84% 82%, ${withAlpha(vipColors.glow, 0.42)} 0%, transparent 58%)`,
            `radial-gradient(ellipse 75% 68% at 52% 48%, ${withAlpha(vipColors.glow, 0.25)} 0%, transparent 68%)`,
            `radial-gradient(ellipse 120% 55% at 50% 105%, ${withAlpha(vipColors.glow, 0.22)} 0%, transparent 60%)`,
          ].join(', '),
        }} />

        {/* Layer C — vinheta lateral suave (não sobrepõe o glow central) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 95% 88% at 50% 40%, transparent 32%, rgba(0,0,0,0.50) 100%)',
        }} />

        {/* Layer D — partículas atmosféricas (CSS-only, GPU-accelerated) */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="atm-particle" style={{
              left:       `${6 + (i * 6.8 + 2) % 88}%`,
              bottom:     `-${4 + (i * 6) % 18}px`,
              '--sz':     `${2 + (i % 3)}px`,
              '--dur':    `${11 + (i * 1.4) % 10}s`,
              '--delay':  `${(i * 0.95) % 11}s`,
              '--tx':     `${-28 + (i * 14) % 56}px`,
              '--op':     `${0.18 + (i % 4) * 0.07}`,
              background: vipColors.primary,
              boxShadow:  `0 0 ${2 + (i % 4) * 2}px ${vipColors.glow}`,
            } as React.CSSProperties} />
          ))}
        </div>

      </div>
    )}

    <div className="flex min-h-screen flex-col" style={{ background: vip && vipThemeImage ? 'transparent' : pageBg }}>
      <style>{`html,body{background:${pageBg};}${vip && vipThemeImage && vipColors ? [
        // Header semi-transparente para o tema respirar
        `header{background:rgba(0,0,0,0.32)!important;}`,
        // Footer: fundo transparente em todos os filhos, tint do tema
        `footer,footer>*{background:transparent!important;}`,
        `footer{background:linear-gradient(180deg,${withAlpha(vipColors.glow,0.07)},rgba(0,0,0,0.42))!important;}`,
        // Headings (LINKS RÁPIDOS, PARA PROFISSIONAIS, CONTATO)
        `footer h3{color:${vipColors.textAccent}!important;}`,
        // Stats (500+, 2.5K+, 4.9★) — gradient de texto do tema
        `footer p.font-black{background-image:linear-gradient(135deg,${vipColors.primary},${vipColors.secondary})!important;-webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent!important;}`,
        // Ícones violet-400 → cor primária do tema
        `footer .text-violet-400{color:${vipColors.primary}!important;}`,
        // Botão Cadastrar Grátis → tema
        `footer a[href="/prestador/cadastro"]{background:${vipColors.buttonBg}!important;box-shadow:0 0 16px ${vipColors.buttonGlow}!important;}`,
        // Botão newsletter → tema
        `footer button{background:${vipColors.buttonBg}!important;box-shadow:0 0 12px ${vipColors.buttonGlow}!important;}`,
        // Linha decorativa do topo do footer → neon do tema
        `footer .h-px.w-full{background:linear-gradient(90deg,transparent,${vipColors.neonLine} 35%,${withAlpha(vipColors.glow,0.55)} 65%,transparent)!important;}`,
        // Logo "Imperatriz" span colorido → cor primária do tema
        `footer span[style]{color:${vipColors.primary}!important;}`,
        // Logo icon div → gradiente do tema
        `footer a[href="/"] > div:first-child{background:linear-gradient(135deg,${vipColors.conicA},${vipColors.conicC})!important;box-shadow:0 0 20px ${vipColors.buttonGlow}!important;}`,
        // Borders dos ícones de contato → tema
        `footer [style*="138,92,255"]{background:${withAlpha(vipColors.glow,0.15)}!important;border-color:${withAlpha(vipColors.glow,0.25)}!important;}`,
        // ReviewSection — rating summary cards gradients
        `.fu4 .from-violet-900\\/30{--tw-gradient-from:${withAlpha(vipColors.glow,0.22)}!important;}`,
        `.fu4 .to-fuchsia-900\\/20{--tw-gradient-to:${withAlpha(vipColors.glow,0.10)}!important;}`,
        `.fu4 .from-violet-900\\/20{--tw-gradient-from:${withAlpha(vipColors.glow,0.15)}!important;}`,
        `.fu4 .to-fuchsia-900\\/10{--tw-gradient-to:${withAlpha(vipColors.glow,0.06)}!important;}`,
        // ReviewSection — icon & action card backgrounds
        `.fu4 .bg-violet-500\\/20{background-color:${withAlpha(vipColors.glow,0.22)}!important;}`,
        `.fu4 .bg-violet-500\\/10{background-color:${withAlpha(vipColors.glow,0.10)}!important;}`,
        // ReviewSection — text colors
        `.fu4 .text-violet-400{color:${vipColors.primary}!important;}`,
        `.fu4 .text-violet-400\\/70{color:${vipColors.primary}!important;opacity:0.7;}`,
        `.fu4 .text-violet-300{color:${vipColors.secondary}!important;}`,
        // ReviewSection — borders
        `.fu4 .border-violet-500\\/20{border-color:${withAlpha(vipColors.glow,0.20)}!important;}`,
        `.fu4 .border-violet-500\\/30{border-color:${withAlpha(vipColors.glow,0.30)}!important;}`,
        // ReviewSection — gradient buttons & avatar circles
        `.fu4 .from-violet-600{--tw-gradient-from:${vipColors.primary}!important;}`,
        `.fu4 .to-fuchsia-500{--tw-gradient-to:${vipColors.secondary}!important;}`,
        // ReviewSection — hover & focus states
        `.fu4 .hover\\:border-violet-500\\/20:hover{border-color:${withAlpha(vipColors.glow,0.20)}!important;}`,
        `.fu4 .hover\\:bg-violet-500\\/20:hover{background-color:${withAlpha(vipColors.glow,0.22)}!important;}`,
        `.fu4 .focus\\:border-violet-500\\/50:focus{border-color:${withAlpha(vipColors.glow,0.50)}!important;}`,
      ].join('') : ''}` + CSS + (vip ? '\n' + vipCSS : '')}</style>
      <Header />

      <main className="flex-1" style={{ position: 'relative' }}>

        {/* ── VIP Ambient Atmosphere — cobre toda a área do perfil ── */}
        {vip && vipColors && (
          <>
            <div style={{
              position: 'absolute', top: 0, left: '-10%',
              width: '75%', height: '65vw', borderRadius: '50%',
              background: withAlpha(vipColors.glow, 0.11),
              filter: 'blur(180px)', pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{
              position: 'absolute', top: '30vw', right: '-5%',
              width: '60%', height: '55vw', borderRadius: '50%',
              background: withAlpha(vipColors.glow, 0.08),
              filter: 'blur(160px)', pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{
              position: 'absolute', top: '75vw', left: '5%',
              width: '65%', height: '55vw', borderRadius: '50%',
              background: withAlpha(vipColors.glow, 0.06),
              filter: 'blur(170px)', pointerEvents: 'none', zIndex: 0,
            }} />
          </>
        )}

        {/* ── VIP Cinematic Cover — topo até o fim da página ── */}
        {vip && vipCoverBg && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '100vh',
            background: vipCoverBg,
            zIndex: 0, pointerEvents: 'none',
          }} />
        )}

        {/* ── Conteúdo do perfil — acima das camadas de fundo ── */}
        <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Breadcrumb ── */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="mx-auto px-4 py-3" style={{ maxWidth: '1100px' }}>
            <nav className="flex items-center gap-1.5 text-xs">
              <Link href="/" style={{ color: 'rgba(255,255,255,0.35)' }} className="transition-colors hover:text-violet-400">Início</Link>
              <ChevronRight className="h-3 w-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
              <Link href="/prestadores" style={{ color: 'rgba(255,255,255,0.35)' }} className="transition-colors hover:text-violet-400">Prestadores</Link>
              <ChevronRight className="h-3 w-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
              <span style={{ color: breadcrumbActive, fontWeight: 600 }}>{p.name}</span>
            </nav>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            1. HERO — Card dominante
        ══════════════════════════════════════════════ */}
        <section className="fu1 px-4" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
          <div className="mx-auto" style={{ maxWidth: '1100px' }}>
            <div
              className="hero-glow relative overflow-hidden"
              style={{
                borderRadius: '24px',
                background: heroBackground,
              }}
            >
              {/* Linha neon no topo */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: topNeonLine,
              }} />
              {/* Glows de fundo */}
              <div style={{
                position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px',
                borderRadius: '50%', background: blobAColor, filter: 'blur(60px)', pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', bottom: '-40px', left: '200px', width: '220px', height: '220px',
                borderRadius: '50%', background: blobBColor, filter: 'blur(50px)', pointerEvents: 'none',
              }} />

              {/* ── VIP: imagem cinematográfica — cobre todo o card ── */}
              {vip && vipThemeImage && (
                <>
                  {/* Imagem full-card — base cinematográfica */}
                  <div
                    className="hidden sm:block"
                    style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url(${vipThemeImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center center',
                      opacity: 0.42,
                      zIndex: 0,
                    }}
                  />
                  {/* Overlay de legibilidade: gradiente esquerda + vinheta top/bottom */}
                  <div
                    className="hidden sm:block"
                    style={{
                      position: 'absolute', inset: 0,
                      background: [
                        `linear-gradient(105deg, ${pageBg} 0%, ${pageBg} 20%, rgba(0,0,0,0.82) 40%, rgba(0,0,0,0.38) 62%, rgba(0,0,0,0.08) 100%)`,
                        `linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 22%, transparent 68%, rgba(0,0,0,0.52) 100%)`,
                      ].join(', '),
                      zIndex: 1,
                    }}
                  />
                </>
              )}

              {/* Conteúdo do hero — acima da imagem de fundo */}
              <div style={{ position: 'relative', zIndex: 2 }}>

              {/* ── Mobile: portrait card com borda neon (idêntico ao desktop) ── */}
              <div
                className="sm:hidden flex justify-center"
                style={{ padding: '24px 24px 0' }}
              >
                {/* WRAPPER EXTERNO: mesmo conic-gradient + overflow:hidden do desktop */}
                <div
                  className="photo-aura relative"
                  style={{
                    width: '58%',
                    maxWidth: '210px',
                    aspectRatio: '9/16',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {/* Conic-gradient girando — igual ao desktop */}
                  <div
                    className="neon-spin"
                    style={{
                      position: 'absolute',
                      width: '200%', height: '200%', top: '-50%', left: '-50%',
                      background: photoConic,
                    }}
                  />

                  {/* WRAPPER INTERNO: inset 3px + overflow:hidden + border-radius correspondente */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '3px',
                      borderRadius: '17px',
                      overflow: 'hidden',
                    }}
                  >
                    {p.avatarUrl ? (
                      <img
                        src={p.avatarUrl} alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(155deg, #1a0640, #4c1d95 55%, #6d28d9)',
                        fontSize: '4.5rem', fontWeight: 900, color: '#fff',
                      }}>{initials}</div>
                    )}
                    {/* Reflexo sutil — igual ao desktop */}
                    <div style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 42%)',
                    }} />
                    {/* Fade no rodapé */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', pointerEvents: 'none',
                      background: 'linear-gradient(0deg, rgba(8,2,24,0.88) 0%, transparent 100%)',
                    }} />
                  </div>

                  {/* Online indicator — posicionado sobre o wrapper externo, igual ao desktop */}
                  <div style={{
                    position: 'absolute', bottom: '14px', left: '12px', zIndex: 10,
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(4,0,18,0.8)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(52,211,153,0.32)', borderRadius: '999px',
                    padding: '6px 12px',
                  }}>
                    <div className="dot-blink" style={{
                      width: '8px', height: '8px', borderRadius: '50%', background: '#34d399',
                      boxShadow: '0 0 10px rgba(52,211,153,1)', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#34d399' }}>Online agora</span>
                  </div>
                </div>
              </div>

              {/* ── Flex principal ── */}
              <div className="flex flex-col sm:flex-row">

                {/* ── FOTO retrato (desktop): double-wrapper para borda neon perfeita ── */}
                <div
                  className="hidden sm:flex sm:items-center"
                  style={{ padding: '24px 0 24px 24px', flexShrink: 0 }}
                >
                  {/*
                    WRAPPER EXTERNO: overflow:hidden + border-radius completo (todos os lados)
                    O conic-gradient giratório preenche o fundo e fica visível como borda.
                  */}
                  <div
                    className="photo-aura relative"
                    style={{
                      width: '210px',
                      minHeight: '420px',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {/* Conic-gradient girando — preenche o container como borda */}
                    <div
                      className="neon-spin"
                      style={{
                        position: 'absolute',
                        width: '200%', height: '200%', top: '-50%', left: '-50%',
                        background: photoConic,
                      }}
                    />

                    {/*
                      WRAPPER INTERNO: inset 3px em todos os lados + overflow:hidden
                      Isso garante 3px de borda neon visível ao redor de toda a foto.
                    */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '3px',
                        borderRadius: '17px',
                        overflow: 'hidden',
                      }}
                    >
                      {p.avatarUrl ? (
                        <img
                          src={p.avatarUrl} alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(155deg, #1a0640, #4c1d95 55%, #6d28d9)',
                          fontSize: '4.5rem', fontWeight: 900, color: '#fff',
                        }}>{initials}</div>
                      )}
                      {/* Reflexo sutil */}
                      <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 42%)',
                      }} />
                      {/* Fade no rodapé para o indicador online */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', pointerEvents: 'none',
                        background: 'linear-gradient(0deg, rgba(8,2,24,0.88) 0%, transparent 100%)',
                      }} />
                    </div>

                    {/* Indicador online — posicionado sobre o wrapper externo */}
                    <div style={{
                      position: 'absolute', bottom: '14px', left: '12px', zIndex: 10,
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(4,0,18,0.8)', backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(52,211,153,0.32)', borderRadius: '999px',
                      padding: '6px 12px',
                    }}>
                      <div className="dot-blink" style={{
                        width: '8px', height: '8px', borderRadius: '50%', background: '#34d399',
                        boxShadow: '0 0 10px rgba(52,211,153,1)', flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#34d399' }}>Online agora</span>
                    </div>
                  </div>
                </div>

                {/* ── CONTEÚDO DIREITO ── */}
                <div style={{
                  flex: 1, display: 'flex', flexDirection: 'column', gap: '20px',
                  padding: 'clamp(20px, 4vw, 40px)',
                  justifyContent: 'center',
                }}>

                  {/* Nome + verificação */}
                  <div>
                    {vip && (
                      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <PlanBadge size="sm" badgeType={p.vipBadgeType} />
                        {onlineStatus && <OnlineStatus status={onlineStatus} variant="profile" />}
                      </div>
                    )}
                    {!vip && p.featured && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                        borderRadius: '999px', padding: '3px 10px',
                        fontSize: '10px', fontWeight: 700, color: '#fbbf24',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}>
                        <Award style={{ width: '10px', height: '10px' }} /> Destaque
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                        fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em', margin: 0,
                        background: 'linear-gradient(90deg, #ffffff 0%, #e9d5ff 55%, #c084fc 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}>
                        {p.name}
                      </h1>
                      <CheckCircle2 style={{
                        width: '22px', height: '22px', color: '#a78bfa', flexShrink: 0,
                        filter: 'drop-shadow(0 0 7px rgba(167,139,250,0.9))',
                      }} />
                    </div>
                  </div>

                  {/* Categoria + localização */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    {catNames.map(cat => (
                      <Link key={cat!.id} href={`/categorias/${cat!.slug}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.38)',
                        borderRadius: '999px', padding: '4px 14px',
                        fontSize: '11px', fontWeight: 700, color: '#c4b5fd',
                        boxShadow: '0 0 12px rgba(139,92,246,0.15)',
                        textDecoration: 'none', transition: 'all .2s ease',
                      }}>
                        {cat!.icon} {cat!.name}
                      </Link>
                    ))}
                    {p.location && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.38)' }}>
                        <MapPin style={{ width: '12px', height: '12px', color: '#e879f9' }} />
                        {p.location}
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#34d399' }}>
                      <span className="dot-blink" style={{
                        display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#34d399',
                        boxShadow: '0 0 6px rgba(52,211,153,1)',
                      }} />
                      Disponível agora
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 500, color: 'rgba(196,181,253,0.7)' }}>
                      <Zap style={{ width: '12px', height: '12px', color: '#a78bfa' }} /> Responde rápido
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.35)' }}>
                      <Shield style={{ width: '12px', height: '12px', color: 'rgba(52,211,153,0.65)' }} /> Perfil verificado
                    </span>
                  </div>

                  {/* CTAs */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {p.whatsapp && (
                      <WhatsAppLink
                        href={waLink}
                        className="wa-glow wa-btn"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: 'linear-gradient(135deg, #059669 0%, #10b981 55%, #34d399 100%)',
                          borderRadius: '16px', padding: '12px 22px',
                          fontSize: '14px', fontWeight: 700, color: '#fff',
                          position: 'relative', overflow: 'hidden',
                        }}
                      >
                        <MessageCircle style={{ width: '16px', height: '16px' }} />
                        Chamar no WhatsApp
                      </WhatsAppLink>
                    )}
                    {p.phone && (
                      <a href={`tel:${p.phone}`} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.11)',
                        borderRadius: '16px', padding: '12px 18px',
                        fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.65)',
                        textDecoration: 'none', transition: 'all .2s ease',
                      }}>
                        <Phone style={{ width: '14px', height: '14px' }} /> {p.phone}
                      </a>
                    )}
                    {vip && <ShareButton name={p.name} />}
                  </div>

                  {/* Separador */}
                  <div style={{
                    height: '1px', width: '100%',
                    background: 'linear-gradient(90deg, rgba(139,92,246,0.45) 0%, rgba(236,72,153,0.18) 55%, transparent 100%)',
                  }} />

                  {/* EMBLEMAS */}
                  {p.userId && (
                    <div>
                      <EmblemasDisplay prestadorId={p.userId} />
                    </div>
                  )}
                </div>
              </div>

              </div>{/* / conteúdo do hero acima da imagem */}

              {/* Linha neon no rodapé */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
                background: bottomNeonLine,
              }} />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            2. GALERIA
        ══════════════════════════════════════════════ */}
        {p.images.length > 0 && (
          <section className="fu2 px-4" style={{ paddingBottom: '32px' }}>
            <div className="mx-auto" style={{ maxWidth: '1100px' }}>
              <div style={{
                borderRadius: '20px', overflow: 'hidden',
                aspectRatio: '16 / 9',
                background: '#07010f',
                boxShadow: galleryGlowShadow,
              }}>
                <ProfileCarousel images={p.images} coverPosition={p.coverPosition} name={p.name} />
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            3. SEÇÕES DE INFORMAÇÃO
        ══════════════════════════════════════════════ */}
        <section className="fu3 px-4" style={{ paddingBottom: '32px' }}>
          <div className="mx-auto" style={{ maxWidth: '1100px' }}>
            <div className="grid gap-6 lg:grid-cols-3">

              {/* Coluna principal */}
              <div className="space-y-5 lg:col-span-2">

                {/* Sobre */}
                {p.description && (
                  <div className="info-card" style={{ padding: '28px' }}>
                    {sectionTitle('Sobre')}
                    <p style={{ color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, fontSize: '14px', margin: 0 }}>
                      {p.description}
                    </p>
                  </div>
                )}

                {/* Áreas de atuação */}
                {catNames.length > 0 && (
                  <div className="info-card" style={{ padding: '28px' }}>
                    {sectionTitle('Áreas de atuação')}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {catNames.map(cat => (
                        <Link key={cat!.id} href={`/categorias/${cat!.slug}`} className="cat-link" style={{
                          display: 'inline-flex', alignItems: 'center', gap: '10px',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '14px', padding: '10px 18px',
                          fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)',
                          textDecoration: 'none',
                        }}>
                          <span style={{ fontSize: '18px' }}>{cat!.icon}</span>
                          {cat!.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Serviços */}
                {p.services.length > 0 && (
                  <div className="info-card" style={{ padding: '28px' }}>
                    {sectionTitle('Serviços Oferecidos')}
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {p.services.map((s, i) => (
                        <li key={i} className="service-row" style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          border: '1px solid rgba(255,255,255,0.06)',
                          background: 'rgba(255,255,255,0.025)',
                          padding: '12px 16px', borderRadius: '14px',
                        }}>
                          <CheckCircle2 style={{ width: '15px', height: '15px', color: 'rgba(139,92,246,0.6)', flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.62)' }}>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-5">

                {/* Contato */}
                <div className="info-card" style={{ padding: '24px' }}>
                  {sectionTitle('Contato')}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {p.phone && (
                      <a href={`tel:${p.phone}`} className="contact-row" style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '14px', padding: '12px 16px',
                        fontSize: '13px', color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                      }}>
                        <Phone style={{ width: '15px', height: '15px', color: '#a78bfa', flexShrink: 0 }} />
                        {p.phone}
                      </a>
                    )}
                    {p.whatsapp && (
                      <WhatsAppLink
                        href={waLink}
                        className="contact-row"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.05))',
                          border: '1px solid rgba(16,185,129,0.28)',
                          borderRadius: '14px', padding: '12px 16px',
                          fontSize: '13px', fontWeight: 600, color: '#34d399',
                        }}
                      >
                        <MessageCircle style={{ width: '15px', height: '15px', flexShrink: 0 }} />
                        Chamar no WhatsApp
                      </WhatsAppLink>
                    )}
                    {p.location && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '14px', padding: '12px 16px',
                        fontSize: '13px', color: 'rgba(255,255,255,0.45)',
                      }}>
                        <MapPin style={{ width: '15px', height: '15px', color: '#e879f9', flexShrink: 0 }} />
                        {p.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Trust card */}
                <div className="info-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                      background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Shield style={{ width: '18px', height: '18px', color: '#34d399' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Perfil verificado</p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.5, margin: 0 }}>
                        Identidade e dados confirmados pela plataforma.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Legal disclaimer */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', lineHeight: 1.6, margin: 0 }}>
                    Este profissional é autônomo e independente. A ServiçosImperatriz atua exclusivamente como canal de visibilidade e conexão, não sendo responsável pela execução ou resultado dos serviços. Contrate com consciência.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            4. CATÁLOGO / CARDÁPIO
        ══════════════════════════════════════════════ */}
        <CatalogSection slug={p.slug} waLink={waLink} sectionBarGrad={sectionBarGrad} />

        {/* ══════════════════════════════════════════════
            5. AVALIAÇÕES
        ══════════════════════════════════════════════ */}
        <section className="fu4 px-4" style={{ paddingBottom: '96px' }}>
          <div className="mx-auto" style={{ maxWidth: '1100px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '5px', height: '24px', borderRadius: '4px',
                background: sectionBarGrad, flexShrink: 0,
              }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0 }}>Avaliações</h2>
              {p.reviews > 0 && (
                <span style={{
                  background: 'rgba(139,92,246,0.15)', borderRadius: '999px',
                  padding: '2px 10px', fontSize: '11px', fontWeight: 600, color: '#c4b5fd',
                }}>
                  {p.reviews}
                </span>
              )}
            </div>
            <ReviewSection providerSlug={p.slug} providerName={p.name} />
          </div>
        </section>

        </div>{/* / content wrapper */}
      </main>

      <Footer />
      {waLink && <FloatingWhatsApp waLink={waLink} name={p.name} />}
    </div>
    </>
  )
}
