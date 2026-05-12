import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { LoginUserQuery } from '@/application/user/login-user.query'

@Module({
  controllers: [AuthController],
  providers: [LoginUserQuery],
})
export class AppModule {}
