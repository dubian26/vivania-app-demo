import { LoginUserDTO } from '@/application/user/login-user.dto'
import { LoginUserValidator } from '@/application/user/login-user.validator'
import { BaseError, ErrorDetail } from '@base/core/errors'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

export const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
})

@Injectable()
export class ZodLoginUserValidator extends LoginUserValidator {
  validate(input: unknown): LoginUserDTO {
    const result = schema.safeParse(input)
    if (result.success) return result.data

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}
