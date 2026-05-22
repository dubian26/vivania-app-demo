import { UpdateRoleDTO } from '@/application/role/update-role.dto'
import { UpdateRoleValidator } from '@/application/role/update-role.validator'
import { BaseError, ErrorDetail } from '@base/core/errors'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  id: z.uuid(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').optional(),
  description: z.string().optional(),
})

@Injectable()
export class ZodUpdateRoleValidator extends UpdateRoleValidator {
  validate(input: UpdateRoleDTO): void {
    const result = schema.safeParse(input)
    if (result.success) return

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}
