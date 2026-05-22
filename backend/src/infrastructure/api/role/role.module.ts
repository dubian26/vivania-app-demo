import { CreateRoleCommand } from '@/application/role/create-role.command'
import { CreateRoleValidator } from '@/application/role/create-role.validator'
import { DeleteRoleCommand } from '@/application/role/delete-role.command'
import { GetRoleQuery } from '@/application/role/get-role.query'
import { ListRolesQuery } from '@/application/role/list-roles.query'
import { SearchRolesQuery } from '@/application/role/search-roles.query'
import { SearchRolesValidator } from '@/application/role/search-roles.validator'
import { UpdateRoleCommand } from '@/application/role/update-role.command'
import { UpdateRoleValidator } from '@/application/role/update-role.validator'
import { ZodCreateRoleValidator } from '@/infrastructure/validators/role/zod-create-role.validator'
import { ZodSearchRolesValidator } from '@/infrastructure/validators/role/zod-search-roles.validator'
import { ZodUpdateRoleValidator } from '@/infrastructure/validators/role/zod-update-role.validator'
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
    {
      provide: CreateRoleValidator,
      useClass: ZodCreateRoleValidator,
    },
    {
      provide: SearchRolesValidator,
      useClass: ZodSearchRolesValidator,
    },
    {
      provide: UpdateRoleValidator,
      useClass: ZodUpdateRoleValidator,
    },
  ],
})
export class RoleModule { }
