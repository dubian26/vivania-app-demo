import { CreateRoleCommand } from '@/application/role/create-role.command'
import { type CreateRoleDTO } from '@/application/role/create-role.dto'
import { DeleteRoleCommand } from '@/application/role/delete-role.command'
import { GetRoleQuery } from '@/application/role/get-role.query'
import { ListRolesQuery } from '@/application/role/list-roles.query'
import { type SearchRolesDTO } from '@/application/role/search-roles.dto'
import { SearchRolesQuery } from '@/application/role/search-roles.query'
import { UpdateRoleCommand } from '@/application/role/update-role.command'
import { type UpdateRoleDTO } from '@/application/role/update-role.dto'
import { type IdResult } from '@js-core/domain/models'
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleCommand: CreateRoleCommand,
    private readonly listRolesQuery: ListRolesQuery,
    private readonly searchRolesQuery: SearchRolesQuery,
    private readonly getRoleQuery: GetRoleQuery,
    private readonly updateRoleCommand: UpdateRoleCommand,
    private readonly deleteRoleCommand: DeleteRoleCommand,
  ) { }

  @Post()
  create(@Body() req: CreateRoleDTO): Promise<IdResult> {
    return this.createRoleCommand.execute(req)
  }

  @Get()
  list() {
    return this.listRolesQuery.execute()
  }

  @Get('search')
  search(@Query() filtros: SearchRolesDTO) {
    return this.searchRolesQuery.execute(filtros)
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.getRoleQuery.execute(id)
  }

  @Put()
  update(@Body() req: UpdateRoleDTO): Promise<IdResult> {
    return this.updateRoleCommand.execute(req)
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<IdResult> {
    return this.deleteRoleCommand.execute(id)
  }
}
