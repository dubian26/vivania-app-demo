import { VerifyUserDTO } from '@/application/user/verify-user.dto'
import { VerifyUserValidator } from '@/application/user/verify-user.validator'
import { BaseError, ErrorDetail } from '@base/core/errors'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  code: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
  purpose: z.enum(['REGISTRO', 'RECUPERACION']).optional().default('REGISTRO'),
})

@Injectable()
export class ZodVerifyUserValidator extends VerifyUserValidator {
  validate(input: VerifyUserDTO): void {
    const result = schema.safeParse(input)
    if (result.success) return

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}
