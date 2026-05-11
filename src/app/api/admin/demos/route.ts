import { NextResponse } from 'next/server'
import { createAdmin } from '@/lib/supabase'

const SEED = [
  { id: '1', name: 'Espaço Bella', slug: 'espaco-bella', category: 'Salão de Beleza', category_slug: 'beleza', rating: 5.0, reviews: 214, description: 'Studio premium de beleza feminina — cabelo, unhas e sobrancelhas no mesmo lugar. Membro Top Regional: aparece primeiro nas buscas e garante agenda cheia todos os dias.', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop', phone: '(99) 99999-1111', whatsapp: '5599999991111', location: 'Centro, Imperatriz', vip_badge_type: 'top_regional', vip_theme_id: 'sakura', active: true },
  { id: '2', name: 'Nails Studio Pro', slug: 'nails-studio-pro', category: 'Nail Design', category_slug: 'beleza', rating: 4.9, reviews: 178, description: 'Especialista em alongamento em gel, esmaltação e nail art exclusiva. Perfil Premium verificado: clientes chegam direto até ela — sem concorrência na frente.', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop', phone: '(99) 99999-2222', whatsapp: '5599999992222', location: 'Bacuri, Imperatriz', vip_badge_type: 'perfil_premium', vip_theme_id: 'royal', active: true },
  { id: '3', name: 'Pet Feliz', slug: 'pet-feliz', category: 'Banho e Tosa', category_slug: 'pet-shop', rating: 5.0, reviews: 312, description: 'Banho, tosa e cuidados especiais para pets com amor e responsabilidade. VIP Vitalício: perfil verificado, destaque permanente e donos de pet encontram você em segundos.', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop', phone: '(99) 99999-3333', whatsapp: '5599999993333', location: 'Centro, Imperatriz', vip_badge_type: 'vip', vip_theme_id: 'ocean', active: true },
  { id: '4', name: 'Sabor Caseiro', slug: 'sabor-caseiro', category: 'Marmitas e Delivery', category_slug: 'delivery', rating: 4.8, reviews: 427, description: 'Marmitas caseiras saborosas e nutritivas com entrega rápida em toda Imperatriz. Em Destaque na plataforma: quem tem fome encontra este perfil primeiro — agenda lotada todo dia.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', phone: '(99) 99999-4444', whatsapp: '5599999994444', location: 'Imperatriz', vip_badge_type: 'destaque', vip_theme_id: 'sunset', active: true },
  { id: '5', name: 'Studio Beleza & Cia', slug: 'studio-beleza-cia', category: 'Salão de Beleza', category_slug: 'beleza', rating: 4.9, reviews: 189, description: 'Especialista em coloração, luzes e cortes modernos. Plano Premium ativo: perfil verificado com badge exclusivo e posição de destaque que atrai clientes qualificados todo dia.', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop', phone: '(99) 99999-5555', whatsapp: '5599999995555', location: 'Centro, Imperatriz', vip_badge_type: 'premium', vip_theme_id: 'galaxy', active: true },
  { id: '6', name: 'FotoClick Pro', slug: 'fotoclick-pro', category: 'Fotografia', category_slug: 'fotografia', rating: 4.9, reviews: 95, description: 'Fotógrafo profissional de casamentos, formaturas e ensaios em Imperatriz. Top Regional: quando noivos e famílias buscam fotógrafo aqui, este perfil é o primeiro que aparece.', image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop', phone: '(99) 99999-6666', whatsapp: '5599999996666', location: 'Centro, Imperatriz', vip_badge_type: 'top_regional', vip_theme_id: 'cyberpunk', active: true },
  { id: '7', name: 'Clean House Limpeza', slug: 'clean-house-limpeza', category: 'Limpeza Residencial', category_slug: 'limpeza', rating: 4.8, reviews: 143, description: 'Limpeza residencial e pós-obra com equipe treinada e produtos profissionais. VIP Vitalício: aparece antes de qualquer concorrente e recebe contatos de clientes prontos para contratar.', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop', phone: '(99) 99999-7777', whatsapp: '5599999997777', location: 'Imperatriz', vip_badge_type: 'vip', vip_theme_id: 'emerald', active: true },
  { id: '8', name: 'Prof. Carlos — Exatas', slug: 'aulas-professor-carlos', category: 'Aulas Particulares', category_slug: 'aulas', rating: 5.0, reviews: 67, description: 'Aulas de matemática, física e química para ENEM e vestibulares. Em Destaque: alunos que precisam de reforço urgente encontram este perfil em primeiro lugar na plataforma.', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop', phone: '(99) 99999-8888', whatsapp: '5599999998888', location: 'Centro, Imperatriz', vip_badge_type: 'destaque', vip_theme_id: 'aurora', active: true },
]

export async function GET() {
  const supabase = createAdmin()
  const { data, error } = await supabase
    .from('demo_providers')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    // table may not exist yet
    return NextResponse.json({ data: [], tableExists: false, error: error.message })
  }

  // auto-seed if empty
  if (!data || data.length === 0) {
    const { error: seedErr } = await supabase.from('demo_providers').insert(SEED)
    if (seedErr) return NextResponse.json({ data: [], tableExists: true, error: seedErr.message })
    return NextResponse.json({ data: SEED, tableExists: true })
  }

  return NextResponse.json({ data, tableExists: true })
}
