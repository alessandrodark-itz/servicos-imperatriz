export const FREE_MAX_PHOTOS = 4
export const VIP_MAX_PHOTOS  = 7
export const PREMIUM_MAX_PHOTOS = VIP_MAX_PHOTOS // backward compat

export type Plan = 'free' | 'premium' | 'vip'

export type VipBadge = 'vip' | 'premium' | 'destaque' | 'top_regional' | 'perfil_premium'

export const VIP_BADGE_CONFIG: Record<VipBadge, {
  label: string
  bg: string
  border: string
  text: string
  icon: string
}> = {
  vip:            { label: 'VIP',            bg: 'rgba(245,158,11,0.2)',   border: 'rgba(251,191,36,0.45)',  text: '#fbbf24', icon: '👑' },
  premium:        { label: 'Premium',        bg: 'rgba(139,92,246,0.2)',   border: 'rgba(167,139,250,0.45)', text: '#c4b5fd', icon: '⭐' },
  destaque:       { label: 'Em Destaque',    bg: 'rgba(59,130,246,0.2)',   border: 'rgba(96,165,250,0.45)',  text: '#93c5fd', icon: '🔵' },
  top_regional:   { label: 'Top Regional',   bg: 'rgba(239,68,68,0.15)',   border: 'rgba(251,113,133,0.45)', text: '#fda4af', icon: '🏆' },
  perfil_premium: { label: 'Perfil Premium', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(52,211,153,0.45)',  text: '#6ee7b7', icon: '✦'  },
}

export function getVipBadgeConfig(badgeType?: string | null) {
  return VIP_BADGE_CONFIG[(badgeType as VipBadge) ?? 'vip'] ?? VIP_BADGE_CONFIG.vip
}

export function isVip(
  plan: string | null | undefined,
  expiresAt: string | null | undefined,
): boolean {
  if (plan !== 'premium' && plan !== 'vip') return false
  if (!expiresAt) return true
  return new Date(expiresAt) > new Date()
}

export const isPremiumActive = isVip

export function getMaxPhotos(
  plan: string | null | undefined,
  expiresAt: string | null | undefined,
): number {
  return isVip(plan, expiresAt) ? VIP_MAX_PHOTOS : FREE_MAX_PHOTOS
}

export function getOnlineStatus(updatedAt: string | null | undefined): 'online' | 'recent' | null {
  if (!updatedAt) return null
  const hours = (Date.now() - new Date(updatedAt).getTime()) / 3_600_000
  if (hours < 6)  return 'online'
  if (hours < 72) return 'recent'
  return null
}
