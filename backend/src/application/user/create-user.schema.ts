import { firstNameCheck, lastNameCheck } from '@/base/util/zod-custom-schemas'
import { z } from 'zod'
import type { CreateUserDTO } from './create-user.command'

export const createUserSchema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  firstName: firstNameCheck(),
  lastName: lastNameCheck(),
  roleId: z.uuid({ message: 'El roleId debe ser un UUID válido.' }).optional(),
}) satisfies z.ZodType<CreateUserDTO>
