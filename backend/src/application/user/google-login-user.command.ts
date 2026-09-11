import { Command } from '@/base/mediator'
import { UserInfo } from '@/base/models/user-info'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { GoogleLoginUserHandler } from './google-login-user.handler'

export interface GoogleLoginUserDTO {
  token: string
}

export class GoogleLoginUserCommand extends Command<UserInfo> {
  readonly handlerType = GoogleLoginUserHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: GoogleLoginUserDTO) {
    super()
  }
}
