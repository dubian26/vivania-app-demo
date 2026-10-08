import { SearchRolesHandler } from '@/application/role/search-roles.handler'
import { SearchRolesQuery } from '@/application/role/search-roles.query'
import { Validator } from '@/base/contracts/validator'
import { Role } from '@/domain/role/role'
import { RoleRepository } from '@/domain/role/role-repository'

describe('SearchRolesHandler', () => {
  function setup() {
    const role = Role.create({ id: 'role-id', name: 'Editor', description: 'Edición' })
    const repository = {
      search: jest.fn().mockResolvedValue([role]),
      totalRows: jest.fn().mockResolvedValue(21),
    }
    const validator = {
      parse: jest.fn((schema: { parse: (value: unknown) => unknown }, value: unknown) => schema.parse(value)),
    }
    const handler = new SearchRolesHandler(
      validator as unknown as Validator,
      repository as unknown as RoleRepository,
    )
    return { handler, repository, role }
  }

  it('returns the total and role results for the same search', async () => {
    const { handler, repository, role } = setup()
    const result = await handler.handle(new SearchRolesQuery({ skip: 10, take: 10, search: 'Editor' }))

    expect(repository.search).toHaveBeenCalledWith({ skip: 10, take: 10, search: 'Editor' })
    expect(repository.totalRows).toHaveBeenCalledWith({ search: 'Editor' })
    expect(result).toEqual({ totalRows: 21, data: [role.toResult()] })
  })

  it('returns an empty result when there are no matches', async () => {
    const { handler, repository } = setup()
    repository.search.mockResolvedValue([])
    repository.totalRows.mockResolvedValue(0)

    await expect(handler.handle(new SearchRolesQuery({ skip: 0, take: 10, search: 'missing' })))
      .resolves.toEqual({ totalRows: 0, data: [] })
  })

  it('keeps the full total on the last batch', async () => {
    const { handler, repository } = setup()
    const result = await handler.handle(new SearchRolesQuery({ skip: 20, take: 10 }))

    expect(result.totalRows).toBe(21)
    expect(result.data).toHaveLength(1)
    expect(repository.totalRows).toHaveBeenCalledWith({ search: undefined })
  })

  it('validates pagination before querying the repository', async () => {
    const { handler, repository } = setup()

    await expect(handler.handle(new SearchRolesQuery({ skip: -1, take: 10 }))).rejects.toThrow()
    expect(repository.search).not.toHaveBeenCalled()
    expect(repository.totalRows).not.toHaveBeenCalled()
  })

  it('propagates count failures', async () => {
    const { handler, repository } = setup()
    repository.totalRows.mockRejectedValue(new Error('Count failed'))

    await expect(handler.handle(new SearchRolesQuery({ skip: 0, take: 10 })))
      .rejects.toThrow('Count failed')
  })
})
