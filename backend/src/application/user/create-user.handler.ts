import { EmailService } from '@/base/contracts/email-service'
import { PasswordHasher } from '@/base/contracts/password-hasher'
import { TxManager } from '@/base/contracts/tx-manager'
import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { AuthService } from '@/base/util/auth-service'
import { escapeHtml } from '@/base/util/helper'
import { Injectable } from '@/base/util/injectable'
import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { User } from '@/domain/user/user'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCode } from '@/domain/verify-code/verify-code'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import { Logger } from '@nestjs/common'
import { randomBytes, randomInt, randomUUID } from 'node:crypto'
import type { CreateUserCommand } from './create-user.command'
import { createUserSchema } from './create-user.schema'

const OTP_EXPIRATION_MS = 15 * 60 * 1000

@Injectable()
export class CreateUserHandler implements RequestHandler<CreateUserCommand, IdResult> {
  private readonly logger = new Logger(CreateUserHandler.name)

  constructor(
    private readonly validator: Validator,
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly verifyCodeRepo: VerifyCodeRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly txManager: TxManager,
    private readonly emailService: EmailService,
    private readonly authService: AuthService,
  ) { }

  async handle(request: CreateUserCommand): Promise<IdResult> {
    this.authService.authorizedTo('/usuarios/nuevo')

    const input = this.validator.parse(createUserSchema, request.input)
    const existingUser = await this.userRepo.findByEmail(input.email)
    if (existingUser) throw UserError.AlreadyExists()

    const role = input.roleId
      ? await this.roleRepo.findById(input.roleId)
      : await this.roleRepo.findByName(Role.CLIENTE)

    if (!role) throw RoleError.NotExists()

    const newUserId = randomUUID()

    // This random password is never shared; the owner replaces it during activation.
    const randomHex = randomBytes(32).toString('hex')
    const hashedPassword = await this.passwordHasher.hash(randomHex)

    const newUser = User.create({
      id: newUserId,
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      roleId: role.id,
    })

    const otp = randomInt(100000, 1000000).toString()

    const verifyCode = VerifyCode.create({
      id: randomUUID(),
      userId: newUserId,
      code: otp,
      purpose: 'ALTA_ADMIN',
      expiration: new Date(Date.now() + OTP_EXPIRATION_MS),
    })

    await this.txManager.run(async () => {
      await this.userRepo.insert(newUser)
      await this.verifyCodeRepo.insert(verifyCode)
    })

    const emailSent = await this.sendActivationEmail(newUser.email, otp)

    const message = emailSent
      ? 'Usuario creado. Debe verificar su correo y elegir una contraseña para activar la cuenta.'
      : 'Usuario creado, pero no se pudo enviar el correo. Solicita un nuevo código en la página de activación.'

    return {
      id: newUserId,
      message,
    }
  }

  private async sendActivationEmail(email: string, otp: string): Promise<boolean> {
    try {
      const activationUrl = new URL('/activar-cuenta', process.env.FRONTEND_URL)
      activationUrl.searchParams.set('email', email)

      const html = '<h1>¡Bienvenido!</h1>' +
        '<p>Un administrador ha creado una cuenta para ti. ' +
        'Para activarla y elegir tu contraseña, ingresa el ' +
        `código <b>${escapeHtml(otp)}</b> en este enlace:</p>` +
        `<p><a href="${escapeHtml(activationUrl.toString())}">Activar mi cuenta</a></p>` +
        '<p>El código expirará en 15 minutos.</p>'

      await this.emailService.send(email, 'Activa tu cuenta', html)

      return true
    } catch {
      this.logger.error('No se pudo enviar el correo de activación.')
      return false
    }
  }
}
