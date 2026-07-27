import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

import { IS_PUBLIC_KEY } from '@/shared/decorators/public.decorator'
import { BaseError } from '@js-core/domain/errors'
import { UserInfo } from '@js-core/domain/models'
import { Injectable } from '@js-core/domain/util'

type AuthenticatedRequest = FastifyRequest & {
  cookies?: { accessToken?: string }
  user?: UserInfo
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

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
      throw BaseError.TokenNotFound()
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || ''
      request.user = jwt.verify(accessToken, jwtSecret) as UserInfo

      return true
    } catch {
      throw BaseError.InvalidToken()
    }
  }

  private getAccessToken(request: AuthenticatedRequest): string | undefined {
    const authorizationHeader = request.headers.authorization

    if (
      typeof authorizationHeader === 'string' &&
      authorizationHeader.startsWith('Bearer ')
    ) {
      return authorizationHeader.slice('Bearer '.length).trim()
    }

    return request.cookies?.accessToken
  }
}
