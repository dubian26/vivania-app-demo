import { CreateRoleCommand, type CreateRoleDTO } from '@/application/role/create-role.command'
import { DeleteRoleCommand } from '@/application/role/delete-role.command'
import { GetRoleQuery } from '@/application/role/get-role.query'
import { ListRolesQuery } from '@/application/role/list-roles.query'
import { SearchRolesQuery, type SearchRolesDTO } from '@/application/role/search-roles.query'
import { UpdateRoleCommand, type UpdateRoleDTO } from '@/application/role/update-role.command'
import { Mediator } from '@/base/mediator'
import { type IdResult } from '@/base/models/id-result'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

@Controller('roles')
export class RoleController {
  constructor(
    private readonly mediator: Mediator,
  ) { }

  @Post()
  create(@Body() req: CreateRoleDTO): Promise<IdResult> {
    return this.mediator.send(new CreateRoleCommand(req))
  }

  @Get()
  list() {
    return this.mediator.send(new ListRolesQuery())
  }

  @Get('search')
  search(@Query() filtros: SearchRolesDTO) {
    return this.mediator.send(new SearchRolesQuery(filtros))
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.mediator.send(new GetRoleQuery(id))
  }

  @Put()
  update(@Body() req: UpdateRoleDTO): Promise<IdResult> {
    return this.mediator.send(new UpdateRoleCommand(req))
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<IdResult> {
    return this.mediator.send(new DeleteRoleCommand(id))
  }
}
