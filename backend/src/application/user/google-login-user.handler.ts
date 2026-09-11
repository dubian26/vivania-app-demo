import { OauthTokenVerifier } from '@/base/contracts/oauth-token-verifier'
import { Validator } from '@/base/contracts/validator'
import { BaseError } from '@/base/errors/base-error'
import { CustomError } from '@/base/errors/custom-error'
import { RequestHandler } from '@/base/mediator'
import { UserInfo } from '@/base/models/user-info'
import { Injectable } from '@/base/util/injectable'
import { Role } from '@/domain/role/role'
import { RoleError } from '@/domain/role/role-error'
import { RoleRepository } from '@/domain/role/role-repository'
import { User } from '@/domain/user/user'
import { UserRepository } from '@/domain/user/user-repository'
import { randomUUID } from 'node:crypto'
import type { GoogleLoginUserCommand } from './google-login-user.command'
import { googleLoginUserSchema } from './google-login-user.schema'

@Injectable()
export class GoogleLoginUserHandler implements RequestHandler<GoogleLoginUserCommand, UserInfo> {
  constructor(
    private readonly validator: Validator,
    private readonly userRepo: UserRepository,
    private readonly roleRepo: RoleRepository,
    private readonly oauthTokenVerifier: OauthTokenVerifier,
  ) { }

  async handle(request: GoogleLoginUserCommand): Promise<UserInfo> {
    const input = this.validator.parse(googleLoginUserSchema, request.input)

    try {
      const payload = await this.oauthTokenVerifier.verify(input.token)

      let user = await this.userRepo.findByEmail(payload.email)

      if (!user) {
        const rol = await this.roleRepo.findByName(Role.CLIENTE)
        if (!rol) throw RoleError.NotExists()

        const newUser = User.create({
          id: randomUUID(),
          email: payload.email,
          password: '',
          firstName: payload.givenName || 'Usuario',
          lastName: payload.familyName || 'Google',
          roleId: rol.id,
        })

        newUser.activate()
        newUser.verifyEmail()

        await this.userRepo.insert(newUser)

        user = await this.userRepo.findByEmail(payload.email)
      }

      if (!user) throw BaseError.GoogleAuthError('No se pudo autenticar al usuario.')

      return user.toUserInfo()
    } catch (error) {
      if (error instanceof CustomError) throw error

      console.error('Error en Google Login:', error)
      throw BaseError.GoogleAuthError(
        error instanceof Error ? error.message : 'Error al autenticar con Google.',
      )
    }
  }
}
