import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/infrastructure/api/app.module'
import cookie from '@fastify/cookie'
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )

  await app.register(cookie)
  await app.listen(process.env.PORT ?? 3000)
}

bootstrap().catch(console.error)
