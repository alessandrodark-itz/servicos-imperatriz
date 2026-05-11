// ─────────────────────────────────────────────────────────────────
// Sistema de Temas VIP — 16 temas premium + helpers
// ─────────────────────────────────────────────────────────────────

export type VipThemeId =
  | 'galaxy' | 'cyberpunk' | 'gold' | 'sakura' | 'lava' | 'ocean'
  | 'aurora'  | 'diamond'  | 'emerald' | 'sunset' | 'royal' | 'rainbow'
  | 'dark'    | 'obsidian' | 'heaven'  | 'phantom'

export type BorderStyle   = 'solid' | 'gradient' | 'animated' | 'pulse' | 'rainbow' | 'cyber'
export type GlowIntensity = 'subtle' | 'medium' | 'strong'

export interface VipThemeConfig {
  themeId:       VipThemeId | null   // null = tema original roxo do sistema
  borderStyle:   BorderStyle
  glowIntensity: GlowIntensity
  particles:     boolean
}

export const DEFAULT_VIP_CONFIG: VipThemeConfig = {
  themeId:       null,
  borderStyle:   'animated',
  glowIntensity: 'medium',
  particles:     false,
}

export interface VipThemeDef {
  id:          VipThemeId
  name:        string
  emoji:       string
  description: string
  image:       string   // URL da imagem cinematográfica do tema
  colors: {
    primary:     string   // hex neon principal
    secondary:   string   // hex neon secundário
    glow:        string   // rgba para box-shadow / filter
    border:      string   // rgba para borda 1px
    cardBg:      string   // gradient do hero card
    blobA:       string   // rgba blob de fundo A
    blobB:       string   // rgba blob de fundo B
    textAccent:  string   // hex para textos / badges de destaque
    conicA:      string   // conic-gradient cor A
    conicB:      string   // conic-gradient cor B
    conicC:      string   // conic-gradient cor C
    buttonBg:    string   // gradient do botão de ação
    buttonGlow:  string   // rgba do glow do botão
    neonLine:    string   // rgba da linha neon topo/rodapé
    // Tokens para theming completo do perfil público
    pageBg:      string   // fundo da página inteira
    cardInnerBg: string   // fundo dos info-cards (seções)
    sectionBar:  string   // gradient da barra lateral dos títulos
    coverBg:     string   // CSS background multi-layer para a capa cinematográfica
  }
}

// ─── Utilitário: muda o alpha de qualquer rgba(r,g,b,a) ──────────
export function withAlpha(rgba: string, alpha: number): string {
  return rgba.replace(/,\s*[\d.]+\)$/, `, ${alpha})`)
}

