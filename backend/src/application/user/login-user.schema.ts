import { passCheck } from '@/base/util/zod-custom-schemas'
import { z } from 'zod'
import type { LoginUserDTO } from './login-user.query'

export const loginUserSchema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  password: passCheck(),
}) satisfies z.ZodType<LoginUserDTO>
