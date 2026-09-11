import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { AuthService } from '@/base/util/auth-service'
import { Injectable } from '@/base/util/injectable'
import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { randomUUID } from 'node:crypto'
import { type CreateRoleCommand } from './create-role.command'
import { createRoleSchema } from './create-role.schema'

@Injectable()
export class CreateRoleHandler implements
  RequestHandler<CreateRoleCommand, IdResult> {

  constructor(
    private readonly validator: Validator,
    private readonly roleRepository: RoleRepository,
    private readonly authService: AuthService,
  ) { }

  async handle(request: CreateRoleCommand): Promise<IdResult> {
    this.authService.authorizedTo('/roles/nuevo')
    const input = this.validator.parse(createRoleSchema, request.input)

    const role = await this.roleRepository.findByName(input.name)
    if (role) throw RoleError.AlreadyExists()

    const newRole = Role.create({
      id: randomUUID(),
      name: input.name,
      description: input.description || null,
    })

    await this.roleRepository.insert(newRole)

    return {
      id: newRole.id,
      message: 'Rol creado con éxito.',
    }
  }
}
