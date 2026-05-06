import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProviderCard from '@/components/ProviderCard'
import SectionHeader from '@/components/SectionHeader'
import { getCategoryBySlug, getProvidersByCategory, categories } from '@/lib/mock-data'
import { ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }))
}

async function getDbProvidersByCategory(categoryId: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('providers') as any)
      .select('*')
      .eq('active', true)
      .contains('categories', [categoryId])
    return (data ?? []) as any[]
  } catch {
    return []
  }
}

export default async function CategoriaDetailPage({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  // Busca providers reais do banco por categoria ID (ex: '1', '2'...)
  const dbProviders = await getDbProvidersByCategory(category.id)

  // Providers do mock como fallback
  const mockProviders = getProvidersByCategory(slug)

  // Monta lista unificada — DB primeiro, depois mock (sem duplicar slug)
  const dbSlugs = new Set(dbProviders.map((p: any) => p.slug))
  const filteredMock = mockProviders.filter((p) => !dbSlugs.has(p.slug))

  const allProviders = [
    ...dbProviders.map((p: any) => ({
      id:          p.id ?? p.slug,
      name:        p.name        ?? 'Prestador',
      slug:        p.slug        ?? '',
      category:    category.name,
      categorySlug: slug,
      rating:      5.0,
      reviews:     0,
      description: p.description ?? '',
      image:       p.cover_url   ?? '',
      phone:       p.phone       ?? '',
      whatsapp:    p.whatsapp    ?? '',
      location:    p.location    ?? '',
      featured:    false,
      fromDb:      true,
    })),
    ...filteredMock.map((p) => ({ ...p, fromDb: false })),
  ]

  const total = allProviders.length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-white/10 bg-white/5">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-white/50 hover:text-violet-400 transition-colors">Início</Link>
              <ChevronRight className="h-4 w-4 text-white/30" />
              <Link href="/categorias" className="text-white/50 hover:text-violet-400 transition-colors">Categorias</Link>
              <ChevronRight className="h-4 w-4 text-white/30" />
              <span className="text-violet-400">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Header da Categoria */}
        <section className="relative overflow-hidden px-4 py-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} p-5 text-4xl shadow-lg`}>
                {category.icon}
              </div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{category.name}</h1>
              <p className="mt-3 text-lg text-white/60 max-w-2xl">{category.description}</p>
              <span className="mt-4 rounded-full bg-violet-500/20 px-4 py-2 text-sm font-medium text-violet-400">
                {total} profissiona{total !== 1 ? 'is' : 'l'} disponíve{total !== 1 ? 'is' : 'l'}
              </span>
            </div>
          </div>
        </section>

        {/* Lista */}
        <section className="px-4 py-8 pb-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              title={`Profissionais de ${category.name}`}
              subtitle="Encontre o ideal para você"
            />

            {allProviders.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {allProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} variant="default" />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                <p className="text-white/60">Nenhum profissional encontrado nesta categoria ainda.</p>
                <Link href="/cadastro"
                  className="mt-4 inline-flex items-center gap-2 text-violet-400 hover:text-violet-300">
                  Cadastre-se como profissional
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
