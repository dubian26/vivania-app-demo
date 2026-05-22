import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { User } from '@/domain/user/user'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCode } from '@/domain/verify-code/verify-code'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import { EmailService, PasswordHasher, TxManager } from '@base/core/contracts'
import { IdResult } from '@base/core/models'
import { Injectable } from '@base/core/util'
import { randomUUID } from 'node:crypto'
import { RegisterUserDTO } from './register-user.dto'
import { RegisterUserValidator } from './register-user.validator'

@Injectable()
export class RegisterUserCommand {
  constructor(
    private readonly validator: RegisterUserValidator,
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly verifyCodeRepo: VerifyCodeRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly txManager: TxManager,
    private readonly emailService: EmailService,
  ) { }

  async execute(input: RegisterUserDTO): Promise<IdResult> {
    this.validator.validate(input)

    const existe = await this.userRepo.findByEmail(input.email)
    if (existe) throw UserError.AlreadyExists()

    const rol = await this.roleRepo.findByName(Role.CLIENTE)
    if (!rol) throw RoleError.NotExists()

    const newUserId = randomUUID()

    await this.txManager.run(async () => {
      const hashedPassword = await this.passwordHasher.hash(input.password)

      const newUser = User.create({
        id: newUserId,
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        roleId: rol.id,
      })

      await this.userRepo.insert(newUser)

      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const verifyCode = VerifyCode.create({
        id: randomUUID(),
        userId: newUserId,
        code: otp,
        purpose: 'REGISTRO',
        expiration: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      })

      await this.verifyCodeRepo.insert(verifyCode)

      const subject = 'Verifica tu correo electrónico'
      const emailHtml = `<h1>¡Bienvenido a la Tienda Online!</h1>
      <p>Tu código de verificación es: <b>${otp}</b></p>
      <p>Este código espirará en 15 minutos.</p>`

      await this.emailService.send(newUser.email, subject, emailHtml)
    })

    return {
      id: newUserId,
      message: 'Usuario creado. Por favor verifica tu email con el código OTP enviado.'
    }
  }
}
