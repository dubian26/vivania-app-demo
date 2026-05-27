import { SearchRolesDTO } from '@/application/role/search-roles.dto'
import { SearchRolesValidator } from '@/application/role/search-roles.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  skip: z.string().regex(/^(0|[1-9]\d*)$/, { message: 'El valor de skip debe ser mayor o igual a 0' }),
  take: z.string().regex(/^[1-9]\d*$/, { message: 'El valor de take debe ser mayor o igual a 1' }),
  search: z.string().optional(),
})

@Injectable()
export class ZodSearchRolesValidator extends SearchRolesValidator {
  validate(input: SearchRolesDTO): void {
    ZodValidator.parse(schema, input)
  }
}
