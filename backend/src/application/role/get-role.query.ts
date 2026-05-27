import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { UuidValidator } from '@base/core/contracts'
import { Injectable } from '@base/core/util'

@Injectable()
export class GetRoleQuery {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly validator: UuidValidator,
  ) { }

  async execute(id: string) {
    this.validator.validate(id)
    const role = await this.roleRepository.findById(id)
    if (!role) throw RoleError.NotExists()

    return role.toResult()
  }
}
