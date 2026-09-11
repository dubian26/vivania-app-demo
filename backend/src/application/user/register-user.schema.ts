import { firstNameCheck, lastNameCheck, passCheck } from '@/base/util/zod-custom-schemas'
import { z } from 'zod'
import type { RegisterUserDTO } from './register-user.command'

export const registerUserSchema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  password: passCheck(),
  firstName: firstNameCheck(),
  lastName: lastNameCheck(),
}) satisfies z.ZodType<RegisterUserDTO>
