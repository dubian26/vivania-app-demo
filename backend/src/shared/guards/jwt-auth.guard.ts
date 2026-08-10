import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

import { ContextStorageService } from '@/shared/context/context-storage.service'
import { IS_PUBLIC_KEY } from '@/shared/decorators/public.decorator'
import { PermissionRepository } from '@/domain/permission/permission-repository'
import { BaseError } from '@/base/errors/base-error'
import { PermissionModel } from '@/base/models/permission-model'
import { UserInfo } from '@/base/models/user-info'
import { Injectable } from '@/base/util/injectable'

type AuthenticatedRequest = FastifyRequest & {
  cookies?: { accessToken?: string }
  user?: UserInfo
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextStorage: ContextStorageService,
    private readonly permissionRepository: PermissionRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

      const permissions = await this.loadPermissions(request.user.roleId)

      this.contextStorage.setContext({
        userInfo: request.user,
        permissions,
      })

      return true
    } catch {
      throw BaseError.InvalidToken()
    }
  }

  private async loadPermissions(roleId: string): Promise<PermissionModel[]> {
    const permissions = await this.permissionRepository.listByRole(roleId)
    return permissions.map((permission) => permission.toResult())
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
