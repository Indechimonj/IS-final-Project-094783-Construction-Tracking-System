import vine from '@vinejs/vine'
import { email, otp, role } from './validator_utils.js'

export const signUpValidator = vine.compile(
  vine.object({
    firstName: vine.string(),
    lastName: vine.string(),
    email,
    role,
  })
)
export const sendOtpValidator = vine.compile(vine.object({ email }))
export const verifyOtpValidator = vine.compile(vine.object({ otp, email }))
export const logoutValidator = vine.compile(vine.object({ allDevices: vine.boolean().optional() }))
