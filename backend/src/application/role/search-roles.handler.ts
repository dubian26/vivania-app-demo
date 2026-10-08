import { Injectable } from '@/base/util/injectable'
import { RequestHandler } from '@/base/mediator'
import { Validator } from '@/base/contracts/validator'
import { RoleRepository } from '@/domain/role/role-repository'
import type { SearchRolesQuery } from './search-roles.query'
import { searchRolesSchema } from './search-roles.schema'
import type { Result } from '@/base/models/result'
import type { Role } from '@/domain/role/role'

@Injectable()
export class SearchRolesHandler implements RequestHandler<SearchRolesQuery, Result<ReturnType<Role['toResult']>>> {
  constructor(
    private readonly validator: Validator,
    private readonly roleRepository: RoleRepository,
  ) { }

  async handle(request: SearchRolesQuery): Promise<Result<ReturnType<Role['toResult']>>> {
    const input = this.validator.parse(searchRolesSchema, request.input)

    const [roles, totalRows] = await Promise.all([
      this.roleRepository.search({
        skip: input.skip,
        take: input.take,
        search: input.search,
      }),
      this.roleRepository.totalRows({ search: input.search }),
    ])

    return { totalRows, data: roles.map((role) => role.toResult()) }
  }
}
