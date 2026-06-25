import { type GetUserByEmailDTO } from '@/application/user/get-user-by-email.dto'
import { GetUserByEmailQuery } from '@/application/user/get-user-by-email.query'
import { GetUserQuery } from '@/application/user/get-user.query'
import { type SearchUsersDTO } from '@/application/user/search-users.dto'
import { SearchUsersQuery } from '@/application/user/search-users.query'
import { Controller, Get, Param, Query } from '@nestjs/common'

@Controller('users')
export class UserController {
  constructor(
    private readonly searchUsersQuery: SearchUsersQuery,
    private readonly getUserQuery: GetUserQuery,
    private readonly getUserByEmailQuery: GetUserByEmailQuery,
  ) { }

  @Get('by-email')
  findByEmail(@Query() query: GetUserByEmailDTO) {
    return this.getUserByEmailQuery.execute(query)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.getUserQuery.execute(id)
  }

  @Get()
  search(@Query() filtros: SearchUsersDTO) {
    return this.searchUsersQuery.execute(filtros)
  }
}
