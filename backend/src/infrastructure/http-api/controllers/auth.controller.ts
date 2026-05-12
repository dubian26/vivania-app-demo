import { type LoginUserDTO } from '@/application/user/login-user.dto'
import { LoginUserQuery } from '@/application/user/login-user.query'
import { type UserInfo } from '@/shared/models/user-info'
import { Body, Controller, Post } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUserQuery: LoginUserQuery) {}

  @Post('login')
  login(@Body() req: LoginUserDTO): Promise<UserInfo> {
    return this.loginUserQuery.execute(req)
  }
}
