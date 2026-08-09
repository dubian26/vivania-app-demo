import { SaveRolePermissionsDTO } from '@/application/permission/save-role-permissions.dto'
import { SaveRolePermissionsValidator } from '@/application/permission/save-role-permissions.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@js-core/domain/util'
import { z } from 'zod'

const schema = z.object({
  roleId: z.uuid({ message: 'El ID del rol no es un UUID válido.' }),
  permissionIds: z.array(
    z.uuid({ message: 'Uno de los IDs de permiso no es un UUID válido.' }),
    { message: 'Los permisos deben enviarse como una lista de IDs.' }
  ),
})

@Injectable()
export class ZodSaveRolePermissionsValidator extends SaveRolePermissionsValidator {
  validate(input: SaveRolePermissionsDTO): void {
    ZodValidator.parse(schema, input)
  }
}