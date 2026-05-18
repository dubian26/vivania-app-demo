import { CreateRoleCommand } from '@/application/role/create-role.command'
import { CreateRoleValidator } from '@/application/role/create-role.validator'
import { RepoModule } from '@/infrastructure/api/repo.module'
import { ZodCreateRoleValidator } from '@/infrastructure/validators/role/zod-create-role.validator'
import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'

@Module({
  imports: [RepoModule],
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
