import cookie from '@fastify/cookie'
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/infrastructure/http-api/app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(cookie)
  await app.listen(process.env.PORT ?? 3001)
}

bootstrap().catch(console.error)
