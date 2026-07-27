import { Role } from '@/domain/role/role'
import { RoleRepository } from '@/domain/role/role-repository'
import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { SearchModel } from '@js-core/domain/models'
import { Injectable } from '@js-core/domain/util'

@Injectable()
export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly dbContext: PrismaDbContext) { }

  async findById(id: string): Promise<Role | null> {
    const record = await this.dbContext.client().roles.findUnique({
      where: { id }
    })

    if (!record) return null
    const result = Role.fromDB(record)

    return result
  }

  async findByName(name: string): Promise<Role | null> {
    const record = await this.dbContext.client().roles.findUnique({
      where: { name }
    })

    if (!record) return null
    const result = Role.fromDB(record)

    return result
  }

  async listAll(): Promise<Role[]> {
    const records = await this.dbContext.client().roles.findMany()

    return records.map((record) => {
      return Role.fromDB(record)
    })
  }

  async search(params: SearchModel): Promise<Role[]> {
    const { skip, take, search } = params
    const records = await this.dbContext.client().roles.findMany({
      skip,
      take,
      where: search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }

        : undefined,

      orderBy: { createdAt: 'desc' },
    })

    return records.map((record) => {
      return Role.fromDB(record)
    })
  }

  async insert(role: Role): Promise<void> {
    const { ...data } = role.toDB()
    await this.dbContext.client().roles.create({ data })
  }

  async update(role: Role): Promise<void> {
    const { id, ...data } = role.toDB()
    await this.dbContext.client().roles.update({
      where: { id },
      data: data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.dbContext.client().roles.delete({
      where: { id },
    })
  }
}
