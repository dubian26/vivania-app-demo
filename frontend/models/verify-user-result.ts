import { type UserInfoModel } from "@/models/user-info-model"

export type VerifyPurpose = "REGISTRO" | "RECUPERACION"

// Response of POST /auth/verify-email. When the user verifies their email,
// the backend performs an implicit login and returns userInfo + cookies.
export interface VerifyUserResult {
  message: string
  userInfo?: UserInfoModel
}
