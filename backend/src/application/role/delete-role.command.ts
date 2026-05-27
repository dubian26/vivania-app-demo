import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { UuidValidator } from '@base/core/contracts'
import { IdResult } from '@base/core/models'
import { Injectable } from '@base/core/util'

@Injectable()
export class DeleteRoleCommand {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly validator: UuidValidator,
  ) { }

  async execute(id: string): Promise<IdResult> {
    this.validator.validate(id)

    const role = await this.roleRepository.findById(id)
    if (!role) throw RoleError.NotExists()

    try {
      await this.roleRepository.delete(id)
    } catch {
      throw RoleError.InUse()
    }

    return { id, message: 'Rol eliminado con éxito.' }
  }
}
