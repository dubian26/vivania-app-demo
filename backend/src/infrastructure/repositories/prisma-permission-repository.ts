import { Permission } from '@/domain/permission/permission'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { Injectable } from '@js-core/domain/util'

@Injectable()
export class PrismaPermissionRepository implements PermissionRepository {
  constructor(private readonly dbContext: PrismaDbContext) { }

  async findById(id: string): Promise<Permission | null> {
    const record = await this.dbContext.client().permissions.findUnique({
      where: { id }
    })

    if (!record) return null
    return Permission.fromDB(record)
  }

  async listAll(): Promise<Permission[]> {
    const records = await this.dbContext.client().permissions.findMany({
      orderBy: { order: 'asc' }
    })

    return records.map((record) => Permission.fromDB(record))
  }

  async listByRole(roleId: string): Promise<Permission[]> {
    const records = await this.dbContext.client().rolePermissions.findMany({
      where: { roleId, active: true },
      include: { permission: true }
    })

    return records.map((record) => Permission.fromDB(record.permission))
  }

  async saveRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await this.dbContext.runInTransaction(async () => {
      const client = this.dbContext.client()

      await client.rolePermissions.updateMany({
        where: { roleId },
        data: { active: false }
      })

      for (const permissionId of permissionIds) {
        await client.rolePermissions.upsert({
          where: {
            roleId_permissionId: {
              roleId,
              permissionId
            }
          },
          update: { active: true },
          create: {
            roleId,
            permissionId,
            active: true
          }
        })
      }
    })
  }

  async insert(permission: Permission): Promise<void> {
    const { createdAt, updatedAt, ...data } = permission.toDB()
    await this.dbContext.client().permissions.create({
      data: {
        ...data,
        createdAt,
        updatedAt
      }
    })
  }

  async update(permission: Permission): Promise<void> {
    const { id, createdAt, updatedAt, ...data } = permission.toDB()
    await this.dbContext.client().permissions.update({
      where: { id },
      data: {
        ...data,
        createdAt,
        updatedAt
      }
    })
  }

  async delete(id: string): Promise<void> {
    await this.dbContext.client().permissions.delete({
      where: { id }
    })
  }

  async countChildren(parentId: string): Promise<number> {
    return this.dbContext.client().permissions.count({
      where: { parentId }
    })
  }
}