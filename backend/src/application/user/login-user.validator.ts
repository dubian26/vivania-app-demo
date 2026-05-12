import { LoginUserDTO } from './login-user.dto'

export abstract class LoginUserValidator {
  abstract validate(input: unknown): LoginUserDTO
}
