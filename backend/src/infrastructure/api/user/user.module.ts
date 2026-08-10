import { GetUserByEmailQuery } from '@/application/user/get-user-by-email.query'
import { GetUserQuery } from '@/application/user/get-user.query'
import { LoginUserQuery } from '@/application/user/login-user.query'
import { RegisterUserCommand } from '@/application/user/register-user.command'
import { ResendOtpCommand } from '@/application/user/resend-otp.command'
import { SearchUsersQuery } from '@/application/user/search-users.query'
import { UpdateProfileCommand } from '@/application/user/update-profile.command'
import { UpdateUserCommand } from '@/application/user/update-user.command'
import { VerifyUserCommand } from '@/application/user/verify-user.command'
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
  ],
})
export class UserModule { }