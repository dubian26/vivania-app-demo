import { GetUserByEmailDTO } from './get-user-by-email.dto'

export abstract class GetUserByEmailValidator {
  abstract validate(input: GetUserByEmailDTO): void
}
