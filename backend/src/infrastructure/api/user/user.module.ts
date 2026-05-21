import { LoginUserQuery } from '@/application/user/login-user.query'
import { LoginUserValidator } from '@/application/user/login-user.validator'
import { RegisterUserCommand } from '@/application/user/register-user.command'
import { RegisterUserValidator } from '@/application/user/register-user.validator'
import { ResendOtpCommand } from '@/application/user/resend-otp.command'
import { ResendOtpValidator } from '@/application/user/resend-otp.validator'
import { VerifyUserCommand } from '@/application/user/verify-user.command'
import { VerifyUserValidator } from '@/application/user/verify-user.validator'
import { ZodLoginUserValidator } from '@/infrastructure/validators/user/zod-login-user.validator'
import { ZodRegisterUserValidator } from '@/infrastructure/validators/user/zod-register-user.validator'
import { ZodResendOtpValidator } from '@/infrastructure/validators/user/zod-resend-otp.validator'
import { ZodVerifyUserValidator } from '@/infrastructure/validators/user/zod-verify-user.validator'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'

@Module({
  controllers: [AuthController],
  providers: [
    LoginUserQuery,
    RegisterUserCommand,
    ResendOtpCommand,
    VerifyUserCommand,
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
    }
  ],
})
export class UserModule { }
