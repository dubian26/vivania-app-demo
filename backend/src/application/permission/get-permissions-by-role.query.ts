import { GetPermissionsByRoleDTO } from './get-permissions-by-role.dto'
import { GetPermissionsByRoleValidator } from './get-permissions-by-role.validator'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { Injectable } from '@js-core/domain/util'

@Injectable()
export class GetPermissionsByRoleQuery {
  constructor(
    private readonly validator: GetPermissionsByRoleValidator,
    private readonly permissionRepository: PermissionRepository,
  ) { }

  async execute(input: GetPermissionsByRoleDTO) {
    this.validator.validate(input)

    const permissions = await this.permissionRepository.listByRole(input.roleId)
    return permissions.map((permission) => permission.toResult())
  }
}