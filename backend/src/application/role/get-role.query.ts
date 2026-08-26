import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { Validator } from '@/base/contracts/validator'
import { uuidCheck } from '@/base/util/zod-custom-schemas'
import { Injectable } from '@/base/util/injectable'

@Injectable()
export class GetRoleQuery {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly validator: Validator,
  ) { }

  async execute(id: string) {
    this.validator.parse(uuidCheck(), id)
    const role = await this.roleRepository.findById(id)
    if (!role) throw RoleError.NotExists()

    return role.toResult()
  }
}
