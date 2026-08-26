import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCodeError } from '@/domain/verify-code/verify-code-error'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import { TxManager } from '@/base/contracts/tx-manager'
import { Injectable } from '@/base/util/injectable'
import { UserInfo } from '@/base/models/user-info'
import { Validator } from '@/base/contracts/validator'
import { z } from 'zod'

export interface VerifyUserDTO {
  email: string
  code: string
  purpose: 'REGISTRO' | 'RECUPERACION'
}

export interface VerifyUserResult {
  message: string
  userInfo?: UserInfo
}

export const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  code: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
  purpose: z.enum(['REGISTRO', 'RECUPERACION']).optional().default('REGISTRO'),
}) satisfies z.ZodType<VerifyUserDTO>

@Injectable()
export class VerifyUserCommand {
  constructor(
    private readonly validator: Validator,
    private readonly userRepo: UserRepository,
    private readonly verifyCodeRepo: VerifyCodeRepository,
    private readonly txManager: TxManager,
  ) { }

  async execute(input: VerifyUserDTO): Promise<VerifyUserResult> {
    input = this.validator.parse(schema, input)

    const user = await this.userRepo.findByEmail(input.email)
    if (!user) throw UserError.NotExists()

    if (input.purpose === 'REGISTRO' && user.emailVerified)
      throw UserError.EmailAlreadyVerified()

    const verifyCode = await this.verifyCodeRepo.findByCode(input.code, input.purpose)
    if (!verifyCode) throw VerifyCodeError.InvalidCode()

    if (verifyCode.userId !== user.id)
      throw VerifyCodeError.CodeDoesNotMatch()

    if (new Date() > verifyCode.expiration)
      throw VerifyCodeError.CodeExpired()

    await this.txManager.run(async () => {
      verifyCode.markAsUsed()
      await this.verifyCodeRepo.update(verifyCode)

      // Entering a valid OTP proves ownership of the email, regardless of the
      // purpose (REGISTRO is always unverified here; RECUPERACION may be used
      // by an account that never completed registration). Mark it verified and
      // active so the user can actually log in afterwards.
      if (!user.emailVerified) {
        user.verifyEmail()
        user.activate()
        await this.userRepo.update(user)
      }
    })

    const userInfo = user.toUserInfo()

    return {
      message: input.purpose === 'REGISTRO'
        ? 'Email verificado correctamente. Ya puedes iniciar sesión.'
        : 'Código verificado correctamente.',
      userInfo
    }
  }
}
