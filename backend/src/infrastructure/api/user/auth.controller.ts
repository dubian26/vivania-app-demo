import { GoogleLoginUserCommand, type GoogleLoginUserDTO } from '@/application/user/google-login-user.command'
import { LoginUserQuery, type LoginUserDTO } from '@/application/user/login-user.query'
import { RegisterUserCommand, type RegisterUserDTO } from '@/application/user/register-user.command'
import { ResendOtpCommand, type ResendOtpDTO } from '@/application/user/resend-otp.command'
import { UpdateProfileCommand, type UpdateProfileDTO } from '@/application/user/update-profile.command'
import { VerifyUserCommand, type VerifyUserDTO, type VerifyUserResult } from '@/application/user/verify-user.command'
import { BaseError } from '@/base/errors/base-error'
import { Mediator } from '@/base/mediator'
import { type IdResult } from '@/base/models/id-result'
import { UserInfo } from '@/base/models/user-info'
import { Public } from '@/shared/decorators/public.decorator'
import { setAccessTokenCookie, setAuthCookies, clearAuthCookies } from '@/shared/util/cookie-helper'
import { Body, Controller, Get, HttpCode, Patch, Post, Req, Res } from '@nestjs/common'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

type RefreshTokenRequest = FastifyRequest & {
  cookies?: { refreshToken?: string }
}

type AuthenticatedRequest = FastifyRequest & { user?: UserInfo }

@Controller('auth')
export class AuthController {
  constructor(
    private readonly mediator: Mediator,
  ) { }

  @Public()
  @Post('login')
  async login(
    @Body() req: LoginUserDTO,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<UserInfo> {
    const userInfo = await this.mediator.send(new LoginUserQuery(req))
    setAuthCookies(reply, userInfo)
    return userInfo
  }

  @Public()
  @Post('google-login')
  async googleLogin(
    @Body() req: GoogleLoginUserDTO,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<UserInfo> {
    const userInfo = await this.mediator.send(new GoogleLoginUserCommand(req))
    setAuthCookies(reply, userInfo)
    return userInfo
  }

  @Public()
  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) reply: FastifyReply): void {
    clearAuthCookies(reply)
  }

  @Public()
  @Post('register')
  register(@Body() req: RegisterUserDTO): Promise<IdResult> {
    return this.mediator.send(new RegisterUserCommand(req))
  }

  @Public()
  @Get('refresh-token')
  async refreshToken(
    @Req() request: RefreshTokenRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<UserInfo> {
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
      return await Promise.resolve(userInfo)
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        throw BaseError.SessionExpired()

      if (error instanceof jwt.JsonWebTokenError
        || error instanceof jwt.NotBeforeError)
        throw BaseError.InvalidToken()

      throw error
    }
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(
    @Body() req: VerifyUserDTO,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<VerifyUserResult> {
    const result = await this.mediator.send(new VerifyUserCommand(req))
    if (result.userInfo) setAuthCookies(reply, result.userInfo)
    return result
  }

  @Public()
  @Post('resend-otp')
  async resendOtp(@Body() req: ResendOtpDTO): Promise<{ message: string }> {
    const result = await this.mediator.send(new ResendOtpCommand(req))
    return result
  }

  @Patch('profile')
  async updateProfile(
    @Body() req: UpdateProfileDTO,
    @Req() request: AuthenticatedRequest,
  ): Promise<IdResult> {
    const userId = request.user!.id
    return this.mediator.send(new UpdateProfileCommand(userId, req))
  }
}
