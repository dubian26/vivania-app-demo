import { Query } from '@/base/mediator'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { SearchRolesHandler } from './search-roles.handler'
import type { Result } from '@/base/models/result'
import type { Role } from '@/domain/role/role'

export interface SearchRolesDTO {
  skip: number
  take: number
  search?: string
}

export class SearchRolesQuery extends Query<Result<ReturnType<Role['toResult']>>> {
  readonly handlerType = SearchRolesHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: SearchRolesDTO) {
    super()
  }
}
