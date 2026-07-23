import { UpdateUserValidator } from '@/application/user/update-user.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  active: z.boolean({ message: 'El campo active debe ser un booleano.' }).optional(),
  roleId: z.string().uuid({ message: 'El roleId debe ser un UUID válido.' }).optional(),
}).refine(data => data.active !== undefined || data.roleId !== undefined, {
  message: 'Debe proporcionar al menos un campo para actualizar.',
})

@Injectable()
export class ZodUpdateUserValidator extends UpdateUserValidator {
  validate(input: unknown): void {
    ZodValidator.parse(schema, input)
  }
}
