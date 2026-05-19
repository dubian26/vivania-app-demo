import { LoginUserQuery } from '@/application/user/login-user.query'
import { LoginUserValidator } from '@/application/user/login-user.validator'
import { RegisterUserCommand } from '@/application/user/register-user.command'
import { RegisterUserValidator } from '@/application/user/register-user.validator'
import { ZodLoginUserValidator } from '@/infrastructure/validators/user/zod-login-user.validator'
import { ZodRegisterUserValidator } from '@/infrastructure/validators/user/zod-register-user.validator'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'

@Module({
  controllers: [AuthController],
  providers: [
    LoginUserQuery,
    RegisterUserCommand,
    {
      provide: LoginUserValidator,
      useClass: ZodLoginUserValidator,
    },
    {
      provide: RegisterUserValidator,
      useClass: ZodRegisterUserValidator,
    },
  ],
})
export class UserModule { }
