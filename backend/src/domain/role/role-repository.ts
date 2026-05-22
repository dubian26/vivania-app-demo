import { SearchModel } from '@base/core/models'
import { Role } from './role'

export abstract class RoleRepository {
  abstract findById(id: string): Promise<Role | null>
  abstract findByName(name: string): Promise<Role | null>
  abstract listAll(): Promise<Role[]>
  abstract search(params: SearchModel): Promise<Role[]>
  abstract insert(role: Role): Promise<void>
  abstract update(role: Role): Promise<void>
  abstract delete(id: string): Promise<void>
}
