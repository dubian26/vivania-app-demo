import { z } from 'zod'
import type { SaveRolePermissionsDTO } from './save-role-permissions.command'

export const saveRolePermissionsSchema = z.object({
  roleId: z.uuid({ message: 'El ID del rol no es un UUID válido.' }),
  permissionIds: z.array(
    z.uuid({ message: 'Uno de los IDs de permiso no es un UUID válido.' }),
    { message: 'Los permisos deben enviarse como una lista de IDs.' },
  ),
}) satisfies z.ZodType<SaveRolePermissionsDTO>
