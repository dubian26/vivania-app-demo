import { Query } from '@/base/mediator'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { SearchRolesHandler } from './search-roles.handler'

export interface SearchRolesDTO {
  skip: number
  take: number
  search?: string
}

export class SearchRolesQuery extends Query<unknown[]> {
  readonly handlerType = SearchRolesHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: SearchRolesDTO) {
    super()
  }
}
