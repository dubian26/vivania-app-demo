import { Command } from '@/base/mediator'
import { UserInfo } from '@/base/models/user-info'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { VerifyUserHandler } from './verify-user.handler'

export interface VerifyUserDTO {
  email: string
  code: string
  purpose: 'REGISTRO' | 'RECUPERACION' | 'ALTA_ADMIN'
  password?: string
}

export interface VerifyUserResult {
  message: string
  userInfo?: UserInfo
}

export class VerifyUserCommand extends Command<VerifyUserResult> {
  readonly handlerType = VerifyUserHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: VerifyUserDTO) {
    super()
  }
}
