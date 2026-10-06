import { TxManager } from '@/base/contracts/tx-manager'
import { PasswordHasher } from '@/base/contracts/password-hasher'
import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCodeError } from '@/domain/verify-code/verify-code-error'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import type { VerifyUserCommand, VerifyUserResult } from './verify-user.command'
import { verifyUserSchema } from './verify-user.schema'

@Injectable()
export class VerifyUserHandler implements RequestHandler<VerifyUserCommand, VerifyUserResult> {
  constructor(
    private readonly validator: Validator,
    private readonly userRepo: UserRepository,
    private readonly verifyCodeRepo: VerifyCodeRepository,
    private readonly txManager: TxManager,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async handle(request: VerifyUserCommand): Promise<VerifyUserResult> {
    const input = this.validator.parse(verifyUserSchema, request.input)

    const user = await this.userRepo.findByEmail(input.email)
    if (!user) throw UserError.NotExists()

    if (input.purpose !== 'RECUPERACION' && user.emailVerified)
      throw UserError.EmailAlreadyVerified()

    const verifyCode = await this.verifyCodeRepo.findByCode(input.code, input.purpose)
    if (!verifyCode || verifyCode.used) throw VerifyCodeError.InvalidCode()

    if (verifyCode.userId !== user.id)
      throw VerifyCodeError.CodeDoesNotMatch()

    if (new Date() > verifyCode.expiration)
      throw VerifyCodeError.CodeExpired()

    const hashedPassword = input.purpose === 'ALTA_ADMIN' && input.password !== undefined
      ? await this.passwordHasher.hash(input.password)
      : undefined

    await this.txManager.run(async () => {
      verifyCode.markAsUsed()
      await this.verifyCodeRepo.update(verifyCode)

      if (hashedPassword !== undefined) user.changePassword(hashedPassword)

      if (!user.emailVerified) {
        user.verifyEmail()
        user.activate()
      }
      await this.userRepo.update(user)
    })

    const userInfo = user.toUserInfo()

    return {
      message: input.purpose === 'ALTA_ADMIN'
        ? 'Cuenta activada. Tu contraseña ha sido guardada correctamente.'
        : input.purpose === 'REGISTRO'
        ? 'Email verificado correctamente. Ya puedes iniciar sesión.'
        : 'Código verificado correctamente.',
      userInfo,
    }
  }
}
