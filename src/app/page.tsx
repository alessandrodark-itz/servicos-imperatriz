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
import { supabase } from '@/lib/supabase'
import { Rocket } from 'lucide-react'

export default async function Home() {
  const featuredProviders = getFeaturedProviders()
  const topCategories = categories.slice(0, 8)

  const { data: dbAds } = await supabase
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
            HERO
        ══════════════════════════════════════════ */}
        <section className="relative overflow-hidden px-4 py-20 sm:py-24 lg:py-32" style={{ backgroundColor: '#05010a' }}>

          {/* Background glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 right-0 h-[700px] w-[700px] rounded-full bg-violet-600/15 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">

              {/* ── Left Content ── */}
              <div>
                {/* Badge */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300">
                  <Crown className="h-3.5 w-3.5" />
                  Conectando Imperatriz
                </div>

                {/* Headline */}
                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[3.75rem] xl:text-[4rem] leading-[1.1]">
                  Encontre. Conecte.
                  <br />
                  <span
                    className="animate-gradient-shift bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #a78bfa, #c084fc, #7F77DD, #a78bfa)',
                    }}
                  >
                    Transforme.
                  </span>
                </h1>

                <p className="mt-7 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
                  A plataforma que conecta você aos melhores prestadores de serviços em Imperatriz.
                  Qualidade, confiança e praticidade em um só lugar.
                </p>

                {/* CTA Buttons */}
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/buscar"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#7F77DD] px-8 py-[14px] text-base font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-[#9089e8] hover:shadow-[0_0_30px_rgba(127,119,221,0.5)] sm:w-auto"
                  >
                    <Search className="h-5 w-5" />
                    Sou Cliente
                  </Link>
                  <Link
                    href="/prestador/cadastro"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/25 bg-transparent px-8 py-[14px] text-base font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-white hover:text-[#07021a] hover:border-white sm:w-auto"
                  >
                    <Briefcase className="h-5 w-5" />
                    Sou Prestador
                  </Link>
                </div>

                {/* Stat Cards */}
                <StatCards />
              </div>

              {/* ── Right: Phone Animation ── */}
              <div className="flex justify-center">
                <PhoneAnimation />
              </div>

            </div>
          </div>
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {featuredProviders.slice(0, 4).map((provider) => (
                <ProviderCard key={provider.id} provider={provider} variant="default" />
              ))}

              {/* CTA Card */}
              <div className="relative flex flex-col overflow-hidden rounded-2xl border border-[#7F77DD]/25 bg-gradient-to-b from-[#1a0f2e] to-[#0f0918] p-6">
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
