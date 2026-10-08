import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { PrismaRoleRepository } from '@/infrastructure/repositories/prisma-role-repository'

describe('PrismaRoleRepository pagination', () => {
  function setup() {
    const roles = {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(21),
    }
    const context = { client: jest.fn(() => ({ roles })) }
    const repository = new PrismaRoleRepository(context as unknown as PrismaDbContext)
    return { repository, roles }
  }

  it('uses the same filter for search and count, with stable ordering', async () => {
    const { repository, roles } = setup()
    await repository.search({ skip: 10, take: 10, search: 'Editor' })
    await expect(repository.totalRows({ search: 'Editor' })).resolves.toBe(21)

    const where = {
      OR: [
        { name: { contains: 'Editor', mode: 'insensitive' } },
        { description: { contains: 'Editor', mode: 'insensitive' } },
      ],
    }
    expect(roles.findMany).toHaveBeenCalledWith({
      skip: 10,
      take: 10,
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    })
    expect(roles.count).toHaveBeenCalledWith({ where })
  })

  it.each([undefined, ''])('counts all records without search (%s)', async (search) => {
    const { repository, roles } = setup()
    await repository.search({ skip: 0, take: 10, search })
    await repository.totalRows({ search })

    expect(roles.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: undefined }))
    expect(roles.count).toHaveBeenCalledWith({ where: undefined })
  })
})
