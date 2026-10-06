import { VerifyUserCommand } from '@/application/user/verify-user.command'
import { VerifyUserHandler } from '@/application/user/verify-user.handler'
import { PasswordHasher } from '@/base/contracts/password-hasher'
import { TxManager } from '@/base/contracts/tx-manager'
import { Validator } from '@/base/contracts/validator'
import { User } from '@/domain/user/user'
import { UserRepository } from '@/domain/user/user-repository'
import { VerifyCode } from '@/domain/verify-code/verify-code'
import { VerifyCodeRepository } from '@/domain/verify-code/verify-code-repository'

describe('VerifyUserHandler activation', () => {
  function setup(expiration = new Date(Date.now() + 60_000)) {
    const user = User.create({
      id: 'user-id', email: 'owner@example.com', password: 'temporary-hash',
      firstName: 'Ana', lastName: 'Perez', roleId: 'role-id',
    })
    const code = VerifyCode.create({
      id: 'code-id', userId: user.id, code: '123456', purpose: 'ALTA_ADMIN', expiration,
    })
    const userRepo = {
      findByEmail: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockResolvedValue(undefined),
    }
    const codeRepo = {
      findByCode: jest.fn().mockResolvedValue(code),
      update: jest.fn().mockResolvedValue(undefined),
    }
    const passwordHasher = {
      hash: jest.fn().mockResolvedValue('owner-password-hash'),
    }
    const validator = {
      parse: jest.fn((schema: { parse: (value: unknown) => unknown }, value: unknown) => schema.parse(value)),
    }
    const txManager = { run: jest.fn(async (callback: () => Promise<unknown>) => callback()) }
    const handler = new VerifyUserHandler(
      validator as unknown as Validator,
      userRepo as unknown as UserRepository,
      codeRepo as unknown as VerifyCodeRepository,
      txManager as unknown as TxManager,
      passwordHasher as unknown as PasswordHasher,
    )
    const request = new VerifyUserCommand({
      email: user.email, code: code.code, purpose: 'ALTA_ADMIN', password: 'Secure1!',
    })
    return { handler, request, user, code, userRepo, codeRepo, passwordHasher }
  }

  it('saves the chosen password, activates the account and consumes the OTP', async () => {
    const { handler, request, user, code, userRepo, codeRepo, passwordHasher } = setup()
    const result = await handler.handle(request)
    expect(passwordHasher.hash).toHaveBeenCalledWith('Secure1!')
    expect(user.password).toBe('owner-password-hash')
    expect(user.emailVerified).toBe(true)
    expect(user.active).toBe(true)
    expect(code.used).toBe(true)
    expect(userRepo.update).toHaveBeenCalledWith(user)
    expect(codeRepo.update).toHaveBeenCalledWith(code)
    expect(result.userInfo?.id).toBe(user.id)
  })

  it('rejects a used OTP before changing the password', async () => {
    const { handler, request, code, passwordHasher } = setup()
    code.markAsUsed()
    await expect(handler.handle(request)).rejects.toThrow()
    expect(passwordHasher.hash).not.toHaveBeenCalled()
  })

  it('rejects an expired OTP', async () => {
    const { handler, request, passwordHasher } = setup(new Date(Date.now() - 1000))
    await expect(handler.handle(request)).rejects.toThrow()
    expect(passwordHasher.hash).not.toHaveBeenCalled()
  })

  it.each([undefined, 'weak'])('rejects a missing or invalid password (%s)', async (password) => {
    const { handler, request, codeRepo } = setup()
    const invalidRequest = new VerifyUserCommand({ ...request.input, password })
    await expect(handler.handle(invalidRequest)).rejects.toThrow()
    expect(codeRepo.update).not.toHaveBeenCalled()
  })

  it('does not replace the password during recovery', async () => {
    const { handler, request, user, passwordHasher } = setup()
    await handler.handle(new VerifyUserCommand({ ...request.input, purpose: 'RECUPERACION', password: undefined }))
    expect(passwordHasher.hash).not.toHaveBeenCalled()
    expect(user.password).toBe('temporary-hash')
  })
})
