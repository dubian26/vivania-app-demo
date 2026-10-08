import { SearchModel } from '@/base/models/search-model'
import { Role } from './role'

export abstract class RoleRepository {
  abstract findById(id: string): Promise<Role | null>
  abstract findByName(name: string): Promise<Role | null>
  abstract listAll(): Promise<Role[]>
  abstract search(params: SearchModel): Promise<Role[]>
  abstract totalRows(params: Pick<SearchModel, 'search'>): Promise<number>
  abstract insert(role: Role): Promise<void>
  abstract update(role: Role): Promise<void>
  abstract delete(id: string): Promise<void>
}
