import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { Injectable } from '@/base/util/injectable'
import { ZodValidator } from '@/shared/util/zod-validator'
import { z } from 'zod'

export interface GetUserByEmailDTO {
  email: string
}

export const schema = z.object({
  email: z.string()
    .min(1, { message: 'El correo electrónico es obligatorio' })
    .email({ message: 'El formato del correo electrónico no es válido' }),
}) satisfies z.ZodType<GetUserByEmailDTO>

@Injectable()
export class GetUserByEmailQuery {
  constructor(
    private readonly userRepository: UserRepository,
  ) { }

  async execute(input: GetUserByEmailDTO) {
    input = ZodValidator.parse(schema, input)

    const user = await this.userRepository.findByEmail(input.email)
    if (!user) throw UserError.NotExists()

    return user.toResult()
  }
}
