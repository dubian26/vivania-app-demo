import { SaveRolePermissionsDTO } from './save-role-permissions.dto'
import { SaveRolePermissionsValidator } from './save-role-permissions.validator'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { AuthService } from '@/shared/util/auth-service'
import { IdResult } from '@js-core/domain/models'
import { Injectable } from '@js-core/domain/util'

@Injectable()
export class SaveRolePermissionsCommand {
  constructor(
    private readonly validator: SaveRolePermissionsValidator,
    private readonly permissionRepository: PermissionRepository,
    private readonly roleRepository: RoleRepository,
    private readonly authService: AuthService,
  ) { }

  async execute(input: SaveRolePermissionsDTO): Promise<IdResult> {
    this.authService.authorizedTo('/roles/permisos')
    this.validator.validate(input)

    const role = await this.roleRepository.findById(input.roleId)
    if (!role) throw RoleError.NotExists()

    await this.permissionRepository.saveRolePermissions(input.roleId, input.permissionIds)

    return { id: input.roleId, message: 'Permisos del rol actualizados con éxito.' }
  }
}