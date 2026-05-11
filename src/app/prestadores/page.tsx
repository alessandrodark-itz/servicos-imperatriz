import { createClient } from '@supabase/supabase-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProviderCard from '@/components/ProviderCard'
import SectionHeader from '@/components/SectionHeader'
import { providers as mockProviders, categories } from '@/lib/mock-data'
import { createAdmin } from '@/lib/supabase'
import { isVip } from '@/lib/plans'

export const dynamic = 'force-dynamic'

async function getAllDbProviders() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const { data } = await (supabase.from('providers') as any)
      .select('id, name, slug, categories, description, cover_url, phone, whatsapp, location, created_at, plan, plan_expires_at, vip_badge_type, updated_at')
      .eq('active', true)
      .order('created_at', { ascending: false })
    return (data ?? []) as any[]
  } catch {
    return []
  }
}

async function getDemoProviders() {
  try {
    const { data } = await createAdmin()
      .from('demo_providers')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: true })
    return (data ?? []) as any[]
  } catch {
    return []
  }
}

function mapDemoToProvider(p: any) {
  return {
    id:            p.id,
    name:          p.name,
    slug:          p.slug,
    category:      p.category,
    categorySlug:  p.category_slug,
    rating:        p.rating ?? 5.0,
    reviews:       p.reviews ?? 0,
    description:   p.description ?? '',
    image:         p.image ?? '',
    phone:         p.phone ?? '',
    whatsapp:      p.whatsapp ?? '',
    location:      p.location ?? '',
    featured:      true,
    plan:          'vip',
    planExpiresAt: null,
    vipBadgeType:  p.vip_badge_type ?? 'vip',
    updatedAt:     p.updated_at ?? null,
  }
}

export default async function PrestadoresPage() {
  const [dbProviders, dbDemos] = await Promise.all([getAllDbProviders(), getDemoProviders()])

  const dbSlugs = new Set(dbProviders.map((p: any) => p.slug))

  // use DB demos if available, else fall back to hardcoded mock
  const demoProviders = dbDemos.length > 0
    ? dbDemos.map(mapDemoToProvider)
    : mockProviders.map(p => ({ ...p, featured: true }))

  // filter out demos that are already real providers in the DB
  const filteredDemos = demoProviders.filter((p: any) => !dbSlugs.has(p.slug))

  const mappedDb = dbProviders.map((p: any) => {
    const catId = p.categories?.[0]
    const cat = categories.find(c => c.id === catId || c.slug === catId)
    return {
      id:            p.id ?? p.slug,
      name:          p.name          ?? 'Prestador',
      slug:          p.slug          ?? '',
      category:      cat?.name       ?? 'Serviços',
      categorySlug:  cat?.slug       ?? '',
      rating:        5.0,
      reviews:       0,
      description:   p.description  ?? '',
      image:         p.cover_url    ?? '',
      phone:         p.phone        ?? '',
      whatsapp:      p.whatsapp     ?? '',
      location:      p.location     ?? '',
      featured:      false,
      plan:          p.plan          ?? 'free',
      planExpiresAt: p.plan_expires_at ?? null,
      vipBadgeType:  p.vip_badge_type ?? null,
      updatedAt:     p.updated_at    ?? null,
    }
  })

  function isMinimallyComplete(p: any) {
    const name = p.name?.trim() ?? ''
    return name.length > 2 && name !== 'Prestador' && (p.whatsapp || p.phone)
  }

  const vipProviders  = [...mappedDb.filter((p: any) => isVip(p.plan, p.planExpiresAt)), ...filteredDemos]
  const freeProviders = mappedDb.filter((p: any) => !isVip(p.plan, p.planExpiresAt) && isMinimallyComplete(p))
  const allProviders  = [...freeProviders]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden px-4 py-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-600/5 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-400">Profissionais qualificados</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Todos os{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                Prestadores
              </span>
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Encontre o profissional ideal para o seu serviço
            </p>
          </div>
        </section>

        {/* VIP section */}
        {vipProviders.length > 0 && (
          <section className="px-4 pb-10">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold"
                  style={{
                    background: 'rgba(251,191,36,0.1)',
                    border: '1px solid rgba(251,191,36,0.3)',
                    color: '#fbbf24',
                  }}
                >
                  <span>👑</span>
                  Profissionais VIP
                </div>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(251,191,36,0.3), transparent)' }} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {vipProviders.map((provider: any) => (
                  <ProviderCard key={provider.id} provider={provider} variant="default" />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-4 py-8 pb-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title="Profissionais Disponíveis"
              subtitle={`${allProviders.length + vipProviders.length} prestadores disponíveis`}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} variant="default" />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
