import { RoleRepository } from '@/domain/role/role-repository'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { PrismaPermissionRepository } from '@/infrastructure/repositories/prisma-permission-repository'
import { PrismaRoleRepository } from '@/infrastructure/repositories/prisma-role-repository'
import { PrismaTxManager } from '@/infrastructure/repositories/prisma-tx-manager'
import { PrismaUserRepository } from '@/infrastructure/repositories/prisma-user-repository'
import { PrismaVerifyCodeRepository } from '@/infrastructure/repositories/prisma-verify-code-repository'
import { TxManager } from '@js-core/domain/contracts'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [
    PrismaDbContext,
    {
      provide: TxManager,
      useClass: PrismaTxManager,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: RoleRepository,
      useClass: PrismaRoleRepository,
    },
    {
      provide: PermissionRepository,
      useClass: PrismaPermissionRepository,
    },
    {
      provide: VerifyCodeRepository,
      useClass: PrismaVerifyCodeRepository,
    }
  ],
  exports: [
    UserRepository,
    RoleRepository,
    PermissionRepository,
    VerifyCodeRepository,
    TxManager
  ],
})
export class RepoModule { }
