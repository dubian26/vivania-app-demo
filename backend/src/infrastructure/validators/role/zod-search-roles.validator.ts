import { SearchRolesDTO } from '@/application/role/search-roles.dto'
import { SearchRolesValidator } from '@/application/role/search-roles.validator'
import { BaseError, ErrorDetail } from '@base/core/errors'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  skip: z.number().min(0, 'El valor de skip debe ser mayor o igual a 0'),
  take: z.number().min(1, 'El valor de take debe ser mayor o igual a 1'),
  search: z.string().optional(),
})

@Injectable()
export class ZodSearchRolesValidator extends SearchRolesValidator {
  validate(input: SearchRolesDTO): void {
    const result = schema.safeParse(input)
    if (result.success) return

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}
