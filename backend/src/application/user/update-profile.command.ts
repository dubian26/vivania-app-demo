import { Command } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { UpdateProfileHandler } from './update-profile.handler'

export interface UpdateProfileDTO {
  firstName?: string
  lastName?: string
  password?: string
}

export class UpdateProfileCommand extends Command<IdResult> {
  readonly handlerType = UpdateProfileHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(
    readonly userId: string,
    readonly input: UpdateProfileDTO,
  ) {
    super()
  }
}
