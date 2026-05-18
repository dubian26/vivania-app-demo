import { RegisterUserDTO } from './register-user.dto'

export abstract class RegisterUserValidator {
  abstract validate(input: RegisterUserDTO): void
}
