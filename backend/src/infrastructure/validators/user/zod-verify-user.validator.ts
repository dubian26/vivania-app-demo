import { VerifyUserDTO } from '@/application/user/verify-user.dto'
import { VerifyUserValidator } from '@/application/user/verify-user.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@js-core/domain/util'
import { z } from 'zod'

const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  code: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
  purpose: z.enum(['REGISTRO', 'RECUPERACION']).optional().default('REGISTRO'),
})

@Injectable()
export class ZodVerifyUserValidator extends VerifyUserValidator {
  validate(input: VerifyUserDTO): void {
    ZodValidator.parse(schema, input)
  }
}
