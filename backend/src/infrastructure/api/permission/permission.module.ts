import { CreatePermissionCommand } from '@/application/permission/create-permission.command'
import { DeletePermissionCommand } from '@/application/permission/delete-permission.command'
import { GetPermissionsByRoleQuery } from '@/application/permission/get-permissions-by-role.query'
import { ListPermissionsQuery } from '@/application/permission/list-permissions.query'
import { SaveRolePermissionsCommand } from '@/application/permission/save-role-permissions.command'
import { UpdatePermissionCommand } from '@/application/permission/update-permission.command'
import { Module } from '@nestjs/common'
import { PermissionController } from './permission.controller'

@Module({
  controllers: [PermissionController],
  providers: [
    CreatePermissionCommand,
    ListPermissionsQuery,
    GetPermissionsByRoleQuery,
    SaveRolePermissionsCommand,
    UpdatePermissionCommand,
    DeletePermissionCommand,
  ],
})
export class PermissionModule { }