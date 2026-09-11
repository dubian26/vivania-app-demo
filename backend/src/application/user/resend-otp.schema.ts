import { z } from 'zod'
import type { ResendOtpDTO } from './resend-otp.command'

export const resendOtpSchema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  purpose: z.enum(['REGISTRO', 'RECUPERACION']).optional().default('REGISTRO'),
}) satisfies z.ZodType<ResendOtpDTO>
