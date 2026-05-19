import { RoleRepository } from '@/domain/role/role-repository'
import { UserRepository } from '@/domain/user/user-repository'
import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { PrismaRoleRepository } from '@/infrastructure/repositories/prisma-role-repository'
import { PrismaTxManager } from '@/infrastructure/repositories/prisma-tx-manager'
import { PrismaUserRepository } from '@/infrastructure/repositories/prisma-user-repository'
import { TxManager } from '@/shared/util/tx-manager'
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
  ],
  exports: [
    UserRepository,
    RoleRepository,
    TxManager
  ],
})
export class RepoModule { }
