import { CreateRoleCommand } from '@/application/role/create-role.command'
import { CreateRoleValidator } from '@/application/role/create-role.validator'
import { ZodCreateRoleValidator } from '@/infrastructure/validators/role/zod-create-role.validator'
import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'

@Module({
  controllers: [RoleController],
  providers: [
    CreateRoleCommand,
    {
      provide: CreateRoleValidator,
      useClass: ZodCreateRoleValidator,
    },
  ],
})
export class RoleModule { }
