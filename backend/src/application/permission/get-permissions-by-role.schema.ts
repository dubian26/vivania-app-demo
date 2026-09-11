import { z } from 'zod'
import type { GetPermissionsByRoleDTO } from './get-permissions-by-role.query'

export const getPermissionsByRoleSchema = z.object({
  roleId: z.uuid({ message: 'El ID del rol no es un UUID válido.' }),
}) satisfies z.ZodType<GetPermissionsByRoleDTO>
