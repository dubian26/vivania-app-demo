import { type SearchUsersDTO } from '@/application/user/search-users.dto'
import { SearchUsersQuery } from '@/application/user/search-users.query'
import { Controller, Get, Query } from '@nestjs/common'

@Controller('users')
export class UserController {
  constructor(
    private readonly searchUsersQuery: SearchUsersQuery,
  ) { }

  @Get()
  search(@Query() filtros: SearchUsersDTO) {
    return this.searchUsersQuery.execute(filtros)
  }
}
