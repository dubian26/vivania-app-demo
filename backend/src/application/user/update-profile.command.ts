import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { PasswordHasher } from '@base/core/contracts'
import { IdResult } from '@base/core/models'
import { Injectable } from '@base/core/util'
import { UpdateProfileDTO } from './update-profile.dto'
import { UpdateProfileValidator } from './update-profile.validator'

@Injectable()
export class UpdateProfileCommand {
  constructor(
    private readonly validator: UpdateProfileValidator,
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(userId: string, input: UpdateProfileDTO): Promise<IdResult> {
    this.validator.validate(input)

    const user = await this.userRepo.findById(userId)
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

    return { id: userId, message: 'Perfil actualizado.' }
  }
}
