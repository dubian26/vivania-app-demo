import { VerifyUserDTO } from './verify-user.dto'

export abstract class VerifyUserValidator {
  abstract validate(input: VerifyUserDTO): void
}
