import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { AuthService } from '@/base/util/auth-service'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { Validator } from '@/base/contracts/validator'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export interface CreateRoleDTO {
  name: string
  description?: string
  active?: boolean
}

export const schema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .regex(
      /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s]+$/,
      { message: 'El nombre contiene caracteres no válidos' }
    ),
  description: z.string()
    .optional()
    .refine(
      (val) => val === undefined || /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,;:!?\-_@#$%&()/+=]+$/.test(val),
      { message: 'La descripción contiene caracteres no válidos' }
    ),
}) satisfies z.ZodType<CreateRoleDTO>

@Injectable()
export class CreateRoleCommand {
  constructor(
    private readonly validator: Validator,
    private readonly roleRepository: RoleRepository,
    private readonly authService: AuthService,
  ) { }

  async execute(input: CreateRoleDTO): Promise<IdResult> {
    this.authService.authorizedTo('/roles/nuevo')
    input = this.validator.parse(schema, input)

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
