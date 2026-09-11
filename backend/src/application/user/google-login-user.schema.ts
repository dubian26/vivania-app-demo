import { z } from 'zod'
import type { GoogleLoginUserDTO } from './google-login-user.command'

export const googleLoginUserSchema = z.object({
  token: z.string().min(1, 'Token de Google es requerido'),
}) satisfies z.ZodType<GoogleLoginUserDTO>
