import { Injectable } from '@/base/util/injectable'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { ZodValidator } from '@/shared/util/zod-validator'
import { z } from 'zod'

export interface GetUserByEmailDTO {
  email: string
}

const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
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
