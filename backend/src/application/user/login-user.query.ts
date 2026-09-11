import { Query } from '@/base/mediator'
import { UserInfo } from '@/base/models/user-info'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { LoginUserHandler } from './login-user.handler'

export interface LoginUserDTO {
  email: string
  password: string
}

export class LoginUserQuery extends Query<UserInfo> {
  readonly handlerType = LoginUserHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: LoginUserDTO) {
    super()
  }
}
