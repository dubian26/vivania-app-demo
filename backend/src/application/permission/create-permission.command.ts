import { Command } from '@/base/mediator'
import { PermissionType } from '@/base/models/permission-model'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { CreatePermissionHandler } from './create-permission.handler'

export interface CreatePermissionDTO {
  path: string
  title: string
  type: PermissionType
  icon?: string | null
  order?: number
  active?: boolean
  parentId?: string | null
}

export class CreatePermissionCommand extends Command<unknown> {
  readonly handlerType = CreatePermissionHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: CreatePermissionDTO) {
    super()
  }
}
