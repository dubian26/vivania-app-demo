import { SearchUsersHandler } from '@/application/user/search-users.handler'
import { SearchUsersQuery } from '@/application/user/search-users.query'
import { Validator } from '@/base/contracts/validator'
import { User } from '@/domain/user/user'
import { UserRepository } from '@/domain/user/user-repository'

describe('SearchUsersHandler', () => {
  function setup() {
    const user = User.create({
      id: 'user-id', email: 'ana@example.com', password: 'private-hash',
      firstName: 'Ana', lastName: 'Perez', roleId: 'role-id',
    })
    const repository = {
      search: jest.fn().mockResolvedValue([user]),
      totalRows: jest.fn().mockResolvedValue(48),
    }
    const validator = {
      parse: jest.fn((schema: { parse: (value: unknown) => unknown }, value: unknown) => schema.parse(value)),
    }
    const handler = new SearchUsersHandler(
      validator as unknown as Validator,
      repository as unknown as UserRepository,
    )
    return { handler, repository, user }
  }

  it('returns the total and public user results for the same search', async () => {
    const { handler, repository, user } = setup()
    const result = await handler.handle(new SearchUsersQuery({ skip: 10, take: 10, search: 'ana' }))

    expect(repository.search).toHaveBeenCalledWith({ skip: 10, take: 10, search: 'ana' })
    expect(repository.totalRows).toHaveBeenCalledWith({ search: 'ana' })
    expect(result).toEqual({ totalRows: 48, data: [user.toResult()] })
    expect(result.data[0]).not.toHaveProperty('password')
  })

  it('returns an empty result when there are no matches', async () => {
    const { handler, repository } = setup()
    repository.search.mockResolvedValue([])
    repository.totalRows.mockResolvedValue(0)

    await expect(handler.handle(new SearchUsersQuery({ skip: 0, take: 10, search: 'missing' })))
      .resolves.toEqual({ totalRows: 0, data: [] })
  })

  it('keeps the full total on the last page', async () => {
    const { handler, repository } = setup()
    repository.totalRows.mockResolvedValue(11)

    const result = await handler.handle(new SearchUsersQuery({ skip: 10, take: 10 }))
    expect(result.totalRows).toBe(11)
    expect(result.data).toHaveLength(1)
    expect(repository.totalRows).toHaveBeenCalledWith({ search: undefined })
  })

  it('validates pagination before calling either repository method', async () => {
    const { handler, repository } = setup()

    await expect(handler.handle(new SearchUsersQuery({ skip: -1, take: 10 }))).rejects.toThrow()
    expect(repository.search).not.toHaveBeenCalled()
    expect(repository.totalRows).not.toHaveBeenCalled()
  })

  it('propagates count failures instead of returning an incorrect total', async () => {
    const { handler, repository } = setup()
    repository.totalRows.mockRejectedValue(new Error('Count failed'))

    await expect(handler.handle(new SearchUsersQuery({ skip: 0, take: 10 })))
      .rejects.toThrow('Count failed')
  })
})
