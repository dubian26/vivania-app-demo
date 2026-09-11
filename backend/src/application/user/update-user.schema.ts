import { z } from 'zod'
import type { UpdateUserDTO } from './update-user.command'

export const updateUserSchema = z.object({
  active: z.boolean({ message: 'El campo active debe ser un booleano.' }).optional(),
  roleId: z.uuid({ message: 'El roleId debe ser un UUID válido.' }).optional(),
}).refine(data => data.active !== undefined || data.roleId !== undefined, {
  message: 'Debe proporcionar al menos un campo para actualizar.',
}) satisfies z.ZodType<UpdateUserDTO>
