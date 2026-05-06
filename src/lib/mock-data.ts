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
    id: '3',
    slug: 'manutencao',
    name: 'Manutenção',
    description: 'Encanadores, eletricistas, pedreiros e reparos gerais',
    icon: '🔧',
    count: 89,
    color: 'from-amber-500 to-orange-700',
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
    id: '5',
    slug: 'saude',
    name: 'Saúde',
    description: 'Médicos, dentistas, fisioterapeutas e nutricionistas',
    icon: '💚',
    count: 78,
    color: 'from-green-600 to-emerald-800',
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
    id: '9',
    slug: 'encanadores',
    name: 'Encanadores',
    description: 'Serviços de encanamento, desentupimento e instalações hidráulicas',
    icon: '🔧',
    count: 45,
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: '10',
    slug: 'eletricistas',
    name: 'Eletricistas',
    description: 'Instalações elétricas, manutenção e reparos',
    icon: '⚡',
    count: 38,
    color: 'from-yellow-500 to-yellow-700',
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
    description: 'Studio completo de beleza feminina. Cabelo, unhas, sobrancelhas e muito mais.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
    phone: '(99) 99999-1111',
    whatsapp: '5599999991111',
    location: 'Centro, Imperatriz',
    featured: true,
  },
  {
    id: '2',
    name: 'Eletricista Silva',
    slug: 'eletricista-silva',
    category: 'Instalações Elétricas',
    categorySlug: 'eletricistas',
    rating: 4.9,
    reviews: 178,
    description: 'Instalações elétricas residenciais e comerciais. Atendimento rápido e seguro.',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
    phone: '(99) 99999-2222',
    whatsapp: '5599999992222',
    location: 'Bacuri, Imperatriz',
    featured: true,
  },
  {
    id: '3',
    name: 'Pet Feliz',
    slug: 'pet-feliz',
    category: 'Banho e Tosa',
    categorySlug: 'pet-shop',
    rating: 5.0,
    reviews: 312,
    description: 'Banho, tosa e cuidados especiais para o seu pet. Agendamento online.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    phone: '(99) 99999-3333',
    whatsapp: '5599999993333',
    location: 'Centro, Imperatriz',
    featured: true,
  },
  {
    id: '4',
    name: 'Sabor Caseiro',
    slug: 'sabor-caseiro',
    category: 'Marmitas e Delivery',
    categorySlug: 'delivery',
    rating: 4.8,
    reviews: 427,
    description: 'Marmitas caseiras saborosas e nutritivas. Entrega rápida em toda Imperatriz.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    phone: '(99) 99999-4444',
    whatsapp: '5599999994444',
    location: 'Imperatriz',
    featured: true,
  },
  {
    id: '5',
    name: 'Studio Beleza & Cia',
    slug: 'studio-beleza-cia',
    category: 'Salão de Beleza',
    categorySlug: 'beleza',
    rating: 4.9,
    reviews: 189,
    description: 'Studio especializado em coloração e cortes modernos.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
    phone: '(99) 99999-5555',
    whatsapp: '5599999995555',
    location: 'Centro, Imperatriz',
    featured: true,
  },
  {
    id: '6',
    name: 'FotoClick Pro',
    slug: 'fotoclick-pro',
    category: 'Fotografia',
    categorySlug: 'fotografia',
    rating: 4.9,
    reviews: 95,
    description: 'Fotografia de casamentos, eventos e ensaios fotográficos profissionais.',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop',
    phone: '(99) 99999-6666',
    whatsapp: '5599999996666',
    location: 'Centro, Imperatriz',
  },
  {
    id: '7',
    name: 'Saúde Plena Clínica',
    slug: 'saude-plena-clinica',
    category: 'Saúde',
    categorySlug: 'saude',
    rating: 4.8,
    reviews: 143,
    description: 'Consultas médicas, fisioterapia e nutrição em um só lugar.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    phone: '(99) 99999-7777',
    whatsapp: '5599999997777',
    location: 'Imperatriz',
  },
  {
    id: '8',
    name: 'Aulas Professor Carlos',
    slug: 'aulas-professor-carlos',
    category: 'Aulas Particulares',
    categorySlug: 'aulas',
    rating: 5.0,
    reviews: 67,
    description: 'Aulas de matemática, física e química para o ENEM e vestibulares.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop',
    phone: '(99) 99999-8888',
    whatsapp: '5599999998888',
    location: 'Centro, Imperatriz',
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
