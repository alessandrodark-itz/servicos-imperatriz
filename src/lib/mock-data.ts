// Dados mock para desenvolvimento
// Estes dados serão substituídos por chamadas ao Supabase em produção

export type Category = {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  count: number
  color: string
}

export type Provider = {
  id: string
  name: string
  slug: string
  category: string
  categorySlug: string
  rating: number
  reviews: number
  description: string
  image: string
  phone?: string
  whatsapp?: string
  location?: string
  featured?: boolean
  plan?: string
  planExpiresAt?: string | null
  vipBadgeType?: string | null
  updatedAt?: string | null
}

export type Ad = {
  id: string
  title: string
  description: string | null
  image_url: string
  link_url: string | null
  button_text: string | null
  phone: string | null
  is_active: boolean
  position: number
}

export const categories: Category[] = [
  {
    id: '1',
    slug: 'beleza',
    name: 'Beleza',
    description: 'Salões, cabelereiros, manicures e estética',
    icon: '✂️',
    count: 120,
    color: 'from-pink-600 to-rose-700',
  },
  {
    id: '2',
    slug: 'pet-shop',
    name: 'Pet Shop',
    description: 'Banho, tosa, veterinários e cuidados com pets',
    icon: '🐾',
    count: 45,
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: '4',
    slug: 'delivery',
    name: 'Delivery',
    description: 'Marmitas, lanches, mercados e entregas em geral',
    icon: '🛵',
    count: 156,
    color: 'from-red-600 to-red-800',
  },
  {
    id: '6',
    slug: 'feira',
    name: 'Feira',
    description: 'Feirantes, hortifruti e produtos naturais',
    icon: '🛒',
    count: 34,
    color: 'from-amber-600 to-yellow-700',
  },
  {
    id: '7',
    slug: 'fotografia',
    name: 'Fotografia',
    description: 'Fotógrafos, videomakers e edição de fotos',
    icon: '📷',
    count: 67,
    color: 'from-teal-600 to-cyan-800',
  },
  {
    id: '8',
    slug: 'aulas',
    name: 'Aulas',
    description: 'Professores particulares, cursos e capacitações',
    icon: '🎓',
    count: 92,
    color: 'from-violet-600 to-purple-800',
  },
  {
    id: '11',
    slug: 'pintores',
    name: 'Pintores',
    description: 'Pintura residencial, comercial e artística',
    icon: '🎨',
    count: 52,
    color: 'from-pink-500 to-pink-700',
  },
  {
    id: '12',
    slug: 'limpeza',
    name: 'Limpeza',
    description: 'Limpeza residencial, comercial e pós-obra',
    icon: '🧹',
    count: 73,
    color: 'from-cyan-500 to-cyan-700',
  },
]

