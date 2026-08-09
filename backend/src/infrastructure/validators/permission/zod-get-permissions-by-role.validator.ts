import { GetPermissionsByRoleDTO } from '@/application/permission/get-permissions-by-role.dto'
import { GetPermissionsByRoleValidator } from '@/application/permission/get-permissions-by-role.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@js-core/domain/util'
import { z } from 'zod'

const schema = z.object({
  roleId: z.uuid({ message: 'El ID del rol no es un UUID válido.' }),
})

@Injectable()
export class ZodGetPermissionsByRoleValidator extends GetPermissionsByRoleValidator {
  validate(input: GetPermissionsByRoleDTO): void {
    ZodValidator.parse(schema, input)
  }
}