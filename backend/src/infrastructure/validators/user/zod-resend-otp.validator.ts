import { ResendOtpDTO } from '@/application/user/resend-otp.dto'
import { ResendOtpValidator } from '@/application/user/resend-otp.validator'
import { BaseError, ErrorDetail } from '@base/core/errors'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  purpose: z.enum(['REGISTRO', 'RECUPERACION']).optional().default('REGISTRO'),
})

@Injectable()
export class ZodResendOtpValidator extends ResendOtpValidator {
  validate(input: ResendOtpDTO): void {
    const result = schema.safeParse(input)
    if (result.success) return

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}
