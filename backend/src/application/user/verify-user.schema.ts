import { passCheck } from '@/base/util/zod-custom-schemas'
import { z } from 'zod'
import type { VerifyUserDTO } from './verify-user.command'

export const verifyUserSchema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  code: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
  purpose: z.enum(['REGISTRO', 'RECUPERACION', 'ALTA_ADMIN']).optional().default('REGISTRO'),
  password: passCheck().optional(),
}).refine(
  data => data.purpose !== 'ALTA_ADMIN' || data.password !== undefined,
  { message: 'Debes definir una contraseña para activar esta cuenta.' },
) satisfies z.ZodType<VerifyUserDTO>
