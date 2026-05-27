import { ResendOtpDTO } from '@/application/user/resend-otp.dto'
import { ResendOtpValidator } from '@/application/user/resend-otp.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  purpose: z.enum(['REGISTRO', 'RECUPERACION']).optional().default('REGISTRO'),
})

@Injectable()
export class ZodResendOtpValidator extends ResendOtpValidator {
  validate(input: ResendOtpDTO): void {
    ZodValidator.parse(schema, input)
  }
}
