import { GlobalExceptionFilter } from '@/shared/filters/global-exception.filter'
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard'
import { ContextMiddleware } from '@/shared/middleware/context.middleware'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { PermissionModule } from './permission/permission.module'
import { RepoModule } from './repo.module'
import { RoleModule } from './role/role.module'
import { UserModule } from './user/user.module'
import { UtilModule } from './util.module'

@Module({
  imports: [
    RepoModule, UtilModule,
    UserModule, RoleModule,
    PermissionModule
  ],
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*')
  }
}
