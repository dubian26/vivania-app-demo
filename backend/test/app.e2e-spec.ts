import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '@/infrastructure/api/app.module'
import { ErrorModel } from '@/shared/errors/error-model'

import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify'

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )
    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'secret',
      })
      .expect(201)
      .expect({
        id: '123',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        roleId: '1',
        roleName: 'Admin',
      })
  })

  it('/auth/login (POST) validation error', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'invalid-email',
        password: '',
      })
      .expect(422)
      .expect((body: ErrorModel) => {
        expect(body.type).toBe('validation')
        expect(body.code).toBe('Schema.ValidationError')
        expect(body.message).toBe(
          'Errores de validación en los datos enviados.',
        )
        expect(body.traceId).toEqual(expect.any(String))
        expect(body.details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              property: 'email',
              message: 'El email no es válido.',
            }),
            expect.objectContaining({
              property: 'password',
              message: 'La contraseña es requerida.',
            }),
          ]),
        )
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
