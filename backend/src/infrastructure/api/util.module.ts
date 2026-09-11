import { EmailService } from '@/base/contracts/email-service'
import { OauthTokenVerifier } from '@/base/contracts/oauth-token-verifier'
import { PasswordHasher } from '@/base/contracts/password-hasher'
import { Validator } from '@/base/contracts/validator'
import { Mediator } from '@/base/mediator'
import { AuthService } from '@/base/util/auth-service'
import { ContextStorage } from '@/base/util/context-storage'
import { ZodValidator } from '@/base/util/zod-validator'
import { BcryptPasswordHasher } from '@/shared/util/bcrypt-password-hasher'
import { BrevoEmailService } from '@/shared/util/brevo-email-service'
import { GoogleOauthTokenVerifier } from '@/shared/util/google-oauth-token-verifier'
import { NestMediator } from '@/shared/util/nest-mediator'
import { LoggingBehavior } from '@/shared/util/logging-behavior'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: EmailService,
      useClass: BrevoEmailService,
    },
    {
      provide: OauthTokenVerifier,
      useClass: GoogleOauthTokenVerifier,
    },
    {
      provide: Validator,
      useClass: ZodValidator,
    },
    {
      provide: Mediator,
      useClass: NestMediator
    },
    ContextStorage,
    AuthService,
    LoggingBehavior,
  ],
  exports: [
    PasswordHasher,
    EmailService,
    OauthTokenVerifier,
    Validator,
    ContextStorage,
    AuthService,
    Mediator,
  ],
})
export class UtilModule { }