// ─────────────────────────────────────────────────────────────────
// 16 TEMAS PREMIUM
// ─────────────────────────────────────────────────────────────────
export const VIP_THEMES: Record<VipThemeId, VipThemeDef> = {

  // ── 1. Galaxy Neon ───────────────────────────────────────────
  galaxy: {
    id: 'galaxy', name: 'Galaxy Neon', emoji: '🌌',
    description: 'Azul e roxo com glow espacial profundo',
    image: '/themes/galaxy.png',
    colors: {
      primary:    '#818cf8', secondary:  '#a78bfa',
      glow:       'rgba(129,140,248,0.6)', border: 'rgba(129,140,248,0.5)',
      cardBg:     'linear-gradient(145deg, #06040f 0%, #0d0821 55%, #100c22 100%)',
      blobA:      'rgba(99,102,241,0.12)', blobB: 'rgba(167,139,250,0.08)',
      textAccent: '#a5b4fc',
      conicA: '#4f46e5', conicB: '#818cf8', conicC: '#a78bfa',
      buttonBg:   'linear-gradient(135deg,#4338ca,#7c3aed)',
      buttonGlow: 'rgba(129,140,248,0.55)',
      neonLine:   'rgba(129,140,248,0.8)',
      pageBg:      '#030012',
      cardInnerBg: 'linear-gradient(145deg, rgba(12,5,30,0.92) 0%, rgba(8,3,20,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #818cf8, #a78bfa)',
      coverBg:     'radial-gradient(ellipse 65% 70% at 18% 45%, rgba(129,140,248,0.2) 0%, transparent 70%), radial-gradient(ellipse 55% 60% at 82% 25%, rgba(99,102,241,0.16) 0%, transparent 65%), radial-gradient(1.5px 1.5px at 12% 15%, rgba(165,180,252,0.9) 0%, transparent), radial-gradient(1px 1px at 28% 38%, rgba(255,255,255,0.65) 0%, transparent), radial-gradient(2px 2px at 42% 22%, rgba(165,180,252,0.8) 0%, transparent), radial-gradient(1px 1px at 58% 45%, rgba(255,255,255,0.55) 0%, transparent), radial-gradient(1.5px 1.5px at 75% 18%, rgba(196,181,253,0.75) 0%, transparent), radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.65) 0%, transparent), radial-gradient(2px 2px at 48% 62%, rgba(129,140,248,0.7) 0%, transparent), linear-gradient(180deg, #020010 0%, #060128 30%, #030012 55%, transparent 100%)',
    },
  },

  // ── 2. Cyberpunk ──────────────────────────────────────────────
  cyberpunk: {
    id: 'cyberpunk', name: 'Cyberpunk', emoji: '⚡',
    description: 'Amarelo neon com efeitos digitais intensos',
    image: '/themes/cyberpunk.png',
    colors: {
      primary:    '#fbbf24', secondary:  '#f59e0b',
      glow:       'rgba(251,191,36,0.7)', border: 'rgba(251,191,36,0.6)',
      cardBg:     'linear-gradient(145deg, #080600 0%, #120e00 55%, #1a1500 100%)',
      blobA:      'rgba(251,191,36,0.1)', blobB: 'rgba(245,158,11,0.07)',
      textAccent: '#fde68a',
      conicA: '#d97706', conicB: '#fbbf24', conicC: '#fde68a',
      buttonBg:   'linear-gradient(135deg,#b45309,#d97706)',
      buttonGlow: 'rgba(251,191,36,0.65)',
      neonLine:   'rgba(251,191,36,0.9)',
      pageBg:      '#060400',
      cardInnerBg: 'linear-gradient(145deg, rgba(22,16,0,0.92) 0%, rgba(14,10,0,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #fbbf24, #f59e0b)',
      coverBg:     'linear-gradient(rgba(251,191,36,0.05) 1px, transparent 1px) 0 0 / 60px 60px, linear-gradient(90deg, rgba(251,191,36,0.05) 1px, transparent 1px) 0 0 / 60px 60px, radial-gradient(ellipse 60% 65% at 22% 50%, rgba(251,191,36,0.18) 0%, transparent 65%), radial-gradient(ellipse 50% 55% at 80% 30%, rgba(245,158,11,0.14) 0%, transparent 60%), linear-gradient(180deg, #060400 0%, #120e00 30%, #090700 55%, transparent 100%)',
    },
  },

  // ── 3. Gold Prestige ─────────────────────────────────────────
  gold: {
    id: 'gold', name: 'Gold Prestige', emoji: '👑',
    description: 'Dourado premium com reflexos elegantes',
    image: '/themes/gold.png',
    colors: {
      primary:    '#f59e0b', secondary:  '#d4a017',
      glow:       'rgba(212,160,23,0.55)', border: 'rgba(245,158,11,0.45)',
      cardBg:     'linear-gradient(145deg, #0c0800 0%, #160f00 55%, #1c1400 100%)',
      blobA:      'rgba(245,158,11,0.09)', blobB: 'rgba(212,160,23,0.06)',
      textAccent: '#fcd34d',
      conicA: '#92400e', conicB: '#d97706', conicC: '#fbbf24',
      buttonBg:   'linear-gradient(135deg,#78350f,#b45309)',
      buttonGlow: 'rgba(212,160,23,0.6)',
      neonLine:   'rgba(251,191,36,0.85)',
      pageBg:      '#050300',
      cardInnerBg: 'linear-gradient(145deg, rgba(20,12,0,0.92) 0%, rgba(14,8,0,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #f59e0b, #fbbf24)',
      coverBg:     'radial-gradient(ellipse 70% 65% at 25% 40%, rgba(245,158,11,0.18) 0%, transparent 65%), radial-gradient(ellipse 55% 60% at 78% 55%, rgba(212,160,23,0.14) 0%, transparent 60%), linear-gradient(135deg, rgba(245,158,11,0.06) 0%, transparent 55%), linear-gradient(180deg, #050300 0%, #0c0800 30%, #070500 55%, transparent 100%)',
    },
  },

  // ── 4. Sakura Pink ───────────────────────────────────────────
  sakura: {
    id: 'sakura', name: 'Sakura Pink', emoji: '🌸',
    description: 'Rosa neon suave com brilho delicado',
    image: '/themes/sakura.png',
    colors: {
      primary:    '#f472b6', secondary:  '#ec4899',
      glow:       'rgba(244,114,182,0.55)', border: 'rgba(244,114,182,0.45)',
      cardBg:     'linear-gradient(145deg, #0f0009 0%, #1a0011 55%, #1f0016 100%)',
      blobA:      'rgba(244,114,182,0.1)', blobB: 'rgba(236,72,153,0.07)',
      textAccent: '#fbcfe8',
      conicA: '#be185d', conicB: '#ec4899', conicC: '#f472b6',
      buttonBg:   'linear-gradient(135deg,#9d174d,#be185d)',
      buttonGlow: 'rgba(244,114,182,0.6)',
      neonLine:   'rgba(244,114,182,0.85)',
      pageBg:      '#080003',
      cardInnerBg: 'linear-gradient(145deg, rgba(22,0,14,0.92) 0%, rgba(15,0,9,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #f472b6, #ec4899)',
      coverBg:     'radial-gradient(ellipse 70% 65% at 22% 45%, rgba(244,114,182,0.2) 0%, transparent 65%), radial-gradient(ellipse 60% 70% at 80% 32%, rgba(236,72,153,0.16) 0%, transparent 60%), radial-gradient(2px 2px at 15% 28%, rgba(252,231,243,0.8) 0%, transparent), radial-gradient(1.5px 1.5px at 38% 48%, rgba(244,114,182,0.7) 0%, transparent), radial-gradient(2px 2px at 62% 32%, rgba(252,231,243,0.6) 0%, transparent), radial-gradient(1px 1px at 85% 55%, rgba(244,114,182,0.65) 0%, transparent), linear-gradient(180deg, #080003 0%, #1a0011 30%, #0f0009 55%, transparent 100%)',
    },
  },

  // ── 5. Lava Inferno ──────────────────────────────────────────
  lava: {
    id: 'lava', name: 'Lava Inferno', emoji: '🔥',
    description: 'Vermelho e laranja com glow ardente',
    image: '/themes/lava.png',
    colors: {
      primary:    '#f97316', secondary:  '#ef4444',
      glow:       'rgba(249,115,22,0.65)', border: 'rgba(249,115,22,0.5)',
      cardBg:     'linear-gradient(145deg, #0f0200 0%, #1c0600 55%, #220900 100%)',
      blobA:      'rgba(239,68,68,0.1)', blobB: 'rgba(249,115,22,0.08)',
      textAccent: '#fed7aa',
      conicA: '#dc2626', conicB: '#ea580c', conicC: '#f97316',
      buttonBg:   'linear-gradient(135deg,#991b1b,#c2410c)',
      buttonGlow: 'rgba(249,115,22,0.65)',
      neonLine:   'rgba(249,115,22,0.9)',
      pageBg:      '#070100',
      cardInnerBg: 'linear-gradient(145deg, rgba(24,6,0,0.92) 0%, rgba(16,4,0,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #f97316, #ef4444)',
      coverBg:     'radial-gradient(ellipse 80% 55% at 30% 85%, rgba(239,68,68,0.3) 0%, transparent 65%), radial-gradient(ellipse 65% 60% at 72% 65%, rgba(249,115,22,0.24) 0%, transparent 60%), radial-gradient(ellipse 90% 40% at 50% 100%, rgba(220,38,38,0.32) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%), linear-gradient(180deg, #100200 0%, #1c0600 30%, #130300 55%, transparent 100%)',
    },
  },

  // ── 6. Ocean Blue ────────────────────────────────────────────
  ocean: {
    id: 'ocean', name: 'Ocean Blue', emoji: '🌊',
    description: 'Azul aqua clean com brilho premium',
    image: '/themes/ocean.png',
    colors: {
      primary:    '#22d3ee', secondary:  '#06b6d4',
      glow:       'rgba(34,211,238,0.55)', border: 'rgba(34,211,238,0.45)',
      cardBg:     'linear-gradient(145deg, #00080f 0%, #000d1a 55%, #001220 100%)',
      blobA:      'rgba(6,182,212,0.1)', blobB: 'rgba(34,211,238,0.07)',
      textAccent: '#a5f3fc',
      conicA: '#0e7490', conicB: '#0891b2', conicC: '#22d3ee',
      buttonBg:   'linear-gradient(135deg,#164e63,#0e7490)',
      buttonGlow: 'rgba(34,211,238,0.6)',
      neonLine:   'rgba(34,211,238,0.85)',
      pageBg:      '#000609',
      cardInnerBg: 'linear-gradient(145deg, rgba(0,18,28,0.92) 0%, rgba(0,12,20,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #22d3ee, #06b6d4)',
      coverBg:     'radial-gradient(ellipse 80% 65% at 22% 65%, rgba(34,211,238,0.18) 0%, transparent 65%), radial-gradient(ellipse 65% 75% at 80% 40%, rgba(6,182,212,0.14) 0%, transparent 60%), linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(6,182,212,0.04) 60%, transparent 100%), linear-gradient(180deg, #000609 0%, #000d1a 30%, #000912 55%, transparent 100%)',
    },
  },

  // ── 7. Aurora Boreal ─────────────────────────────────────────
  aurora: {
    id: 'aurora', name: 'Aurora Boreal', emoji: '🌌',
    description: 'Verde teal e roxo — luzes do norte',
    image: '/themes/aurora.png',
    colors: {
      primary:    '#00d4aa', secondary:  '#a855f7',
      glow:       'rgba(0,212,170,0.55)', border: 'rgba(0,212,170,0.45)',
      cardBg:     'linear-gradient(145deg, #000f0d 0%, #001a16 55%, #001020 100%)',
      blobA:      'rgba(0,212,170,0.1)', blobB: 'rgba(168,85,247,0.07)',
      textAccent: '#6ee7d4',
      conicA: '#0d9488', conicB: '#00d4aa', conicC: '#a855f7',
      buttonBg:   'linear-gradient(135deg,#0f766e,#0d9488)',
      buttonGlow: 'rgba(0,212,170,0.6)',
      neonLine:   'rgba(0,212,170,0.85)',
      pageBg:      '#000808',
      cardInnerBg: 'linear-gradient(145deg, rgba(0,22,18,0.92) 0%, rgba(0,14,12,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #00d4aa, #a855f7)',
      coverBg:     'linear-gradient(120deg, rgba(0,212,170,0.16) 0%, transparent 40%, rgba(168,85,247,0.14) 55%, transparent 100%), radial-gradient(ellipse 70% 65% at 28% 50%, rgba(0,212,170,0.18) 0%, transparent 65%), radial-gradient(ellipse 55% 70% at 75% 32%, rgba(168,85,247,0.14) 0%, transparent 60%), linear-gradient(180deg, #000808 0%, #001a16 30%, #000f0d 55%, transparent 100%)',
    },
  },

  // ── 8. Diamond Ice ───────────────────────────────────────────
  diamond: {
    id: 'diamond', name: 'Diamond Ice', emoji: '💎',
    description: 'Azul gelo cristalino e frio',
    image: 'https://images.unsplash.com/photo-1490750967868-88df7c55f493?w=1200&auto=format&fit=crop&q=80',
    colors: {
      primary:    '#a8d8ea', secondary:  '#7dd3fc',
      glow:       'rgba(168,216,234,0.5)', border: 'rgba(168,216,234,0.4)',
      cardBg:     'linear-gradient(145deg, #000508 0%, #000d1a 55%, #001020 100%)',
      blobA:      'rgba(168,216,234,0.08)', blobB: 'rgba(125,211,252,0.06)',
      textAccent: '#e0f3ff',
      conicA: '#0369a1', conicB: '#7dd3fc', conicC: '#e0f3ff',
      buttonBg:   'linear-gradient(135deg,#0369a1,#0284c7)',
      buttonGlow: 'rgba(168,216,234,0.55)',
      neonLine:   'rgba(168,216,234,0.8)',
      pageBg:      '#000407',
      cardInnerBg: 'linear-gradient(145deg, rgba(0,16,36,0.92) 0%, rgba(0,10,24,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #7dd3fc, #a8d8ea)',
      coverBg:     'radial-gradient(ellipse 65% 75% at 22% 40%, rgba(168,216,234,0.18) 0%, transparent 65%), radial-gradient(ellipse 70% 65% at 80% 60%, rgba(125,211,252,0.14) 0%, transparent 60%), linear-gradient(45deg, rgba(168,216,234,0.05) 0%, transparent 55%), linear-gradient(180deg, #000407 0%, #000d1a 30%, #000510 55%, transparent 100%)',
    },
  },

  // ── 9. Emerald Lux ───────────────────────────────────────────
  emerald: {
    id: 'emerald', name: 'Emerald Lux', emoji: '💚',
    description: 'Verde esmeralda profundo e luxuoso',
    image: '/themes/emerald.png',
    colors: {
      primary:    '#10b981', secondary:  '#34d399',
      glow:       'rgba(16,185,129,0.55)', border: 'rgba(16,185,129,0.45)',
      cardBg:     'linear-gradient(145deg, #000f09 0%, #001a0f 55%, #001f14 100%)',
      blobA:      'rgba(16,185,129,0.1)', blobB: 'rgba(52,211,153,0.07)',
      textAccent: '#6ee7b7',
      conicA: '#065f46', conicB: '#059669', conicC: '#34d399',
      buttonBg:   'linear-gradient(135deg,#065f46,#047857)',
      buttonGlow: 'rgba(16,185,129,0.6)',
      neonLine:   'rgba(16,185,129,0.85)',
      pageBg:      '#000906',
      cardInnerBg: 'linear-gradient(145deg, rgba(0,24,14,0.92) 0%, rgba(0,16,9,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #10b981, #34d399)',
      coverBg:     'radial-gradient(ellipse 70% 70% at 25% 45%, rgba(16,185,129,0.22) 0%, transparent 65%), radial-gradient(ellipse 60% 65% at 78% 55%, rgba(52,211,153,0.16) 0%, transparent 60%), linear-gradient(180deg, #000906 0%, #001a0f 30%, #000f09 55%, transparent 100%)',
    },
  },

  // ── 10. Sunset Glow ──────────────────────────────────────────
  sunset: {
    id: 'sunset', name: 'Sunset Glow', emoji: '🌅',
    description: 'Laranja quente e rosa vibrante do pôr do sol',
    image: '/themes/sunset.png',
    colors: {
      primary:    '#fb923c', secondary:  '#ec4899',
      glow:       'rgba(251,146,60,0.6)', border: 'rgba(251,146,60,0.5)',
      cardBg:     'linear-gradient(145deg, #0f0500 0%, #1a0900 55%, #200c00 100%)',
      blobA:      'rgba(251,146,60,0.1)', blobB: 'rgba(236,72,153,0.08)',
      textAccent: '#fed7aa',
      conicA: '#c2410c', conicB: '#f97316', conicC: '#ec4899',
      buttonBg:   'linear-gradient(135deg,#c2410c,#ea580c)',
      buttonGlow: 'rgba(251,146,60,0.6)',
      neonLine:   'rgba(251,146,60,0.88)',
      pageBg:      '#080200',
      cardInnerBg: 'linear-gradient(145deg, rgba(30,10,0,0.92) 0%, rgba(20,7,0,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #fb923c, #ec4899)',
      coverBg:     'radial-gradient(ellipse 80% 60% at 28% 70%, rgba(251,146,60,0.26) 0%, transparent 65%), radial-gradient(ellipse 70% 55% at 76% 42%, rgba(236,72,153,0.2) 0%, transparent 60%), linear-gradient(180deg, #080200 0%, #1a0900 30%, #120500 55%, transparent 100%)',
    },
  },

  // ── 11. Royal Purple ─────────────────────────────────────────
  royal: {
    id: 'royal', name: 'Royal Purple', emoji: '🔮',
    description: 'Violeta profundo — realeza e poder',
    image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200&auto=format&fit=crop&q=80',
    colors: {
      primary:    '#7c3aed', secondary:  '#a855f7',
      glow:       'rgba(124,58,237,0.65)', border: 'rgba(124,58,237,0.55)',
      cardBg:     'linear-gradient(145deg, #060012 0%, #0d0020 55%, #100027 100%)',
      blobA:      'rgba(124,58,237,0.14)', blobB: 'rgba(168,85,247,0.09)',
      textAccent: '#c4b5fd',
      conicA: '#4c1d95', conicB: '#7c3aed', conicC: '#a855f7',
      buttonBg:   'linear-gradient(135deg,#4c1d95,#6d28d9)',
      buttonGlow: 'rgba(124,58,237,0.65)',
      neonLine:   'rgba(124,58,237,0.9)',
      pageBg:      '#040010',
      cardInnerBg: 'linear-gradient(145deg, rgba(18,0,45,0.92) 0%, rgba(12,0,30,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #7c3aed, #a855f7)',
      coverBg:     'radial-gradient(ellipse 75% 72% at 22% 50%, rgba(124,58,237,0.28) 0%, transparent 65%), radial-gradient(ellipse 65% 65% at 80% 30%, rgba(168,85,247,0.22) 0%, transparent 60%), radial-gradient(1.5px 1.5px at 15% 22%, rgba(196,181,253,0.8) 0%, transparent), radial-gradient(1px 1px at 38% 42%, rgba(255,255,255,0.5) 0%, transparent), radial-gradient(1px 1px at 65% 25%, rgba(196,181,253,0.7) 0%, transparent), radial-gradient(1.5px 1.5px at 88% 48%, rgba(255,255,255,0.55) 0%, transparent), linear-gradient(180deg, #040010 0%, #0d0020 30%, #060012 55%, transparent 100%)',
    },
  },

  // ── 12. Neon Rainbow ─────────────────────────────────────────
  rainbow: {
    id: 'rainbow', name: 'Neon Rainbow', emoji: '🌈',
    description: 'Multi-color vibrante — energia total',
    image: '/themes/rainbow.png',
    colors: {
      primary:    '#f0abfc', secondary:  '#67e8f9',
      glow:       'rgba(240,171,252,0.5)', border: 'rgba(240,171,252,0.4)',
      cardBg:     'linear-gradient(145deg, #060008 0%, #0a0014 55%, #0c0018 100%)',
      blobA:      'rgba(240,171,252,0.08)', blobB: 'rgba(103,232,249,0.06)',
      textAccent: '#f0abfc',
      conicA: '#7c3aed', conicB: '#ec4899', conicC: '#67e8f9',
      buttonBg:   'linear-gradient(135deg,#7c3aed,#ec4899)',
      buttonGlow: 'rgba(240,171,252,0.55)',
      neonLine:   'rgba(240,171,252,0.82)',
      pageBg:      '#040006',
      cardInnerBg: 'linear-gradient(145deg, rgba(18,0,28,0.92) 0%, rgba(12,0,20,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #f0abfc, #67e8f9)',
      coverBg:     'linear-gradient(135deg, rgba(240,171,252,0.14) 0%, rgba(103,232,249,0.12) 30%, rgba(251,146,60,0.08) 60%, rgba(240,171,252,0.08) 100%), radial-gradient(ellipse 70% 65% at 25% 50%, rgba(240,171,252,0.16) 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 78% 35%, rgba(103,232,249,0.14) 0%, transparent 60%), linear-gradient(180deg, #040006 0%, #0a0014 30%, #060008 55%, transparent 100%)',
    },
  },

  // ── 13. Dark Elite ───────────────────────────────────────────
  dark: {
    id: 'dark', name: 'Dark Elite', emoji: '🖤',
    description: 'Ultra-dark minimalista — branco neon puro',
    image: '/themes/dark.png',
    colors: {
      primary:    '#f1f5f9', secondary:  '#cbd5e1',
      glow:       'rgba(241,245,249,0.4)', border: 'rgba(241,245,249,0.3)',
      cardBg:     'linear-gradient(145deg, #080808 0%, #0d0d0d 55%, #111111 100%)',
      blobA:      'rgba(255,255,255,0.06)', blobB: 'rgba(203,213,225,0.04)',
      textAccent: '#f1f5f9',
      conicA: '#374151', conicB: '#6b7280', conicC: '#f1f5f9',
      buttonBg:   'linear-gradient(135deg,#1f2937,#374151)',
      buttonGlow: 'rgba(241,245,249,0.3)',
      neonLine:   'rgba(241,245,249,0.7)',
      pageBg:      '#040404',
      cardInnerBg: 'linear-gradient(145deg, rgba(18,18,18,0.95) 0%, rgba(10,10,10,0.98) 100%)',
      sectionBar:  'linear-gradient(180deg, #94a3b8, #f1f5f9)',
      coverBg:     'radial-gradient(ellipse 60% 70% at 22% 45%, rgba(241,245,249,0.07) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 80% 35%, rgba(203,213,225,0.06) 0%, transparent 60%), linear-gradient(180deg, #040404 0%, #0d0d0d 30%, #080808 55%, transparent 100%)',
    },
  },

  // ── 14. Obsidian Red ─────────────────────────────────────────
  obsidian: {
    id: 'obsidian', name: 'Obsidian Red', emoji: '🔴',
    description: 'Vermelho dramático em obsidiana negra',
    image: '/themes/obsidian.png',
    colors: {
      primary:    '#dc2626', secondary:  '#ef4444',
      glow:       'rgba(220,38,38,0.6)', border: 'rgba(220,38,38,0.5)',
      cardBg:     'linear-gradient(145deg, #0f0000 0%, #1c0000 55%, #240000 100%)',
      blobA:      'rgba(220,38,38,0.1)', blobB: 'rgba(127,29,29,0.07)',
      textAccent: '#fca5a5',
      conicA: '#7f1d1d', conicB: '#b91c1c', conicC: '#dc2626',
      buttonBg:   'linear-gradient(135deg,#7f1d1d,#991b1b)',
      buttonGlow: 'rgba(220,38,38,0.6)',
      neonLine:   'rgba(220,38,38,0.9)',
      pageBg:      '#090000',
      cardInnerBg: 'linear-gradient(145deg, rgba(28,0,0,0.92) 0%, rgba(18,0,0,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #dc2626, #ef4444)',
      coverBg:     'radial-gradient(ellipse 80% 60% at 30% 70%, rgba(220,38,38,0.28) 0%, transparent 65%), radial-gradient(ellipse 65% 70% at 74% 42%, rgba(127,29,29,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 35% at 50% 95%, rgba(220,38,38,0.18) 0%, transparent 50%), linear-gradient(180deg, #090000 0%, #1c0000 30%, #0f0000 55%, transparent 100%)',
    },
  },

  // ── 15. Heaven Light ─────────────────────────────────────────
  heaven: {
    id: 'heaven', name: 'Heaven Light', emoji: '✨',
    description: 'Dourado celestial — suave e etéreo',
    image: '/themes/heaven.png',
    colors: {
      primary:    '#fde68a', secondary:  '#fef3c7',
      glow:       'rgba(253,230,138,0.45)', border: 'rgba(253,230,138,0.35)',
      cardBg:     'linear-gradient(145deg, #0c0b00 0%, #141200 55%, #1a1800 100%)',
      blobA:      'rgba(253,230,138,0.08)', blobB: 'rgba(254,243,199,0.05)',
      textAccent: '#fef3c7',
      conicA: '#b45309', conicB: '#d97706', conicC: '#fde68a',
      buttonBg:   'linear-gradient(135deg,#92400e,#b45309)',
      buttonGlow: 'rgba(253,230,138,0.5)',
      neonLine:   'rgba(253,230,138,0.75)',
      pageBg:      '#070600',
      cardInnerBg: 'linear-gradient(145deg, rgba(22,20,0,0.92) 0%, rgba(15,14,0,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #fde68a, #fcd34d)',
      coverBg:     'radial-gradient(ellipse 80% 65% at 28% 40%, rgba(253,230,138,0.14) 0%, transparent 65%), radial-gradient(ellipse 65% 70% at 76% 58%, rgba(254,243,199,0.1) 0%, transparent 60%), radial-gradient(2px 2px at 18% 28%, rgba(253,230,138,0.85) 0%, transparent), radial-gradient(1.5px 1.5px at 45% 45%, rgba(255,255,255,0.6) 0%, transparent), radial-gradient(1px 1px at 72% 30%, rgba(253,230,138,0.75) 0%, transparent), linear-gradient(180deg, #070600 0%, #141200 30%, #0c0b00 55%, transparent 100%)',
    },
  },

  // ── 16. Phantom Blue ─────────────────────────────────────────
  phantom: {
    id: 'phantom', name: 'Phantom Blue', emoji: '👻',
    description: 'Azul espectral profundo e misterioso',
    image: '/themes/phantom.png',
    colors: {
      primary:    '#3b82f6', secondary:  '#60a5fa',
      glow:       'rgba(59,130,246,0.6)', border: 'rgba(59,130,246,0.5)',
      cardBg:     'linear-gradient(145deg, #000514 0%, #000b22 55%, #000e2a 100%)',
      blobA:      'rgba(59,130,246,0.1)', blobB: 'rgba(29,78,216,0.07)',
      textAccent: '#93c5fd',
      conicA: '#1e3a8a', conicB: '#1d4ed8', conicC: '#3b82f6',
      buttonBg:   'linear-gradient(135deg,#1e3a8a,#1d4ed8)',
      buttonGlow: 'rgba(59,130,246,0.6)',
      neonLine:   'rgba(59,130,246,0.85)',
      pageBg:      '#000312',
      cardInnerBg: 'linear-gradient(145deg, rgba(0,12,35,0.92) 0%, rgba(0,8,24,0.96) 100%)',
      sectionBar:  'linear-gradient(180deg, #3b82f6, #60a5fa)',
      coverBg:     'radial-gradient(ellipse 72% 72% at 22% 45%, rgba(59,130,246,0.24) 0%, transparent 65%), radial-gradient(ellipse 65% 65% at 80% 30%, rgba(96,165,250,0.18) 0%, transparent 60%), radial-gradient(1.5px 1.5px at 12% 18%, rgba(147,197,253,0.85) 0%, transparent), radial-gradient(1px 1px at 35% 38%, rgba(255,255,255,0.55) 0%, transparent), radial-gradient(1px 1px at 62% 25%, rgba(147,197,253,0.75) 0%, transparent), radial-gradient(1.5px 1.5px at 88% 50%, rgba(255,255,255,0.6) 0%, transparent), linear-gradient(180deg, #000312 0%, #000b22 30%, #000514 55%, transparent 100%)',
    },
  },
}

