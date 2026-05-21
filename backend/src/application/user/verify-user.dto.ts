import { UserInfo } from '@/shared/models/user-info'

export interface VerifyUserDTO {
  email: string
  code: string
  purpose: 'REGISTRO' | 'RECUPERACION'
}

export interface VerifyUserResult {
  message: string
  userInfo?: UserInfo
}
