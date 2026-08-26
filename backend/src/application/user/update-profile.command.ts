import { PasswordHasher } from '@/base/contracts/password-hasher'
import { IdResult } from '@/base/models/id-result'
import { Injectable } from '@/base/util/injectable'
import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { firstNameCheck, lastNameCheck, passCheck } from '@/base/util/zod-custom-schemas'
import { Validator } from '@/base/contracts/validator'
import { z } from 'zod'

export interface UpdateProfileDTO {
  firstName?: string
  lastName?: string
  password?: string
}

const schema = z.object({
  firstName: firstNameCheck().optional(),
  lastName: lastNameCheck().optional(),
  password: passCheck().optional(),
}).refine(
  data => data.firstName !== undefined ||
    data.lastName !== undefined ||
    data.password !== undefined, {
  message: 'Debe proporcionar al menos un campo para actualizar.',
}) satisfies z.ZodType<UpdateProfileDTO>

@Injectable()
export class UpdateProfileCommand {
  constructor(
    private readonly validator: Validator,
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(userId: string, input: UpdateProfileDTO): Promise<IdResult> {
    input = this.validator.parse(schema, input)

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
