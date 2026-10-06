import { firstNameCheck, lastNameCheck } from '@/base/util/zod-custom-schemas'
import { z } from 'zod'
import type { UpdateUserDTO } from './update-user.command'

export const updateUserSchema = z.object({
  firstName: firstNameCheck().optional(),
  lastName: lastNameCheck().optional(),
  active: z.boolean({ message: 'El campo active debe ser un booleano.' }).optional(),
  roleId: z.uuid({ message: 'El roleId debe ser un UUID válido.' }).optional(),
}).refine(
  data => data.firstName !== undefined ||
    data.lastName !== undefined ||
    data.active !== undefined ||
    data.roleId !== undefined,
  {
    message: 'Debe proporcionar al menos un campo para actualizar.',
  },
) satisfies z.ZodType<UpdateUserDTO>
