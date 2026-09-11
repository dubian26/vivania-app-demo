import { PasswordHasher } from '@/base/contracts/password-hasher'
import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { UserInfo } from '@/base/models/user-info'
import { Injectable } from '@/base/util/injectable'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import type { LoginUserQuery } from './login-user.query'
import { loginUserSchema } from './login-user.schema'

@Injectable()
export class LoginUserHandler implements RequestHandler<LoginUserQuery, UserInfo> {
  constructor(
    private readonly validator: Validator,
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async handle(request: LoginUserQuery): Promise<UserInfo> {
    const input = this.validator.parse(loginUserSchema, request.input)
    const user = await this.userRepository.findByEmail(input.email)

    const isValidPassword = user
      ? await this.passwordHasher.compare(input.password, user.password)
      : false

    if (!user || !isValidPassword)
      throw UserError.InvalidCredentials()

    if (!user.emailVerified)
      throw UserError.EmailNotVerified()

    return user.toUserInfo()
  }
}
