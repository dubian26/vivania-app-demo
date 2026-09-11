import { z } from 'zod'
import type { GetUserByEmailDTO } from './get-user-by-email.query'

export const getUserByEmailSchema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
}) satisfies z.ZodType<GetUserByEmailDTO>
