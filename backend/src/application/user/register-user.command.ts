import { Command } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { RegisterUserHandler } from './register-user.handler'

export interface RegisterUserDTO {
  email: string
  password: string
  firstName: string
  lastName: string
}

export class RegisterUserCommand extends Command<IdResult> {
  readonly handlerType = RegisterUserHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: RegisterUserDTO) {
    super()
  }
}
