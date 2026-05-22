import { RoleRepository } from '@/domain/role/role-repository'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { PrismaRoleRepository } from '@/infrastructure/repositories/prisma-role-repository'
import { PrismaTxManager } from '@/infrastructure/repositories/prisma-tx-manager'
import { PrismaUserRepository } from '@/infrastructure/repositories/prisma-user-repository'
import { PrismaVerifyCodeRepository } from '@/infrastructure/repositories/prisma-verify-code-repository'
import { TxManager } from '@base/core/contracts'
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
      provide: VerifyCodeRepository,
      useClass: PrismaVerifyCodeRepository,
    }
  ],
  exports: [
    UserRepository,
    RoleRepository,
    VerifyCodeRepository,
    TxManager
  ],
})
export class RepoModule { }
