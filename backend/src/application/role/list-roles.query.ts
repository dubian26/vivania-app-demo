import { Query } from '@/base/mediator'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { ListRolesHandler } from './list-roles.handler'

export class ListRolesQuery extends Query<unknown[]> {
  readonly handlerType = ListRolesHandler
  readonly behaviorTypes = [LoggingBehavior]
}
