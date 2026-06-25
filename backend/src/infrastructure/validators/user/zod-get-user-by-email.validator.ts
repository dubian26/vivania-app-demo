import { GetUserByEmailDTO } from '@/application/user/get-user-by-email.dto'
import { GetUserByEmailValidator } from '@/application/user/get-user-by-email.validator'
import { ZodValidator } from '@/shared/util/zod-validator'
import { Injectable } from '@base/core/util'
import { z } from 'zod'

const schema = z.object({
  email: z.string()
    .min(1, { message: 'El correo electrónico es obligatorio' })
    .email({ message: 'El formato del correo electrónico no es válido' }),
})

@Injectable()
export class ZodGetUserByEmailValidator extends GetUserByEmailValidator {
  validate(input: GetUserByEmailDTO): void {
    ZodValidator.parse(schema, input)
  }
}
