import { CreateUserHandler } from '@/application/user/create-user.handler'
import { GetUserByEmailHandler } from '@/application/user/get-user-by-email.handler'
import { GetUserHandler } from '@/application/user/get-user.handler'
import { GoogleLoginUserHandler } from '@/application/user/google-login-user.handler'
import { LoginUserHandler } from '@/application/user/login-user.handler'
import { RegisterUserHandler } from '@/application/user/register-user.handler'
import { ResendOtpHandler } from '@/application/user/resend-otp.handler'
import { SearchUsersHandler } from '@/application/user/search-users.handler'
import { UpdateProfileHandler } from '@/application/user/update-profile.handler'
import { UpdateUserHandler } from '@/application/user/update-user.handler'
import { VerifyUserHandler } from '@/application/user/verify-user.handler'
import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserController } from './user.controller'

@Module({
  controllers: [AuthController, UserController],
  providers: [
    LoginUserHandler,
    RegisterUserHandler,
    CreateUserHandler,
    GoogleLoginUserHandler,
    ResendOtpHandler,
    VerifyUserHandler,
    SearchUsersHandler,
    GetUserHandler,
    GetUserByEmailHandler,
    UpdateUserHandler,
    UpdateProfileHandler,
  ],
})
export class UserModule { }
