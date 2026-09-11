import { Query } from '@/base/mediator'
import { UserResult } from '@/domain/user/user'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { SearchUsersHandler } from './search-users.handler'

export interface SearchUsersDTO {
  skip: number
  take: number
  search?: string
}

export class SearchUsersQuery extends Query<UserResult[]> {
  readonly handlerType = SearchUsersHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: SearchUsersDTO) {
    super()
  }
}
