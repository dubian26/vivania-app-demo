import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCode } from '@/domain/verify-code/verify-code'
import { VerifyCodeError } from '@/domain/verify-code/verify-code-error'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import { EmailService, TxManager } from '@js-core/domain/contracts'
import { Injectable } from '@js-core/domain/util'
import { randomUUID } from 'node:crypto'
import { ZodValidator } from '@/shared/util/zod-validator'
import { z } from 'zod'

export interface ResendOtpDTO {
  email: string
  purpose: 'REGISTRO' | 'RECUPERACION'
}

export const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  purpose: z.enum(['REGISTRO', 'RECUPERACION']).optional().default('REGISTRO'),
}) satisfies z.ZodType<ResendOtpDTO>

@Injectable()
export class ResendOtpCommand {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly verifyCodeRepo: VerifyCodeRepository,
    private readonly txManager: TxManager,
    private readonly emailService: EmailService,
  ) { }

  async execute(input: ResendOtpDTO): Promise<{ message: string }> {
    input = ZodValidator.parse(schema, input)

    const user = await this.userRepo.findByEmail(input.email)
    if (!user) throw UserError.NotExists()

    if (input.purpose === 'REGISTRO' && user.emailVerified)
      throw UserError.EmailAlreadyVerified()

    const rol = await this.roleRepo.findByName(Role.CLIENTE)
    if (!rol) throw RoleError.NotExists()

    const verifyCodes = await this.verifyCodeRepo.findByUserId(user.id)
    const recentCode = verifyCodes.find(code => code.purpose === input.purpose)
    if (!recentCode) throw VerifyCodeError.CodeDoesNotMatch()

    const diffSegundos = (new Date().getTime() - recentCode.createdAt.getTime()) / 1000
    if (diffSegundos < 60)
      throw VerifyCodeError.RetryVerySoon(Math.ceil(60 - diffSegundos))

    await this.txManager.run(async () => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const newVerifyCode = VerifyCode.create({
        id: randomUUID(),
        userId: user.id,
        code: otp,
        purpose: input.purpose,
        expiration: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      })

      await this.verifyCodeRepo.insert(newVerifyCode)

      const subject = input.purpose === 'REGISTRO'
        ? 'Verifica tu correo electrónico'
        : 'Recuperación de contraseña'

      const html = input.purpose === 'REGISTRO'
        ? `<h1>¡Bienvenido a la Tienda Online!</h1><p>Tu código de verificación es: <b>${otp}</b></p><p>Este código expirará en 15 minutos.</p>`
        : `<h1>Recuperación de contraseña</h1><p>Has solicitado restablecer tu contraseña. Tu código de verificación es: <b>${otp}</b></p><p>Este código expirará en 15 minutos.</p>`

      await this.emailService.send(user.email, subject, html)
    })

    return {
      message: 'Se ha enviado un nuevo código a tu correo.'
    }
  }
}
