import { Command } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { DeletePermissionHandler } from './delete-permission.handler'

export class DeletePermissionCommand extends Command<IdResult> {
  readonly handlerType = DeletePermissionHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly id: string) {
    super()
  }
}
