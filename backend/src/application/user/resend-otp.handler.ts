import { EmailService } from '@/base/contracts/email-service'
import { TxManager } from '@/base/contracts/tx-manager'
import { Validator } from '@/base/contracts/validator'
import { CustomError } from '@/base/errors/custom-error'
import { RequestHandler } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCode } from '@/domain/verify-code/verify-code'
import { VerifyCodeError } from '@/domain/verify-code/verify-code-error'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import { randomInt, randomUUID } from 'node:crypto'
import { Logger } from '@nestjs/common'
import type { ResendOtpCommand } from './resend-otp.command'
import { resendOtpSchema } from './resend-otp.schema'

const OTP_EXPIRATION_MS = 15 * 60 * 1000
const RESEND_INTERVAL_SECONDS = 60

@Injectable()
export class ResendOtpHandler implements
  RequestHandler<ResendOtpCommand, { message: string }> {
  private readonly logger = new Logger(ResendOtpHandler.name)

  constructor(
    private readonly validator: Validator,
    private readonly userRepo: UserRepository,
    private readonly verifyCodeRepo: VerifyCodeRepository,
    private readonly txManager: TxManager,
    private readonly emailService: EmailService,
  ) { }

  async handle(request: ResendOtpCommand): Promise<{ message: string }> {
    const input = this.validator.parse(resendOtpSchema, request.input)

    const user = await this.userRepo.findByEmail(input.email)
    if (!user) throw UserError.NotExists()

    if (input.purpose !== 'RECUPERACION' && user.emailVerified) {
      throw UserError.EmailAlreadyVerified()
    }

    await this.validateResendInterval(user.id, input.purpose)

    const otp = randomInt(100000, 1000000).toString()
    const newVerifyCode = VerifyCode.create({
      id: randomUUID(),
      userId: user.id,
      code: otp,
      purpose: input.purpose,
      expiration: new Date(Date.now() + OTP_EXPIRATION_MS),
    })

    await this.txManager.run(async () => {
      await this.verifyCodeRepo.insert(newVerifyCode)
    })

    await this.sendOtpEmail(user.email, otp, input.purpose)

    return {
      message: 'Se ha enviado un nuevo código a tu correo.',
    }
  }

  private async validateResendInterval(
    userId: string,
    purpose: string,
  ): Promise<void> {
    const verifyCodes = await this.verifyCodeRepo.findByUserId(userId)
    const recentCode = verifyCodes
      .filter(code => code.purpose === purpose)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]

    if (!recentCode) return

    const elapsedSeconds =
      (Date.now() - recentCode.createdAt.getTime()) / 1000

    if (elapsedSeconds < RESEND_INTERVAL_SECONDS) {
      const remainingSeconds = Math.ceil(
        RESEND_INTERVAL_SECONDS - elapsedSeconds,
      )
      throw VerifyCodeError.RetryVerySoon(remainingSeconds)
    }
  }

  private async sendOtpEmail(
    email: string,
    otp: string,
    purpose: string,
  ): Promise<void> {
    try {
      const { subject, html } = this.buildOtpEmail(email, otp, purpose)
      await this.emailService.send(email, subject, html)
    } catch {
      this.logger.error('No se pudo enviar el correo con el código OTP.')
      throw new CustomError(
        'El código se guardó, pero no se pudo enviar el correo. '
          + 'Espera un minuto antes de solicitar otro código.',
        'uncontrolled',
        'VerifyCode.EmailSendFailed',
      )
    }
  }

  private buildOtpEmail(
    email: string,
    otp: string,
    purpose: string,
  ): { subject: string; html: string } {
    if (purpose === 'ALTA_ADMIN') {
      const activationUrl = new URL(
        '/activar-cuenta',
        process.env.FRONTEND_URL,
      )
      activationUrl.searchParams.set('email', email)
      const escapedUrl = activationUrl.toString()
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')

      return {
        subject: 'Activa tu cuenta',
        html: `
          <h1>Activa tu cuenta</h1>
          <p>
            Para verificar tu correo y elegir tu contraseña,
            utiliza el código <b>${otp}</b>.
          </p>
          <p><a href="${escapedUrl}">Activar mi cuenta</a></p>
          <p>Este código expirará en 15 minutos.</p>
        `,
      }
    }

    if (purpose === 'REGISTRO') {
      return {
        subject: 'Verifica tu correo electrónico',
        html: `
          <h1>¡Bienvenido a la Tienda Online!</h1>
          <p>Tu código de verificación es: <b>${otp}</b></p>
          <p>Este código expirará en 15 minutos.</p>
        `,
      }
    }

    return {
      subject: 'Recuperación de contraseña',
      html: `
        <h1>Recuperación de contraseña</h1>
        <p>
          Has solicitado restablecer tu contraseña.
          Tu código de verificación es: <b>${otp}</b>
        </p>
        <p>Este código expirará en 15 minutos.</p>
      `,
    }
  }
}
