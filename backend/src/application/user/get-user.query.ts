import { Query } from '@/base/mediator'
import { UserResult } from '@/domain/user/user'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { GetUserHandler } from './get-user.handler'

export class GetUserQuery extends Query<UserResult> {
  readonly handlerType = GetUserHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly id: string) {
    super()
  }
}
