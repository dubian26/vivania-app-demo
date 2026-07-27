import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { PasswordHasher } from '@js-core/domain/contracts'
import { type UserInfo } from '@js-core/domain/models'
import { Injectable } from '@js-core/domain/util'
import { LoginUserDTO } from './login-user.dto'
import { LoginUserValidator } from './login-user.validator'

@Injectable()
export class LoginUserQuery {
  constructor(
    private readonly validator: LoginUserValidator,
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(input: LoginUserDTO): Promise<UserInfo> {
    this.validator.validate(input)
    const user = await this.userRepository.findByEmail(input.email)

    const isValidPassword = user
      ? await this.passwordHasher.compare(input.password, user.password)
      : false

    if (!user || !isValidPassword)
      throw UserError.InvalidCredentials()

    if (!user.emailVerified)
      throw UserError.EmailNotVerified()

    return user?.toUserInfo()
  }
}
