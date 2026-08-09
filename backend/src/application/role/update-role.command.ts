import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { AuthService } from '@/shared/util/auth-service'
import { IdResult } from '@js-core/domain/models'
import { Injectable } from '@js-core/domain/util'
import { UpdateRoleDTO } from './update-role.dto'
import { UpdateRoleValidator } from './update-role.validator'

@Injectable()
export class UpdateRoleCommand {
  constructor(
    private readonly validator: UpdateRoleValidator,
    private readonly roleRepository: RoleRepository,
    private readonly authService: AuthService,
  ) { }

  async execute(input: UpdateRoleDTO): Promise<IdResult> {
    this.authService.authorizedTo('/roles/editar')
    this.validator.validate(input)

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