// ─── UI labels ────────────────────────────────────────────────────

export const BORDER_STYLES: { id: BorderStyle; label: string; description: string }[] = [
  { id: 'solid',    label: 'Glow Sólido',    description: 'Borda neon estática' },
  { id: 'gradient', label: 'Glow Gradiente', description: 'Degradê colorido constante' },
  { id: 'animated', label: 'Glow Animado',   description: 'Pulsa suavemente' },
  { id: 'pulse',    label: 'Pulse Neon',     description: 'Borda pulsante rítmica' },
  { id: 'rainbow',  label: 'Rainbow',        description: 'Gradiente arco-íris completo' },
  { id: 'cyber',    label: 'Cyber Glow',     description: 'Efeito digital dinâmico' },
]

export const GLOW_INTENSITIES: { id: GlowIntensity; label: string; mult: number }[] = [
  { id: 'subtle', label: 'Sutil',  mult: 0.5 },
  { id: 'medium', label: 'Médio',  mult: 1.0 },
  { id: 'strong', label: 'Forte',  mult: 1.8 },
]

// ─── CSS generator completo ───────────────────────────────────────

export function generateVipCSS(cfg: VipThemeConfig): string {
  if (!cfg.themeId || !(cfg.themeId in VIP_THEMES)) return ''

  const t   = VIP_THEMES[cfg.themeId]
  const c   = t.colors
  const gm  = GLOW_INTENSITIES.find(g => g.id === cfg.glowIntensity)?.mult ?? 1.0
  const s   = (v: number) => Math.round(v * gm)
  const wa  = (rgba: string, alpha: number) =>
    rgba.replace(/,\s*[\d.]+\)$/, `, ${alpha})`)

  const borderBase = `0 0 0 1px ${c.border}, 0 60px 160px rgba(0,0,0,0.7)`

  // ── heroGlow por estilo de borda ──
  let heroGlow = ''
  switch (cfg.borderStyle) {
    case 'solid':
      heroGlow = `@keyframes heroGlow {
  0%,100% { box-shadow: 0 0 ${s(30)}px ${c.glow}, ${borderBase}; }
}`; break
    case 'gradient':
      heroGlow = `@keyframes heroGlow {
  0%,100% { box-shadow: 0 0 ${s(35)}px ${c.glow}, ${borderBase}; }
  50%      { box-shadow: 0 0 ${s(55)}px ${c.glow}, 0 0 0 1px ${c.border}, 0 60px 160px rgba(0,0,0,0.7); }
}`; break
    case 'animated':
      heroGlow = `@keyframes heroGlow {
  0%,100% { box-shadow: 0 0 ${s(30)}px ${c.glow}, ${borderBase}; }
  33%      { box-shadow: 0 0 ${s(50)}px ${c.glow}, 0 0 0 1px ${c.border}, 0 60px 160px rgba(0,0,0,0.7); }
  66%      { box-shadow: 0 0 ${s(20)}px ${c.glow}, ${borderBase}; }
}`; break
    case 'pulse':
      heroGlow = `@keyframes heroGlow {
  0%,100% { box-shadow: 0 0 ${s(20)}px ${c.glow}, ${borderBase}; }
  25%      { box-shadow: 0 0 ${s(60)}px ${c.glow}, 0 0 0 2px ${c.border}, 0 60px 160px rgba(0,0,0,0.7); }
  75%      { box-shadow: 0 0 ${s(15)}px ${c.glow}, ${borderBase}; }
}`; break
    case 'rainbow':
      heroGlow = `@keyframes heroGlow {
  0%,100% { box-shadow: 0 0 ${s(35)}px ${c.glow}, ${borderBase}; }
  25%      { box-shadow: 0 0 ${s(40)}px rgba(255,255,255,0.15), ${borderBase}; }
  50%      { box-shadow: 0 0 ${s(50)}px ${c.glow}, 0 0 0 1px ${c.border}, 0 60px 160px rgba(0,0,0,0.7); }
  75%      { box-shadow: 0 0 ${s(40)}px rgba(255,255,255,0.15), ${borderBase}; }
}`; break
    case 'cyber':
      heroGlow = `@keyframes heroGlow {
  0%,20%,22%,100% { box-shadow: 0 0 ${s(35)}px ${c.glow}, ${borderBase}; }
  21%              { box-shadow: 0 0 ${s(70)}px ${c.glow}, 0 0 0 2px ${c.border}, 0 60px 160px rgba(0,0,0,0.7); }
  80%,82%          { box-shadow: 0 0 ${s(35)}px ${c.glow}, ${borderBase}; }
  81%              { box-shadow: 0 0 ${s(65)}px ${c.glow}, 0 0 0 2px ${c.border}, 0 60px 160px rgba(0,0,0,0.7); }
}`; break
  }

  const photoAura = `@keyframes photoAura {
  0%,100% { filter: drop-shadow(0 0 22px ${c.glow}); }
  50%      { filter: drop-shadow(0 0 38px ${c.glow}); }
}`

  const waGlow = `@keyframes waGlow {
  0%,100% { box-shadow: 0 0 28px rgba(16,185,129,0.55); }
  50%      { box-shadow: 0 0 50px rgba(16,185,129,0.95), 0 0 0 6px rgba(16,185,129,0.1); }
}`

  // ── Overrides de seções do perfil ──
  const sectionCSS = `
.info-card {
  background: ${c.cardInnerBg};
  border-color: ${wa(c.glow, 0.18)};
}
.info-card:hover {
  border-color: ${wa(c.glow, 0.32)};
}
.info-card::before {
  background: linear-gradient(90deg, transparent, ${wa(c.glow, 0.28)} 50%, transparent);
}
.service-row:hover {
  background: ${wa(c.glow, 0.08)};
}
.cat-link:hover {
  border-color: ${wa(c.glow, 0.42)} !important;
  background: ${wa(c.glow, 0.12)} !important;
  color: ${c.textAccent} !important;
}
.contact-row:hover {
  border-color: ${wa(c.glow, 0.32)} !important;
  background: ${wa(c.glow, 0.08)} !important;
  color: #fff !important;
}`

  const particlesCSS = cfg.particles ? `
@keyframes floatUp {
  0%   { transform: translateY(0) translateX(0) scale(1);   opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.3; }
  100% { transform: translateY(-120px) translateX(var(--px,10px)) scale(0.4); opacity: 0; }
}
.vip-particle {
  position: absolute; width: 4px; height: 4px; border-radius: 50%;
  background: ${c.primary}; box-shadow: 0 0 6px ${c.glow};
  animation: floatUp var(--dur,4s) ease-in-out var(--delay,0s) infinite;
  pointer-events: none;
}` : ''

  return `/* VIP Theme: ${t.name} */
${heroGlow}
${photoAura}
${waGlow}
${sectionCSS}
${particlesCSS}`
}

// ─── Conic gradient para borda da foto ───────────────────────────

export function getVipConic(themeId: VipThemeId | null): string {
  if (!themeId || !(themeId in VIP_THEMES)) {
    return 'conic-gradient(from 0deg, #7b2ff7 0%, #a855f7 14%, #ec4899 28%, #f43f5e 40%, #fb923c 52%, #facc15 60%, #06b6d4 70%, #3b82f6 82%, #8b5cf6 92%, #7b2ff7 100%)'
  }
  const c = VIP_THEMES[themeId].colors
  return `conic-gradient(from 0deg, ${c.conicA} 0%, ${c.conicB} 30%, ${c.conicC} 55%, ${c.conicB} 75%, ${c.conicA} 100%)`
}
