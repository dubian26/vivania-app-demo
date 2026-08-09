import { UpdatePermissionDTO } from './update-permission.dto'

export abstract class UpdatePermissionValidator {
  abstract validate(input: UpdatePermissionDTO): void
}