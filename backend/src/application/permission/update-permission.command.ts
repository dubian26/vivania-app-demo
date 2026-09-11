import { Command } from '@/base/mediator'
import { PermissionType } from '@/base/models/permission-model'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { UpdatePermissionHandler } from './update-permission.handler'

export interface UpdatePermissionDTO {
  id: string
  path: string
  title: string
  type: PermissionType
  icon?: string | null
  order?: number
  active?: boolean
  parentId?: string | null
}

export class UpdatePermissionCommand extends Command<unknown> {
  readonly handlerType = UpdatePermissionHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: UpdatePermissionDTO) {
    super()
  }
}
