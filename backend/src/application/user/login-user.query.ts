import { type UserInfo } from '@/shared/models/user-info'
import { LoginUserValidator } from './login-user.validator'
import { Injectable } from '@/shared/util/injectable'
import { UserRepository } from '@/domain/user/user-repository'
import { UserError } from '@/domain/user/user-error'

@Injectable()
export class LoginUserQuery {
  constructor(
    private readonly loginUserValidator: LoginUserValidator,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(req: unknown): Promise<UserInfo> {
    const dto = this.loginUserValidator.validate(req)
    const user = await this.userRepository.getByEmail(dto.email)

    if (!user || user.password !== dto.password)
      throw UserError.InvalidCredentials()

    if (!user.emailVerified) throw UserError.EmailNotVerified()

    return user?.toUserInfo()
  }
}
