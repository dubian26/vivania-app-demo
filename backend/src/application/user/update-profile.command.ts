import { UserError } from '@/domain/user/user-error'
import { UserRepository } from '@/domain/user/user-repository'
import { PasswordHasher } from '@js-core/domain/contracts'
import { IdResult } from '@js-core/domain/models'
import { Injectable } from '@js-core/domain/util'
import { ZodValidator } from '@/shared/util/zod-validator'
import { z } from 'zod'

export interface UpdateProfileDTO {
  firstName?: string
  lastName?: string
  password?: string
}

export const schema = z.object({
  firstName: z.string()
    .min(2, { message: 'El nombre es demasiado corto.' })
    .max(50, { message: 'El nombre es demasiado largo.' })
    .optional(),
  lastName: z.string()
    .min(2, { message: 'El apellido es demasiado corto.' })
    .max(50, { message: 'El apellido es demasiado largo.' })
    .optional(),
  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    .regex(/[A-Z]/, { message: 'Debe contener al menos una mayúscula.' })
    .optional(),
}).refine(data => data.firstName !== undefined || data.lastName !== undefined || data.password !== undefined, {
  message: 'Debe proporcionar al menos un campo para actualizar.',
}) satisfies z.ZodType<UpdateProfileDTO>

@Injectable()
export class UpdateProfileCommand {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(userId: string, input: UpdateProfileDTO): Promise<IdResult> {
    input = ZodValidator.parse(schema, input)

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
