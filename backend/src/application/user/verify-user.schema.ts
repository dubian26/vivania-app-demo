import { z } from 'zod'
import type { VerifyUserDTO } from './verify-user.command'

export const verifyUserSchema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  code: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
  purpose: z.enum(['REGISTRO', 'RECUPERACION']).optional().default('REGISTRO'),
}) satisfies z.ZodType<VerifyUserDTO>
