import { PasswordHasher } from '@/base/contracts/password-hasher'
import { type UserInfo } from '@/base/models/user-info'
import { Injectable } from '@/base/util/injectable'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { passCheck } from '@/base/util/zod-custom-schemas'
import { Validator } from '@/base/contracts/validator'
import { z } from 'zod'

export interface LoginUserDTO {
  email: string
  password: string
}

const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  password: passCheck(),
}) satisfies z.ZodType<LoginUserDTO>

@Injectable()
export class LoginUserQuery {
  constructor(
    private readonly validator: Validator,
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(input: LoginUserDTO): Promise<UserInfo> {
    input = this.validator.parse(schema, input)
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
