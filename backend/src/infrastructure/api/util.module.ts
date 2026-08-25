import { EmailService } from '@/base/contracts/email-service'
import { OauthTokenVerifier } from '@/base/contracts/oauth-token-verifier'
import { PasswordHasher } from '@/base/contracts/password-hasher'
import { UuidValidator } from '@/base/contracts/uuid.validator'
import { AuthService } from '@/shared/util/auth-service'
import { BcryptPasswordHasher } from '@/shared/util/bcrypt-password-hasher'
import { BrevoEmailService } from '@/shared/util/brevo-email-service'
import { GoogleOauthTokenVerifier } from '@/shared/util/google-oauth-token-verifier'
import { ContextStorage } from '@/shared/util/context-storage'
import { ZodUuidValidator } from '@/shared/util/zod-uuid.validator'
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
      provide: UuidValidator,
      useClass: ZodUuidValidator,
    },
    ContextStorage,
    AuthService,
  ],
  exports: [
    PasswordHasher,
    EmailService,
    OauthTokenVerifier,
    UuidValidator,
    ContextStorage,
    AuthService,
  ],
})
export class UtilModule { }
