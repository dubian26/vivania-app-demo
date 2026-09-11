import { Query } from '@/base/mediator'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { GetPermissionsByRoleHandler } from './get-permissions-by-role.handler'

export interface GetPermissionsByRoleDTO {
  roleId: string
}

export class GetPermissionsByRoleQuery extends Query<unknown[]> {
  readonly handlerType = GetPermissionsByRoleHandler
  readonly behaviorTypes = [LoggingBehavior]

  constructor(readonly input: GetPermissionsByRoleDTO) {
    super()
  }
}
