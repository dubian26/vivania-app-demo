import { CreateRoleHandler } from '@/application/role/create-role.handler'
import { DeleteRoleHandler } from '@/application/role/delete-role.handler'
import { GetRoleHandler } from '@/application/role/get-role.handler'
import { ListRolesHandler } from '@/application/role/list-roles.handler'
import { SearchRolesHandler } from '@/application/role/search-roles.handler'
import { UpdateRoleHandler } from '@/application/role/update-role.handler'
import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'

@Module({
  controllers: [RoleController],
  providers: [
    CreateRoleHandler,
    DeleteRoleHandler,
    GetRoleHandler,
    ListRolesHandler,
    SearchRolesHandler,
    UpdateRoleHandler,
  ],
})
export class RoleModule { }
