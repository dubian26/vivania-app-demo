import { LoginUserQuery } from '@/application/user/login-user.query'
import { LoginUserValidator } from '@/application/user/login-user.validator'
import { UserRepository } from '@/domain/user/user-repository'
import { PrismaDbContext } from '@/infrastructure/repositories/prisma-db-context'
import { PrismaTxManager } from '@/infrastructure/repositories/prisma-tx-manager'
import { PrismaUserRepository } from '@/infrastructure/repositories/prisma-user-repository'
import { ZodLoginUserValidator } from '@/infrastructure/validators/user/zod-login-user.validator'
import { TxManager } from '@/shared/util/tx-manager'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'

@Module({
  controllers: [AuthController],
  providers: [
    LoginUserQuery,
    PrismaDbContext,
    {
      provide: LoginUserValidator,
      useClass: ZodLoginUserValidator,
    },
    {
      provide: TxManager,
      useClass: PrismaTxManager,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
