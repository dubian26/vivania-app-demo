import { CreatePermissionCommand, type CreatePermissionDTO } from '@/application/permission/create-permission.command'
import { DeletePermissionCommand } from '@/application/permission/delete-permission.command'
import { GetPermissionsByRoleQuery } from '@/application/permission/get-permissions-by-role.query'
import { ListPermissionsQuery } from '@/application/permission/list-permissions.query'
import { SaveRolePermissionsCommand } from '@/application/permission/save-role-permissions.command'
import { UpdatePermissionCommand, type UpdatePermissionDTO } from '@/application/permission/update-permission.command'
import { Mediator } from '@/base/mediator'
import { type IdResult } from '@/base/models/id-result'
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly mediator: Mediator,
  ) { }

  @Get()
  list() {
    return this.mediator.send(new ListPermissionsQuery())
  }

  @Get('role/:roleId')
  listByRole(@Param('roleId') roleId: string) {
    return this.mediator.send(new GetPermissionsByRoleQuery({ roleId }))
  }

  @Post('role/:roleId')
  saveRolePermissions(
    @Param('roleId') roleId: string,
    @Body() req: { permissionIds: string[] },
  ): Promise<IdResult> {
    return this.mediator.send(new SaveRolePermissionsCommand({
      roleId,
      permissionIds: req.permissionIds,
    }))
  }

  @Post()
  create(@Body() req: CreatePermissionDTO) {
    return this.mediator.send(new CreatePermissionCommand(req))
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() req: UpdatePermissionDTO) {
    return this.mediator.send(new UpdatePermissionCommand({ ...req, id }))
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<IdResult> {
    return this.mediator.send(new DeletePermissionCommand(id))
  }
}
