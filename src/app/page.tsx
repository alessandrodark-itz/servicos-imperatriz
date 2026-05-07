import Link from 'next/link'
import { Search, Briefcase, Crown } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdsCarousel from '@/components/AdsCarousel'
import ProviderCard from '@/components/ProviderCard'
import CategoryCard from '@/components/CategoryCard'
import PhoneAnimation from '@/components/PhoneAnimation'
import HowItWorks from '@/components/HowItWorks'
import StatCards from '@/components/StatCards'
import { categories, ads as mockAds, getFeaturedProviders } from '@/lib/mock-data'
import { createAdmin } from '@/lib/supabase'
import { Rocket } from 'lucide-react'

export default async function Home() {
  const featuredProviders = getFeaturedProviders()
  const topCategories = categories.slice(0, 8)

  const { data: dbAds } = await createAdmin()
    .from('ads')
    .select('*')
    .eq('is_active', true)
    .order('position', { ascending: true })

  const ads = dbAds && dbAds.length > 0 ? dbAds : mockAds

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ══════════════════════════════════════════
            HERO PREMIUM
        ══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden px-4 py-20 sm:py-24 lg:py-28"
          style={{ background: 'linear-gradient(180deg, #070114 0%, #080318 60%, #05010d 100%)' }}
        >
          {/* ── Background mesh + glows ── */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Grid dots pattern */}
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(138,92,255,0.55) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
              }}
            />
            {/* Main glow orb top-right */}
            <div
              className="absolute -top-32 right-0"
              style={{ width: 720, height: 720, borderRadius: '50%', background: 'radial-gradient(circle, rgba(138,92,255,0.18) 0%, rgba(138,92,255,0.06) 40%, transparent 70%)', filter: 'blur(1px)' }}
            />
            {/* Secondary glow bottom-left */}
            <div
              className="absolute -bottom-48 -left-24"
              style={{ width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,70,239,0.1) 0%, transparent 70%)', filter: 'blur(1px)' }}
            />
            {/* Center subtle glow */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(138,92,255,0.04) 0%, transparent 70%)' }}
            />
            {/* Top horizontal line glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(138,92,255,0.4) 50%, transparent 100%)' }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

              {/* ── Coluna esquerda ── */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

                {/* Badge premium */}
                <div
                  className="mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2"
                  style={{
                    background: 'rgba(255,217,102,0.08)',
                    border: '1px solid rgba(255,217,102,0.28)',
                    boxShadow: '0 0 20px rgba(255,217,102,0.1)',
                  }}
                >
                  <Crown className="h-3.5 w-3.5" style={{ color: '#FFD966' }} />
                  <span className="text-sm font-semibold" style={{ color: '#FFD966' }}>
                    Conectando Imperatriz
                  </span>
                  <div
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: '#FFD966', boxShadow: '0 0 8px #FFD966' }}
                  />
                </div>

                {/* Headline de três linhas */}
                <h1
                  className="font-black tracking-tight text-white"
                  style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
                >
                  <span className="block">Encontre.</span>
                  <span className="block">Conecte.</span>
                  <span
                    className="block"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #8A5CFF 0%, #B18CFF 35%, #d4b8ff 60%, #8A5CFF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundSize: '200% auto',
                      animation: 'gradientShift 4s linear infinite',
                      textShadow: 'none',
                      filter: 'drop-shadow(0 0 28px rgba(138,92,255,0.5))',
                    }}
                  >
                    Transforme.
                  </span>
                </h1>

                {/* Subtítulo */}
                <p
                  className="mt-7 max-w-md text-base leading-relaxed sm:text-lg"
                  style={{ color: 'rgba(169,163,201,0.75)', letterSpacing: '0.01em' }}
                >
                  A plataforma que conecta você aos melhores prestadores de serviços em Imperatriz.
                  <span className="font-medium" style={{ color: 'rgba(177,140,255,0.85)' }}> Qualidade, confiança e praticidade</span> em um só lugar.
                </p>

                {/* CTAs */}
                <div className="mt-9 flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
                  {/* CTA primário — neon gradient */}
                  <Link
                    href="/buscar"
                    className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:scale-[1.04]"
                    style={{
                      background: 'linear-gradient(135deg, #7b2ff7 0%, #8A5CFF 50%, #9b5cff 100%)',
                      boxShadow: '0 0 30px rgba(138,92,255,0.45), 0 8px 24px rgba(0,0,0,0.3)',
                    }}
                  >
                    {/* Shine */}
                    <span
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
                    />
                    <Search className="h-5 w-5 flex-shrink-0" />
                    Sou Cliente
                  </Link>

                  {/* CTA secundário — glassmorphism */}
                  <Link
                    href="/prestador/cadastro"
                    className="btn-secondary group flex items-center justify-center gap-2.5 rounded-2xl px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:scale-[1.04]"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      backdropFilter: 'blur(12px)',
                      border: '1.5px solid rgba(255,255,255,0.18)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                    }}
                  >
                    <Briefcase className="h-5 w-5 flex-shrink-0" />
                    Sou Prestador
                  </Link>
                </div>

                {/* Stat Cards */}
                <StatCards />
              </div>

              {/* ── Coluna direita: Mockup — oculto no mobile ── */}
              <div className="hidden lg:flex justify-center lg:justify-end">
                <PhoneAnimation />
              </div>

            </div>
          </div>

          {/* Keyframes */}
          <style>{`
            @keyframes gradientShift {
              0%   { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
            .btn-secondary:hover {
              background: rgba(138,92,255,0.12) !important;
              border-color: rgba(138,92,255,0.4) !important;
              box-shadow: 0 0 24px rgba(138,92,255,0.2), 0 4px 20px rgba(0,0,0,0.3) !important;
            }
          `}</style>
        </section>

        {/* ══════════════════════════════════════════
            COMO FUNCIONA
        ══════════════════════════════════════════ */}
        <HowItWorks />

        {/* ══════════════════════════════════════════
            ADS CAROUSEL
        ══════════════════════════════════════════ */}
        <div style={{ backgroundColor: '#05010a' }}>
          <AdsCarousel ads={ads} />
        </div>

        {/* ══════════════════════════════════════════
            CATEGORIES
        ══════════════════════════════════════════ */}
        <section className="px-4 py-14 sm:py-16" style={{ backgroundColor: '#05010a' }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#7F77DD]">
                  Categorias
                </p>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  O que você precisa hoje?
                </h2>
              </div>
              <Link
                href="/categorias"
                className="flex items-center gap-1 text-sm font-medium text-[#7F77DD] transition-colors hover:text-violet-300"
              >
                Ver todas as categorias
                <span className="ml-0.5">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {topCategories.map((category) => (
                <CategoryCard key={category.id} category={category} variant="grid" />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FEATURED PROVIDERS
        ══════════════════════════════════════════ */}
        <section className="px-4 pb-16 sm:pb-20" style={{ backgroundColor: '#05010a' }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#7F77DD]">
                  Destaques em Imperatriz
                </p>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Profissionais que fazem a diferença
                </h2>
              </div>
              <Link
                href="/prestadores"
                className="flex items-center gap-1 text-sm font-medium text-[#7F77DD] transition-colors hover:text-violet-300"
              >
                Ver todos os prestadores
                <span className="ml-0.5">→</span>
              </Link>
            </div>

            <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
              {featuredProviders.slice(0, 4).map((provider) => (
                <ProviderCard key={provider.id} provider={provider} variant="default" />
              ))}

              {/* CTA Card */}
              <div className="col-span-2 lg:col-span-1 relative flex flex-col overflow-hidden rounded-2xl border border-[#7F77DD]/25 bg-gradient-to-b from-[#1a0f2e] to-[#0f0918] p-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#7F77DD]">
                  Seja um Prestador
                </p>
                <h3 className="text-lg font-bold text-white">Aumente seus Clientes!</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Cadastre-se gratuitamente e comece a receber contatos agora mesmo.
                </p>
                <div className="mt-auto pt-6">
                  <Link
                    href="/prestador/cadastro"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7F77DD] py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8] hover:shadow-[0_0_30px_rgba(127,119,221,0.5)]"
                  >
                    <Rocket className="h-4 w-4" />
                    Cadastrar Grátis
                  </Link>
                </div>
                <div className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-[#7F77DD]/20 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
