import { RegisterUserDTO } from '@/application/user/register-user.dto'
import { RegisterUserValidator } from '@/application/user/register-user.validator'
import { BaseError } from '@/shared/errors/base-error'
import { ErrorDetail } from '@/shared/errors/error-model'
import { Injectable } from '@/shared/util/injectable'
import { z } from 'zod'

const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    .regex(/[A-Z]/, { message: 'Debe contener al menos una mayúscula.' }),
  firstName: z.string()
    .min(2, { message: 'El nombre es demasiado corto.' })
    .max(50, { message: 'El nombre es demasiado largo.' }),
  lastName: z.string()
    .min(2, { message: 'El apellido es demasiado corto.' })
    .max(50, { message: 'El apellido es demasiado largo.' }),
})

@Injectable()
export class ZodRegisterUserValidator extends RegisterUserValidator {
  validate(input: RegisterUserDTO): void {
    const result = schema.safeParse(input)
    if (result.success) return

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}