export const providers: Provider[] = [
  {
    id: '1',
    name: 'Espaço Bella',
    slug: 'espaco-bella',
    category: 'Salão de Beleza',
    categorySlug: 'beleza',
    rating: 5.0,
    reviews: 214,
    description: 'Studio premium de beleza feminina — cabelo, unhas e sobrancelhas no mesmo lugar. Membro Top Regional: aparece primeiro nas buscas e garante agenda cheia todos os dias.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    phone: '(99) 99999-1111',
    whatsapp: '5599999991111',
    location: 'Centro, Imperatriz',
    featured: true,
    plan: 'vip',
    planExpiresAt: null,
    vipBadgeType: 'top_regional',
    updatedAt: '2026-05-11T09:30:00.000Z',
  },
  {
    id: '2',
    name: 'Nails Studio Pro',
    slug: 'nails-studio-pro',
    category: 'Nail Design',
    categorySlug: 'beleza',
    rating: 4.9,
    reviews: 178,
    description: 'Especialista em alongamento em gel, esmaltação e nail art exclusiva. Perfil Premium verificado: clientes que buscam nail design chegam direto até ela — sem concorrência na frente.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
    phone: '(99) 99999-2222',
    whatsapp: '5599999992222',
    location: 'Bacuri, Imperatriz',
    featured: true,
    plan: 'vip',
    planExpiresAt: null,
    vipBadgeType: 'perfil_premium',
    updatedAt: '2026-05-11T08:15:00.000Z',
  },
  {
    id: '3',
    name: 'Pet Feliz',
    slug: 'pet-feliz',
    category: 'Banho e Tosa',
    categorySlug: 'pet-shop',
    rating: 5.0,
    reviews: 312,
    description: 'Banho, tosa e cuidados especiais para pets com amor e responsabilidade. VIP Vitalício: perfil verificado, destaque permanente e donos de pet encontram você em segundos.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    phone: '(99) 99999-3333',
    whatsapp: '5599999993333',
    location: 'Centro, Imperatriz',
    featured: true,
    plan: 'vip',
    planExpiresAt: null,
    vipBadgeType: 'vip',
    updatedAt: '2026-05-11T10:00:00.000Z',
  },
  {
    id: '4',
    name: 'Sabor Caseiro',
    slug: 'sabor-caseiro',
    category: 'Marmitas e Delivery',
    categorySlug: 'delivery',
    rating: 4.8,
    reviews: 427,
    description: 'Marmitas caseiras saborosas e nutritivas com entrega rápida em toda Imperatriz. Em Destaque na plataforma: quem tem fome encontra este perfil primeiro — agenda lotada todo dia.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    phone: '(99) 99999-4444',
    whatsapp: '5599999994444',
    location: 'Imperatriz',
    featured: true,
    plan: 'vip',
    planExpiresAt: null,
    vipBadgeType: 'destaque',
    updatedAt: '2026-05-11T07:45:00.000Z',
  },
  {
    id: '5',
    name: 'Studio Beleza & Cia',
    slug: 'studio-beleza-cia',
    category: 'Salão de Beleza',
    categorySlug: 'beleza',
    rating: 4.9,
    reviews: 189,
    description: 'Especialista em coloração, luzes e cortes modernos. Plano Premium ativo: perfil verificado com badge exclusivo e posição de destaque que atrai clientes qualificados todo dia.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
    phone: '(99) 99999-5555',
    whatsapp: '5599999995555',
    location: 'Centro, Imperatriz',
    featured: true,
    plan: 'vip',
    planExpiresAt: null,
    vipBadgeType: 'premium',
    updatedAt: '2026-05-11T06:00:00.000Z',
  },
  {
    id: '6',
    name: 'FotoClick Pro',
    slug: 'fotoclick-pro',
    category: 'Fotografia',
    categorySlug: 'fotografia',
    rating: 4.9,
    reviews: 95,
    description: 'Fotógrafo profissional de casamentos, formaturas e ensaios em Imperatriz. Top Regional: quando noivos e famílias buscam fotógrafo aqui, este perfil é o primeiro que aparece.',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop',
    phone: '(99) 99999-6666',
    whatsapp: '5599999996666',
    location: 'Centro, Imperatriz',
    featured: true,
    plan: 'vip',
    planExpiresAt: null,
    vipBadgeType: 'top_regional',
    updatedAt: '2026-05-11T09:00:00.000Z',
  },
  {
    id: '7',
    name: 'Clean House Limpeza',
    slug: 'clean-house-limpeza',
    category: 'Limpeza Residencial',
    categorySlug: 'limpeza',
    rating: 4.8,
    reviews: 143,
    description: 'Limpeza residencial e pós-obra com equipe treinada e produtos profissionais. VIP Vitalício: aparece antes de qualquer concorrente e recebe contatos de clientes prontos para contratar.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    phone: '(99) 99999-7777',
    whatsapp: '5599999997777',
    location: 'Imperatriz',
    featured: true,
    plan: 'vip',
    planExpiresAt: null,
    vipBadgeType: 'vip',
    updatedAt: '2026-05-11T08:30:00.000Z',
  },
  {
    id: '8',
    name: 'Prof. Carlos — Exatas',
    slug: 'aulas-professor-carlos',
    category: 'Aulas Particulares',
    categorySlug: 'aulas',
    rating: 5.0,
    reviews: 67,
    description: 'Aulas de matemática, física e química para ENEM e vestibulares. Em Destaque: alunos que precisam de reforço urgente encontram este perfil em primeiro lugar na plataforma.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop',
    phone: '(99) 99999-8888',
    whatsapp: '5599999998888',
    location: 'Centro, Imperatriz',
    featured: true,
    plan: 'vip',
    planExpiresAt: null,
    vipBadgeType: 'destaque',
    updatedAt: '2026-05-11T07:00:00.000Z',
  },
]

export const ads: Ad[] = [
  {
    id: '1',
    title: 'Horto Pizzaria',
    description: 'A melhor pizza de Imperatriz!',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
    link_url: '#',
    button_text: 'Peça Agora',
    phone: '(99) 99999-9999',
    is_active: true,
    position: 1,
  },
  {
    id: '2',
    title: 'Constrular Materiais',
    description: 'Tudo para sua obra! Entrega rápida.',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
    link_url: '#',
    button_text: 'Ver Produtos',
    phone: '(99) 99999-8888',
    is_active: true,
    position: 2,
  },
  {
    id: '3',
    title: 'Lava Jato Brilho Car',
    description: 'Seu carro sempre novo! Agende já.',
    image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop',
    link_url: '#',
    button_text: 'Agendar',
    phone: '(99) 99999-7777',
    is_active: true,
    position: 3,
  },
  {
    id: '4',
    title: 'Impera Fitness',
    description: 'Treine seu limite! Avaliação gratuita.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    link_url: '#',
    button_text: 'Avaliar Grátis',
    phone: '(99) 99999-6666',
    is_active: true,
    position: 4,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function getProvidersByCategory(categorySlug: string): Provider[] {
  return providers.filter((p) => p.categorySlug === categorySlug)
}

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find((p) => p.slug === slug)
}

export function getFeaturedProviders(): Provider[] {
  return providers.filter((p) => p.featured)
}

export function searchProviders(query: string): Provider[] {
  const lowerQuery = query.toLowerCase()
  return providers.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  )
}
