import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { User } from '@/domain/user/user'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { PasswordHasher } from '@/shared/contracts/password-hasher'
import { IdResult } from '@/shared/models/id-result'
import { Injectable } from '@/shared/util/injectable'
import { randomUUID } from 'node:crypto'
import { RegisterUserDTO } from './register-user.dto'
import { RegisterUserValidator } from './register-user.validator'

@Injectable()
export class RegisterUserCommand {
  constructor(
    private readonly validator: RegisterUserValidator,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(input: RegisterUserDTO): Promise<IdResult> {
    this.validator.validate(input)

    const existe = await this.userRepository.getByEmail(input.email)
    if (existe) throw UserError.AlreadyExists()

    const rol = await this.roleRepository.getByName(Role.CLIENTE)
    if (!rol) throw RoleError.NotExists()

    const hashedPassword = await this.passwordHasher.hash(input.password)

    const newUser = User.create({
      id: randomUUID(),
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      roleId: rol.id,
    })

    await this.userRepository.insert(newUser)

    return {
      id: newUser.id,
      message: 'Usuario creado. Por favor verifica tu email con el código OTP enviado.'
    }
  }
}
