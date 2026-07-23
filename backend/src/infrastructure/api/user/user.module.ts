import { GetUserByEmailQuery } from '@/application/user/get-user-by-email.query'
import { GetUserByEmailValidator } from '@/application/user/get-user-by-email.validator'
import { GetUserQuery } from '@/application/user/get-user.query'
import { LoginUserQuery } from '@/application/user/login-user.query'
import { LoginUserValidator } from '@/application/user/login-user.validator'
import { RegisterUserCommand } from '@/application/user/register-user.command'
import { RegisterUserValidator } from '@/application/user/register-user.validator'
import { ResendOtpCommand } from '@/application/user/resend-otp.command'
import { ResendOtpValidator } from '@/application/user/resend-otp.validator'
import { SearchUsersQuery } from '@/application/user/search-users.query'
import { SearchUsersValidator } from '@/application/user/search-users.validator'
import { UpdateProfileCommand } from '@/application/user/update-profile.command'
import { UpdateProfileValidator } from '@/application/user/update-profile.validator'
import { UpdateUserCommand } from '@/application/user/update-user.command'
import { UpdateUserValidator } from '@/application/user/update-user.validator'
import { VerifyUserCommand } from '@/application/user/verify-user.command'
import { VerifyUserValidator } from '@/application/user/verify-user.validator'
import { ZodGetUserByEmailValidator } from '@/infrastructure/validators/user/zod-get-user-by-email.validator'
import { ZodLoginUserValidator } from '@/infrastructure/validators/user/zod-login-user.validator'
import { ZodRegisterUserValidator } from '@/infrastructure/validators/user/zod-register-user.validator'
import { ZodResendOtpValidator } from '@/infrastructure/validators/user/zod-resend-otp.validator'
import { ZodSearchUsersValidator } from '@/infrastructure/validators/user/zod-search-users.validator'
import { ZodUpdateProfileValidator } from '@/infrastructure/validators/user/zod-update-profile.validator'
import { ZodUpdateUserValidator } from '@/infrastructure/validators/user/zod-update-user.validator'
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
    GetUserQuery,
    GetUserByEmailQuery,
    UpdateUserCommand,
    UpdateProfileCommand,
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
    {
      provide: GetUserByEmailValidator,
      useClass: ZodGetUserByEmailValidator,
    },
    {
      provide: UpdateUserValidator,
      useClass: ZodUpdateUserValidator,
    },
    {
      provide: UpdateProfileValidator,
      useClass: ZodUpdateProfileValidator,
    },
  ],
})
export class UserModule { }
