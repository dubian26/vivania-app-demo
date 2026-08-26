import { RoleRepository } from '@/domain/role/role-repository'
import { Injectable } from '@/base/util/injectable'
import { Validator } from '@/base/contracts/validator'
import { z } from 'zod'

export interface SearchRolesDTO {
  skip: number
  take: number
  search?: string
}

export const schema = z.object({
  skip: z.coerce.number().int().min(0, { message: 'El valor de skip debe ser mayor o igual a 0' }),
  take: z.coerce.number().int().min(1, { message: 'El valor de take debe ser mayor o igual a 1' }),
  search: z.string().optional(),
}) satisfies z.ZodType<SearchRolesDTO>

@Injectable()
export class SearchRolesQuery {
  constructor(
    private readonly validator: Validator,
    private readonly roleRepository: RoleRepository,
  ) { }

  async execute(input: SearchRolesDTO) {
    input = this.validator.parse(schema, input)

    const roles = await this.roleRepository.search({
      skip: input.skip,
      take: input.take,
      search: input.search,
    })

    return roles.map((role) => role.toResult())
  }
}
