import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { Validator } from '@/base/contracts/validator'
import { uuidCheck } from '@/base/util/zod-custom-schemas'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'

@Injectable()
export class DeleteRoleCommand {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly validator: Validator,
  ) { }

  async execute(id: string): Promise<IdResult> {
    this.validator.parse(uuidCheck(), id)

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
