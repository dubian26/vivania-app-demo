import { CreatePermissionCommand } from '@/application/permission/create-permission.command'
import { CreatePermissionValidator } from '@/application/permission/create-permission.validator'
import { DeletePermissionCommand } from '@/application/permission/delete-permission.command'
import { GetPermissionsByRoleQuery } from '@/application/permission/get-permissions-by-role.query'
import { GetPermissionsByRoleValidator } from '@/application/permission/get-permissions-by-role.validator'
import { ListPermissionsQuery } from '@/application/permission/list-permissions.query'
import { SaveRolePermissionsCommand } from '@/application/permission/save-role-permissions.command'
import { SaveRolePermissionsValidator } from '@/application/permission/save-role-permissions.validator'
import { UpdatePermissionCommand } from '@/application/permission/update-permission.command'
import { UpdatePermissionValidator } from '@/application/permission/update-permission.validator'
import { ZodCreatePermissionValidator } from '@/infrastructure/validators/permission/zod-create-permission.validator'
import { ZodGetPermissionsByRoleValidator } from '@/infrastructure/validators/permission/zod-get-permissions-by-role.validator'
import { ZodSaveRolePermissionsValidator } from '@/infrastructure/validators/permission/zod-save-role-permissions.validator'
import { ZodUpdatePermissionValidator } from '@/infrastructure/validators/permission/zod-update-permission.validator'
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
    {
      provide: CreatePermissionValidator,
      useClass: ZodCreatePermissionValidator,
    },
    {
      provide: GetPermissionsByRoleValidator,
      useClass: ZodGetPermissionsByRoleValidator,
    },
    {
      provide: SaveRolePermissionsValidator,
      useClass: ZodSaveRolePermissionsValidator,
    },
    {
      provide: UpdatePermissionValidator,
      useClass: ZodUpdatePermissionValidator,
    },
  ],
})
export class PermissionModule { }