import hash from '@adonisjs/core/services/hash'
import crypto from 'node:crypto'

export async function generateOtp(expiryMinutes = 25) {
  const otp = crypto.randomInt(100000, 999999)
  const otpExpiresAt = new Date(Date.now() + 1000 * 60 * expiryMinutes)
  const otpHash = await hash.make(otp.toString())
  return { otp, otpHash, otpExpiresAt }
}
