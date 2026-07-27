import { CreateRoleDTO } from '@/application/role/create-role.dto'
import { CreateRoleValidator } from '@/application/role/create-role.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@js-core/domain'
import { z } from 'zod'

const schema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .regex(
      /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s]+$/,
      { message: 'El nombre contiene caracteres no válidos' }
    ),
  description: z.string()
    .optional()
    .refine(
      (val) => val === undefined || /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,;:!?\-_@#$%&()/+=]+$/.test(val),
      { message: 'La descripción contiene caracteres no válidos' }
    )
})

@Injectable()
export class ZodCreateRoleValidator extends CreateRoleValidator {
  validate(input: CreateRoleDTO): void {
    ZodValidator.parse(schema, input)
  }
}
