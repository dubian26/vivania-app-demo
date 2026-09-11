import { Query } from '@/base/mediator'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { GetRoleHandler } from './get-role.handler'

export class GetRoleQuery extends Query<unknown> {
  readonly handlerType = GetRoleHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly id: string) {
    super()
  }
}
