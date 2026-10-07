import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import type { Result } from '@/base/models/result'
import { Injectable } from '@/base/util/injectable'
import { UserRepository } from '@/domain/user/user-repository'
import { UserResult } from '@/domain/user/user'
import type { SearchUsersQuery } from './search-users.query'
import { searchUsersSchema } from './search-users.schema'

@Injectable()
export class SearchUsersHandler implements RequestHandler<SearchUsersQuery, Result<UserResult>> {
  constructor(
    private readonly validator: Validator,
    private readonly userRepository: UserRepository,
  ) { }

  async handle(request: SearchUsersQuery): Promise<Result<UserResult>> {
    const input = this.validator.parse(searchUsersSchema, request.input)

    const [users, totalRows] = await Promise.all([
      this.userRepository.search({
        skip: input.skip,
        take: input.take,
        search: input.search,
      }),
      this.userRepository.totalRows({ search: input.search }),
    ])

    return { totalRows, data: users.map((user) => user.toResult()) }
  }
}
