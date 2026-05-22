import { RoleRepository } from '@/domain/role/role-repository'
import { Injectable } from '@base/core/util'
import { SearchRolesDTO } from './search-roles.dto'
import { SearchRolesValidator } from './search-roles.validator'

@Injectable()
export class SearchRolesQuery {
  constructor(
    private readonly validator: SearchRolesValidator,
    private readonly roleRepository: RoleRepository,
  ) { }

  async execute(input: SearchRolesDTO) {
    this.validator.validate(input)

    const roles = await this.roleRepository.search({
      skip: Number(input.skip),
      take: Number(input.take),
      search: input.search,
    })

    return roles.map((role) => role.toResult())
  }
}
