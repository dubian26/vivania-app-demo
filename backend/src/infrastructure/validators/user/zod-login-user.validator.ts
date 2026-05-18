import { LoginUserDTO } from '@/application/user/login-user.dto'
import { LoginUserValidator } from '@/application/user/login-user.validator'
import { BaseError } from '@/shared/errors/base-error'
import { ErrorDetail } from '@/shared/errors/error-model'
import { Injectable } from '@/shared/util/injectable'
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
