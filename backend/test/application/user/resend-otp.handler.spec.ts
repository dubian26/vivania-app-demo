import { ResendOtpCommand } from '@/application/user/resend-otp.command'
import { ResendOtpHandler } from '@/application/user/resend-otp.handler'
import { TxManager } from '@/base/contracts/tx-manager'
import { Validator } from '@/base/contracts/validator'
import { User } from '@/domain/user/user'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCode } from '@/domain/verify-code/verify-code'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'
import { Logger } from '@nestjs/common'

describe('ResendOtpHandler activation', () => {
  const originalFrontendUrl = process.env.FRONTEND_URL

  beforeEach(() => {
    process.env.FRONTEND_URL = 'https://example.com'
  })

  afterEach(() => {
    if (originalFrontendUrl === undefined) {
      delete process.env.FRONTEND_URL
    } else {
      process.env.FRONTEND_URL = originalFrontendUrl
    }
    jest.restoreAllMocks()
  })

  function setup() {
    const user = User.create({
      id: 'user-id', email: 'owner@example.com', password: 'temporary-hash',
      firstName: 'Ana', lastName: 'Perez', roleId: 'role-id',
    })
    const userRepo = { findByEmail: jest.fn().mockResolvedValue(user) }
    const codeRepo = {
      findByUserId: jest.fn().mockResolvedValue([]),
      insert: jest.fn<Promise<void>, [VerifyCode]>().mockResolvedValue(undefined),
    }
    const emailService = { send: jest.fn().mockResolvedValue(undefined) }
    const validator = {
      parse: jest.fn((schema: { parse: (value: unknown) => unknown }, value: unknown) => schema.parse(value)),
    }
    const txManager = { run: jest.fn(async (callback: () => Promise<unknown>) => callback()) }
    const handler = new ResendOtpHandler(
      validator as unknown as Validator,
      userRepo as unknown as UserRepository,
      codeRepo as unknown as VerifyCodeRepository,
      txManager as unknown as TxManager,
      emailService,
    )
    const request = new ResendOtpCommand({ email: user.email, purpose: 'ALTA_ADMIN' })
    return { handler, request, user, codeRepo, emailService, txManager }
  }

  it('sends an activation email with a new OTP and activation link', async () => {
    const { handler, request, codeRepo, emailService } = setup()
    await handler.handle(request)
    const code = codeRepo.insert.mock.calls[0][0]
    expect(code.purpose).toBe('ALTA_ADMIN')
    expect(code.code).toMatch(/^\d{6}$/)
    expect(emailService.send).toHaveBeenCalledWith(
      'owner@example.com', 'Activa tu cuenta', expect.stringContaining('/activar-cuenta?email='),
    )
  })

  it('enforces cooldown using the latest code even if records are unordered', async () => {
    const { handler, request, user, codeRepo, emailService } = setup()
    const oldCode = VerifyCode.fromDB({
      id: 'old', userId: user.id, code: '123456', purpose: 'ALTA_ADMIN',
      expiration: new Date(), used: false, createdAt: new Date(Date.now() - 120_000),
    })
    const recentCode = VerifyCode.create({
      id: 'recent', userId: user.id, code: '654321', purpose: 'ALTA_ADMIN',
      expiration: new Date(Date.now() + 60_000),
    })
    codeRepo.findByUserId.mockResolvedValue([oldCode, recentCode])
    await expect(handler.handle(request)).rejects.toThrow()
    expect(emailService.send).not.toHaveBeenCalled()
  })

  it('sends the email only after the transaction completes', async () => {
    const { handler, request, emailService, txManager } = setup()
    let transactionCompleted = false

    txManager.run.mockImplementation(async callback => {
      const result = await callback()
      expect(emailService.send).not.toHaveBeenCalled()
      transactionCompleted = true
      return result
    })
    emailService.send.mockImplementation(async () => {
      expect(transactionCompleted).toBe(true)
    })

    await handler.handle(request)
    expect(emailService.send).toHaveBeenCalledTimes(1)
  })

  it('reports delivery failure after persisting the code', async () => {
    const { handler, request, codeRepo, emailService } = setup()
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {})
    emailService.send.mockRejectedValue(new Error('Delivery failed'))

    await expect(handler.handle(request)).rejects.toMatchObject({
      code: 'VerifyCode.EmailSendFailed',
      type: 'uncontrolled',
    })
    expect(codeRepo.insert).toHaveBeenCalledTimes(1)
  })

  it('does not send email when persistence fails', async () => {
    const { handler, request, codeRepo, emailService } = setup()
    codeRepo.insert.mockRejectedValue(new Error('Persistence failed'))

    await expect(handler.handle(request)).rejects.toThrow('Persistence failed')
    expect(emailService.send).not.toHaveBeenCalled()
  })

  it.each([
    ['REGISTRO', 'Verifica tu correo electrónico'],
    ['RECUPERACION', 'Recuperación de contraseña'],
  ] as const)('sends %s without an activation URL', async (purpose, subject) => {
    const { handler, user, emailService } = setup()
    delete process.env.FRONTEND_URL
    const request = new ResendOtpCommand({ email: user.email, purpose })

    await handler.handle(request)

    expect(emailService.send).toHaveBeenCalledWith(
      user.email,
      subject,
      expect.stringContaining('Este código expirará en 15 minutos.'),
    )
    expect(emailService.send.mock.calls[0][2]).not.toContain('/activar-cuenta')
  })
})
