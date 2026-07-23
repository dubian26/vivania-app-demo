import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { IdResult } from '@base/core/models'
import { Injectable } from '@base/core/util'
import { UpdateUserDTO } from './update-user.dto'
import { UpdateUserValidator } from './update-user.validator'

@Injectable()
export class UpdateUserCommand {
  constructor(
    private readonly validator: UpdateUserValidator,
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
  ) { }

  async execute(id: string, input: UpdateUserDTO, currentRoleName: string): Promise<IdResult> {
    this.validator.validate(input)

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
