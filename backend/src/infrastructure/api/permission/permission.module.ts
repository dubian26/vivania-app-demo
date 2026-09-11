import { CreatePermissionHandler } from '@/application/permission/create-permission.handler'
import { DeletePermissionHandler } from '@/application/permission/delete-permission.handler'
import { GetPermissionsByRoleHandler } from '@/application/permission/get-permissions-by-role.handler'
import { ListPermissionsHandler } from '@/application/permission/list-permissions.handler'
import { SaveRolePermissionsHandler } from '@/application/permission/save-role-permissions.handler'
import { UpdatePermissionHandler } from '@/application/permission/update-permission.handler'
import { Module } from '@nestjs/common'
import { PermissionController } from './permission.controller'

@Module({
  controllers: [PermissionController],
  providers: [
    CreatePermissionHandler,
    DeletePermissionHandler,
    GetPermissionsByRoleHandler,
    ListPermissionsHandler,
    SaveRolePermissionsHandler,
    UpdatePermissionHandler,
  ],
})
export class PermissionModule { }
