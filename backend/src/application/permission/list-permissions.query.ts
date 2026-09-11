import { Query } from '@/base/mediator'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { ListPermissionsHandler } from './list-permissions.handler'

export class ListPermissionsQuery extends Query<unknown[]> {
  readonly handlerType = ListPermissionsHandler
  readonly behaviorTypes = [LoggingBehavior]
}
