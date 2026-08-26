import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { AuthService } from '@/base/util/auth-service'
import { Validator } from '@/base/contracts/validator'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { z } from 'zod'

export interface SaveRolePermissionsDTO {
  roleId: string
  permissionIds: string[]
}

export const schema = z.object({
  roleId: z.uuid({ message: 'El ID del rol no es un UUID válido.' }),
  permissionIds: z.array(
    z.uuid({ message: 'Uno de los IDs de permiso no es un UUID válido.' }),
    { message: 'Los permisos deben enviarse como una lista de IDs.' }
  ),
}) satisfies z.ZodType<SaveRolePermissionsDTO>

@Injectable()
export class SaveRolePermissionsCommand {
  constructor(
    private readonly validator: Validator,
    private readonly permissionRepository: PermissionRepository,
    private readonly roleRepository: RoleRepository,
    private readonly authService: AuthService,
  ) { }

  async execute(input: SaveRolePermissionsDTO): Promise<IdResult> {
    this.authService.authorizedTo('/roles/permisos')
    input = this.validator.parse(schema, input)

    const role = await this.roleRepository.findById(input.roleId)
    if (!role) throw RoleError.NotExists()

    await this.permissionRepository.saveRolePermissions(input.roleId, input.permissionIds)

    return { id: input.roleId, message: 'Permisos del rol actualizados con éxito.' }
  }
}
