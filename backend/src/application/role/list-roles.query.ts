import { RoleRepository } from '@/domain/role/role-repository'
import { Injectable } from '@base/core/util'

@Injectable()
export class ListRolesQuery {
  constructor(
    private readonly roleRepository: RoleRepository,
  ) { }

  async execute() {
    const roles = await this.roleRepository.listAll()
    return roles.map((role) => role.toResult())
  }
}
