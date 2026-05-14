import { User } from '@/domain/user/user'
import { UserRepository } from '@/domain/user/user-repository'
import { dbClient } from '@/infrastructure/repositories/db-client'
import { SearchModel } from '@/shared/models/search-model'

export class PrismaUserRepository implements UserRepository {
  async getById(id: string): Promise<User | null> {
    const record = await dbClient.users.findUnique({
      where: { id },
      include: { role: { select: { name: true } } },
    })

    if (!record) return null

    const { role, ...data } = record
    const result = User.fromDB({ ...data, roleName: role?.name })

    return result
  }

  async getByEmail(email: string): Promise<User | null> {
    const record = await dbClient.users.findUnique({
      where: { email },
      include: { role: { select: { name: true } } },
    })

    if (!record) return null

    const { role, ...data } = record
    const result = User.fromDB({ ...data, roleName: role?.name })

    return result
  }

  async listAll(): Promise<User[]> {
    const records = await dbClient.users.findMany({
      include: { role: { select: { name: true } } },
    })

    return records.map((record) => {
      const { role, ...data } = record
      return User.fromDB({ ...data, roleName: role?.name })
    })
  }

  async search(params: SearchModel): Promise<User[]> {
    const { skip, take, search } = params
    const records = await dbClient.users.findMany({
      skip,
      take,
      where: search
        ? {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        role: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return records.map((record) => {
      const { role, ...data } = record
      return User.fromDB({ ...data, roleName: role?.name })
    })
  }

  async insert(user: User): Promise<void> {
    const { ...data } = user.toDB()
    await dbClient.users.create({ data })
  }

  async update(user: User): Promise<void> {
    const { id, ...data } = user.toDB()
    await dbClient.users.update({
      where: { id },
      data: data,
    })
  }

  async delete(id: string): Promise<void> {
    await dbClient.users.delete({
      where: { id },
    })
  }
}
