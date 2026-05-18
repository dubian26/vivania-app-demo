import { CreateRoleDTO } from '@/application/role/create-role.dto'
import { CreateRoleValidator } from '@/application/role/create-role.validator'
import { BaseError } from '@/shared/errors/base-error'
import { ErrorDetail } from '@/shared/errors/error-model'
import { Injectable } from '@nestjs/common'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  active: z.boolean().optional()
})

@Injectable()
export class ZodCreateRoleValidator extends CreateRoleValidator {
  validate(input: CreateRoleDTO): void {
    const result = schema.safeParse(input)
    if (result.success) return

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}