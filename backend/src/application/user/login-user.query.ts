import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { type UserInfo } from '@/shared/models/user-info'
import { Injectable } from '@/shared/util/injectable'
import { LoginUserDTO } from './login-user.dto'
import { LoginUserValidator } from './login-user.validator'

@Injectable()
export class LoginUserQuery {
  constructor(
    private readonly validator: LoginUserValidator,
    private readonly userRepository: UserRepository,
  ) { }

  async execute(input: LoginUserDTO): Promise<UserInfo> {
    this.validator.validate(input)
    const user = await this.userRepository.getByEmail(input.email)

    if (!user || user.password !== input.password)
      throw UserError.InvalidCredentials()

    if (!user.emailVerified)
      throw UserError.EmailNotVerified()

    return user?.toUserInfo()
  }
}
