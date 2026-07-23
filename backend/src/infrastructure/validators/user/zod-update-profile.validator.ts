import { UpdateProfileValidator } from '@/application/user/update-profile.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string()
    .min(2, { message: 'El nombre es demasiado corto.' })
    .max(50, { message: 'El nombre es demasiado largo.' })
    .optional(),
  lastName: z.string()
    .min(2, { message: 'El apellido es demasiado corto.' })
    .max(50, { message: 'El apellido es demasiado largo.' })
    .optional(),
  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    .regex(/[A-Z]/, { message: 'Debe contener al menos una mayúscula.' })
    .optional(),
}).refine(data => data.firstName !== undefined || data.lastName !== undefined || data.password !== undefined, {
  message: 'Debe proporcionar al menos un campo para actualizar.',
})

@Injectable()
export class ZodUpdateProfileValidator extends UpdateProfileValidator {
  validate(input: unknown): void {
    ZodValidator.parse(schema, input)
  }
}
