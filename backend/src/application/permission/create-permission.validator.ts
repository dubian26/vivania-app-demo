import { CreatePermissionDTO } from './create-permission.dto'

export abstract class CreatePermissionValidator {
  abstract validate(input: CreatePermissionDTO): void
}