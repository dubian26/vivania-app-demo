import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { type UserInfo } from '@/shared/models/user-info'
import { Injectable } from '@/shared/util/injectable'
import { LoginUserValidator } from './login-user.validator'

@Injectable()
export class LoginUserQuery {
  constructor(
    private readonly loginUserValidator: LoginUserValidator,
    private readonly userRepository: UserRepository,
  ) { }

  async execute(req: unknown): Promise<UserInfo> {
    const dto = this.loginUserValidator.validate(req)
    const user = await this.userRepository.getByEmail(dto.email)

    if (!user || user.password !== dto.password)
      throw UserError.InvalidCredentials()

    if (!user.emailVerified)
      throw UserError.EmailNotVerified()

    return user?.toUserInfo()
  }
}
