import { PasswordHasher } from '@/shared/contracts/password-hasher'
import { BcryptPasswordHasher } from '@/shared/util/bcrypt-password-hasher'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [PasswordHasher],
})
export class UtilModule { }
