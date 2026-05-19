import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { PasswordHasher } from '@/shared/contracts/password-hasher'
import { type UserInfo } from '@/shared/models/user-info'
import { Injectable } from '@/shared/util/injectable'
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
    const user = await this.userRepository.getByEmail(input.email)

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
