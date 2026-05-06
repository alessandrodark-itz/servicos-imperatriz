import { createClient } from '@supabase/supabase-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProviderCard from '@/components/ProviderCard'
import SectionHeader from '@/components/SectionHeader'
import { providers as mockProviders, categories } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

async function getAllDbProviders() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('providers') as any)
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    return (data ?? []) as any[]
  } catch {
    return []
  }
}

export default async function PrestadoresPage() {
  const dbProviders = await getAllDbProviders()
  const dbSlugs = new Set(dbProviders.map((p: any) => p.slug))
  const filteredMock = mockProviders.filter((p) => !dbSlugs.has(p.slug))

  const allProviders = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...dbProviders.map((p: any) => {
      const catId = p.categories?.[0]
      const cat = categories.find(c => c.id === catId || c.slug === catId)
      return {
        id:          p.id ?? p.slug,
        name:        p.name        ?? 'Prestador',
        slug:        p.slug        ?? '',
        category:    cat?.name     ?? 'Serviços',
        categorySlug: cat?.slug    ?? '',
        rating:      5.0,
        reviews:     0,
        description: p.description ?? '',
        image:       p.cover_url   ?? '',
        phone:       p.phone       ?? '',
        whatsapp:    p.whatsapp    ?? '',
        location:    p.location    ?? '',
        featured:    false,
      }
    }),
    ...filteredMock,
  ]

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

        <section className="px-4 py-8 pb-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title="Profissionais Disponíveis"
              subtitle={`${allProviders.length} prestadores cadastrados`}
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
