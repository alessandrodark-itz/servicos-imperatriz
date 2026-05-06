import crypto from 'crypto'

export function createSessionToken(): string {
  const exp = Date.now() + 24 * 60 * 60 * 1000
  const sig = crypto
    .createHmac('sha256', process.env.ADMIN_JWT_SECRET!)
    .update(String(exp))
    .digest('hex')
  return `${exp}.${sig}`
}

export function verifyPassword(input: string): boolean {
  const inputHash = crypto
    .createHash('sha256')
    .update(input + process.env.ADMIN_SALT!)
    .digest('hex')

  const stored = process.env.ADMIN_PASSWORD_HASH!
  if (inputHash.length !== stored.length) return false

  try {
    return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(stored))
  } catch {
    return false
  }
}
