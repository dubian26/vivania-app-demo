import { UpdateUserCommand, type UpdateUserDTO } from '@/application/user/update-user.command'
import { GetUserByEmailQuery, type GetUserByEmailDTO } from '@/application/user/get-user-by-email.query'
import { GetUserQuery } from '@/application/user/get-user.query'
import { SearchUsersQuery, type SearchUsersDTO } from '@/application/user/search-users.query'
import { Body, Controller, Get, Param, Patch, Query, Req } from '@nestjs/common'
import { type FastifyRequest } from 'fastify'
import { UserInfo } from '@js-core/domain/models'

type AuthenticatedRequest = FastifyRequest & { user?: UserInfo }

@Controller('users')
export class UserController {
  constructor(
    private readonly searchUsersQuery: SearchUsersQuery,
    private readonly getUserQuery: GetUserQuery,
    private readonly getUserByEmailQuery: GetUserByEmailQuery,
    private readonly updateUserCommand: UpdateUserCommand,
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() req: UpdateUserDTO,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.updateUserCommand.execute(id, req, request.user!.roleName!)
  }
}
