import { RegisterUserDTO } from '@/application/user/register-user.dto'
import { RegisterUserValidator } from '@/application/user/register-user.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@js-core/domain/util'
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
    ZodValidator.parse(schema, input)
  }
}
