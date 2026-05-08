export const FREE_MAX_PHOTOS   = 2
export const PREMIUM_MAX_PHOTOS = 4

export type Plan = 'free' | 'premium'

export function isPremiumActive(
  plan: string | null | undefined,
  expiresAt: string | null | undefined,
): boolean {
  if (plan !== 'premium') return false
  if (!expiresAt) return true
  return new Date(expiresAt) > new Date()
}

export function getMaxPhotos(
  plan: string | null | undefined,
  expiresAt: string | null | undefined,
): number {
  return isPremiumActive(plan, expiresAt) ? PREMIUM_MAX_PHOTOS : FREE_MAX_PHOTOS
}
