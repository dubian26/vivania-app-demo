import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { Injectable } from '@/base/util/injectable'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import type { GetPermissionsByRoleQuery } from './get-permissions-by-role.query'
import { getPermissionsByRoleSchema } from './get-permissions-by-role.schema'

@Injectable()
export class GetPermissionsByRoleHandler implements RequestHandler<GetPermissionsByRoleQuery, unknown[]> {
  constructor(
    private readonly validator: Validator,
    private readonly permissionRepository: PermissionRepository,
  ) { }

  async handle(request: GetPermissionsByRoleQuery): Promise<unknown[]> {
    const input = this.validator.parse(getPermissionsByRoleSchema, request.input)

    const permissions = await this.permissionRepository.listByRole(input.roleId)
    return permissions.map((permission) => permission.toResult())
  }
}
