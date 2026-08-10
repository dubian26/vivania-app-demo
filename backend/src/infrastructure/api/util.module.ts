import { ContextStorageService } from '@/shared/context/context-storage.service'
import { AuthService } from '@/shared/util/auth-service'
import { BcryptPasswordHasher } from '@/shared/util/bcrypt-password-hasher'
import { BrevoEmailService } from '@/shared/util/brevo-email-service'
import { ZodUuidValidator } from '@/shared/util/zod-uuid.validator'
import { EmailService } from '@/base/contracts/email-service'
import { PasswordHasher } from '@/base/contracts/password-hasher'
import { UuidValidator } from '@/base/contracts/uuid.validator'
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
      provide: UuidValidator,
      useClass: ZodUuidValidator,
    },
    ContextStorageService,
    AuthService,
  ],
  exports: [
    PasswordHasher,
    EmailService,
    UuidValidator,
    ContextStorageService,
    AuthService,
  ],
})
export class UtilModule { }
