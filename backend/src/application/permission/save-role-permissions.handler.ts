import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { AuthService } from '@/base/util/auth-service'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import type { SaveRolePermissionsCommand } from './save-role-permissions.command'
import { saveRolePermissionsSchema } from './save-role-permissions.schema'

@Injectable()
export class SaveRolePermissionsHandler implements RequestHandler<SaveRolePermissionsCommand, IdResult> {
  constructor(
    private readonly validator: Validator,
    private readonly permissionRepository: PermissionRepository,
    private readonly roleRepository: RoleRepository,
    private readonly authService: AuthService,
  ) { }

  async handle(request: SaveRolePermissionsCommand): Promise<IdResult> {
    this.authService.authorizedTo('/roles/permisos')
    const input = this.validator.parse(saveRolePermissionsSchema, request.input)

    const role = await this.roleRepository.findById(input.roleId)
    if (!role) throw RoleError.NotExists()

    await this.permissionRepository.saveRolePermissions(input.roleId, input.permissionIds)

    return { id: input.roleId, message: 'Permisos del rol actualizados con éxito.' }
  }
}
