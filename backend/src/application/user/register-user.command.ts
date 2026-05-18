import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { User } from '@/domain/user/user'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { IdResult } from '@/shared/models/id-result'
import { Injectable } from '@/shared/util/injectable'
import { v7 as uuidv7 } from 'uuid'
import { RegisterUserDTO } from './register-user.dto'
import { RegisterUserValidator } from './register-user.validator'

@Injectable()
export class RegisterUserCommand {
  constructor(
    private readonly validator: RegisterUserValidator,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) { }

  async execute(input: RegisterUserDTO): Promise<IdResult> {
    this.validator.validate(input)

    const existe = await this.userRepository.getByEmail(input.email)
    if (existe) throw UserError.AlreadyExists()

    const rol = await this.roleRepository.getByName(Role.CLIENTE)
    if (!rol) throw RoleError.NotExists()

    const newUser = User.create({
      id: uuidv7(),
      email: input.email,
      password: input.password,
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
