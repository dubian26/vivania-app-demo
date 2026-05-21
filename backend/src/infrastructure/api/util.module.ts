import { EmailService } from '@/shared/contracts/email-service'
import { PasswordHasher } from '@/shared/contracts/password-hasher'
import { BcryptPasswordHasher } from '@/shared/util/bcrypt-password-hasher'
import { BrevoEmailService } from '@/shared/util/brevo-email-service'
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
    }
  ],
  exports: [PasswordHasher, EmailService],
})
export class UtilModule { }
