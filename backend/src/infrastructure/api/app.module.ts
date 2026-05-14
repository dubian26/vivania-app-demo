import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { GlobalExceptionFilter } from '@/shared/filters/global-exception.filter'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { UserModule } from './user/user.module'

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
