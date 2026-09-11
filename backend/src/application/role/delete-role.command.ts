import { Command } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { DeleteRoleHandler } from './delete-role.handler'

export class DeleteRoleCommand extends Command<IdResult> {
  readonly handlerType = DeleteRoleHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly id: string) {
    super()
  }
}
