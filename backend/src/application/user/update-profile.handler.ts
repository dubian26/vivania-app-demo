import { PasswordHasher } from '@/base/contracts/password-hasher'
import { Validator } from '@/base/contracts/validator'
import { RequestHandler } from '@/base/mediator'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import type { UpdateProfileCommand } from './update-profile.command'
import { updateProfileSchema } from './update-profile.schema'

@Injectable()
export class UpdateProfileHandler implements RequestHandler<UpdateProfileCommand, IdResult> {
  constructor(
    private readonly validator: Validator,
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async handle(request: UpdateProfileCommand): Promise<IdResult> {
    const input = this.validator.parse(updateProfileSchema, request.input)

    const user = await this.userRepo.findById(request.userId)
    if (!user) throw UserError.NotExists()

    if (input.firstName !== undefined || input.lastName !== undefined) {
      user.rename(
        input.firstName ?? user.firstName,
        input.lastName ?? user.lastName,
      )
    }

    if (input.password !== undefined) {
      const hashedPassword = await this.passwordHasher.hash(input.password)
      user.changePassword(hashedPassword)
    }

    await this.userRepo.update(user)

    return { id: request.userId, message: 'Perfil actualizado.' }
  }
}
