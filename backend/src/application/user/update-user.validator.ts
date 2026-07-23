import { UpdateUserDTO } from './update-user.dto'

export abstract class UpdateUserValidator {
  abstract validate(input: UpdateUserDTO): void
}
