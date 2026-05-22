import { UpdateRoleDTO } from './update-role.dto'

export abstract class UpdateRoleValidator {
  abstract validate(input: UpdateRoleDTO): void
}
