import { User } from '@/domain/user/user'
import { SearchModel } from '@/shared/models/search-model'

export abstract class UserRepository {
  abstract getById(id: string): Promise<User | null>
  abstract getByEmail(email: string): Promise<User | null>
  abstract listAll(): Promise<User[]>
  abstract search(params: SearchModel): Promise<User[]>
  abstract insert(user: User): Promise<void>
  abstract update(user: User): Promise<void>
  abstract delete(id: string): Promise<void>
}
