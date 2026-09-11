import { Command } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { SaveRolePermissionsHandler } from './save-role-permissions.handler'

export interface SaveRolePermissionsDTO {
  roleId: string
  permissionIds: string[]
}

export class SaveRolePermissionsCommand extends Command<IdResult> {
  readonly handlerType = SaveRolePermissionsHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: SaveRolePermissionsDTO) {
    super()
  }
}
