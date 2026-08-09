import { GetPermissionsByRoleDTO } from './get-permissions-by-role.dto'

export abstract class GetPermissionsByRoleValidator {
  abstract validate(input: GetPermissionsByRoleDTO): void
}