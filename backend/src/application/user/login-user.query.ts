import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { PasswordHasher } from '@/base/contracts/password-hasher'
import { type UserInfo } from '@/base/models/user-info'
import { Injectable } from '@/base/util/injectable'
import { ZodValidator } from '@/shared/util/zod-validator'
import { z } from 'zod'

export interface LoginUserDTO {
  email: string
  password: string
}

export const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
}) satisfies z.ZodType<LoginUserDTO>

@Injectable()
export class LoginUserQuery {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(input: LoginUserDTO): Promise<UserInfo> {
    input = ZodValidator.parse(schema, input)
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
