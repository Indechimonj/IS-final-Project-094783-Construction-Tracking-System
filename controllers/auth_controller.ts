import {
  logoutValidator,
  sendOtpValidator,
  signUpValidator,
  verifyOtpValidator,
} from '#validators/auth_validator'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import { generateOtp } from '../utils/mailer.js'
import User from '#models/user'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  private async sendOtpViaEmail(email: string, firstName: string) {
    const { otp, otpHash, otpExpiresAt } = await generateOtp()
    await User.query().where('email', email).update({ otpHash, otpExpiresAt })
    await mail.send((msg) => {
      msg.to(email).subject('Log into your account').html(`
        <html>
          <body>
            <h4>Hi ${firstName},</h4>

            <p>We need to verify that its you, before you can access the app. Please copy this one time password (OTP) and enter it into the OTP screen on the app.</p>

            <h3>${otp}</h3>

            <p>This OTP expires in 25 mins and will automatically be invalidated if it is used or if another OTP is sent.</p><br/>

            <p>Best,<br/>
            De-Construct Team.</p>
          </body>
        </html>`)
    })
  }

  async signUp({ auth, request, response }: HttpContext) {
    const { email, firstName, lastName, role } = await signUpValidator.validate(request.body())
    if (await auth.check()) {
      return response.unauthorized({ status: 'error', message: 'A user is already logged in.' })
    }
    if (await User.query().where('email', email).first()) {
      return response.badRequest({ status: 'error', message: 'User already exists.' })
    }
    const user = await User.create({ email, firstName, lastName })
    const roleRecord = await user.related('rolesRecords').create({ role })
    // user.rolesRecords = [rolesRecord]
    return response.created({
      status: 'success',
      message: 'User created successfully',
      user: { ...user.serialize(), roles: [roleRecord.role] },
    })
  }

  async sendOtp({ request, auth, response, logger }: HttpContext) {
    const { email } = await sendOtpValidator.validate(request.body())
    if (await auth.check()) {
      return response.unauthorized({ status: 'error', message: 'A user is already logged in.' })
    }
    const user = await User.query().where('email', email).first()
    if (user === null) {
      return response.notFound({ status: 'error', message: 'User not found.' })
    }
    try {
      await this.sendOtpViaEmail(email, user.firstName)
    } catch (error) {
      logger.error(error, 'Failed to send OTP.')
      return response.internalServerError({
        status: 'error',
        message: 'Uh oh. We could not send the OTP.',
      })
    }
    return response.ok({
      status: 'success',
      message: 'OTP sent successfully.',
    })
  }

  async verifyOtp({ request, response, auth }: HttpContext) {
    const { otp, email } = await verifyOtpValidator.validate(request.body())
    if (await auth.check()) {
      return response.unauthorized({ status: 'error', message: 'A user is already logged in.' })
    }
    const user = await User.query().where('email', email).first()
    if (user === null) {
      return response.notFound({ status: 'error', message: 'User not found.' })
    }
    const unauthorizedResponse = response.unauthorized({
      status: 'error',
      message: 'Invalid or expired OTP',
    })
    if (!user.otpHash || !user.otpExpiresAt || user.otpExpiresAt < DateTime.now()) {
      return unauthorizedResponse
    }
    const hashIsValid = await hash.verify(user.otpHash, otp.toString())
    if (!hashIsValid) {
      return unauthorizedResponse
    }
    await User.query().where('id', user.id).update({ otpHash: null, otpExpiresAt: null })
    const token = await User.accessTokens.create(user, [], { expiresIn: '7 days' })

    return response
      .cookie('LoginToken', token.value!.release(), { httpOnly: true, sameSite: 'lax', path: '/' })
      .created({
        status: 'success',
        message: 'OTP verified successfully.',
      })
  }

  async userInfo({ auth, response }: HttpContext) {
    return response.ok({ status: 'success', user: auth.user! })
  }

  async logout({ auth, request, response }: HttpContext) {
    const { allDevices } = await logoutValidator.validate(request.body())
    const user = auth.user!
    if (allDevices) {
      await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()
      return response.ok({
        status: 'success',
        message: 'User logged out from all devices successfully.',
      })
    }
    await User.accessTokens.delete(user, user.currentAccessToken!.identifier)
    return response.ok({ status: 'success', message: 'User logged out successfully.' })
  }

  async test({ auth, response }: HttpContext) {
    return response.ok({ status: 'success', auth: await auth.check() })
  }
}
