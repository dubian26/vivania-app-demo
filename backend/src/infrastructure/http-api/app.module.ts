import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AuthController } from './controllers/auth.controller'
import { LoginUserQuery } from '@/application/user/login-user.query'
import { GlobalExceptionFilter } from './filters/global-exception.filter'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Module({
  controllers: [AuthController],
  providers: [
    LoginUserQuery,
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
