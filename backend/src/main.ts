import 'dotenv/config'

import { AppModule } from '@/infrastructure/api/app.module'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import cookie from '@fastify/cookie'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  app.enableShutdownHooks()
  await app.register(cookie as any)
  await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch(console.error)
