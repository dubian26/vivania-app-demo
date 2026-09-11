import { Command } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { CreateRoleHandler } from './create-role.handler'

export interface CreateRoleDTO {
  name: string
  description?: string
  active?: boolean
}

export class CreateRoleCommand extends Command<IdResult> {
  readonly handlerType = CreateRoleHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: CreateRoleDTO) {
    super()
  }
}
