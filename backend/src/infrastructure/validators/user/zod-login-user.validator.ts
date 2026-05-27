import { LoginUserDTO } from '@/application/user/login-user.dto'
import { LoginUserValidator } from '@/application/user/login-user.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  email: z.email({ message: 'El email no es válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
})

@Injectable()
export class ZodLoginUserValidator extends LoginUserValidator {
  validate(input: unknown): LoginUserDTO {
    return ZodValidator.parse(schema, input)
  }
}
