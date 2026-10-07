import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { PrismaUserRepository } from '@/infrastructure/repositories/prisma-user-repository'

describe('PrismaUserRepository pagination', () => {
  function setup() {
    const users = {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(48),
    }
    const context = { client: jest.fn(() => ({ users })) }
    const repository = new PrismaUserRepository(context as unknown as PrismaDbContext)
    return { repository, users }
  }

  it('uses the identical case-insensitive filter for search and totalRows', async () => {
    const { repository, users } = setup()
    await repository.search({ skip: 10, take: 10, search: 'Ana' })
    await expect(repository.totalRows({ search: 'Ana' })).resolves.toBe(48)

    const where = {
      OR: [
        { firstName: { contains: 'Ana', mode: 'insensitive' } },
        { lastName: { contains: 'Ana', mode: 'insensitive' } },
        { email: { contains: 'Ana', mode: 'insensitive' } },
      ],
    }
    expect(users.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 10, take: 10, where }))
    expect(users.count).toHaveBeenCalledWith({ where })
  })

  it.each([undefined, ''])('counts all records without a search (%s)', async (search) => {
    const { repository, users } = setup()
    await repository.search({ skip: 0, take: 10, search })
    await repository.totalRows({ search })

    expect(users.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: undefined }))
    expect(users.count).toHaveBeenCalledWith({ where: undefined })
  })
})
