import { UserRepository } from '@/domain/user/user-repository'
import { Injectable } from '@/base/util/injectable'
import { Validator } from '@/base/contracts/validator'
import { z } from 'zod'

export interface SearchUsersDTO {
  skip: number
  take: number
  search?: string
}

export const schema = z.object({
  skip: z.coerce.number().int().min(0, { message: 'El valor de skip debe ser mayor o igual a 0' }),
  take: z.coerce.number().int().min(1, { message: 'El valor de take debe ser mayor o igual a 1' }),
  search: z.string().optional(),
}) satisfies z.ZodType<SearchUsersDTO>

@Injectable()
export class SearchUsersQuery {
  constructor(
    private readonly validator: Validator,
    private readonly userRepository: UserRepository,
  ) { }

  async execute(input: SearchUsersDTO) {
    input = this.validator.parse(schema, input)

    const users = await this.userRepository.search({
      skip: input.skip,
      take: input.take,
      search: input.search,
    })

    return users.map((user) => user.toResult())
  }
}
