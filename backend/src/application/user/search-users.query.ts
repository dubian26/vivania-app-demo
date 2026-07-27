import { UserRepository } from '@/domain/user/user-repository'
import { Injectable } from '@js-core/domain/util'
import { SearchUsersDTO } from './search-users.dto'
import { SearchUsersValidator } from './search-users.validator'

@Injectable()
export class SearchUsersQuery {
  constructor(
    private readonly validator: SearchUsersValidator,
    private readonly userRepository: UserRepository,
  ) { }

  async execute(input: SearchUsersDTO) {
    this.validator.validate(input)

    const users = await this.userRepository.search({
      skip: Number(input.skip),
      take: Number(input.take),
      search: input.search,
    })

    return users.map((user) => user.toResult())
  }
}
