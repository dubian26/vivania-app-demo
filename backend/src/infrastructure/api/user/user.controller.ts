import { CreateUserCommand, type CreateUserDTO } from '@/application/user/create-user.command'
import { GetUserByEmailQuery, type GetUserByEmailDTO } from '@/application/user/get-user-by-email.query'
import { GetUserQuery } from '@/application/user/get-user.query'
import { SearchUsersQuery, type SearchUsersDTO } from '@/application/user/search-users.query'
import { UpdateUserCommand, type UpdateUserDTO } from '@/application/user/update-user.command'
import { Mediator } from '@/base/mediator'
import { type IdResult } from '@/base/models/id-result'
import { UserInfo } from '@/base/models/user-info'
import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'
import { type FastifyRequest } from 'fastify'

type AuthenticatedRequest = FastifyRequest & { user?: UserInfo }

@Controller('users')
export class UserController {
  constructor(
    private readonly mediator: Mediator,
  ) { }

  @Get('by-email')
  findByEmail(@Query() query: GetUserByEmailDTO) {
    return this.mediator.send(new GetUserByEmailQuery(query))
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.mediator.send(new GetUserQuery(id))
  }

  @Get()
  search(@Query() filtros: SearchUsersDTO) {
    return this.mediator.send(new SearchUsersQuery(filtros))
  }

  @Post()
  create(
    @Body() req: CreateUserDTO,
  ): Promise<IdResult> {
    return this.mediator.send(new CreateUserCommand(req))
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() req: UpdateUserDTO,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.mediator.send(new UpdateUserCommand(id, req, request.user!.roleName!))
  }
}
