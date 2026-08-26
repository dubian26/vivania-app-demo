import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { Validator } from '@/base/contracts/validator'
import { z } from 'zod'

export interface UpdateUserDTO {
  active?: boolean
  roleId?: string
}

const schema = z.object({
  active: z.boolean({ message: 'El campo active debe ser un booleano.' }).optional(),
  roleId: z.uuid({ message: 'El roleId debe ser un UUID válido.' }).optional(),
}).refine(data => data.active !== undefined || data.roleId !== undefined, {
  message: 'Debe proporcionar al menos un campo para actualizar.',
}) satisfies z.ZodType<UpdateUserDTO>

@Injectable()
export class UpdateUserCommand {
  constructor(
    private readonly validator: Validator,
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
  ) { }

  async execute(id: string, input: UpdateUserDTO, currentRoleName: string): Promise<IdResult> {
    input = this.validator.parse(schema, input)

    if (currentRoleName !== Role.ADMIN) throw UserError.NotAuthorized()

    const user = await this.userRepo.findById(id)
    if (!user) throw UserError.NotExists()

    if (input.roleId !== undefined) {
      const role = await this.roleRepo.findById(input.roleId)
      if (!role) throw RoleError.NotExists()
      user.setRole(input.roleId)
    }

    if (input.active !== undefined) {
      user.setActive(input.active)
    }

    await this.userRepo.update(user)

    return { id, message: 'Usuario actualizado.' }
  }
}
