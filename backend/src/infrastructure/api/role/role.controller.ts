import { CreateRoleCommand } from '@/application/role/create-role.command'
import { type CreateRoleDTO } from '@/application/role/create-role.dto'
import { type IdResult } from '@base/core/models'
import { Body, Controller, Post } from '@nestjs/common'

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleCommand: CreateRoleCommand,
  ) { }

  @Post()
  create(@Body() req: CreateRoleDTO): Promise<IdResult> {
    return this.createRoleCommand.execute(req)
  }
}
