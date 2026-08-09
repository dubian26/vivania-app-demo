import { SaveRolePermissionsDTO } from './save-role-permissions.dto'

export abstract class SaveRolePermissionsValidator {
  abstract validate(input: SaveRolePermissionsDTO): void
}