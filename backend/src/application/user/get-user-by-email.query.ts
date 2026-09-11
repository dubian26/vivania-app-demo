import { Query } from '@/base/mediator'
import { UserResult } from '@/domain/user/user'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { GetUserByEmailHandler } from './get-user-by-email.handler'

export interface GetUserByEmailDTO {
  email: string
}

export class GetUserByEmailQuery extends Query<UserResult> {
  readonly handlerType = GetUserByEmailHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: GetUserByEmailDTO) {
    super()
  }
}
