import { SearchUsersDTO } from '@/application/user/search-users.dto'
import { SearchUsersValidator } from '@/application/user/search-users.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@js-core/domain/util'
import { z } from 'zod'

const schema = z.object({
  skip: z.string().regex(/^(0|[1-9]\d*)$/, { message: 'El valor de skip debe ser mayor o igual a 0' }),
  take: z.string().regex(/^[1-9]\d*$/, { message: 'El valor de take debe ser mayor o igual a 1' }),
  search: z.string().optional(),
})

@Injectable()
export class ZodSearchUsersValidator extends SearchUsersValidator {
  validate(input: SearchUsersDTO): void {
    ZodValidator.parse(schema, input)
  }
}
