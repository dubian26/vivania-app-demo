import { type LoginUserDTO } from '@/application/user/login-user.dto'
import { LoginUserQuery } from '@/application/user/login-user.query'
import { RegisterUserCommand } from '@/application/user/register-user.command'
import { type RegisterUserDTO } from '@/application/user/register-user.dto'
import { Public } from '@/shared/decorators/public.decorator'
import { type IdResult } from '@/shared/models/id-result'
import { type UserInfo } from '@/shared/models/user-info'
import { setAuthCookies } from '@/shared/util/cookie-helper'
import { Body, Controller, Post, Res } from '@nestjs/common'
import { type FastifyReply } from 'fastify'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUserQuery: LoginUserQuery,
    private readonly registerUserCommand: RegisterUserCommand,
  ) { }

  @Public()
  @Post('login')
  async login(
    @Body() req: LoginUserDTO,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<UserInfo> {
    const userInfo = await this.loginUserQuery.execute(req)
    setAuthCookies(reply, userInfo)
    return userInfo
  }

  @Public()
  @Post('register')
  register(@Body() req: RegisterUserDTO): Promise<IdResult> {
    return this.registerUserCommand.execute(req)
  }
}
