import { UpdateRoleDTO } from '@/application/role/update-role.dto'
import { UpdateRoleValidator } from '@/application/role/update-role.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@js-core/domain/util'
import { z } from 'zod'

const schema = z.object({
  id: z.uuid(),
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .regex(
      /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s]+$/,
      { message: 'El nombre contiene caracteres no válidos' }
    )
    .optional(),
  description: z.string()
    .optional()
    .refine(
      (val) => val === undefined || /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,;:!?\-_@#$%&()/+=]+$/.test(val),
      { message: 'La descripción contiene caracteres no válidos' }
    ),
})

@Injectable()
export class ZodUpdateRoleValidator extends UpdateRoleValidator {
  validate(input: UpdateRoleDTO): void {
    ZodValidator.parse(schema, input)
  }
}
