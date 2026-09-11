import { Command } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { UpdateRoleHandler } from './update-role.handler'

export interface UpdateRoleDTO {
  id: string
  name?: string
  description?: string
}

export class UpdateRoleCommand extends Command<IdResult> {
  readonly handlerType = UpdateRoleHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: UpdateRoleDTO) {
    super()
  }
}
