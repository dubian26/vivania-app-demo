import { LoginUserQuery } from '@/application/user/login-user.query'
import { LoginUserValidator } from '@/application/user/login-user.validator'
import { RegisterUserCommand } from '@/application/user/register-user.command'
import { RegisterUserValidator } from '@/application/user/register-user.validator'
import { ResendOtpCommand } from '@/application/user/resend-otp.command'
import { ResendOtpValidator } from '@/application/user/resend-otp.validator'
import { SearchUsersQuery } from '@/application/user/search-users.query'
import { SearchUsersValidator } from '@/application/user/search-users.validator'
import { VerifyUserCommand } from '@/application/user/verify-user.command'
import { VerifyUserValidator } from '@/application/user/verify-user.validator'
import { ZodLoginUserValidator } from '@/infrastructure/validators/user/zod-login-user.validator'
import { ZodRegisterUserValidator } from '@/infrastructure/validators/user/zod-register-user.validator'
import { ZodResendOtpValidator } from '@/infrastructure/validators/user/zod-resend-otp.validator'
import { ZodSearchUsersValidator } from '@/infrastructure/validators/user/zod-search-users.validator'
import { ZodVerifyUserValidator } from '@/infrastructure/validators/user/zod-verify-user.validator'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserController } from './user.controller'

@Module({
  controllers: [AuthController, UserController],
  providers: [
    LoginUserQuery,
    RegisterUserCommand,
    ResendOtpCommand,
    VerifyUserCommand,
    SearchUsersQuery,
    {
      provide: LoginUserValidator,
      useClass: ZodLoginUserValidator,
    },
    {
      provide: RegisterUserValidator,
      useClass: ZodRegisterUserValidator,
    },
    {
      provide: VerifyUserValidator,
      useClass: ZodVerifyUserValidator,
    },
    {
      provide: ResendOtpValidator,
      useClass: ZodResendOtpValidator,
    },
    {
      provide: SearchUsersValidator,
      useClass: ZodSearchUsersValidator,
    },
  ],
})
export class UserModule { }
