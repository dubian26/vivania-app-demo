import { CreateRoleDTO } from './create-role.dto'

export abstract class CreateRoleValidator {
  abstract validate(input: CreateRoleDTO): void
}
