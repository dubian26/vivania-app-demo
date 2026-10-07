import { User } from '@/domain/user/user'
import { UserRepository } from '@/domain/user/user-repository'
import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { SearchModel } from '@/base/models/search-model'
import { Injectable } from '@/base/util/injectable'
import type { Prisma } from '@prisma/client'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly dbContext: PrismaDbContext) { }

  async findById(id: string): Promise<User | null> {
    const record = await this.dbContext.client().users.findUnique({
      where: { id },
      include: { role: { select: { name: true } } },
    })

    if (!record) return null

    const { role, ...data } = record
    const result = User.fromDB({ ...data, roleName: role?.name })

    return result
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.dbContext.client().users.findUnique({
      where: { email },
      include: { role: { select: { name: true } } },
    })

    if (!record) return null

    const { role, ...data } = record
    const result = User.fromDB({ ...data, roleName: role?.name })

    return result
  }

  async listAll(): Promise<User[]> {
    const records = await this.dbContext.client().users.findMany({
      include: { role: { select: { name: true } } },
    })

    return records.map((record) => {
      const { role, ...data } = record
      return User.fromDB({ ...data, roleName: role?.name })
    })
  }

  async search(params: SearchModel): Promise<User[]> {
    const { skip, take, search } = params
    const records = await this.dbContext.client().users.findMany({
      skip,
      take,
      where: this.searchFilter(search),
      include: {
        role: {
          select: { name: true },
        },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    })

    return records.map((record) => {
      const { role, ...data } = record
      return User.fromDB({ ...data, roleName: role?.name })
    })
  }

  async totalRows(params: Pick<SearchModel, 'search'>): Promise<number> {
    return this.dbContext.client().users.count({
      where: this.searchFilter(params.search),
    })
  }

  private searchFilter(search?: string): Prisma.UsersWhereInput | undefined {
    if (!search) return undefined

    return {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }
  }

  async insert(user: User): Promise<void> {
    const { ...data } = user.toDB()
    await this.dbContext.client().users.create({ data })
  }

  async update(user: User): Promise<void> {
    const { id, ...data } = user.toDB()
    await this.dbContext.client().users.update({
      where: { id },
      data: data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.dbContext.client().users.delete({
      where: { id },
    })
  }
}
