import { type LoginUserDTO } from '@/application/user/login-user.dto'
import { LoginUserQuery } from '@/application/user/login-user.query'
import { RegisterUserCommand } from '@/application/user/register-user.command'
import { type RegisterUserDTO } from '@/application/user/register-user.dto'
import { ResendOtpCommand } from '@/application/user/resend-otp.command'
import { type ResendOtpDTO } from '@/application/user/resend-otp.dto'
import { VerifyUserCommand } from '@/application/user/verify-user.command'
import { type VerifyUserDTO, type VerifyUserResult } from '@/application/user/verify-user.dto'
import { Public } from '@/shared/decorators/public.decorator'
import { setAccessTokenCookie, setAuthCookies } from '@/shared/util/cookie-helper'
import { BaseError } from '@base/core/errors'
import { type IdResult, UserInfo } from '@base/core/models'
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

type RefreshTokenRequest = FastifyRequest & {
  cookies?: { refreshToken?: string }
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUserQuery: LoginUserQuery,
    private readonly registerUserCommand: RegisterUserCommand,
    private readonly verifyUserQuery: VerifyUserCommand,
    private readonly resendOtpCommand: ResendOtpCommand,
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

  @Public()
  @Get('refresh-token')
  async refreshToken(
    @Req() request: RefreshTokenRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<string> {
    const refreshToken = request.cookies?.refreshToken

    if (!refreshToken)
      throw BaseError.MissingRefreshToken()

    try {
      const jwtSecret = process.env.JWT_SECRET || ''
      const jwtEmisor = process.env.JWT_EMISOR || ''

      const decode = jwt.verify(refreshToken, jwtSecret, {
        issuer: jwtEmisor,
      }) as jwt.JwtPayload & UserInfo

      const userInfo: UserInfo = {
        id: decode.id,
        email: decode.email,
        firstName: decode.firstName,
        lastName: decode.lastName,
        roleId: decode.roleId,
        roleName: decode.roleName,
      }

      setAccessTokenCookie(reply, userInfo)
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        throw BaseError.SessionExpired()

      if (error instanceof jwt.JsonWebTokenError
        || error instanceof jwt.NotBeforeError)
        throw BaseError.InvalidToken()

      throw error
    }

    return await Promise.resolve('Token refrescado')
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(
    @Body() req: VerifyUserDTO,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<VerifyUserResult> {
    const result = await this.verifyUserQuery.execute(req)
    if (result.userInfo) setAuthCookies(reply, result.userInfo)
    return result
  }

  @Public()
  @Post('resend-otp')
  async resendOtp(@Body() req: ResendOtpDTO): Promise<{ message: string }> {
    const result = await this.resendOtpCommand.execute(req)
    return result
  }
}
