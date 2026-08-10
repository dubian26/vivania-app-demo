import { AppModule } from '@/infrastructure/api/app.module'
import { PasswordHasher } from '@/base/contracts/password-hasher'
import { ErrorModel } from '@/base/errors/error-model'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'

describe('AuthController (e2e)', () => {
  let app: NestFastifyApplication
  const passwordHasher = {
    compare: jest.fn(),
    hash: jest.fn(),
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PasswordHasher)
      .useValue(passwordHasher)
      .compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    )
    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  beforeEach(() => {
    jest.resetAllMocks()
    passwordHasher.compare.mockResolvedValue(true)
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
