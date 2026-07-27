import { BcryptPasswordHasher } from '@/shared/util/bcrypt-password-hasher'
import { BrevoEmailService } from '@/shared/util/brevo-email-service'
import { ZodUuidValidator } from '@/shared/util/zod-uuid.validator'
import { EmailService, PasswordHasher, UuidValidator } from '@js-core/domain/contracts'
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
    }
  ],
  exports: [
    PasswordHasher,
    EmailService,
    UuidValidator,
  ],
})
export class UtilModule { }
