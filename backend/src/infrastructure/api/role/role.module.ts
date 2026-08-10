import { CreateRoleCommand } from '@/application/role/create-role.command'
import { DeleteRoleCommand } from '@/application/role/delete-role.command'
import { GetRoleQuery } from '@/application/role/get-role.query'
import { ListRolesQuery } from '@/application/role/list-roles.query'
import { SearchRolesQuery } from '@/application/role/search-roles.query'
import { UpdateRoleCommand } from '@/application/role/update-role.command'
import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'

@Module({
  controllers: [RoleController],
  providers: [
    CreateRoleCommand,
    ListRolesQuery,
    SearchRolesQuery,
    GetRoleQuery,
    UpdateRoleCommand,
    DeleteRoleCommand,
  ],
})
export class RoleModule { }