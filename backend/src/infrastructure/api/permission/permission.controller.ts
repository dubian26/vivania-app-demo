import { CreatePermissionCommand, type CreatePermissionDTO } from '@/application/permission/create-permission.command'
import { DeletePermissionCommand } from '@/application/permission/delete-permission.command'
import { GetPermissionsByRoleQuery } from '@/application/permission/get-permissions-by-role.query'
import { ListPermissionsQuery } from '@/application/permission/list-permissions.query'
import { SaveRolePermissionsCommand } from '@/application/permission/save-role-permissions.command'
import { UpdatePermissionCommand, type UpdatePermissionDTO } from '@/application/permission/update-permission.command'
import { type IdResult } from '@js-core/domain/models'
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly listPermissionsQuery: ListPermissionsQuery,
    private readonly getPermissionsByRoleQuery: GetPermissionsByRoleQuery,
    private readonly saveRolePermissionsCommand: SaveRolePermissionsCommand,
    private readonly createPermissionCommand: CreatePermissionCommand,
    private readonly updatePermissionCommand: UpdatePermissionCommand,
    private readonly deletePermissionCommand: DeletePermissionCommand,
  ) { }

  @Get()
  list() {
    return this.listPermissionsQuery.execute()
  }

  @Get('role/:roleId')
  listByRole(@Param('roleId') roleId: string) {
    return this.getPermissionsByRoleQuery.execute({ roleId })
  }

  @Post('role/:roleId')
  saveRolePermissions(
    @Param('roleId') roleId: string,
    @Body() req: { permissionIds: string[] },
  ): Promise<IdResult> {
    return this.saveRolePermissionsCommand.execute({
      roleId,
      permissionIds: req.permissionIds,
    })
  }

  @Post()
  create(@Body() req: CreatePermissionDTO) {
    return this.createPermissionCommand.execute(req)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() req: UpdatePermissionDTO) {
    return this.updatePermissionCommand.execute({ ...req, id })
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<IdResult> {
    return this.deletePermissionCommand.execute(id)
  }
}