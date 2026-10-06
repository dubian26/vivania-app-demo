import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import type { UpdateUserCommand } from './update-user.command'
import { updateUserSchema } from './update-user.schema'

@Injectable()
export class UpdateUserHandler implements RequestHandler<UpdateUserCommand, IdResult> {
  constructor(
    private readonly validator: Validator,
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
  ) { }

  async handle(request: UpdateUserCommand): Promise<IdResult> {
    const input = this.validator.parse(updateUserSchema, request.input)

    if (request.currentRoleName !== Role.ADMIN) throw UserError.NotAuthorized()

    const user = await this.userRepo.findById(request.id)
    if (!user) throw UserError.NotExists()

    if (input.firstName !== undefined || input.lastName !== undefined) {
      user.rename(
        input.firstName ?? user.firstName,
        input.lastName ?? user.lastName,
      )
    }

    if (input.roleId !== undefined) {
      const role = await this.roleRepo.findById(input.roleId)
      if (!role) throw RoleError.NotExists()
      user.setRole(input.roleId)
    }

    if (input.active !== undefined) {
      if (input.active && !user.emailVerified) throw UserError.EmailNotVerified()
      user.setActive(input.active)
    }

    await this.userRepo.update(user)

    return { id: request.id, message: 'Usuario actualizado.' }
  }
}
