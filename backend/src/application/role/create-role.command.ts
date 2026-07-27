import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { IdResult } from '@js-core/domain/models'
import { Injectable } from '@js-core/domain/util'
import { randomUUID } from 'node:crypto'
import { CreateRoleDTO } from './create-role.dto'
import { CreateRoleValidator } from './create-role.validator'

@Injectable()
export class CreateRoleCommand {
  constructor(
    private readonly validator: CreateRoleValidator,
    private readonly roleRepository: RoleRepository,
  ) { }

  async execute(input: CreateRoleDTO): Promise<IdResult> {
    //this.authorizedTo('/roles/nuevo')
    this.validator.validate(input)

    const rol = await this.roleRepository.findByName(input.name)
    if (rol) throw RoleError.AlreadyExists()

    const newRole = Role.create({
      id: randomUUID(),
      name: input.name,
      description: input.description || null
    })

    await this.roleRepository.insert(newRole)

    return {
      id: newRole.id,
      message: 'Rol creado con éxito.'
    }
  }
}
