import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { LoginUserQuery } from '@/application/user/login-user.query'
import { LoginUserValidator } from '@/application/user/login-user.validator'
import { ZodLoginUserValidator } from '@/infrastructure/validators/user/zod-login-user.validator'
import { UserRepository } from '@/domain/user/user-repository'
import { PrismaUserRepository } from '@/infrastructure/repositories/prisma-user-repository'

@Module({
  controllers: [AuthController],
  providers: [
    LoginUserQuery,
    {
      provide: LoginUserValidator,
      useClass: ZodLoginUserValidator,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
