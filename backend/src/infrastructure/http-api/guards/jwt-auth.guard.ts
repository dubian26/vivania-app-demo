import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import jwt from 'jsonwebtoken'
import { Request } from 'express'

import { IS_PUBLIC_KEY } from '@/infrastructure/http-api/decorators/public.decorator'
import { BaseError } from '@/shared/errors/base-error'
import { UserInfo } from '@/shared/models/user-info'

export interface AuthenticatedRequest extends Request {
  user?: UserInfo
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const accessToken = this.getAccessToken(request)

    if (!accessToken) {
      throw BaseError.TokenInexistente()
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || ''
      request.user = jwt.verify(accessToken, jwtSecret) as UserInfo

      return true
    } catch {
      throw BaseError.TokenInvalido()
    }
  }

  private getAccessToken(request: AuthenticatedRequest): string | undefined {
    const authorizationHeader = request.headers.authorization

    if (authorizationHeader?.startsWith('Bearer ')) {
      return authorizationHeader.slice('Bearer '.length).trim()
    }

    const cookies = request.cookies as { accessToken?: string } | undefined
    return cookies?.accessToken
  }
}
