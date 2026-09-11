import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { RequestHandler } from '@/base/mediator'
import { Validator } from '@/base/contracts/validator'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import type { UpdateRoleCommand } from './update-role.command'
import { updateRoleSchema } from './update-role.schema'

@Injectable()
export class UpdateRoleHandler implements RequestHandler<UpdateRoleCommand, IdResult> {
  constructor(
    private readonly validator: Validator,
    private readonly roleRepository: RoleRepository,
  ) { }

  async handle(request: UpdateRoleCommand): Promise<IdResult> {
    const input = this.validator.parse(updateRoleSchema, request.input)

    const role = await this.roleRepository.findById(input.id)
    if (!role) throw RoleError.NotExists()

    if (input.name && input.name !== role.name) {
      const existing = await this.roleRepository.findByName(input.name)
      if (existing) throw RoleError.AlreadyExists()
      role.rename(input.name)
    }

    if (input.description !== undefined)
      role.updateDescription(input.description || null)

    await this.roleRepository.update(role)

    return { id: role.id, message: 'Rol actualizado con éxito.' }
  }
}
