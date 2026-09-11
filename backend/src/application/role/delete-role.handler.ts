import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { uuidCheck } from '@/base/util/zod-custom-schemas'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import type { DeleteRoleCommand } from './delete-role.command'

@Injectable()
export class DeleteRoleHandler implements RequestHandler<DeleteRoleCommand, IdResult> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly validator: Validator,
  ) { }

  async handle(request: DeleteRoleCommand): Promise<IdResult> {
    this.validator.parse(uuidCheck(), request.id)

    const role = await this.roleRepository.findById(request.id)
    if (!role) throw RoleError.NotExists()

    try {
      await this.roleRepository.delete(request.id)
    } catch {
      throw RoleError.InUse()
    }

    return { id: request.id, message: 'Rol eliminado con éxito.' }
  }
}
