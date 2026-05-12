import { LoginUserValidator } from '@/application/user/login-user.validator'
import { LoginUserDTO } from '@/application/user/login-user.dto'
import { BaseError } from '@/shared/errors/base-error'
import { ErrorDetail } from '@/shared/errors/error-model'
import { Injectable } from '@/shared/util/injectable'

import { loginUserSchema } from './login-user.schema'

@Injectable()
export class ZodLoginUserValidator extends LoginUserValidator {
  validate(input: unknown): LoginUserDTO {
    const result = loginUserSchema.safeParse(input)

    if (result.success) {
      return result.data
    }

    const details: ErrorDetail[] = result.error.issues.map((issue) => ({
      property: issue.path.join('.'),
      message: issue.message,
    }))

    throw BaseError.ValidationError(details)
  }
}
