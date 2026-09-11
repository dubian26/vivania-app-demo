import { Injectable } from '@/base/util/injectable'
import { RequestHandler } from '@/base/mediator'
import { Validator } from '@/base/contracts/validator'
import { RoleRepository } from '@/domain/role/role-repository'
import type { SearchRolesQuery } from './search-roles.query'
import { searchRolesSchema } from './search-roles.schema'

@Injectable()
export class SearchRolesHandler implements RequestHandler<SearchRolesQuery, unknown[]> {
  constructor(
    private readonly validator: Validator,
    private readonly roleRepository: RoleRepository,
  ) { }

  async handle(request: SearchRolesQuery): Promise<unknown[]> {
    const input = this.validator.parse(searchRolesSchema, request.input)

    const roles = await this.roleRepository.search({
      skip: input.skip,
      take: input.take,
      search: input.search,
    })

    return roles.map((role) => role.toResult())
  }
}
