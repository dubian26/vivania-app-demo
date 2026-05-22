import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { Injectable } from '@base/core/util'

@Injectable()
export class GetRoleQuery {
  constructor(
    private readonly roleRepository: RoleRepository,
  ) { }

  async execute(id: string) {
    const role = await this.roleRepository.findById(id)
    if (!role) throw RoleError.NotExists()

    return role.toResult()
  }
}
