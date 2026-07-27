import { UserInfo } from '@js-core/domain/models'

export interface VerifyUserDTO {
  email: string
  code: string
  purpose: 'REGISTRO' | 'RECUPERACION'
}

export interface VerifyUserResult {
  message: string
  userInfo?: UserInfo
}
