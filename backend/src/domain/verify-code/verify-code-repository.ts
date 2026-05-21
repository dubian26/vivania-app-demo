import { VerifyCode } from './verify-code'

export abstract class VerifyCodeRepository {
  abstract findById(id: string): Promise<VerifyCode | null>
  abstract findByUserId(userId: string): Promise<VerifyCode[]>
  abstract findByCode(code: string, purpose: string): Promise<VerifyCode | null>
  abstract insert(verifyCode: VerifyCode): Promise<void>
  abstract update(verifyCode: VerifyCode): Promise<void>
  abstract delete(id: string): Promise<void>
}
