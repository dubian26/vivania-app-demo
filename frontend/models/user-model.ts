import { UserInfoModel } from "./user-info-model"

// Password never travels here.
export interface UserModel {
  id: string
  email: string
  firstName: string
  lastName: string
  roleId: string
  active: boolean
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  roleName?: string
}

export interface UserRegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UserUpdateProfileRequest {
  password: string
}

export interface UserUpdateRequest {
  id: string
  active?: boolean
  roleId?: string
}

export type VerifyPurpose = "REGISTRO" | "RECUPERACION"

export interface UserVerifyRequest {
  email: string
  code: string
  purpose: VerifyPurpose
}

export interface UserVerifyResult {
  message: string
  userInfo?: UserInfoModel
}

export interface UserResendOtpRequest {
  email: string
  purpose: VerifyPurpose
}
