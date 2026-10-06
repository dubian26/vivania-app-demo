import { Command } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { UpdateUserHandler } from './update-user.handler'

export interface UpdateUserDTO {
  firstName?: string
  lastName?: string
  active?: boolean
  roleId?: string
}

export class UpdateUserCommand extends Command<IdResult> {
  readonly handlerType = UpdateUserHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(
    readonly id: string,
    readonly input: UpdateUserDTO,
    readonly currentRoleName: string,
  ) {
    super()
  }
}
