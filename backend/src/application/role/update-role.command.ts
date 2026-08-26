import { Validator } from '@/base/contracts/validator'
import { IdResult } from '@/base/models/id-result'
import { AuthService } from '@/base/util/auth-service'
import { Injectable } from '@/base/util/injectable'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { z } from 'zod'

export interface UpdateRoleDTO {
  id: string
  name?: string
  description?: string
}

export const schema = z.object({
  id: z.uuid(),
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .regex(
      /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s]+$/,
      { message: 'El nombre contiene caracteres no válidos' }
    )
    .optional(),
  description: z.string()
    .optional()
    .refine(
      (val) => val === undefined || /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,;:!?\-_@#$%&()/+=]+$/.test(val),
      { message: 'La descripción contiene caracteres no válidos' }
    ),
}) satisfies z.ZodType<UpdateRoleDTO>

@Injectable()
export class UpdateRoleCommand {
  constructor(
    private readonly validator: Validator,
    private readonly roleRepository: RoleRepository,
    private readonly authService: AuthService,
  ) { }

  async execute(input: UpdateRoleDTO): Promise<IdResult> {
    //this.authService.authorizedTo('/roles/editar')
    input = this.validator.parse(schema, input)

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
