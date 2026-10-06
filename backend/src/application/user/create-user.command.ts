import { Command } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { CreateUserHandler } from './create-user.handler'

export interface CreateUserDTO {
  email: string
  firstName: string
  lastName: string
  roleId?: string
}

export class CreateUserCommand extends Command<IdResult> {
  readonly handlerType = CreateUserHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(
    readonly input: CreateUserDTO,
  ) {
    super()
  }
}
