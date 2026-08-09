import { Permission } from './permission'

export abstract class PermissionRepository {
  abstract findById(id: string): Promise<Permission | null>
  abstract listAll(): Promise<Permission[]>
  abstract listByRole(roleId: string): Promise<Permission[]>
  abstract saveRolePermissions(roleId: string, permissionIds: string[]): Promise<void>
  abstract insert(permission: Permission): Promise<void>
  abstract update(permission: Permission): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract countChildren(parentId: string): Promise<number>
}